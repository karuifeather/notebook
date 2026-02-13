import Footer from '@/components/footer.tsx';
import Header from '@/components/header.tsx';
import NoteView from '@/components/notes/note-view.tsx';
import { useActions } from '@/hooks/use-actions.ts';
import { useTypedSelector } from '@/hooks/use-typed-selector.ts';
import { insertCellAfter } from '@/state/action-creators/index.ts';
import { store } from '@/state/index.ts';
import { useEffect } from 'react';

/** Single fixed note id for the playground. "Try" always loads this one note. */
const PLAYGROUND_NOTEBOOK_ID = 'playground';
const PLAYGROUND_NOTE_ID = 'playground-default-note';

const DIGITAL_CLOCK_CODE = `import React, { useEffect, useMemo, useState } from "react";

function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = useMemo(
    () =>
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [now]
  );

  const date = useMemo(
    () =>
      now.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    [now]
  );

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 px-6">
      <div className="relative w-full max-w-md">
        {/* glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/30 via-cyan-400/20 to-indigo-400/30 blur-2xl" />

        {/* card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-white/60">
                DIGITAL CLOCK
              </p>
              <h1 className="mt-2 text-lg font-semibold text-white">
                🕒 My Digital Clock
              </h1>
            </div>

            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
              Live
              <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            </span>
          </div>

          <div className="mt-8 text-center">
            <div className="font-mono text-5xl md:text-6xl font-semibold tracking-tight text-white drop-shadow">
              {time}
            </div>
            <div className="mt-3 text-sm text-white/70">{date}</div>
          </div>

          <div className="mt-8 flex items-center justify-between text-xs text-white/50">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              Updates every second
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DigitalClock;
`;

/** Default cells to seed the playground — showcases all block types. */
const DEFAULT_CELLS: { type: string; content: string }[] = [
  {
    type: 'markdown',
    content: `# Welcome to FeatherPad ✨

This playground shows what you can do in a note: **rich text**, **live code**, callouts, images, tables, checklists, and link previews.

Scroll down to try each block type. Use the **+** on the left to add more blocks.`,
  },
  {
    type: 'code',
    content: DIGITAL_CLOCK_CODE,
  },
  {
    type: 'callout',
    content: JSON.stringify({
      variant: 'tip',
      emoji: '💡',
      title: 'Try it yourself',
      text: 'Edit any block by clicking into it. Change the callout variant with the emoji button, or add **markdown** in the body.',
    }),
  },
  {
    type: 'image',
    content: JSON.stringify({
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
      alt: 'Code on screen',
      caption: 'Paste, drag, or upload images — they’re stored with your note.',
    }),
  },
  {
    type: 'table',
    content: JSON.stringify({
      columns: [
        { id: 'c1', name: 'Feature', type: 'text' as const },
        { id: 'c2', name: 'Status', type: 'text' as const },
      ],
      rows: [
        { id: 'r1', cells: { c1: 'Code cells', c2: '✅ Live preview' } },
        { id: 'r2', cells: { c1: 'Tables', c2: '✅ Inline edit' } },
        { id: 'r3', cells: { c1: 'Checklists', c2: '✅ Progress' } },
      ],
    }),
  },
  {
    type: 'tasks',
    content: JSON.stringify({
      items: [
        { id: 't1', text: 'Explore the block types below', checked: true },
        { id: 't2', text: 'Create your own notebook', checked: false },
        { id: 't3', text: 'Add code, callouts, and embeds', checked: false },
      ],
    }),
  },
  {
    type: 'embed',
    content: JSON.stringify({
      url: 'https://react.dev',
      title: 'React – The library for web and native user interfaces',
      description: 'React is the library for web and native user interfaces.',
      siteName: 'react.dev',
      image: '',
      favicon: '',
    }),
  },
];

export default function Playground() {
  const { createNote, createNotebookWithId } = useActions();
  const notebooks = useTypedSelector((state) => state.notebooks.data);
  const playgroundNotebookExists = Boolean(notebooks?.[PLAYGROUND_NOTEBOOK_ID]);
  const playgroundNoteExists = useTypedSelector((state) =>
    Boolean(state.notes[PLAYGROUND_NOTEBOOK_ID]?.data[PLAYGROUND_NOTE_ID])
  );
  const playgroundCellCount = useTypedSelector(
    (state) => state.cells[PLAYGROUND_NOTE_ID]?.order?.length ?? 0
  );

  useEffect(() => {
    if (!playgroundNotebookExists) {
      createNotebookWithId(
        'Playground',
        'Quick try-out space',
        PLAYGROUND_NOTEBOOK_ID
      );
    }
  }, [playgroundNotebookExists, createNotebookWithId]);

  useEffect(() => {
    if (!playgroundNoteExists) {
      createNote(PLAYGROUND_NOTEBOOK_ID, {
        id: PLAYGROUND_NOTE_ID,
        title: 'Playground',
        description: 'Try FeatherPad — edit any block to see it in action.',
        dependencies: [],
      });
    }
  }, [playgroundNoteExists, createNote]);

  useEffect(() => {
    if (playgroundNoteExists && playgroundCellCount === 0) {
      DEFAULT_CELLS.forEach((cell) => {
        store.dispatch(
          insertCellAfter(PLAYGROUND_NOTE_ID, null, cell.type, cell.content)
        );
      });
    }
  }, [playgroundNoteExists, playgroundCellCount]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <Header />
      <main className="min-h-0 flex-1 overflow-auto custom-scrollbar">
        <NoteView playgroundNoteId={PLAYGROUND_NOTE_ID} />
      </main>
      <Footer />
    </div>
  );
}
