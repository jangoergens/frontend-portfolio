import { createHash, createHmac, randomUUID } from "node:crypto";

import type { RequiredCommentInfo } from "../types/youtubeApiTypes.ts";
import type { CachedComments, CommentsStore } from "./comments-store.ts";

import { createCommentsStore } from "./comments-store.ts";
import { sampleComments } from "./sample-comments.ts";

const defaultCommentsStore = createCommentsStore();

export const commentsLimits = {
	cacheSeconds: 900,
	dailyCalls: 1000,
	maxPages: 10,
	requestsPerMinute: 10,
	requestTimeoutMs: 15000,
};

interface Options {
	apiKey?: string;
	fetcher?: typeof fetch;
	limits?: typeof commentsLimits;
	mode?: string;
	store?: CommentsStore;
}

class CommentsError extends Error {
	code?: string;
	retryAfter?: number;
	status: number;

	constructor(message: string, status: number, retryAfter?: number, code?: string) {
		super(message);
		this.code = code;
		this.status = status;
		this.retryAfter = retryAfter;
	}
}

export function createCommentsHandler({
	apiKey,
	fetcher = fetch,
	limits = commentsLimits,
	mode,
	store = defaultCommentsStore,
}: Options) {
	return async function handle(
		videoId: string | undefined,
		clientAddress: string,
		requestSignal?: AbortSignal,
	): Promise<Response> {
		if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
			return Response.json(
				{ error: "Invalid YouTube video ID." },
				{ headers: { "Cache-Control": "no-store" }, status: 400 },
			);
		}
		if (mode === "development") return success({ comments: sampleComments, partial: false });
		if (mode !== "production" || !apiKey) {
			return Response.json(
				{ error: "YouTube API is not configured." },
				{ headers: { "Cache-Control": "no-store" }, status: 503 },
			);
		}

		const timeout = AbortSignal.timeout(limits.requestTimeoutMs);
		const signal = requestSignal ? AbortSignal.any([timeout, requestSignal]) : timeout;
		// Group by API key within this process. Raw client addresses are never stored.
		const prefix = `tcf:v1:${createHash("sha256").update(apiKey).digest("hex").slice(0, 16)}`;
		const client = createHmac("sha256", apiKey)
			.update(clientAddress || "unknown")
			.digest("hex");
		const cacheKey = `${prefix}:comments:${limits.maxPages}:${videoId}`;
		const lockKey = `${cacheKey}:lock`;
		const owner = randomUUID();
		let locked = false;

		try {
			const retryAfter = await store.consume(
				`${prefix}:client:${client}`,
				limits.requestsPerMinute,
				60,
				signal,
			);
			if (retryAfter)
				throw new CommentsError("Too many requests. Please try again shortly.", 429, retryAfter);
			const cached = await store.get(cacheKey, signal);
			if (cached !== null) {
				if (!isCachedComments(cached)) throw new Error("Invalid cached comments.");
				return success(cached, true);
			}
			locked = await store.lock(
				lockKey,
				owner,
				Math.ceil(limits.requestTimeoutMs / 1000) + 5,
				signal,
			);
			if (!locked)
				throw new CommentsError(
					"Comments are already being fetched. Please try again shortly.",
					503,
					2,
				);

			// Close the race where another request populated the cache before we acquired its lock.
			const ready = await store.get(cacheKey, signal);
			if (ready !== null) {
				if (!isCachedComments(ready)) throw new Error("Invalid cached comments.");
				return success(ready, true);
			}

			let comments: RequiredCommentInfo[] = [];
			let nextPageToken: string | undefined;
			const seenTokens = new Set<string>();
			for (let page = 0; page < limits.maxPages; page++) {
				signal.throwIfAborted();
				// One quota unit per attempted commentThreads.list call, including upstream errors.
				const quotaRetryAfter = await store.consume(
					`${prefix}:youtube`,
					limits.dailyCalls,
					86400,
					signal,
				);
				if (quotaRetryAfter)
					throw new CommentsError(
						"The comment service has reached its quota. Please try again later.",
						503,
						quotaRetryAfter,
					);

				const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
				url.search = new URLSearchParams({
					key: apiKey,
					maxResults: "100",
					order: "relevance",
					part: "snippet",
					textFormat: "plainText",
					videoId,
					...(nextPageToken ? { pageToken: nextPageToken } : {}),
				}).toString();
				let parsed;
				try {
					const response = await fetcher(url, { redirect: "error", signal });
					if (!response.ok) throw await youtubeError(response);
					parsed = parsePage(await response.json());
				} catch (error) {
					if (error instanceof CommentsError) throw error;
					if (signal.aborted)
						throw new CommentsError(
							"Fetching comments took too long. Please try again later.",
							504,
						);
					throw new CommentsError("Unable to contact YouTube or read its response.", 502);
				}
				comments = [...comments, ...parsed.comments]
					.sort((a, b) => Number(b.likeCount) - Number(a.likeCount))
					.slice(0, 20);
				nextPageToken = parsed.nextPageToken;
				if (!nextPageToken) break;
				if (seenTokens.has(nextPageToken))
					throw new CommentsError("YouTube returned repeated pagination tokens.", 502);
				seenTokens.add(nextPageToken);
			}

			const result = { comments, partial: !!nextPageToken };
			await store.put(cacheKey, result, limits.cacheSeconds, signal);
			return success(result);
		} catch (error) {
			const failure =
				error instanceof CommentsError
					? error
					: signal.aborted
						? new CommentsError("Fetching comments took too long. Please try again later.", 504)
						: new CommentsError("The comment service is busy. Please try again later.", 503, 30);
			return Response.json(
				{ error: failure.message, ...(failure.code ? { code: failure.code } : {}) },
				{
					headers: {
						"Cache-Control": "no-store",
						...(failure.retryAfter ? { "Retry-After": String(failure.retryAfter) } : {}),
					},
					status: failure.status,
				},
			);
		} finally {
			// Never delete another owner's lock if this request outlived its lease.
			if (locked) await store.unlock(lockKey, owner).catch(() => {});
		}
	};
}

