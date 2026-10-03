import type { RequiredCommentInfo } from "../types/youtubeApiTypes.ts";

export interface CachedComments {
	comments: RequiredCommentInfo[];
	partial: boolean;
}

export interface CommentsStore {
	consume: (key: string, limit: number, seconds: number, signal: AbortSignal) => Promise<number>;
	get: (key: string, signal: AbortSignal) => Promise<unknown>;
	lock: (key: string, owner: string, seconds: number, signal: AbortSignal) => Promise<boolean>;
	put: (key: string, value: CachedComments, seconds: number, signal: AbortSignal) => Promise<void>;
	unlock: (key: string, owner: string) => Promise<void>;
}

interface Entry<T> {
	expiresAt: number;
	value: T;
}

interface Options {
	clock?: () => number;
	maxCacheEntries?: number;
	maxCounterEntries?: number;
	maxLocks?: number;
}

// One store per running process. Instances and cold starts have independent state.
export function createCommentsStore({
	clock = Date.now,
	maxCacheEntries = 100,
	maxCounterEntries = 2000,
	maxLocks = 100,
}: Options = {}): CommentsStore {
	const cache = new Map<string, Entry<CachedComments>>();
	const counters = new Map<string, Entry<number>>();
	const locks = new Map<string, Entry<string>>();

	function read<T>(entries: Map<string, Entry<T>>, key: string): Entry<T> | undefined {
		const entry = entries.get(key);
		if (entry && entry.expiresAt <= clock()) {
			entries.delete(key);
			return undefined;
		}
		return entry;
	}

	function makeRoom<T>(entries: Map<string, Entry<T>>, capacity: number): boolean {
		if (entries.size < capacity) return true;
		const now = clock();
		for (const [key, entry] of entries) {
			if (entry.expiresAt <= now) entries.delete(key);
		}
		return entries.size < capacity;
	}

	// Mutations run synchronously before returning a promise, so concurrent requests
	// in this process cannot interleave counter checks or lock acquisition.
	function run<T>(signal: AbortSignal | undefined, operation: () => T): Promise<T> {
		try {
			signal?.throwIfAborted();
			return Promise.resolve(operation());
		} catch (error) {
			return Promise.reject(
				error instanceof Error ? error : new Error("Storage operation failed."),
			);
		}
	}

	return {
		consume(key, limit, seconds, signal) {
			return run(signal, () => {
				const existing = read(counters, key);
				if (existing) {
					if (existing.value >= limit)
						return Math.max(1, Math.ceil((existing.expiresAt - clock()) / 1000));
					existing.value++;
				} else {
					// Never evict live counters: that would let clients bypass their limits.
					if (!makeRoom(counters, maxCounterEntries))
						throw new Error("Too many active quota counters.");
					counters.set(key, { expiresAt: clock() + seconds * 1000, value: 1 });
				}
				return 0;
			});
		},
		get(key, signal) {
			return run(signal, () => read(cache, key)?.value ?? null);
		},
		lock(key, owner, seconds, signal) {
			return run(signal, () => {
				if (read(locks, key)) return false;
				if (!makeRoom(locks, maxLocks)) throw new Error("Too many active comment lookups.");
				locks.set(key, { expiresAt: clock() + seconds * 1000, value: owner });
				return true;
			});
		},
		put(key, value, seconds, signal) {
			return run(signal, () => {
				cache.delete(key);
				if (!makeRoom(cache, maxCacheEntries)) {
					const oldest = cache.keys().next().value;
					if (oldest !== undefined) cache.delete(oldest);
				}
				cache.set(key, { expiresAt: clock() + seconds * 1000, value });
			});
		},
		unlock(key, owner) {
			return run(undefined, () => {
				if (read(locks, key)?.value === owner) locks.delete(key);
			});
		},
	};
}
