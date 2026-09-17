chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({
    enabled: true,
    hideOnBlur: true,
    hideOnTabSwitch: true,
    revealOnFocus: true
  }, (current) => {
    chrome.storage.sync.set(current);
  });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { type: "TAB_ACTIVATED" }).catch(() => {});
});
