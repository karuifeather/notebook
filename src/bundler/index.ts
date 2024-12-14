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

// Main build function
const build = async (rawCode: string): Promise<BuildReturnObject> => {
  try {
    // Ensure esbuild is initialized
    await initializeService();

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
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