function isCachedComments(value: unknown): value is CachedComments {
	return (
		!!value &&
		typeof value === "object" &&
		"partial" in value &&
		typeof value.partial === "boolean" &&
		"comments" in value &&
		Array.isArray(value.comments) &&
		value.comments.length <= 20 &&
		value.comments.every(isComment)
	);
}

function isComment(value: unknown): value is RequiredCommentInfo {
	if (!value || typeof value !== "object") return false;
	return (
		"authorChannelUrl" in value &&
		typeof value.authorChannelUrl === "string" &&
		"authorDisplayName" in value &&
		typeof value.authorDisplayName === "string" &&
		"authorProfileImageUrl" in value &&
		typeof value.authorProfileImageUrl === "string" &&
		"likeCount" in value &&
		typeof value.likeCount === "string" &&
		/^\d+$/.test(value.likeCount) &&
		Number.isSafeInteger(Number(value.likeCount)) &&
		"publishedAt" in value &&
		typeof value.publishedAt === "string" &&
		Number.isFinite(Date.parse(value.publishedAt)) &&
		"textDisplay" in value &&
		typeof value.textDisplay === "string"
	);
}

function parsePage(value: unknown): { comments: RequiredCommentInfo[]; nextPageToken?: string } {
	if (
		!value ||
		typeof value !== "object" ||
		!("items" in value) ||
		!Array.isArray(value.items) ||
		value.items.length > 100
	) {
		throw new CommentsError("YouTube returned an invalid response.", 502);
	}
	if (
		"nextPageToken" in value &&
		(typeof value.nextPageToken !== "string" || !value.nextPageToken)
	) {
		throw new CommentsError("YouTube returned an invalid response.", 502);
	}
	const comments = value.items.map((item: unknown) => {
		if (!item || typeof item !== "object" || !("snippet" in item))
			throw new CommentsError("YouTube returned an invalid response.", 502);
		const snippet = item.snippet;
		if (!snippet || typeof snippet !== "object" || !("topLevelComment" in snippet))
			throw new CommentsError("YouTube returned an invalid response.", 502);
		const topLevel = snippet.topLevelComment;
		if (!topLevel || typeof topLevel !== "object" || !("snippet" in topLevel))
			throw new CommentsError("YouTube returned an invalid response.", 502);
		const info = topLevel.snippet;
		if (!info || typeof info !== "object")
			throw new CommentsError("YouTube returned an invalid response.", 502);
		// YouTube omits authorChannelUrl for some deleted/unavailable accounts.
		const likes = "likeCount" in info ? info.likeCount : undefined;
		const comment: unknown = {
			...info,
			authorChannelUrl:
				"authorChannelUrl" in info ? info.authorChannelUrl : "https://www.youtube.com/",
			authorProfileImageUrl: "authorProfileImageUrl" in info ? info.authorProfileImageUrl : "",
			likeCount:
				typeof likes === "number" && Number.isSafeInteger(likes) && likes >= 0
					? String(likes)
					: likes,
		};
		if (!isComment(comment)) throw new CommentsError("YouTube returned an invalid response.", 502);
		return {
			authorChannelUrl: comment.authorChannelUrl,
			authorDisplayName: comment.authorDisplayName,
			authorProfileImageUrl: comment.authorProfileImageUrl,
			likeCount: comment.likeCount,
			publishedAt: comment.publishedAt,
			textDisplay: comment.textDisplay,
		};
	});
	return {
		comments,
		nextPageToken: "nextPageToken" in value ? (value.nextPageToken as string) : undefined,
	};
}

