import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const filecache = localForage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Set up onResolve event handler on build
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        // Check for the main file
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // Handle imports from external package's repo
        if (args.path.includes('./') || args.path.includes('../')) {
          const path = new URL(
            args.path,
            'https://unpkg.com' +
              args.resolveDir +
              '/' /* We need the trailing slash. See URL API. */
          ).href;

          return {
            namespace: 'a',
            path,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      // Set up onLoad event handler on build
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        // This is our main file that gets built on the fly
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'react';
              import ReactDOM from 'react-dom';
              import lodash from 'lodash';
              import axios from 'axios';

              console.log(message, ReactDOM, lodash, axios);
            `,
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
