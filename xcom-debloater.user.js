// ==UserScript==
// @name         X.com Debloater
// @namespace    https://github.com/wenzu404
// @version      2.0
// @description  Removes Premium upsells, suggestions, verified orgs tab, promoted tweets, footer... and now preserves profile videos/images.
// @author       wenzu
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  function containsMedia(el) {
    return !!el.querySelector('video, img, [data-testid="videoPlayer"]');
  }

  function cleanUp() {
    // 1) Premium upsells
    document.querySelectorAll(
      '[data-testid="super-upsell-UpsellCardRenderProperties"], ' +
      'a[href*="/i/premium_sign_up"]'
    ).forEach(el => el.remove());

    // 2) "Who to follow" sidebar
    document.querySelectorAll(
      'aside[aria-label="Suggestions"], ' +
      'aside[aria-label="Who to follow"]'
    ).forEach(el => el.remove());

    // 3) Verified Organizations tab
    document.querySelectorAll('a[data-testid="vo-signup-tab"]')
      .forEach(el => el.remove());

    // 4) Promoted tweets — only remove if "Promoted" label is shown
    //    and the tweet does NOT contain a video or image
    document.querySelectorAll('[data-testid="placementTracking"]').forEach(marker => {
      if (containsMedia(marker)) return;

      const tweet = marker.closest('[data-testid="tweet"], article');
      if (!tweet) return;

      const isPromoted = [...tweet.querySelectorAll('span')]
        .some(span => span.textContent.trim() === 'Promoted');
      if (isPromoted) tweet.remove();
    });

    // 5) Footer and legal links
    document.querySelectorAll(
      'nav[aria-label="Pied de page"], ' +
      'nav[aria-label="Footer"], ' +
      'footer'
    ).forEach(el => el.remove());

    // 6) Old suggestion wrappers (empty but may contain media)
    document.querySelectorAll('div.css-175oi2r.r-1ifxtd0').forEach(div => {
      const html = div.innerHTML.trim();
      if ((!html || html === '<div></div>') && !containsMedia(div)) {
        div.remove();
      }
    });

    // 7) Other empty containers
    document.querySelectorAll('div.css-175oi2r.r-1bro5k0').forEach(div => {
      if (!div.innerHTML.trim() && !containsMedia(div)) {
        div.remove();
      }
    });
  }

  // Initial run
  cleanUp();

  // Watch for DOM changes
  new MutationObserver(cleanUp).observe(document.body, {
    childList: true,
    subtree:   true
  });
})();
