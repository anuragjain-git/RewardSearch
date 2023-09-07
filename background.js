// background.js

let searchTabId = null;
let stopSearch = false;
let intervalId = null;
let searchesLeft = 0;

function updateStatus(status) {
  chrome.storage.local.set({ searchStatus: status });
}

function startSearch(searchCount, delayTime) {
  searchesLeft = searchCount;
  updateStatus(`Number of searches left: ${searchesLeft}`);

  chrome.tabs.create({ url: 'https://www.bing.com' }, function (tab) {
    searchTabId = tab.id;
  });

  intervalId = setInterval(async function () {
    if (stopSearch || searchesLeft <= 0) {
      clearInterval(intervalId);
      chrome.tabs.update(searchTabId, { url: 'https://www.bing.com' }); // Close the search tab
      updateStatus('Searches completed!');
      return;
    }

    const randomWord = await getRandomWord();
    const searchQuery = `https://www.bing.com/search?q=${randomWord}`;

    chrome.tabs.update(searchTabId, { url: searchQuery }, function () {
      searchesLeft--;
      updateStatus(`Number of searches left: ${searchesLeft}`);
    });
  }, delayTime);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'startSearch') {
    startSearch(message.searchCount, message.delayTime);
  } else if (message.action === 'stopSearch') {
    stopSearch = true;
  }
});

async function getRandomWord() {
  const response = await fetch('https://random-word-api.herokuapp.com/word');
  const data = await response.json();
  return data[0];
}
