/**
 * Simple path-based reactive data model supporting JSON Pointer-like resolution.
 * Paths are formatted as /path/to/property.
 */
export class DataModel {
  private data: any = {};
  private listeners: Set<{ path: string; callback: () => void }> = new Set();

  constructor(initialData: any = {}) {
    this.data = JSON.parse(JSON.stringify(initialData));
  }

  /**
   * Resolves a path value from the store.
   */
  public get(path: string): any {
    if (path === '' || path === '/') {
      return this.data;
    }
    const parts = this.parsePath(path);
    let current = this.data;
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }

  /**
   * Sets a value in the store and triggers reactive listeners.
   */
  public set(path: string, value: any): void {
    if (path === '' || path === '/') {
      this.data = JSON.parse(JSON.stringify(value));
      this.notify(path);
      return;
    }

    const parts = this.parsePath(path);
    let current = this.data;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || current[part] === null || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    const lastPart = parts[parts.length - 1];
    current[lastPart] = JSON.parse(JSON.stringify(value));
    this.notify(path);
  }

  /**
   * Subscribes to changes at a specific path or its children/parents.
   */
  public subscribe(path: string, callback: () => void): () => void {
    const listener = { path: this.normalizePath(path), callback };
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Helper to notify subscribers that match the modified path.
   */
  private notify(changedPath: string): void {
    const normChanged = this.normalizePath(changedPath);
    for (const listener of this.listeners) {
      // Trigger if listener path is a parent of changed path,
      // or changed path is a parent of listener path.
      if (
        normChanged.startsWith(listener.path) ||
        listener.path.startsWith(normChanged) ||
        listener.path === '/' ||
        normChanged === '/'
      ) {
        listener.callback();
      }
    }
  }

  private parsePath(path: string): string[] {
    return this.normalizePath(path)
      .split('/')
      .filter(p => p !== '');
  }

  private normalizePath(path: string): string {
    let clean = path.trim();
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
    if (clean.endsWith('/') && clean.length > 1) {
      clean = clean.slice(0, -1);
    }
    return clean;
  }

  public getRawData(): any {
    return this.data;
  }
}
