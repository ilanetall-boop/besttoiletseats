/**
 * network-banners.js — Cross-Promotion Banner System
 *
 * Inserts promotional banners for other blogs in the network.
 * Reads from SITE_CONFIG.network to know which banners to show.
 * Never promotes the current site (self-detection via domain).
 *
 * Usage: Add to each blog's components/ folder + configure banners in site-config.js
 *
 * Positions:
 *   - mid-article: after 3rd product-review div
 *   - end-article: before FAQ section or at end of .prose
 *   - sidebar: sticky on desktop (if sidebar exists)
 */

(function () {
  'use strict';

  var config = window.SITE_CONFIG;
  if (!config || !config.networkBanners) return;

  var banners = config.networkBanners;
  var currentDomain = window.location.hostname.replace('www.', '');

  // Filter out self-promotion
  var otherBanners = banners.filter(function (b) {
    return b.domain !== currentDomain && b.active !== false;
  });

  if (otherBanners.length === 0) return;

  // CSS for banners
  var style = document.createElement('style');
  style.textContent = [
    '.network-banner {',
    '  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);',
    '  border: 2px solid #dee2e6;',
    '  border-radius: 12px;',
    '  padding: 0;',
    '  margin: 2rem 0;',
    '  overflow: hidden;',
    '  transition: transform 0.3s ease, box-shadow 0.3s ease;',
    '  display: flex;',
    '  flex-direction: row;',
    '  align-items: stretch;',
    '  text-decoration: none;',
    '  color: inherit;',
    '}',
    '.network-banner:hover {',
    '  transform: translateY(-3px);',
    '  box-shadow: 0 8px 25px rgba(0,0,0,0.12);',
    '  border-color: var(--accent, #FF7043);',
    '}',
    '.network-banner-image {',
    '  width: 280px;',
    '  min-height: 180px;',
    '  background-size: cover;',
    '  background-position: center;',
    '  flex-shrink: 0;',
    '}',
    '.network-banner-content {',
    '  padding: 1.5rem;',
    '  display: flex;',
    '  flex-direction: column;',
    '  justify-content: center;',
    '  flex: 1;',
    '}',
    '.network-banner-label {',
    '  font-size: 0.7rem;',
    '  text-transform: uppercase;',
    '  letter-spacing: 0.1em;',
    '  color: #6c757d;',
    '  margin-bottom: 0.5rem;',
    '}',
    '.network-banner-title {',
    '  font-size: 1.25rem;',
    '  font-weight: 700;',
    '  color: #212529;',
    '  margin: 0 0 0.5rem 0;',
    '  line-height: 1.3;',
    '}',
    '.network-banner-desc {',
    '  font-size: 0.9rem;',
    '  color: #495057;',
    '  margin: 0 0 1rem 0;',
    '  line-height: 1.5;',
    '}',
    '.network-banner-cta {',
    '  display: inline-block;',
    '  background: var(--accent, #FF7043);',
    '  color: white;',
    '  padding: 0.5rem 1.25rem;',
    '  border-radius: 6px;',
    '  font-weight: 600;',
    '  font-size: 0.85rem;',
    '  text-decoration: none;',
    '  align-self: flex-start;',
    '  transition: filter 0.2s;',
    '}',
    '.network-banner-cta:hover { filter: brightness(0.9); }',
    '@media (max-width: 640px) {',
    '  .network-banner { flex-direction: column; }',
    '  .network-banner-image { width: 100%; min-height: 140px; }',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  function createBannerElement(banner) {
    var url = 'https://www.' + banner.domain + (banner.landingPage || '');
    var el = document.createElement('a');
    el.className = 'network-banner';
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener';
    el.setAttribute('data-network', banner.id);

    el.innerHTML = [
      '<div class="network-banner-image" style="background-image: url(\'' + (banner.bannerImage || '') + '\')"></div>',
      '<div class="network-banner-content">',
      '  <div class="network-banner-label">From Our Network</div>',
      '  <h4 class="network-banner-title">' + banner.headline + '</h4>',
      '  <p class="network-banner-desc">' + banner.description + '</p>',
      '  <span class="network-banner-cta">' + (banner.ctaText || 'Read More') + ' &rarr;</span>',
      '</div>'
    ].join('');

    return el;
  }

  function insertMidArticle(banner) {
    // Insert after 3rd .product-review
    var products = document.querySelectorAll('.product-review');
    if (products.length >= 3) {
      var target = products[2];
      target.parentNode.insertBefore(createBannerElement(banner), target.nextSibling);
      return true;
    }
    return false;
  }

  function insertEndArticle(banner) {
    // Insert before FAQ or before .final-cta or at end of .prose
    var faq = document.querySelector('#faq');
    var finalCta = document.querySelector('.final-cta');
    var prose = document.querySelector('.prose');

    if (faq) {
      faq.parentNode.insertBefore(createBannerElement(banner), faq);
    } else if (finalCta) {
      finalCta.parentNode.insertBefore(createBannerElement(banner), finalCta);
    } else if (prose) {
      prose.appendChild(createBannerElement(banner));
    }
  }

  // Shuffle and pick banners for each position
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
  }

  var shuffled = shuffle(otherBanners.slice());

  document.addEventListener('DOMContentLoaded', function () {
    // Mid-article: first banner
    if (shuffled.length >= 1) {
      insertMidArticle(shuffled[0]);
    }
    // End-article: second banner (or first if different)
    if (shuffled.length >= 2) {
      insertEndArticle(shuffled[1]);
    } else if (shuffled.length === 1) {
      insertEndArticle(shuffled[0]);
    }
  });
})();
