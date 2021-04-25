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
      // Handle root file aka index.js
      // This is our main file that gets built on the fly
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: startCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check to see if we have already fecthed this file
        // and if it is in the cache
        const cachedResult = await filecache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      // Handle css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // Get the contents of external file and return it
        const { data, request } = await axios.get(args.path);
        const resolveDir = new URL('./', request.responseURL).pathname;

        const escapedCSS = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        let contents = `
            const style = document.createElement('style');
            style.innerText = '${escapedCSS}';
            document.head.appendChild(style)`;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir,
        };

        // Store the response in cache and return it
        await filecache.setItem(args.path, result);
        return result;
      });

      // Handle everything else?
      build.onLoad({ filter: /.*/ }, async (args: any) => {
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
