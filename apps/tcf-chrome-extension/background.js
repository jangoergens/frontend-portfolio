chrome.action.onClicked.addListener((tab) => {
  const url = new URL(tab.url);
  const videoId = new URLSearchParams(url.search).get("v");
  if (videoId) {
    chrome.tabs.create({
      url: `https://topcomments.jangoergens.de/${videoId}`,
    });
  }
});
