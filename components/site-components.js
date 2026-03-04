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
                '<h1>' + config.name + '</h1>' +
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
})();
