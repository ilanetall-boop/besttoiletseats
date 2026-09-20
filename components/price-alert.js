/**
 * price-alert.js — « Alert me if the price drops » sur chaque fiche produit.
 *
 * POURQUOI
 * Le réseau reçoit ~4 000 sessions par mois et n'en capture aucune : chaque
 * lecteur repart et ne revient jamais. Une adresse capturée ici devient une
 * alerte de baisse de prix avec notre lien affilié — un clic d'intention, pas
 * un clic de lecture. C'est aussi le seul actif que Google ne peut pas retirer.
 *
 * COMMENT IL S'INSÈRE
 * Aucune dépendance, aucun framework, aucun style global : tout est porté par
 * le composant. Il se greffe sur les DEUX gabarits du réseau —
 * `.product-section` (récent) et `.product-card` (ancien, celui des pages les
 * plus visitées). Ne connaître qu'un gabarit sur deux, c'est ce qui avait laissé
 * 166 images mortes sur les pages qui rapportent le plus.
 *
 * CE QU'IL NE FAIT PAS
 * Aucun traçage, aucun cookie, aucune requête au chargement. Il ne parle à
 * l'API qu'au moment où le lecteur clique et donne son adresse. Un lecteur qui
 * ne s'inscrit pas n'est jamais vu par DipHound.
 */
(function () {
  'use strict';
  var API = 'https://api.diphound.com/subscribe';
  if (window.__priceAlertLoaded) return;
  window.__priceAlertLoaded = true;

  var CSS = [
    '.pa-wrap{margin:14px 0 4px}',
    '.pa-btn{display:inline-flex;align-items:center;gap:7px;background:none;border:1px solid #d3d3d3;',
    'border-radius:8px;padding:9px 14px;font:inherit;font-size:14px;color:#444;cursor:pointer;line-height:1.2}',
    '.pa-btn:hover{border-color:#999;color:#111}',
    '.pa-form{display:none;margin-top:10px;gap:8px;flex-wrap:wrap;align-items:center}',
    '.pa-form.pa-open{display:flex}',
    '.pa-form input{flex:1 1 210px;min-width:0;padding:10px 12px;border:1px solid #d3d3d3;border-radius:8px;font:inherit;font-size:15px}',
    '.pa-form button{padding:10px 16px;border:0;border-radius:8px;background:#1f1f1f;color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer}',
    '.pa-form button[disabled]{opacity:.55;cursor:default}',
    '.pa-msg{margin-top:8px;font-size:13.5px;line-height:1.45}',
    '.pa-ok{color:#1a7f37}.pa-err{color:#b3261e}',
    '.pa-fine{margin-top:6px;font-size:12px;color:#777;line-height:1.4}'
  ].join('');

  function injectCss() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // L'ASIN d'une fiche est celui de SON lien Amazon. On prend le premier lien
  // /dp/ de la section : c'est le produit dont la fiche parle.
  function asinOf(section) {
    var a = section.querySelector('a[href*="/dp/"]');
    if (!a) return null;
    var m = a.getAttribute('href').match(/\/dp\/([A-Z0-9]{10})/);
    return m ? m[1] : null;
  }

  function build(section, asin, blog) {
    var wrap = document.createElement('div');
    wrap.className = 'pa-wrap';
    wrap.innerHTML =
      '<button type="button" class="pa-btn" aria-expanded="false">' +
        '<span aria-hidden="true">🔔</span><span>Alert me if the price drops</span>' +
      '</button>' +
      '<div class="pa-form">' +
        '<input type="email" placeholder="your@email.com" aria-label="Email for price alerts" autocomplete="email" required>' +
        '<button type="button">Notify me</button>' +
      '</div>' +
      '<div class="pa-msg" role="status" aria-live="polite"></div>';

    var toggle = wrap.querySelector('.pa-btn');
    var form = wrap.querySelector('.pa-form');
    var input = wrap.querySelector('input');
    var submit = wrap.querySelector('.pa-form button');
    var msg = wrap.querySelector('.pa-msg');

    toggle.addEventListener('click', function () {
      var open = form.classList.toggle('pa-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) input.focus();
    });

    function say(text, cls) { msg.className = 'pa-msg ' + cls; msg.textContent = text; }

    function send() {
      var email = (input.value || '').trim();
      if (!email || email.indexOf('@') < 1) { say('Please enter a valid email address.', 'pa-err'); input.focus(); return; }
      submit.disabled = true;
      say('Sending…', '');
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, asin: asin, source: blog })
      }).then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          submit.disabled = false;
          if (d && d.ok) {
            form.classList.remove('pa-open');
            // Le message est le même dans tous les cas : on ne révèle jamais
            // qu'une adresse était déjà connue.
            say('Check your inbox and click the link to start watching this price.', 'pa-ok');
            wrap.insertAdjacentHTML('beforeend',
              '<div class="pa-fine">Free. Unsubscribe in one click. We earn a commission if you buy through our link.</div>');
          } else if (d && d.error === 'too_many_requests') {
            say('Too many attempts. Please try again in a minute.', 'pa-err');
          } else {
            say('Something went wrong. Please try again.', 'pa-err');
          }
        })
        .catch(function () { submit.disabled = false; say('Network error. Please try again.', 'pa-err'); });
    }

    submit.addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });
    return wrap;
  }

  function init() {
    // Le blog est lu depuis le domaine : aucune configuration par page à tenir
    // à jour, donc rien qui puisse diverger d'un blog à l'autre.
    var blog = location.hostname.replace(/^www\./, '');
    var sections = document.querySelectorAll('.product-section, .product-card');
    if (!sections.length) return;
    injectCss();
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (s.querySelector('.pa-wrap')) continue;
      var asin = asinOf(s);
      if (!asin) continue;
      // Sous le bouton d'achat : on propose l'alerte à qui n'achète pas
      // aujourd'hui, sans jamais passer devant le lien qui rapporte.
      var cta = s.querySelector('a.cta-button, a[class*="cta"]');
      var anchor = cta && cta.parentNode ? cta.parentNode : s;
      anchor.appendChild(build(s, asin, blog));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
