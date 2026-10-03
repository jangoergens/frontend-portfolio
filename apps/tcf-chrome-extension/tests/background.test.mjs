import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = await readFile(
  new URL("../background.js", import.meta.url),
  "utf8",
);

function click(url) {
  const opened = [];
  let listener;
  runInNewContext(source, {
    URL,
    chrome: {
      action: {
        onClicked: {
          addListener: (callback) => {
            listener = callback;
          },
        },
      },
      tabs: { create: ({ url }) => opened.push(url) },
    },
  });
  listener({ url });
  return opened;
}

test("opens supported YouTube watch, short, live, embed and share URLs", () => {
  for (const url of [
    "https://www.youtube.com/watch?v=czgOWmtGVGs&t=10",
    "https://youtube.com/watch?v=czgOWmtGVGs",
    "https://m.youtube.com/watch?v=czgOWmtGVGs",
    "https://music.youtube.com/watch?v=czgOWmtGVGs",
    "https://youtu.be/czgOWmtGVGs?si=example",
    "https://www.youtube.com/shorts/czgOWmtGVGs",
    "https://www.youtube.com/live/czgOWmtGVGs",
    "https://www.youtube.com/embed/czgOWmtGVGs",
  ])
    assert.deepEqual(click(url), [
      "https://topcomments.jangoergens.de/czgOWmtGVGs",
    ]);
});

test("ignores unrelated hosts, unsafe schemes, credentials, ports and ambiguous IDs", () => {
  for (const url of [
    undefined,
    "not a URL",
    "chrome://extensions",
    "https://example.com/watch?v=czgOWmtGVGs",
    "https://youtube.com.example.com/watch?v=czgOWmtGVGs",
    "https://www.youtube.com@evil.example/watch?v=czgOWmtGVGs",
    "ftp://www.youtube.com/watch?v=czgOWmtGVGs",
    "https://user:password@www.youtube.com/watch?v=czgOWmtGVGs",
    "https://www.youtube.com:8443/watch?v=czgOWmtGVGs",
    "https://www.youtube.com/watch?v=czgOWmtGVGs&v=abcdefghijk",
    "https://www.youtube.com/watch?v=invalid",
    "https://www.youtube.com/watch?v=abcdefghij%2F",
    "https://www.youtube.com/channel/czgOWmtGVGs",
    "https://youtu.be/czgOWmtGVGs/extra",
    "https://www.youtube.com/shorts/czgOWmtGVGs/extra",
    "https://www.youtube.com/",
  ])
    assert.deepEqual(click(url), []);
});
