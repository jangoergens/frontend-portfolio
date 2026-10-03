import assert from "node:assert/strict";
import test from "node:test";

import type { CachedComments, CommentsStore } from "../../src/lib/server/comments-store.ts";

import { commentsLimits, createCommentsHandler } from "../../src/lib/server/comments.ts";

const videoId = "czgOWmtGVGs";

class MemoryStore implements CommentsStore {
	cache = new Map<string, { expires: number; value: CachedComments }>();
	counters = new Map<string, { count: number; expires: number }>();
	locks = new Map<string, string>();
	now = 0;
	unavailable = false;

	consume(key: string, limit: number, seconds: number): Promise<number> {
		if (this.unavailable) return Promise.reject(new Error("Storage unavailable"));
		let counter = this.counters.get(key);
		if (!counter || counter.expires <= this.now) {
			counter = { count: 0, expires: this.now + seconds };
			this.counters.set(key, counter);
		}
		if (counter.count >= limit) return Promise.resolve(counter.expires - this.now);
		counter.count++;
		return Promise.resolve(0);
	}

	get(key: string): Promise<unknown> {
		const cached = this.cache.get(key);
		return Promise.resolve(cached && cached.expires > this.now ? cached.value : null);
	}

	lock(key: string, owner: string): Promise<boolean> {
		if (this.locks.has(key)) return Promise.resolve(false);
		this.locks.set(key, owner);
		return Promise.resolve(true);
	}

	put(key: string, value: CachedComments, seconds: number): Promise<void> {
		this.cache.set(key, { expires: this.now + seconds, value });
		return Promise.resolve();
	}

	unlock(key: string, owner: string): Promise<void> {
		if (this.locks.get(key) === owner) this.locks.delete(key);
		return Promise.resolve();
	}
}

function fixture(
	responses: Response[] = [Response.json(page([2, 5, 1]))],
	limits = commentsLimits,
) {
	const requests: URL[] = [];
	const store = new MemoryStore();
	const fetcher: typeof fetch = (input) => {
		requests.push(new URL(input instanceof Request ? input.url : input));
		const response = responses.shift();
		return response ? Promise.resolve(response) : Promise.reject(new Error("Unexpected fetch"));
	};
	const handle = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher,
		limits,
		mode: "production",
		store,
	});
	return { handle, requests, store };
}

function page(likes: number[], nextPageToken?: string) {
	return {
		items: likes.map((likeCount, index) => ({
			snippet: {
				topLevelComment: {
					snippet: {
						authorChannelUrl: "https://www.youtube.com/channel/example",
						authorDisplayName: `Author ${index}`,
						authorProfileImageUrl: "https://example.com/avatar.png",
						likeCount,
						publishedAt: "2026-01-01T00:00:00Z",
						textDisplay: `Comment with ${likeCount} likes`,
					},
				},
			},
		})),
		...(nextPageToken ? { nextPageToken } : {}),
	};
}

void test("rejects invalid IDs before quota checks or upstream calls", async () => {
	const { handle, requests, store } = fixture();
	const response = await handle("../invalid", "127.0.0.1");
	assert.equal(response.status, 400);
	assert.equal(requests.length, 0);
	assert.equal(store.counters.size, 0);
});

void test("development works without keys or quota storage", async () => {
	const handle = createCommentsHandler({ mode: "development" });
	const response = await handle(videoId, "127.0.0.1");
	assert.equal(response.status, 200);
	const comments = (await response.json()) as { likeCount: string }[];
	assert.equal(comments.length, 6);
	assert.deepEqual(
		comments.map((comment) => Number(comment.likeCount)),
		[20, 12, 7, 3, 1, 0],
	);
});

void test("fails closed when mode or API key is missing", async () => {
	for (const options of [{}, { mode: "production", store: new MemoryStore() }]) {
		const handle = createCommentsHandler({
			...options,
			fetcher: () => assert.fail("Must not contact YouTube"),
		});
		assert.equal((await handle(videoId, "127.0.0.1")).status, 503);
	}
});

void test("production needs no external storage and shares its default cache within an instance", async () => {
	const options = { apiKey: "test-without-external-storage", mode: "production" };
	const first = createCommentsHandler({
		...options,
		fetcher: () => Promise.resolve(Response.json(page([42]))),
	});
	assert.equal((await first(videoId, "127.0.0.1")).status, 200);
	const second = createCommentsHandler({
		...options,
		fetcher: () => assert.fail("Cache hit must not contact YouTube"),
	});
	const cached = await second(videoId, "127.0.0.2");
	assert.equal(cached.status, 200);
	assert.equal(cached.headers.get("X-Comments-Cache"), "HIT");
});

