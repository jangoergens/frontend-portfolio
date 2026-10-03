chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  let url;
  try {
    url = new URL(tab.url);
  } catch {
    return;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return;
  if (url.username || url.password || url.port) return;

  let videoId;
  if (url.hostname === "youtu.be") {
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 1) videoId = parts[0];
  } else if (
    [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "music.youtube.com",
    ].includes(url.hostname)
  ) {
    if (url.pathname === "/watch") {
      const ids = url.searchParams.getAll("v");
      if (ids.length === 1) videoId = ids[0];
    } else {
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length === 2 && ["shorts", "live", "embed"].includes(parts[0]))
        videoId = parts[1];
    }
  }

  if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    chrome.tabs.create({
      url: `https://topcomments.jangoergens.de/${videoId}`,
    });
  }
});
