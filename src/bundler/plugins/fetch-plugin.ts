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
      // Handle root file aka index.js (must match namespace from unpkg-path-plugin)
      build.onLoad({ filter: /^index\.js$/, namespace: 'a' }, () => {
        return {
          loader: 'jsx',
          contents: startCode,
        };
      });

      const isHttps = (path: string) =>
        typeof path === 'string' && path.startsWith('https://');

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (!isHttps(args.path)) {
          return {
            contents: '',
            loader: 'js',
            errors: [
              {
                text: 'Only HTTPS URLs are allowed for external modules.',
                location: null,
              },
            ],
          };
        }
        const cachedResult = await filecache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      // Handle css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        if (!isHttps(args.path)) {
          return {
            contents: '',
            loader: 'js',
            errors: [
              {
                text: 'Only HTTPS URLs are allowed for CSS.',
                location: null,
              },
            ],
          };
        }
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

      // Handle everything else (JS/TS etc.)
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (!isHttps(args.path)) {
          return {
            contents: '',
            loader: 'js',
            errors: [
              {
                text: 'Only HTTPS URLs are allowed for external modules.',
                location: null,
              },
            ],
          };
        }
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
