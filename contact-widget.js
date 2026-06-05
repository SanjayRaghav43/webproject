(function () {
  /* Wait for DOM if needed */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var fab = document.getElementById('contactFab');
    var overlay = document.getElementById('contactOverlay');
    var closeBtn = document.getElementById('contactClose');
    var form = document.getElementById('contactForm');

    if (!fab) { console.warn('Contact widget: contactFab not found'); return; }
    if (!overlay) { console.warn('Contact widget: contactOverlay not found'); return; }

    /* ═══════════════════════════════════════
       OPEN / CLOSE POPUP
       ═══════════════════════════════════════ */
    fab.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closePopup();
    });

    function closePopup() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      closeAllDropdowns();
    }

    /* ═══════════════════════════════════════
       CUSTOM DROPDOWNS
       ═══════════════════════════════════════ */
    var dropdowns = document.querySelectorAll('.cf-custom-dropdown');

    dropdowns.forEach(function (dd) {
      var display = dd.querySelector('.cf-dd-display');
      var textEl = dd.querySelector('.cf-dd-text');
      var hiddenInput = dd.querySelector('input[type="hidden"]');
      var options = dd.querySelectorAll('.cf-dd-options li');
      var searchInput = dd.querySelector('.cf-dd-search');

      if (!display) return;

      display.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = dd.classList.contains('open');
        closeAllDropdowns();
        if (!wasOpen) {
          dd.classList.add('open');
          if (searchInput) {
            setTimeout(function () { searchInput.focus(); }, 50);
          }
        }
      });

      options.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
          e.stopPropagation();
          var value = opt.getAttribute('data-value');
          var text = opt.textContent;
          textEl.textContent = text;
          textEl.classList.remove('placeholder');
          hiddenInput.value = value;
          options.forEach(function (o) { o.classList.remove('selected'); });
          opt.classList.add('selected');
          dd.classList.remove('open');
          if (searchInput) {
            searchInput.value = '';
            options.forEach(function (o) { o.classList.remove('hidden'); });
          }
        });
      });

      if (searchInput) {
        searchInput.addEventListener('click', function (e) { e.stopPropagation(); });
        searchInput.addEventListener('input', function () {
          var q = searchInput.value.toLowerCase().trim();
          options.forEach(function (opt) {
            var text = opt.textContent.toLowerCase();
            if (q === '' || text.indexOf(q) !== -1) {
              opt.classList.remove('hidden');
            } else {
              opt.classList.add('hidden');
            }
          });
        });
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.cf-custom-dropdown')) {
        closeAllDropdowns();
      }
    });

    function closeAllDropdowns() {
      dropdowns.forEach(function (dd) {
        dd.classList.remove('open');
        var searchInput = dd.querySelector('.cf-dd-search');
        var options = dd.querySelectorAll('.cf-dd-options li');
        if (searchInput) {
          searchInput.value = '';
          options.forEach(function (o) { o.classList.remove('hidden'); });
        }
      });
    }

    /* ═══════════════════════════════════════
       FORM SUBMIT
       ═══════════════════════════════════════ */
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var privacy = form.querySelector('#cfPrivacy');
        if (!privacy.checked) {
          alert('Please agree to the privacy policy before sending.');
          return;
        }
        var requiredDropdowns = form.querySelectorAll('.cf-custom-dropdown[data-required="true"]');
        var missing = false;
        requiredDropdowns.forEach(function (dd) {
          var hiddenInput = dd.querySelector('input[type="hidden"]');
          if (!hiddenInput.value) {
            missing = true;
            dd.style.borderBottom = '2px solid #e53935';
          } else {
            dd.style.borderBottom = '';
          }
        });
        if (missing) {
          alert('Please fill in all required fields.');
          return;
        }
        var data = new FormData(form);
        var entries = {};
        data.forEach(function (val, key) { entries[key] = val; });
        console.log('Contact form submitted:', entries);
        var btn = form.querySelector('.cf-send');
        var originalText = btn.textContent;
        btn.textContent = 'SENT ✓';
        btn.style.background = '#2e7d32';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          closePopup();
          form.reset();
          dropdowns.forEach(function (dd) {
            var textEl = dd.querySelector('.cf-dd-text');
            var hiddenInput = dd.querySelector('input[type="hidden"]');
            var name = dd.getAttribute('data-name');
            if (name === 'salutation') {
              textEl.textContent = 'Ms.';
              hiddenInput.value = 'Ms.';
            } else if (name === 'industry') {
              textEl.textContent = 'Select an industry';
              hiddenInput.value = '';
            } else if (name === 'region') {
              textEl.textContent = 'Select your Location/Region';
              hiddenInput.value = '';
            }
          });
        }, 1800);
      });
    }
  }
})();