void test("paginates using encoded tokens and selects the top 20 across pages", async () => {
	const { handle, requests } = fixture([
		Response.json(
			page(
				Array.from({ length: 20 }, (_, index) => index),
				"token+with/&?symbols",
			),
		),
		Response.json(page([500, 200, 0])),
	]);
	const response = await handle(videoId, "127.0.0.1");
	assert.equal(response.status, 200);
	const comments = (await response.json()) as { likeCount: string; textDisplay: string }[];
	assert.equal(comments.length, 20);
	assert.deepEqual(
		comments.slice(0, 3).map((comment) => comment.likeCount),
		["500", "200", "19"],
	);
	assert.equal(requests.length, 2);
	assert.equal(requests[0].searchParams.get("videoId"), videoId);
	assert.equal(requests[1].searchParams.get("pageToken"), "token+with/&?symbols");
	assert.equal(response.headers.get("X-Comments-Partial"), "false");
});

void test("accepts and forwards opaque pagination tokens longer than 1024 characters", async () => {
	const token = "a".repeat(1084);
	const { handle, requests } = fixture([Response.json(page([1], token)), Response.json(page([2]))]);
	const response = await handle(videoId, "127.0.0.1");
	assert.equal(response.status, 200);
	assert.equal(requests.length, 2);
	assert.equal(requests[1].searchParams.get("pageToken"), token);
	assert.deepEqual(
		((await response.json()) as { likeCount: string }[]).map((comment) => comment.likeCount),
		["2", "1"],
	);
});

void test("bounds pagination and marks the limited sample", async () => {
	const { handle, requests } = fixture(
		[Response.json(page([1], "page2")), Response.json(page([2], "page3"))],
		{ ...commentsLimits, maxPages: 2 },
	);
	const response = await handle(videoId, "127.0.0.1");
	assert.equal(response.status, 200);
	assert.equal(response.headers.get("X-Comments-Partial"), "true");
	assert.equal(requests.length, 2);
});

void test("shares successful cache entries across requests and expires them", async () => {
	const { handle, requests, store } = fixture([Response.json(page([1])), Response.json(page([2]))]);
	assert.equal((await handle(videoId, "127.0.0.1")).headers.get("X-Comments-Cache"), "MISS");
	const otherWorker = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher: () => assert.fail("Cache hit must not contact YouTube"),
		mode: "production",
		store,
	});
	const cached = await otherWorker(videoId, "127.0.0.2");
	assert.equal(cached.headers.get("X-Comments-Cache"), "HIT");
	assert.equal(cached.headers.get("Cache-Control"), "no-store");
	assert.equal(requests.length, 1);
	store.now += commentsLimits.cacheSeconds;
	assert.equal((await handle(videoId, "127.0.0.1")).headers.get("X-Comments-Cache"), "MISS");
	assert.equal(requests.length, 2);
});

void test("enforces per-client limits on cached requests, without storing raw IPs", async () => {
	const { handle, requests, store } = fixture(undefined, {
		...commentsLimits,
		requestsPerMinute: 2,
	});
	assert.equal((await handle(videoId, "192.0.2.123")).status, 200);
	assert.equal((await handle(videoId, "192.0.2.123")).status, 200);
	const blocked = await handle(videoId, "192.0.2.123");
	assert.equal(blocked.status, 429);
	assert.equal(blocked.headers.get("Retry-After"), "60");
	assert.equal(requests.length, 1);
	assert.ok([...store.counters.keys()].every((key) => !key.includes("192.0.2.123")));
	assert.equal((await handle(videoId, "192.0.2.124")).status, 200);
	store.now += 60;
	assert.equal((await handle(videoId, "192.0.2.123")).status, 200);
});

void test("caps an instance's YouTube calls across clients, charges errors, and resets its window", async () => {
	const { handle, requests, store } = fixture(
		[new Response(null, { status: 403 }), Response.json(page([1]))],
		{ ...commentsLimits, dailyCalls: 1 },
	);
	assert.equal((await handle(videoId, "127.0.0.1")).status, 502);
	const exhausted = await handle("abcdefghijk", "127.0.0.2");
	assert.equal(exhausted.status, 503);
	assert.equal(exhausted.headers.get("Retry-After"), "86400");
	assert.equal(requests.length, 1);
	store.now += 86400;
	assert.equal((await handle(videoId, "127.0.0.1")).status, 200);
	assert.equal(requests.length, 2);
});

void test("checks the shared budget before every pagination call", async () => {
	const { handle, requests } = fixture([Response.json(page([1], "next"))], {
		...commentsLimits,
		dailyCalls: 1,
	});
	assert.equal((await handle(videoId, "127.0.0.1")).status, 503);
	assert.equal(requests.length, 1);
});

