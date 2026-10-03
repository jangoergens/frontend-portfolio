import { expect, test } from "@playwright/test";

import type { RequiredCommentInfo } from "../../src/lib/types/youtubeApiTypes";

test("development API returns JSON comments sorted by likes", async ({ request }) => {
	const response = await request.get("/api/comments/czgOWmtGVGs");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("application/json");
	const comments = (await response.json()) as RequiredCommentInfo[];
	expect(comments).toHaveLength(6);
	const likes = comments.map((comment) => Number(comment.likeCount));
	expect(likes).toEqual([...likes].sort((a, b) => b - a));
});

test("API rejects malformed video IDs", async ({ request }) => {
	const response = await request.get("/api/comments/invalid");
	expect(response.status()).toBe(400);
	expect(await response.json()).toEqual({ error: "Invalid YouTube video ID." });
});
