import assert from "node:assert/strict";
import test from "node:test";

import { createCommentsStore } from "../../src/lib/server/comments-store.ts";

const signal = () => AbortSignal.timeout(1000);
const comments = { comments: [], partial: false };

void test("atomically limits concurrent requests and expires counters without extending their window", async () => {
	let now = 0;
	const store = createCommentsStore({ clock: () => now });
	const results = await Promise.all(
		Array.from({ length: 20 }, () => store.consume("client", 10, 60, signal())),
	);
	assert.equal(results.filter((result) => result === 0).length, 10);
	assert.equal(results.filter((result) => result === 60).length, 10);
	now = 30500;
	assert.equal(await store.consume("client", 10, 60, signal()), 30);
	now = 60000;
	assert.equal(await store.consume("client", 10, 60, signal()), 0);
});

void test("expires cached results and bounds the number of cached videos", async () => {
	let now = 0;
	const store = createCommentsStore({ clock: () => now, maxCacheEntries: 2 });
	await store.put("first", comments, 900, signal());
	await store.put("second", comments, 900, signal());
	await store.put("third", comments, 900, signal());
	assert.equal(await store.get("first", signal()), null);
	assert.deepEqual(await store.get("second", signal()), comments);
	assert.deepEqual(await store.get("third", signal()), comments);
	now = 900000;
	assert.equal(await store.get("third", signal()), null);
});

void test("deduplicates lookups and prevents an expired owner from releasing a new lease", async () => {
	let now = 0;
	const store = createCommentsStore({ clock: () => now });
	assert.equal(await store.lock("video", "old-owner", 20, signal()), true);
	assert.equal(await store.lock("video", "other-owner", 20, signal()), false);
	await store.unlock("video", "other-owner");
	assert.equal(await store.lock("video", "other-owner", 20, signal()), false);
	now = 20000;
	assert.equal(await store.lock("video", "new-owner", 20, signal()), true);
	await store.unlock("video", "old-owner");
	assert.equal(await store.lock("video", "another-owner", 20, signal()), false);
	await store.unlock("video", "new-owner");
	assert.equal(await store.lock("video", "another-owner", 20, signal()), true);
});

void test("rejects new clients when counters are full without evicting live limits", async () => {
	let now = 0;
	const store = createCommentsStore({ clock: () => now, maxCounterEntries: 2 });
	assert.equal(await store.consume("first", 1, 60, signal()), 0);
	assert.equal(await store.consume("second", 1, 60, signal()), 0);
	await assert.rejects(store.consume("third", 1, 60, signal()));
	assert.equal(await store.consume("first", 1, 60, signal()), 60);
	now = 60000;
	assert.equal(await store.consume("third", 1, 60, signal()), 0);
});

void test("bounds concurrent lookups and reclaims expired leases", async () => {
	let now = 0;
	const store = createCommentsStore({ clock: () => now, maxLocks: 1 });
	assert.equal(await store.lock("first", "owner", 20, signal()), true);
	await assert.rejects(store.lock("second", "owner", 20, signal()));
	now = 20000;
	assert.equal(await store.lock("second", "owner", 20, signal()), true);
});

void test("rejects cancelled operations before they consume quota", async () => {
	const controller = new AbortController();
	controller.abort();
	const store = createCommentsStore();
	await assert.rejects(store.consume("client", 1, 60, controller.signal));
	assert.equal(await store.consume("client", 1, 60, signal()), 0);
});

void test("separate instances start with independent counters and caches", async () => {
	const first = createCommentsStore();
	const second = createCommentsStore();
	await first.consume("client", 1, 60, signal());
	await first.put("video", comments, 900, signal());
	assert.equal(await first.consume("client", 1, 60, signal()), 60);
	assert.equal(await second.consume("client", 1, 60, signal()), 0);
	assert.equal(await second.get("video", signal()), null);
});