void test("serves the cache after the YouTube budget is exhausted", async () => {
	const { handle, requests } = fixture(undefined, { ...commentsLimits, dailyCalls: 1 });
	assert.equal((await handle(videoId, "127.0.0.1")).status, 200);
	assert.equal((await handle(videoId, "127.0.0.2")).status, 200);
	assert.equal((await handle("abcdefghijk", "127.0.0.3")).status, 503);
	assert.equal(requests.length, 1);
});

void test("refuses malformed cached data instead of bypassing quota storage", async () => {
	const store = new MemoryStore();
	store.get = () => Promise.resolve({ comments: [{ textDisplay: "invalid" }], partial: false });
	const handle = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher: () => assert.fail("Must not contact YouTube"),
		mode: "production",
		store,
	});
	assert.equal((await handle(videoId, "127.0.0.1")).status, 503);
});

void test("deduplicates concurrent requests within an instance and releases the lock", async () => {
	const store = new MemoryStore();
	let resolveFetch: (response: Response) => void = () => assert.fail("Fetch not started");
	let announceFetch: () => void = () => {};
	const started = new Promise<void>((resolve) => {
		announceFetch = resolve;
	});
	let calls = 0;
	const fetcher: typeof fetch = () => {
		calls++;
		announceFetch();
		return new Promise<Response>((resolve) => {
			resolveFetch = resolve;
		});
	};
	const handle = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher,
		mode: "production",
		store,
	});
	const first = handle(videoId, "127.0.0.1");
	await started;
	const otherWorker = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher,
		mode: "production",
		store,
	});
	const duplicate = await otherWorker(videoId, "127.0.0.2");
	assert.equal(duplicate.status, 503);
	assert.equal(duplicate.headers.get("Retry-After"), "2");
	assert.equal(calls, 1);
	resolveFetch(Response.json(page([42])));
	assert.equal((await first).status, 200);
	assert.equal(store.locks.size, 0);
	assert.equal((await otherWorker(videoId, "127.0.0.2")).status, 200);
	assert.equal(calls, 1);
});

void test("refuses YouTube calls when storage is unavailable", async () => {
	const { handle, requests, store } = fixture();
	store.unavailable = true;
	const response = await handle(videoId, "127.0.0.1");
	assert.equal(response.status, 503);
	assert.equal(requests.length, 0);
});

void test("reports upstream network and HTTP errors without caching them", async () => {
	for (const responses of [
		[],
		[new Response(null, { status: 500 })],
		[new Response(null, { status: 403 })],
	]) {
		const { handle, store } = fixture(responses);
		assert.equal((await handle(videoId, "127.0.0.1")).status, 502);
		assert.equal(store.cache.size, 0);
		assert.equal(store.locks.size, 0);
	}
});

void test("classifies YouTube errors and logs only safe diagnostic fields", async (t) => {
	const logger = t.mock.method(console, "error", () => {});
	for (const [reason, upstreamStatus, status, code] of [
		["commentsDisabled", 403, 403, "comments_disabled"],
		["videoNotFound", 404, 404, "video_unavailable"],
		["quotaExceeded", 403, 503, "youtube_quota_exceeded"],
		["dailyLimitExceeded", 403, 503, "youtube_quota_exceeded"],
		["rateLimitExceeded", 403, 503, "youtube_quota_exceeded"],
		["keyInvalid", 400, 503, "youtube_configuration_error"],
		["API_KEY_INVALID", 400, 503, "youtube_configuration_error"],
		["API_KEY_HTTP_REFERRER_BLOCKED", 403, 503, "youtube_configuration_error"],
		["API_KEY_IP_ADDRESS_BLOCKED", 403, 503, "youtube_configuration_error"],
		["API_KEY_SERVICE_BLOCKED", 403, 503, "youtube_configuration_error"],
		["accessNotConfigured", 403, 503, "youtube_configuration_error"],
		["SERVICE_DISABLED", 403, 503, "youtube_configuration_error"],
		["forbidden", 403, 503, "youtube_configuration_error"],
	] as const) {
		const modern = reason.includes("_");
		const upstream = Response.json(
			{
				error: {
					details: modern ? [{ metadata: { key: "test-api-key" }, reason }] : [],
					errors: [{ reason: modern ? "forbidden" : reason }],
					message: "Secret upstream details containing test-api-key",
				},
			},
			{ status: upstreamStatus },
		);
		const { handle, requests, store } = fixture([upstream]);
		const response = await handle(videoId, "127.0.0.1");
		assert.equal(response.status, status);
		assert.equal(response.headers.get("Cache-Control"), "no-store");
		const body = (await response.json()) as { code: string; error: string };
		assert.equal(body.code, code);
		assert.ok(!body.error.includes("test-api-key"));
		assert.equal(requests.length, 1);
		assert.equal(store.cache.size, 0);
		assert.equal(store.locks.size, 0);
		assert.deepEqual(logger.mock.calls.at(-1)?.arguments, [
			"YouTube comment request failed",
			{ reason, status: upstreamStatus },
		]);
	}
});

