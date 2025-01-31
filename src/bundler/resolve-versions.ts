const UNPKG_PACKAGE_JSON = (pkg: string, version?: string) =>
  version
    ? `https://unpkg.com/${encodeURIComponent(pkg)}@${encodeURIComponent(version)}/package.json`
    : `https://unpkg.com/${encodeURIComponent(pkg)}/package.json`;

const NPM_REGISTRY = (pkg: string) =>
  `https://registry.npmjs.org/${encodeURIComponent(pkg)}`;

export interface ResolveVersionsResult {
  resolved: Record<string, string>;
  errors: Array<{ pkg: string; message: string }>;
}

/**
 * Resolve a single package to an exact version.
 * If version is provided, fetches that version from unpkg; otherwise fetches "latest".
 */
export async function resolveVersion(
  pkg: string,
  version?: string
): Promise<{ version: string } | { error: string }> {
  try {
    const url = UNPKG_PACKAGE_JSON(pkg, version);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { error: `unpkg ${res.status}: ${res.statusText}` };
    }
    const data = (await res.json()) as { version?: string };
    const v = data?.version;
    if (typeof v === 'string' && v.length > 0) {
      return { version: v };
    }
    return { error: 'No version in package.json' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { error: message };
  }
}

/**
 * Fetch list of available versions from npm registry (for version picker).
 * Returns versions newest-first (registry 'time' order); limit to 30.
 */
export async function fetchVersionList(
  pkg: string
): Promise<{ versions: string[]; error?: string }> {
  try {
    const res = await fetch(NPM_REGISTRY(pkg), { cache: 'no-store' });
    if (!res.ok) {
      return {
        versions: [],
        error: `registry ${res.status}: ${res.statusText}`,
      };
    }
    const data = (await res.json()) as {
      versions?: Record<string, unknown>;
      'dist-tags'?: { latest?: string };
    };
    const versions = data?.versions ? Object.keys(data.versions) : [];
    // newest first (npm registry often has chronological order; reverse for newest)
    versions.sort((a, b) => compareSemver(b, a));
    return { versions: versions.slice(0, 30) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { versions: [], error: message };
  }
}

function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}

/**
 * Resolve exact versions for the given package names by fetching
 * package.json from unpkg (which serves "latest" when no version is in the URL).
 * Optional map of pkg -> chosen version; if not set, resolves to latest.
 * Returns { resolved: { pkgName: version }, errors }.
 */
export async function resolvePinnedVersions(
  pkgNames: Set<string> | string[],
  chosenVersions?: Record<string, string>
): Promise<ResolveVersionsResult> {
  const names = Array.from(pkgNames);
  const resolved: Record<string, string> = {};
  const errors: Array<{ pkg: string; message: string }> = [];

  await Promise.all(
    names.map(async (pkg) => {
      const chosen = chosenVersions?.[pkg];
      const result = await resolveVersion(
        pkg,
        chosen && chosen !== 'latest' ? chosen : undefined
      );
      if ('version' in result) {
        resolved[pkg] = result.version;
      } else {
        errors.push({ pkg, message: result.error });
      }
    })
  );

  return { resolved, errors };
}
