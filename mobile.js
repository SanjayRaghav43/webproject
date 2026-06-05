/* ═══════════════════════════════════════
   MOBILE MENU — Hamburger + Accordion
   ═══════════════════════════════════════ */

(function() {
  var hamburger = document.getElementById('hamburgerBtn');
  var overlay = document.getElementById('mobileOverlay');
  var closeBtn = document.getElementById('mobileClose');

  if (!hamburger || !overlay) return;

  /* Open overlay */
  hamburger.addEventListener('click', function() {
    hamburger.classList.add('active');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  /* Close overlay */
  function closeMobile() {
    hamburger.classList.remove('active');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeMobile);

  /* ── Top-level accordion (Solutions, Services, etc.) ── */
  var navItems = overlay.querySelectorAll('.mobile-nav-item > .mobile-nav-btn');
  navItems.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var parent = btn.parentElement;
      var wasOpen = parent.classList.contains('open');

      /* Close all top-level items */
      overlay.querySelectorAll('.mobile-nav-item').forEach(function(item) {
        item.classList.remove('open');
      });

      /* Toggle clicked one */
      if (!wasOpen) {
        parent.classList.add('open');
      }
    });
  });

  /* ── Sub-level accordion (Food feed, Advanced materials, etc.) ── */
  var subItems = overlay.querySelectorAll('.mobile-sub-item > .mobile-sub-btn');
  subItems.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var parent = btn.parentElement;
      var wasOpen = parent.classList.contains('open');

      /* Close sibling sub-items only */
      var siblings = parent.parentElement.querySelectorAll('.mobile-sub-item');
      siblings.forEach(function(item) {
        item.classList.remove('open');
      });

      if (!wasOpen) {
        parent.classList.add('open');
      }
    });
  });

})();


/* ═══════════════════════════════════════
   FOOTER — Accordion toggle on mobile
   ═══════════════════════════════════════ */
(function() {
  var footerCols = document.querySelectorAll('.footer-col');

  footerCols.forEach(function(col) {
    var h4 = col.querySelector('h4');
    if (!h4) return;

    /* Add + toggle icon if not already present */
    if (!h4.querySelector('.footer-col-toggle')) {
      var toggle = document.createElement('span');
      toggle.className = 'footer-col-toggle';
      toggle.textContent = '+';
      h4.appendChild(toggle);
    }

    h4.addEventListener('click', function() {
      /* Only work on mobile */
      if (window.innerWidth > 768) return;

      var wasOpen = col.classList.contains('fc-open');

      /* Close all footer cols */
      footerCols.forEach(function(c) {
        c.classList.remove('fc-open');
      });

      /* Toggle clicked one */
      if (!wasOpen) {
        col.classList.add('fc-open');
      }
    });
  });
})();




/* ── MOBILE LANGUAGE PICKER ── */
(function() {
  var btn = document.getElementById('mobileLangBtn');
  var overlay = document.getElementById('mobileLangOverlay');
  var closeBtn = document.getElementById('mobileLangClose');
  var val = document.getElementById('mobileLangVal');
  if (!btn || !overlay) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    overlay.classList.add('open');
  });

  closeBtn.addEventListener('click', function() {
    overlay.classList.remove('open');
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  overlay.querySelectorAll('.mobile-lang-list li').forEach(function(li) {
    li.addEventListener('click', function() {
      overlay.querySelectorAll('li').forEach(function(x) { x.classList.remove('active'); });
      li.classList.add('active');
      val.textContent = li.dataset.l;
      overlay.classList.remove('open');
    });
  });
})();