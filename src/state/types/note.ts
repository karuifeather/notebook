/** Per-note lock: package name -> exact version for reproducible bundling. */
export type DepsLock = Record<string, string>;

export interface Note {
  id?: string;
  title: string;
  description: string;
  dependencies: string[];
  /** Pinned NPM versions for bare imports (e.g. { "react": "18.2.0" }). Persisted with note. */
  depsLock?: DepsLock;
}
