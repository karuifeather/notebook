import { init, parse } from 'es-module-lexer';

let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = init;
  return initPromise;
}

/**
 * Returns true if the specifier is "bare" (npm package), not relative or URL.
 */
function isBareSpecifier(spec: string): boolean {
  if (!spec || spec.startsWith('.') || spec.startsWith('/')) return false;
  if (spec.startsWith('http:') || spec.startsWith('https:')) return false;
  return true;
}

/**
 * Normalize import specifier to package name for the lock map.
 * - "react" -> "react"
 * - "lodash/debounce" -> "lodash"
 * - "@scope/pkg" -> "@scope/pkg"
 * - "@scope/pkg/subpath" -> "@scope/pkg"
 * - "react/jsx-runtime" -> "react"
 */
export function specifierToPackageName(spec: string): string {
  const trimmed = spec.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('@')) {
    const rest = trimmed.slice(1);
    const idx = rest.indexOf('/');
    if (idx === -1) return trimmed; // @scope (invalid but treat as pkg)
    // @scope/pkg or @scope/pkg/subpath
    const scope = rest.slice(0, idx);
    const afterScope = rest.slice(idx + 1);
    const subIdx = afterScope.indexOf('/');
    const pkg = subIdx === -1 ? afterScope : afterScope.slice(0, subIdx);
    return `@${scope}/${pkg}`;
  }

  const idx = trimmed.indexOf('/');
  return idx === -1 ? trimmed : trimmed.slice(0, idx);
}

/** Regex fallback: find from 'pkg' or from "pkg" (handles JSX and other non-parseable code). */
const FROM_SPECIFIER_RE = /from\s+['"]([^'"]+)['"]/g;

function extractBareImportsRegex(code: string): Set<string> {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  FROM_SPECIFIER_RE.lastIndex = 0;
  while ((m = FROM_SPECIFIER_RE.exec(code)) !== null) {
    const spec = m[1];
    if (spec && isBareSpecifier(spec)) {
      const pkg = specifierToPackageName(spec);
      if (pkg) out.add(pkg);
    }
  }
  return out;
}

/**
 * Parse code with es-module-lexer and return the set of bare package names
 * (no relative paths, no URLs). Falls back to regex when lexer fails (e.g. JSX).
 */
export async function extractBareImports(code: string): Promise<Set<string>> {
  const out = new Set<string>();
  try {
    await ensureInit();
    const [imports] = parse(code, 'index.js');
    if (process.env.NODE_ENV === 'development' && imports.length > 0) {
      console.log(
        '[bundler] extractBareImports',
        'imports count',
        imports.length,
        'specifiers',
        imports.map((i) => i.n)
      );
    }
    for (const imp of imports) {
      const spec = imp.n;
      if (spec && isBareSpecifier(spec)) {
        const pkg = specifierToPackageName(spec);
        if (pkg) out.add(pkg);
      }
    }
    return out;
  } catch {
    out.clear();
    const fallback = extractBareImportsRegex(code);
    fallback.forEach((p) => out.add(p));
    return out;
  }
}
