import * as esbuild from 'esbuild-wasm';
import { specifierToPackageName } from '../imports.ts';

/** Resolver: package name -> exact version. Used to build versioned unpkg URLs. */
export type GetPinnedVersion = (pkgName: string) => string | undefined;

/**
 * Split bare specifier into package name and subpath; detect explicit @version if present.
 * e.g. "lodash/debounce" -> { pkgName: "lodash", subpath: "debounce", version: undefined }
 *      "react@18.2.0" -> { pkgName: "react", subpath: "", version: "18.2.0" }
 */
function parseSpecifier(spec: string): {
  pkgName: string;
  subpath: string;
  version: string | undefined;
} {
  const pkgName = specifierToPackageName(spec);
  if (!pkgName) return { pkgName: '', subpath: '', version: undefined };

  // Explicit version: pkg@ver or pkg@ver/subpath (non-scoped) or @scope/pkg@ver/subpath
  if (spec.startsWith('@')) {
    const firstSlash = spec.indexOf('/');
    const afterScope = firstSlash !== -1 ? spec.slice(firstSlash + 1) : '';
    const atIdx = afterScope.indexOf('@');
    if (atIdx !== -1) {
      const afterVer = afterScope.slice(atIdx + 1);
      const slash = afterVer.indexOf('/');
      const version = slash === -1 ? afterVer : afterVer.slice(0, slash);
      const subpath = slash === -1 ? '' : afterVer.slice(slash + 1);
      const pkgEnd = spec.indexOf('@', 1);
      const basePkg = pkgEnd !== -1 ? spec.slice(0, pkgEnd) : pkgName;
      return {
        pkgName: basePkg,
        subpath,
        version,
      };
    }
    const subpath =
      spec.length > pkgName.length ? spec.slice(pkgName.length + 1) : '';
    return { pkgName, subpath, version: undefined };
  }

  const atIdx = spec.indexOf('@');
  if (atIdx !== -1) {
    const afterAt = spec.slice(atIdx + 1);
    const slash = afterAt.indexOf('/');
    const version = slash === -1 ? afterAt : afterAt.slice(0, slash);
    const subpath = slash === -1 ? '' : afterAt.slice(slash + 1);
    return { pkgName: spec.slice(0, atIdx), subpath, version };
  }

  const subpath =
    spec.length > pkgName.length ? spec.slice(pkgName.length + 1) : '';
  return { pkgName, subpath, version: undefined };
}

export function unpkgPathPlugin(
  getPinnedVersion: GetPinnedVersion = () => undefined
): esbuild.Plugin {
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
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        const path = new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
          .href;
        return {
          namespace: 'a',
          path,
        };
      });

      // Handle package paths (bare specifiers): use lock version when available
      build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
        const spec = args.path;
        const {
          pkgName,
          subpath,
          version: explicitVersion,
        } = parseSpecifier(spec);

        const version =
          explicitVersion ?? (pkgName ? getPinnedVersion(pkgName) : undefined);
        const pathSegment =
          version && pkgName
            ? `${pkgName}@${version}${subpath ? `/${subpath}` : ''}`
            : spec;
        return {
          namespace: 'a',
          path: `https://unpkg.com/${pathSegment}`,
        };
      });
    },
  };
}
