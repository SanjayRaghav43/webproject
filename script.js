/* ═══════════════════════════════════════
   NAVBAR — Hide on scroll down, show on scroll up
   ═══════════════════════════════════════ */
var navbar = document.querySelector('.navbar');
var lastScrollY = window.scrollY;
var scrollThreshold = 10; // minimum scroll distance to trigger hide/show
var navbarHeight = 80;
var isHovering = false;

// Don't hide navbar while user is hovering over it (e.g. using mega menu)
navbar.addEventListener('mouseenter', function() { isHovering = true; });
navbar.addEventListener('mouseleave', function() { isHovering = false; });

window.addEventListener('scroll', function() {
  var currentScrollY = window.scrollY;
  var scrollDiff = currentScrollY - lastScrollY;

  // If at the very top, always show navbar without shadow
  if (currentScrollY <= 0) {
    navbar.classList.remove('nav-hidden');
    navbar.classList.remove('nav-scrolled');
    lastScrollY = currentScrollY;
    return;
  }

  // Add scrolled class for shadow when not at top
  navbar.classList.add('nav-scrolled');

  // Don't hide if user is hovering over navbar (using dropdowns)
  if (isHovering) {
    lastScrollY = currentScrollY;
    return;
  }

 // Scrolling DOWN — hide navbar
  if (scrollDiff > scrollThreshold) {
    navbar.classList.add('nav-hidden');
  }
  // Scrolling UP — show navbar
  else if (scrollDiff < -scrollThreshold) {
    navbar.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
}, { passive: true });


/* ═══════════════════════════════════════
   NAVBAR — Search toggle
   ═══════════════════════════════════════ */
var searchBtn = document.getElementById('searchBtn'),
    searchSlide = document.getElementById('searchSlide'),
    searchInput = document.getElementById('searchInput'),
    iconMag = document.getElementById('iconMag'),
    iconX = document.getElementById('iconX'),
    portal = document.getElementById('portal'),
    searchOpen = false;

var langWrap = document.getElementById('langWrap'),
    langBtn = document.getElementById('langBtn'),
    langVal = document.getElementById('langVal');

searchBtn.onclick = function(e) {
  e.stopPropagation();
  searchOpen = !searchOpen;
  if (searchOpen) {
    searchSlide.classList.add('open');
    langWrap.classList.add('hide');
    portal.classList.add('hide');
    iconMag.style.display = 'none';
    iconX.style.display = 'block';
    setTimeout(function() { searchInput.focus(); }, 350);
  } else {
    closeSearch();
  }
};

function closeSearch() {
  searchOpen = false;
  searchSlide.classList.remove('open');
  langWrap.classList.remove('hide');
  portal.classList.remove('hide');
  iconMag.style.display = 'block';
  iconX.style.display = 'none';
  searchInput.value = '';
}

document.addEventListener('click', function(e) {
  if (searchOpen && !searchBtn.contains(e.target) && !searchSlide.contains(e.target)) closeSearch();
});

searchInput.onkeydown = function(e) {
  if (e.key === 'Escape') closeSearch();
};


/* ═══════════════════════════════════════
   NAVBAR — Language dropdown
   ═══════════════════════════════════════ */
langBtn.onclick = function(e) {
  e.stopPropagation();
  langWrap.classList.toggle('open');
};

langWrap.querySelectorAll('.lang-list a').forEach(function(a) {
  a.onclick = function(e) {
    e.preventDefault();
    langWrap.querySelectorAll('a').forEach(function(x) { x.classList.remove('active'); });
    a.classList.add('active');
    langVal.textContent = a.dataset.l;
    langWrap.classList.remove('open');
  };
});

document.addEventListener('click', function() {
  langWrap.classList.remove('open');
});

document.getElementById('navLinks').querySelectorAll('li').forEach(function(li) {
  li.addEventListener('mouseenter', function() {
    langWrap.classList.remove('open');
    if (searchOpen) closeSearch();
  });
});


/* ═══════════════════════════════════════
   SLIDER / CAROUSEL (infinite loop)
   ═══════════════════════════════════════ */
var belt = document.getElementById('belt'),
    slides = [].slice.call(belt.children),
    total = slides.length,
    pos = total;

function getStep() {
  var w = window.innerWidth;
  if (w <= 768) return 100;       // 1 card on mobile
  if (w <= 1024) return 100 / 2;  // 2 cards on tablet
  return 100 / 3;                 // 3 cards on desktop
}

var step = getStep();

window.addEventListener('resize', function() { step = getStep(); go(false); });

// Clone slides for infinite loop

slides.forEach(function(s) { belt.appendChild(s.cloneNode(true)); });
slides.forEach(function(s) { belt.insertBefore(s.cloneNode(true), belt.firstChild); });

function go(animate) {
  belt.style.transition = animate ? 'transform .5s cubic-bezier(.4,0,.2,1)' : 'none';
  belt.style.transform = 'translateX(-' + (pos * step) + '%)';
}
go(false);

/* Build dots */
var dotsWrap = document.getElementById('sliderDots');
for (var i = 0; i < total; i++) {
  var dot = document.createElement('button');
  dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  (function(idx) {
    dot.onclick = function() { pos = total + idx; go(true); updateDots(); };
  })(i);
  dotsWrap.appendChild(dot);
}

belt.addEventListener('transitionend', function() {
  if (pos >= total * 2) { pos -= total; go(false); }
  if (pos < total) { pos += total; go(false); }
});

document.getElementById('nextBtn').onclick = function() { pos++; go(true); updateDots(); };
document.getElementById('prevBtn').onclick = function() { pos--; go(true); updateDots(); };

/* ── DOTS ── */
function updateDots() {
  var dots = document.querySelectorAll('.slider-dot');
  var current = ((pos - total) % total + total) % total;
  dots.forEach(function(d, i) {
    d.classList.toggle('active', i === current);
  });
}

/* Touch swipe for mobile */
var touchStartX = 0, touchEndX = 0;
belt.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
belt.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  var diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) { pos++; go(true); updateDots(); }
    else { pos--; go(true); updateDots(); }
  }
}, { passive: true });


