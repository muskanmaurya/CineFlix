interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtlMs: number;
  private maxEntries: number;

  constructor(defaultTtlMs: number = 5 * 60 * 1000, maxEntries: number = 500) {
    // Default 5 minutes TTL
    this.defaultTtlMs = defaultTtlMs;
    this.maxEntries = maxEntries;
  }

  /**
   * Retrieves an item from the cache if present and not expired
   */
  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Stores an item in the cache with a TTL
   */
  public set<T>(key: string, value: T, ttlMs?: number): void {
    this.cleanupExpired();

    if (!this.store.has(key) && this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    const ttl = ttlMs ?? this.defaultTtlMs;
    const expiresAt = Date.now() + ttl;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Removes a specific item from the cache
   */
  public delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clears all stored items
   */
  public clear(): void {
    this.store.clear();
  }

  /**
   * Cleans up expired cache entries
   */
  public cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();
