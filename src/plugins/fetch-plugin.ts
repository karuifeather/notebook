import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const filecache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (startCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // Set up onLoad event handler on build
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // This is our main file that gets built on the fly
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: startCode,
          };
        }

        // Check to see if we have already fecthed this file
        // and if it is in the cache
        const cachedResult = await filecache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }

        // Get the contents of external file and return it
        const { data, request } = await axios.get(args.path);

        const resolveDir = new URL('./', request.responseURL).pathname;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir,
        };

        // Store the response in cache and return it
        await filecache.setItem(args.path, result);
        return result;
      });
    },
  };
};