/* ═══════════════════════════════════════
   SOLUTIONS — Expand / Collapse (+)
   ═══════════════════════════════════════ */
var solGrid = document.getElementById('solutionsGrid');
var solToggle = document.getElementById('solToggle');
var solExpanded = false;

solToggle.onclick = function() {
  solExpanded = !solExpanded;

  if (solExpanded) {
    solGrid.classList.add('expanded');
    solToggle.classList.add('rotated');
  } else {
    solGrid.classList.remove('expanded');
    solToggle.classList.remove('rotated');
  }
};


/* ═══════════════════════════════════════
   VIDEO — Click sidebar to switch video
   ═══════════════════════════════════════ */
var videoList = document.getElementById('videoList');
var mainVideo = document.getElementById('mainVideo');
var videoItems = videoList.querySelectorAll('.video-item');

videoItems.forEach(function(item) {
  item.onclick = function() {

    // Remove active from all items
    videoItems.forEach(function(v) { v.classList.remove('active'); });

    // Set this one as active
    item.classList.add('active');

    // Change the iframe source
    mainVideo.src = item.dataset.src;

    // Update "Now Playing" badge
    videoItems.forEach(function(v) {
      var thumb = v.querySelector('.video-thumb');
      thumb.classList.remove('now-playing');

      var badge = thumb.querySelector('.np-badge');
      if (badge) badge.remove();

      var img = thumb.querySelector('img');
      if (img) img.style.display = 'block';
      var play = thumb.querySelector('.play-icon');
      if (play) play.style.display = 'flex';
    });

    // Add "Now Playing" to clicked item
    var clickedThumb = item.querySelector('.video-thumb');
    clickedThumb.classList.add('now-playing');

    var img = clickedThumb.querySelector('img');
    if (img) img.style.display = 'none';
    var play = clickedThumb.querySelector('.play-icon');
    if (play) play.style.display = 'none';

    var badge = document.createElement('span');
    badge.className = 'np-badge';
    badge.innerHTML = 'Now<br>Playing';
    clickedThumb.appendChild(badge);
  };
});


/*  BACK TO TOP */
document.getElementById('backToTop').onclick = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};






/* Custom scrollbars on EVERY divider line (all sections except the last) — Bühler style */
/* Custom scrollbars on every section (including last) — Bühler style */
document.querySelectorAll('.mega .section').forEach(function(sec) {
  var megaInner = sec.parentElement;

  var thumb = document.createElement('div');
  thumb.className = 'custom-scroll-thumb';
  megaInner.appendChild(thumb);

  function updateThumb() {
    var scrollTop = sec.scrollTop;
    var scrollHeight = sec.scrollHeight;
    var clientHeight = sec.clientHeight;

    if (scrollHeight <= clientHeight) {
      thumb.style.display = 'none';
      return;
    }
    thumb.style.display = 'block';

    var secRect = sec.getBoundingClientRect();
    var megaRect = megaInner.getBoundingClientRect();

    // Position thumb — slight gap for the last section
    var allSections = megaInner.querySelectorAll('.section');
    var isLastSection = (sec === allSections[allSections.length - 1]);
    var gapOffset = isLastSection ? 15 : 5;
    var leftOffset = secRect.right - megaRect.left + gapOffset;

// Long thumb — 88% of visible section height
    var thumbHeight = clientHeight * 0.88;
    var maxScroll = scrollHeight - clientHeight;
    var thumbOffset = maxScroll > 0 ? (scrollTop / maxScroll) * (clientHeight - thumbHeight) : 0;
    var topOffset = secRect.top - megaRect.top + thumbOffset;

    thumb.style.left = leftOffset + 'px';
    thumb.style.top = topOffset + 'px';
    thumb.style.height = thumbHeight + 'px';
  }

  sec.addEventListener('scroll', updateThumb, { passive: true });

  // Update when dropdown opens
  var parentLi = megaInner.closest('li');
  if (parentLi) {
    parentLi.addEventListener('mouseenter', function() {
      setTimeout(updateThumb, 50);
    });
  }
});

window.addEventListener(
  "wheel",
  function (e) {
    var mobileOverlay = document.getElementById('mobileOverlay');
    if (mobileOverlay && mobileOverlay.classList.contains('open')) return;
    if (window.scrollY === 0 && e.deltaY < 0) {
      e.preventDefault();
    }
  },
  { passive: false }
);


