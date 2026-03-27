/**
 * site-components.js — Shared header & footer injection
 * Master template: core/components/site-components.js
 *
 * Reads window.SITE_CONFIG (set by site-config.js loaded synchronously in <head>)
 * Injects standardized header, footer, and their CSS into the page.
 */
(function () {
  'use strict';

  var config = window.SITE_CONFIG;
  if (!config) {
    console.error('[site-components] window.SITE_CONFIG not found. Load site-config.js before this script.');
    return;
  }

  // ---------------------------------------------------------------------------
  // Google Analytics — auto-inject if gaId is set and gtag not already loaded
  // ---------------------------------------------------------------------------
  if (config.gaId && !window.gtag) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.gaId;
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.gaId, { send_page_view: true });
  }

  // ---------------------------------------------------------------------------
  // Detect current page
  // ---------------------------------------------------------------------------
  var path = window.location.pathname;
  var page = path.split('/').pop().replace(/\.html$/, '') || 'index';

  function isActive(href) {
    // "index" matches "", "/" and "index"
    if (href === 'index') return page === 'index' || page === '' || path === '/';
    return page === href || page.toLowerCase() === href.toLowerCase();
  }

  // ---------------------------------------------------------------------------
  // Inject CSS
  // ---------------------------------------------------------------------------
  var css = [
    '/* ===== RESET: isolate header/footer from page styles ===== */',
    '#site-header,#site-footer{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;box-sizing:border-box}',
    '#site-header *,#site-footer *,#site-header *::before,#site-footer *::before,#site-header *::after,#site-footer *::after{box-sizing:border-box;margin:0;padding:0}',
    '#site-header img,#site-footer img{display:block;max-width:100%;border:0}',
    '#site-header a,#site-footer a{color:inherit;text-decoration:none}',
    '#site-header ul,#site-footer ul{list-style:none}',
    '#site-header h1,#site-header h4,#site-footer h1,#site-footer h4{font-size:inherit;font-weight:inherit}',
    '#site-header p,#site-footer p{margin:0}',
    '#site-header button{font:inherit;cursor:pointer}',

    '/* ===== HEADER ===== */',
    '#site-header{background:#fff;border-bottom:1px solid var(--border,#e5e5e5);position:sticky;top:0;z-index:50;box-shadow:0 1px 3px rgba(0,0,0,.1)}',
    '#site-header .hf-container,#site-footer .hf-container{max-width:1200px;margin:0 auto;padding:0 1rem}',
    '#site-header .header-content{display:flex;align-items:center;justify-content:space-between;padding:1rem 0}',
    '#site-header .logo-section{display:flex;align-items:center;gap:1rem}',
    '#site-header .logo-section a{display:flex;align-items:center;gap:1rem;text-decoration:none}',
    '#site-header .logo-section img{height:3.5rem;width:3.5rem}',
    '#site-header .logo-section h1{font-size:1.5rem;font-weight:700;color:var(--primary);margin:0;line-height:1.2}',
    '#site-header .logo-section p{font-size:.875rem;color:var(--primary-light);margin:0}',
    '#site-header nav ul{display:flex;list-style:none;gap:2rem;margin:0;padding:0}',
    '#site-header nav a{color:var(--primary);text-decoration:none;font-weight:500;transition:color .3s ease;position:relative}',
    '#site-header nav a::after{content:\'\';position:absolute;width:0;height:2px;bottom:-3px;left:0;background:var(--accent);transition:width .3s ease}',
    '#site-header nav a:hover{color:var(--accent)}',
    '#site-header nav a:hover::after{width:100%}',
    '#site-header nav a.active{color:var(--accent)}',
    '#site-header nav a.active::after{width:100%}',

    '/* Mobile menu toggle */',
    '#site-header .mobile-menu-toggle{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}',
    '#site-header .mobile-menu-toggle span{display:block;width:24px;height:2px;background:var(--primary);border-radius:2px;transition:all .3s ease}',
    '#site-header .mobile-menu-toggle.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}',
    '#site-header .mobile-menu-toggle.open span:nth-child(2){opacity:0}',
    '#site-header .mobile-menu-toggle.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}',

    '/* ===== FOOTER ===== */',
    '#site-footer{background:var(--primary-dark);color:#fff;padding:3rem 0 2rem}',
    '#site-footer .footer-grid{display:grid;gap:2rem;margin-bottom:2rem}',
    '#site-footer .footer-grid h4{font-weight:700;font-size:1rem;margin-bottom:1rem}',
    '#site-footer .footer-grid p,#site-footer .footer-grid li{font-size:.875rem;color:rgba(255,255,255,.7);line-height:1.7}',
    '#site-footer .footer-grid ul{list-style:none;margin:0;padding:0}',
    '#site-footer .footer-grid li{margin-bottom:.5rem}',
    '#site-footer .footer-grid a{color:rgba(255,255,255,.7);text-decoration:none;transition:color .3s ease}',
    '#site-footer .footer-grid a:hover{color:var(--accent)}',
    '#site-footer .footer-bottom{border-top:1px solid rgba(255,255,255,.15);padding-top:1.5rem;text-align:center;font-size:.8rem;color:rgba(255,255,255,.5)}',

    '/* ===== RESPONSIVE ===== */',
    '@media(min-width:768px){',
    '  #site-footer .footer-grid{grid-template-columns:repeat(4,1fr)}',
    '  #site-header .header-content{flex-wrap:nowrap}',
    '}',
    '@media(max-width:767px){',
    '  #site-header .mobile-menu-toggle{display:flex}',
    '  #site-header nav{display:none;width:100%;padding-top:.5rem}',
    '  #site-header nav.open{display:block}',
    '  #site-header nav ul{flex-direction:column;gap:0}',
    '  #site-header nav li{border-top:1px solid var(--border,#e5e5e5)}',
    '  #site-header nav a{display:block;padding:.75rem 0}',
    '  #site-header .header-content{flex-wrap:wrap}',
    '  table,.comparison-table{display:block!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch;max-width:100vw!important}',
    '  .specs-grid,.product-specs{overflow-x:auto;max-width:100vw}',
    '}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'site-components-css';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------------------------------------------------------------------------
  // Inject header
  // ---------------------------------------------------------------------------
  var header = document.getElementById('site-header');
  if (header) {
    var navItems = config.nav.map(function (item) {
      var cls = isActive(item.href) ? ' class="active"' : '';
      return '<li><a href="' + item.href + '"' + cls + '>' + item.label + '</a></li>';
    }).join('');

    header.innerHTML =
      '<div class="hf-container">' +
        '<div class="header-content">' +
          '<div class="logo-section">' +
            '<a href="index">' +
              '<img src="' + config.logo + '" alt="' + config.name + ' Logo" width="56" height="56">' +
              '<div>' +
                '<div class="site-title" style="font-size:1.5em;font-weight:700;margin:0">' + config.name + '</div>' +
                '<p>' + config.tagline + '</p>' +
              '</div>' +
            '</a>' +
          '</div>' +
          '<button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<nav>' +
            '<ul>' + navItems + '</ul>' +
          '</nav>' +
        '</div>' +
      '</div>';

    // Mobile menu toggle handler
    var toggle = header.querySelector('.mobile-menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var nav = header.querySelector('nav');
        nav.classList.toggle('open');
        toggle.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Inject affiliate disclosure on article pages (not homepage/utility pages)
  // ---------------------------------------------------------------------------
  var isArticle = document.querySelector('article') && !window.location.pathname.match(/^\/?$|index|articles|about|contact|privacy|terms|disclosure|comparisons|how-we-research|404/);
  if (isArticle && !document.querySelector('.affiliate-disclosure')) {
    var disclosureEl = document.createElement('div');
    disclosureEl.className = 'affiliate-disclosure';
    disclosureEl.style.cssText = 'background:#f8f9fa;border-left:3px solid var(--accent,#FF6F00);padding:10px 16px;margin:10px 0 20px;font-size:0.85rem;color:#666;font-style:italic;max-width:900px;margin-left:auto;margin-right:auto;';
    disclosureEl.innerHTML = 'This article contains affiliate links. If you purchase through these links, we may earn a small commission at no extra cost to you. <a href="/disclosure" style="color:var(--primary,#333)">Full disclosure</a>.';
    var articleEl = document.querySelector('article');
    if (articleEl) articleEl.parentNode.insertBefore(disclosureEl, articleEl);
  }

  // ---------------------------------------------------------------------------
  // Inject footer
  // ---------------------------------------------------------------------------
  var footer = document.getElementById('site-footer');
  if (footer) {
    var quickLinks = config.footer.quickLinks.map(function (l) {
      return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
    }).join('');

    var legalLinks = config.footer.legal.map(function (l) {
      return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
    }).join('');

    var networkLinks = config.footer.network.map(function (l) {
      return '<li><a href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a></li>';
    }).join('');

    footer.innerHTML =
      '<div class="hf-container">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<h4>' + config.name + '</h4>' +
            '<p>' + config.footer.description + '</p>' +
          '</div>' +
          '<div>' +
            '<h4>Quick Links</h4>' +
            '<ul>' + quickLinks + '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Legal</h4>' +
            '<ul>' + legalLinks + '</ul>' +
          '</div>' +
          '<div>' +
            '<h4>Our Network</h4>' +
            '<ul>' + networkLinks + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>&copy; ' + new Date().getFullYear() + ' ' + config.name + ' - All rights reserved</p>' +
        '</div>' +
      '</div>';
  }
  // ---------------------------------------------------------------------------
  // Product image gallery — click thumbnail to view full-size
  // Supports two gallery structures:
  //   1) .gallery-main + .gallery-thumbs (BBR, SC, BTS)
  //   2) .product-gallery grid (BSH, BV)
  // ---------------------------------------------------------------------------

  // Inject gallery lightbox + improved gallery layout CSS
  var galleryCss = [
    '/* Gallery layout: main image prominent, thumbs as small row below */',
    '.product-gallery{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:12px}',
    '.gallery-main{width:100%!important;max-width:320px!important;height:260px!important;object-fit:contain!important;border-radius:8px!important;margin:0 auto 4px!important;display:block!important;background:#f9f9f9;border:1px solid #e0e0e0;cursor:pointer;transition:opacity .25s ease}',
    '.gallery-thumbs{display:flex!important;justify-content:center;gap:6px;flex-wrap:wrap}',
    '.gallery-thumb{width:52px!important;min-width:52px!important;max-width:52px!important;height:52px!important;object-fit:cover!important;border-radius:6px!important;border:2px solid #e0e0e0!important;cursor:pointer!important;transition:border-color .2s,transform .2s}',
    '.gallery-thumb:hover{border-color:var(--accent,#FF7043)!important;transform:scale(1.08)}',
    '.gallery-thumb.active{border-color:var(--accent,#FF7043)!important;box-shadow:0 0 0 1px var(--accent,#FF7043)}',
    '/* Lightbox */',
    '.gallery-lightbox{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.85);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;opacity:0;transition:opacity .2s ease}',
    '.gallery-lightbox.show{opacity:1}',
    '.gallery-lightbox img{max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;box-shadow:0 4px 24px rgba(0,0,0,.5)}',
    '.product-gallery img{cursor:pointer}'
  ].join('\n');
  var galleryStyle = document.createElement('style');
  galleryStyle.textContent = galleryCss;
  document.head.appendChild(galleryStyle);

  document.addEventListener('click', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;

    var src = null;

    // Case 1: gallery-thumb with data-full attribute
    if (img.classList.contains('gallery-thumb') && img.getAttribute('data-full')) {
      src = img.getAttribute('data-full');
      // Also update the gallery-main image if present
      var container = img.closest('.product-card') || img.parentElement.parentElement;
      var mainImg = container ? container.querySelector('.gallery-main') : null;
      if (mainImg) {
        mainImg.src = src;
        mainImg.alt = img.alt;
      }
      // Update active state
      var thumbs = img.parentElement.querySelectorAll('.gallery-thumb');
      for (var t = 0; t < thumbs.length; t++) thumbs[t].classList.remove('active');
      img.classList.add('active');
    }

    // Case 2: product-gallery img click
    if (img.parentElement && img.parentElement.classList.contains('product-gallery')) {
      src = img.src;
    }

    // Case 3: gallery-main click
    if (img.classList.contains('gallery-main')) {
      src = img.src;
    }

    // Open lightbox
    if (src) {
      e.preventDefault();
      var overlay = document.createElement('div');
      overlay.className = 'gallery-lightbox';
      var bigImg = document.createElement('img');
      bigImg.src = src;
      bigImg.alt = img.alt || 'Product image';
      overlay.appendChild(bigImg);
      document.body.appendChild(overlay);
      // Trigger fade-in
      requestAnimationFrame(function () { overlay.classList.add('show'); });
      overlay.addEventListener('click', function () {
        overlay.classList.remove('show');
        setTimeout(function () { overlay.remove(); }, 200);
      });
      document.addEventListener('keydown', function closeOnEsc(ev) {
        if (ev.key === 'Escape') {
          overlay.classList.remove('show');
          setTimeout(function () { overlay.remove(); }, 200);
          document.removeEventListener('keydown', closeOnEsc);
        }
      });
    }
  });
})();