function success(result: CachedComments, cached = false): Response {
	return Response.json(result.comments, {
		headers: {
			"Cache-Control": "no-store",
			"X-Comments-Cache": cached ? "HIT" : "MISS",
			"X-Comments-Partial": String(result.partial),
		},
	});
}

async function youtubeError(response: Response): Promise<CommentsError> {
	const knownReasons = new Map([
		["accessNotConfigured", "youtube_configuration_error"],
		["API_KEY_HTTP_REFERRER_BLOCKED", "youtube_configuration_error"],
		["API_KEY_INVALID", "youtube_configuration_error"],
		["API_KEY_IP_ADDRESS_BLOCKED", "youtube_configuration_error"],
		["API_KEY_SERVICE_BLOCKED", "youtube_configuration_error"],
		["commentsDisabled", "comments_disabled"],
		["dailyLimitExceeded", "youtube_quota_exceeded"],
		["forbidden", "youtube_configuration_error"],
		["keyInvalid", "youtube_configuration_error"],
		["quotaExceeded", "youtube_quota_exceeded"],
		["rateLimitExceeded", "youtube_quota_exceeded"],
		["SERVICE_DISABLED", "youtube_configuration_error"],
		["videoNotFound", "video_unavailable"],
	]);
	let reason = "unknown";
	try {
		const body: unknown = await response.json();
		if (body && typeof body === "object" && "error" in body) {
			const error = body.error;
			if (error && typeof error === "object") {
				for (const field of ["details", "errors"] as const) {
					if (!(field in error)) continue;
					const entries = (error as Record<string, unknown>)[field];
					if (!Array.isArray(entries)) continue;
					for (const entry of entries as unknown[]) {
						if (
							entry &&
							typeof entry === "object" &&
							"reason" in entry &&
							typeof entry.reason === "string" &&
							knownReasons.has(entry.reason)
						) {
							reason = entry.reason;
							break;
						}
					}
					if (reason !== "unknown") break;
				}
			}
		}
	} catch {
		// Error bodies are not always JSON. Never expose upstream text or request URLs.
	}
	const code = knownReasons.get(reason);
	// Log only allowlisted reasons: Google messages can contain credentials and project details.
	console.error("YouTube comment request failed", { reason, status: response.status });
	switch (code) {
		case "comments_disabled":
			return new CommentsError("Comments are disabled for this video.", 403, undefined, code);
		case "video_unavailable":
			return new CommentsError("This video is unavailable or private.", 404, undefined, code);
		case "youtube_configuration_error":
			return new CommentsError("The comment service cannot access YouTube.", 503, undefined, code);
		case "youtube_quota_exceeded":
			return new CommentsError(
				"The comment service has reached its YouTube quota. Please try again later.",
				503,
				undefined,
				code,
			);
		default:
			return new CommentsError("Unable to fetch comments from YouTube.", 502);
	}
}
