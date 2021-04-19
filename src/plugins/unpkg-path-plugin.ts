import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

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

        // Check if the imports are done from the main file
        if (args.importer === 'index.js') {
          return {
            namespace: 'a',
            path: `https://unpkg.com/${args.path}`,
          };
        }

        // Handle imports from external files
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
      });

      // Set up onLoad event handler on build
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        // This is our main file that gets built on the fly
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'nested-test-pkg';
              console.log(message);
            `,
          };
        }

        // Get the contents of external file and return it
        const { data, request } = await axios.get(args.path);

        const resolveDir = new URL('./', request.responseURL).pathname;

        return {
          loader: 'jsx',
          contents: data,
          resolveDir,
        };
      });
    },
  };
};
