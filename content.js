/******************************************************
 * content.js
 * Reads the user's account→color config from storage,
 * detects the current AWS account in the URL,
 * and applies the user's chosen color to the top nav.
 ******************************************************/

(function() {
  const host = window.location.hostname;
  const match = host.match(/^(\d+)-/);
  const accountId = match ? match[1] : null;

  if (!accountId) return;

  chrome.storage.sync.get({ accountColors: {} }, (result) => {
    const color = result.accountColors[accountId];
    if (!color) return;

    const possibleNavSelectors = [
      '#awsc-top-level-nav',
      'header[class*="awsc-header"]',
      'header[class*="globalNav"]',
      '[class*="awsc-nav"]'
    ];

    function applyColor() {
      for (const selector of possibleNavSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          element.style.backgroundColor = color;
          return true;
        }
      }
      return false;
    }

    // Try immediately
    if (!applyColor()) {
      // If not found, try again after a short delay
      setTimeout(applyColor, 1000);
    }
  });
})();
