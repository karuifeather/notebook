import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return {
          path: 'index.js',
          namespace: 'a',
        };
      });

      // Handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
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

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
