// src/chrome-extension/background/background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "moveAllTabsToNewWindow",
    title: chrome.i18n.getMessage("moveToNewWindow"),
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "moveAllTabsToNewWindow") {
    // 現在のウィンドウのタブ情報を取得
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      // 各タブを別々の新しいウィンドウで開く
      tabs.forEach(tab => {
        chrome.windows.create({
          url: tab.url,
          focused: false  // 新しいウィンドウにフォーカスを移動しない
        });
      });
      
      // 元のウィンドウのタブをすべて閉じる
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const tabIds = tabs.map(tab => tab.id);
        chrome.tabs.remove(tabIds);
      });
    });
  }
});

// エラーハンドリング
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'error') {
    console.error('Tab Extension Error:', request.message);
  }
});