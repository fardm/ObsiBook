chrome.action.onClicked.addListener((tab) => {
  // Check if the tab URL starts with chrome:// or about
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) {
    console.warn("Extension cannot be run on chrome:// or about: pages.");
    return;
  }

  // Check if site is whitelisted
  const supportedSites = [
    "taaghche.com",
    "digikala.com",
    "goodreads.com", 
    "fidibo.com",
    "behkhaan.ir",
    "ketabrah.ir"
  ];

  const isSiteSupported = supportedSites.some(site => tab.url.includes(site));

  if (!isSiteSupported) {
    console.warn("This website is not supported by the extension.");
    return;
  }

  // Refresh the Fidibo site
  if (tab.url.includes("fidibo.com")) {
    chrome.tabs.reload(tab.id, {}, () => {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
      }, 1000);
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  }
});