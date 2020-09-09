// Background code goes here
// eslint-disable-next-line no-undef
chrome.browserAction.onClicked.addListener((/* tab */) => {
  // Opens our extension in a new browser window.
  // Only if a popup isn't defined in the manifest.
  // eslint-disable-next-line no-undef
  chrome.tabs.create({
    // eslint-disable-next-line no-undef
    url: chrome.extension.getURL('www/index.html')
  }, (/* newTab */) => {
    // Tab opened.
  })
})