void test("does not expose unknown upstream reasons or non-JSON error bodies", async (t) => {
	const logger = t.mock.method(console, "error", () => {});
	for (const upstream of [
		Response.json(
			{ error: { errors: [{ reason: "test-api-key" }], message: "test-api-key" } },
			{ status: 400 },
		),
		Response.json({ error: { details: "test-api-key", errors: [null] } }, { status: 400 }),
		new Response("<html>test-api-key</html>", { status: 400 }),
	]) {
		const { handle, store } = fixture([upstream]);
		const response = await handle(videoId, "127.0.0.1");
		assert.equal(response.status, 502);
		assert.deepEqual(await response.json(), { error: "Unable to fetch comments from YouTube." });
		assert.equal(store.cache.size, 0);
		assert.equal(store.locks.size, 0);
		assert.deepEqual(logger.mock.calls.at(-1)?.arguments, [
			"YouTube comment request failed",
			{ reason: "unknown", status: 400 },
		]);
	}
});

void test("validates upstream JSON, comment fields and pagination tokens", async () => {
	for (const body of [
		null,
		{},
		{ items: [null] },
		{ items: [{ snippet: null }] },
		{ items: [{ snippet: { topLevelComment: { snippet: { likeCount: -1 } } } }] },
		{ items: [], nextPageToken: 123 },
		{ items: [], nextPageToken: "" },
	]) {
		const { handle, store } = fixture([Response.json(body)]);
		assert.equal((await handle(videoId, "127.0.0.1")).status, 502);
		assert.equal(store.cache.size, 0);
	}
	const { handle } = fixture([
		new Response("invalid JSON", { headers: { "Content-Type": "application/json" } }),
	]);
	assert.equal((await handle(videoId, "127.0.0.1")).status, 502);
});

void test("accepts empty videos and missing author profile URLs", async () => {
	const empty = fixture([Response.json({ items: [] })]);
	const response = await empty.handle(videoId, "127.0.0.1");
	assert.equal(response.status, 200);
	assert.deepEqual(await response.json(), []);
	const body = page([1]);
	Reflect.deleteProperty(body.items[0].snippet.topLevelComment.snippet, "authorChannelUrl");
	Reflect.deleteProperty(body.items[0].snippet.topLevelComment.snippet, "authorProfileImageUrl");
	const missing = fixture([Response.json(body)]);
	assert.equal((await missing.handle(videoId, "127.0.0.1")).status, 200);
});

void test("rejects repeated pagination tokens", async () => {
	const { handle, requests } = fixture([
		Response.json(page([1], "same")),
		Response.json(page([2], "same")),
	]);
	assert.equal((await handle(videoId, "127.0.0.1")).status, 502);
	assert.equal(requests.length, 2);
});

void test("aborts a slow upstream fetch within the whole-request deadline", async () => {
	const store = new MemoryStore();
	const fetcher: typeof fetch = (_, init) =>
		new Promise<Response>((_, reject) => {
			init?.signal?.addEventListener("abort", () => reject(new Error("Aborted")), { once: true });
		});
	const handle = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher,
		limits: { ...commentsLimits, requestTimeoutMs: 20 },
		mode: "production",
		store,
	});
	// AbortSignal.timeout uses an unref'd timer. Keep the test runner alive until it fires.
	const keepAlive = setTimeout(() => {}, 1000);
	try {
		const response = await handle(videoId, "127.0.0.1");
		assert.equal(response.status, 504);
		assert.equal(store.cache.size, 0);
		assert.equal(store.locks.size, 0);
	} finally {
		clearTimeout(keepAlive);
	}
});

void test("propagates client cancellation without starting another page", async () => {
	const store = new MemoryStore();
	const controller = new AbortController();
	let calls = 0;
	const fetcher: typeof fetch = () => {
		calls++;
		controller.abort();
		return Promise.resolve(Response.json(page([1], "next")));
	};
	const handle = createCommentsHandler({
		apiKey: "test-api-key",
		fetcher,
		mode: "production",
		store,
	});
	assert.equal((await handle(videoId, "127.0.0.1", controller.signal)).status, 504);
	assert.equal(calls, 1);
});
