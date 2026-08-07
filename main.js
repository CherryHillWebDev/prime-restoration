(function(){
  "use strict";

  /* ---------- current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  var onScroll = function(){
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- desktop Services dropdown ---------- */
  var ddWrap = document.getElementById('services-dd');
  var ddBtn = document.getElementById('services-dd-btn');
  if (ddWrap && ddBtn){
    var closeDropdown = function(){
      ddWrap.setAttribute('data-open', 'false');
      ddBtn.setAttribute('aria-expanded', 'false');
    };
    var openDropdown = function(){
      ddWrap.setAttribute('data-open', 'true');
      ddBtn.setAttribute('aria-expanded', 'true');
    };

    ddBtn.addEventListener('mouseenter', openDropdown);
    ddWrap.addEventListener('mouseenter', openDropdown);
    ddWrap.addEventListener('mouseleave', closeDropdown);

    ddBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      openDropdown();
    });

    document.addEventListener('click', function(e){
      if (!ddWrap.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') { closeDropdown(); }
    });
  }

  /* ---------- mobile hamburger menu ---------- */
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileNav = document.getElementById('mobile-nav');
  var closeMobileNav = function(){
    mobileNav.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.innerHTML = '<svg class="icon"><use href="#i-menu"/></svg>';
    document.body.style.overflow = '';
  };
  var openMobileNav = function(){
    mobileNav.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.innerHTML = '<svg class="icon"><use href="#i-close"/></svg>';
    document.body.style.overflow = 'hidden';
  };
  if (hamburgerBtn && mobileNav){
    hamburgerBtn.addEventListener('click', function(){
      var isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) closeMobileNav(); else openMobileNav();
    });
    Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function(a){
      a.addEventListener('click', closeMobileNav);
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  /* ---------- mobile Services accordion ---------- */
  var mSvcToggle = document.getElementById('mobile-services-toggle');
  var mSubmenu = document.getElementById('mobile-submenu');
  if (mSvcToggle && mSubmenu){
    mSvcToggle.addEventListener('click', function(){
      var isOpen = mSubmenu.classList.toggle('is-open');
      mSvcToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- FAQ accordion (single-open) ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
  faqItems.forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    var setOpen = function(open){
      item.setAttribute('data-open', open ? 'true' : 'false');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? (a.scrollHeight + 'px') : '0px';
    };
    // initialize
    setOpen(item.getAttribute('data-open') === 'true');
    q.addEventListener('click', function(){
      var willOpen = item.getAttribute('data-open') !== 'true';
      faqItems.forEach(function(other){
        if (other !== item) {
          var otherA = other.querySelector('.faq-a');
          var otherQ = other.querySelector('.faq-q');
          other.setAttribute('data-open', 'false');
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.style.maxHeight = '0px';
        }
      });
      setOpen(willOpen);
    });
  });
  // keep open FAQ height correct on resize
  window.addEventListener('resize', function(){
    faqItems.forEach(function(item){
      if (item.getAttribute('data-open') === 'true'){
        var a = item.querySelector('.faq-a');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- emergency picker: smooth scroll + highlight target card ---------- */
  var pickerTiles = document.querySelectorAll('.picker-tile[data-target]');
  Array.prototype.forEach.call(pickerTiles, function(tile){
    tile.addEventListener('click', function(e){
      var id = tile.getAttribute('data-target');
      var target = document.getElementById(id);
      if (!target) return;
      // let native anchor scrolling happen (html has scroll-behavior:smooth),
      // then flash the target card so it's obvious where the user landed.
      window.setTimeout(function(){
        target.classList.add('is-flash');
        target.focus({ preventScroll: true });
        window.setTimeout(function(){ target.classList.remove('is-flash'); }, 1600);
      }, 350);
    });
  });

  /* ---------- scroll-reveal (respects prefers-reduced-motion) ---------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window){
    var revealTargets = document.querySelectorAll('.svc-card, .stat-card, .review-card, .rebuild-item, .picker-tile, .includes-item, .cause-card, .process-step, .explainer-card, .related-card, .value-card');
    revealTargets.forEach(function(el){
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function(el){ io.observe(el); });
  }

})();