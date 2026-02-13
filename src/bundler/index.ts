import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin.ts';
import { fetchPlugin } from './plugins/fetch-plugin.ts';

// Define the return object for better type safety
interface BuildReturnObject {
  code: string;
  error: string;
}

// Initialize the esbuild service
let isInitialized = false;
let isInitializing = false;
let initializePromise: Promise<void> | null = null; // Track the initialization promise

const initializeService = async () => {
  if (isInitialized) {
    return; // Already initialized
  }

  if (isInitializing && initializePromise) {
    await initializePromise; // Wait for ongoing initialization
    return;
  }

  isInitializing = true;

  initializePromise = (async () => {
    try {
      console.log('Initializing esbuild...');
      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.24.0/esbuild.wasm', // Path to the esbuild.wasm file
      });
      isInitialized = true;
      console.log('esbuild initialized.');
    } catch (error) {
      console.error('Failed to initialize esbuild:', error);
      throw error; // Propagate error if initialization fails
    } finally {
      isInitializing = false;
      initializePromise = null; // Reset the promise tracker
    }
  })();

  await initializePromise;
};

/** All React 18 hooks so users never need to import from 'react' when we prepend. Avoids duplicate-declaration errors if they paste an import. */
const PREAMBLE =
  "import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer, useLayoutEffect, useImperativeHandle, useDebugValue, useDeferredValue, useTransition, useId, useSyncExternalStore, useInsertionEffect } from 'react'; import { createRoot } from 'react-dom/client'; const _React = React; export { React, createRoot };\n";

/** User already has React/ReactDOM boilerplate (old snippet); don't duplicate. */
function hasReactBoilerplate(code: string): boolean {
  return /import\s+.*\s+from\s+['"]react['"]/m.test(code);
}

/** Strip import-from-react statements (single or multiline) so we never get duplicate declarations when we prepend. */
function stripReactImportLines(code: string): string {
  return code
    .replace(/\s*import\s+[\s\S]*?from\s+['"]react['"]\s*;?\s*/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** When user has import React, append exports so the iframe can mount default export. */
const FOOTER_WITH_CREATEROOT =
  "\nimport { createRoot } from 'react-dom/client'; export { React, createRoot };";
const FOOTER_EXPORT_ONLY = '\nexport { React, createRoot };';

/** User already imports createRoot from react-dom/client; avoid duplicate. */
function hasCreateRootImport(code: string): boolean {
  return /import\s+.*createRoot.*\s+from\s+['"]react-dom\/client['"]/s.test(
    code
  );
}

/** Optional per-note lock: package name -> exact version for reproducible bundling. */
export type DepsLock = Record<string, string>;

// Main build function
const build = async (
  rawCode: string,
  depsLock?: DepsLock
): Promise<BuildReturnObject> => {
  try {
    // Ensure esbuild is initialized
    await initializeService();

    const withBoilerplate = hasReactBoilerplate(rawCode);
    const footer =
      withBoilerplate && hasCreateRootImport(rawCode)
        ? FOOTER_EXPORT_ONLY
        : FOOTER_WITH_CREATEROOT;
    const entryCode = withBoilerplate
      ? rawCode + footer
      : PREAMBLE + stripReactImportLines(rawCode);

    const getPinnedVersion = (pkgName: string) => depsLock?.[pkgName];

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      format: 'esm',
      plugins: [unpkgPathPlugin(getPinnedVersion), fetchPlugin(entryCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: withBoilerplate
        ? 'React.createElement'
        : '_React.createElement',
      jsxFragment: withBoilerplate ? 'React.Fragment' : '_React.Fragment',
    });

    return {
      code: result.outputFiles?.[0]?.text ?? '',
      error: '',
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { code: '', error: error.message };
    }
    return { code: '', error: 'An unknown error occurred' };
  }
};

export default build;
