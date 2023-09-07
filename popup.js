// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const stopButton = document.getElementById('stopButton');
  const searchCountInput = document.getElementById('searchCount'); // Define searchCountInput
  const delayTimeInput = document.getElementById('delayTime'); // Define delayTimeInput
  const statusDiv = document.getElementById('status');

  function updatePopupStatus(status) {
    statusDiv.textContent = status;
  }

  searchButton.addEventListener('click', async () => {
    const searchCount = parseInt(searchCountInput.value);
    const delayTime = parseInt(delayTimeInput.value);
    chrome.runtime.sendMessage({ action: 'startSearch', searchCount, delayTime });
  });

  stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stopSearch' });
  });

  // Retrieve and display the search status from storage
  chrome.storage.local.get('searchStatus', function (result) {
    updatePopupStatus(result.searchStatus || '');
  });

  // Listen for changes to the search status
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.searchStatus) {
      updatePopupStatus(changes.searchStatus.newValue || '');
    }
  });
});
