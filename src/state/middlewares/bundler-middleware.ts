import { Middleware } from './middleware.ts';
import { ActionType } from '../action-types/index.ts';
import bundle from '../../bundler/index.ts';
import { extractBareImports } from '../../bundler/imports.ts';
import { resolvePinnedVersions } from '../../bundler/resolve-versions.ts';
import { noteDepsLockMerge } from '../action-creators/index.ts';
import type { Action } from '../actions/index.ts';
import type { RootState } from '../store.ts';

/** Find (parentId, noteId) for a cellId by scanning state. */
function findNoteContext(
  state: RootState,
  cellId: string
): { parentId: string; noteId: string } | null {
  const cells = state.cells ?? {};
  const notes = state.notes ?? {};
  for (const noteId of Object.keys(cells)) {
    if (cells[noteId]?.data?.[cellId]) {
      for (const parentId of Object.keys(notes)) {
        if (notes[parentId]?.data?.[noteId]) {
          return { parentId, noteId };
        }
      }
      return { parentId: '', noteId }; // note exists but no parent (e.g. rehydration)
    }
  }
  return null;
}

/** Collect raw code from all code cells in a note for import extraction. */
function getCombinedCodeFromNote(state: RootState, noteId: string): string {
  const cells = state.cells ?? {};
  const cellMeta = cells[noteId];
  if (!cellMeta?.order) return '';
  return cellMeta.order
    .map((id: string) => cellMeta.data[id])
    .filter((c: { type?: string } | undefined) => c?.type === 'code')
    .map((c: { content?: string }) => c.content || '')
    .join('\n');
}

export const bundlerMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type !== ActionType.BUNDLE_IT) return;

    const {
      cellId,
      rawCode,
      noteId: payloadNoteId,
      parentId: payloadParentId,
    } = action.payload;

    const state = getState();
    const { parentId, noteId } =
      payloadNoteId != null && payloadParentId != null
        ? { parentId: payloadParentId, noteId: payloadNoteId }
        : (findNoteContext(state, cellId) ?? { parentId: '', noteId: '' });

    if (process.env.NODE_ENV === 'development') {
      console.log('[bundler] BUNDLE_IT received', {
        cellId,
        codeLength: rawCode?.length,
        noteId,
        parentId,
      });
    }

    dispatch({
      type: ActionType.BUNDLE_CREATING,
      payload: { cellId },
    });

    const asyncBundle = async () => {
      let depsLock: Record<string, string> = {};
      let resolutionErrorText = '';

      if (parentId && noteId) {
        const currentState = getState() as RootState;
        const note = currentState.notes?.[parentId]?.data?.[noteId];
        depsLock = { ...(note?.depsLock ?? {}) };

        const combinedCode = getCombinedCodeFromNote(currentState, noteId);
        const codeForExtraction = combinedCode.trim() || rawCode.trim();
        const bareFromCombined = await extractBareImports(codeForExtraction);
        const bareFromRaw =
          rawCode.trim().length > 0
            ? await extractBareImports(rawCode.trim())
            : new Set<string>();
        const barePackages = new Set([...bareFromCombined, ...bareFromRaw]);
        const missing = new Set([...barePackages].filter((p) => !depsLock[p]));

        if (process.env.NODE_ENV === 'development') {
          console.log(
            '[bundler] depsLock flow',
            'barePackages',
            [...barePackages],
            'missing',
            [...missing],
            'noteExists',
            !!note,
            'currentLock',
            Object.keys(depsLock)
          );
        }

        if (missing.size > 0) {
          const { resolved, errors } = await resolvePinnedVersions(missing);
          if (process.env.NODE_ENV === 'development') {
            console.log('[bundler] resolvePinnedVersions', {
              resolved: Object.keys(resolved),
              errors: errors.map((e) => e.pkg + ': ' + e.message),
            });
          }
          if (Object.keys(resolved).length > 0) {
            dispatch(noteDepsLockMerge(parentId, noteId, resolved) as Action);
            depsLock = { ...depsLock, ...resolved };
          }
          if (errors.length > 0) {
            resolutionErrorText = errors
              .map((e) => `${e.pkg}: ${e.message}`)
              .join('; ');
          }
        }
      }

      try {
        const result = await bundle(rawCode, depsLock);
        const fullError = [result?.error, resolutionErrorText]
          .filter(Boolean)
          .join('\n\nDependency resolution: ');

        if (process.env.NODE_ENV === 'development') {
          console.log('[bundler] BUNDLE_CREATED', {
            cellId,
            hasCode: !!result?.code,
            codeLength: result?.code?.length ?? 0,
            hasError: !!fullError,
          });
        }
        if (fullError) {
          console.warn('[bundler] Build failed for cell', cellId, fullError);
        }
        dispatch({
          type: ActionType.BUNDLE_CREATED,
          payload: {
            cellId,
            bundle: {
              code: result?.code ?? '',
              error: fullError,
            },
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown bundler error';
        const fullError = resolutionErrorText
          ? `${message}\n\nDependency resolution: ${resolutionErrorText}`
          : message;
        console.error('[bundler] Unhandled error', cellId, err);
        dispatch({
          type: ActionType.BUNDLE_CREATED,
          payload: {
            cellId,
            bundle: { code: '', error: fullError },
          },
        });
      }
    };

    asyncBundle();
  };
