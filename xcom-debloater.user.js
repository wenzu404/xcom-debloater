// ==UserScript==
// @name         X.com Debloater
// @namespace    https://github.com/wenzu404
// @version      1.0
// @description  Remove Premium upsells, suggestions, verified-org tab, promoted tweets, footer, empty wrappers and more on X.com / Twitter.
// @author       wenzu
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  function cleanUp() {
    // Remove Premium upsell cards and links
    document.querySelectorAll(
      '[data-testid="super-upsell-UpsellCardRenderProperties"], ' +
      'a[href*="/i/premium_sign_up"]'
    ).forEach(el => el.remove());

    // Remove Suggestions / Who to follow panels
    document.querySelectorAll(
      'aside[aria-label="Suggestions"], ' +
      'aside[aria-label="Who to follow"]'
    ).forEach(el => el.remove());

    // Remove Verified Organizations signup tab
    document.querySelectorAll('a[data-testid="vo-signup-tab"]')
      .forEach(el => el.remove());

    // Remove promoted tweets
    document.querySelectorAll('[data-testid="placementTracking"]')
      .forEach(el => {
        let tweet = el.closest('[data-testid="tweet"], article');
        if (tweet) tweet.remove();
      });

    // Remove footer and legal links
    document.querySelectorAll(
      'nav[aria-label="Pied de page"], ' +
      'nav[aria-label="Footer"], ' +
      'footer'
    ).forEach(el => el.remove());

    // Remove old empty suggestion wrappers
    document.querySelectorAll('div.css-175oi2r.r-1ifxtd0')
      .forEach(div => {
        let content = div.innerHTML.trim();
        if (!content || content === '<div></div>') {
          div.remove();
        }
      });

    // Remove leftover blank containers
    document.querySelectorAll('div.css-175oi2r.r-1bro5k0')
      .forEach(div => div.remove());
  }

  // Run once on load
  cleanUp();

  // Watch for dynamically loaded content
  new MutationObserver(cleanUp).observe(document.body, {
    childList: true,
    subtree:   true
  });
})();
