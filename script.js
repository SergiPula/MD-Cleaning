document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Navbar shadow on scroll ---------- */
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');
    const scrollProgress = document.getElementById('scrollProgress');
    function onScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (backToTop) {
            if (window.scrollY > 500) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        }
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scrollspy: highlight active nav link ---------- */
    const navLinks = Array.from(document.querySelectorAll('.navbar nav ul > li > a[href^="#"]'));
    const spySections = navLinks
        .map(function (link) { return document.querySelector(link.getAttribute('href')); })
        .filter(Boolean);
    if ('IntersectionObserver' in window && spySections.length) {
        const spyIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === id);
                    });
                }
            });
        }, { threshold: 0, rootMargin: '-45% 0px -50% 0px' });
        spySections.forEach(function (section) { spyIo.observe(section); });
    }

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Mobile hamburger menu ---------- */
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.navbar nav');
    const overlay = document.querySelector('.nav-overlay');

    function closeMenu() {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    function toggleMenu() {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        overlay.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    if (hamburger && nav && overlay) {
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Animated stat counters ---------- */
    const counters = document.querySelectorAll('[data-count-to]');
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count-to'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && counters.length) {
        const counterIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { counterIo.observe(el); });
    }

    /* ---------- Gallery lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(item) {
        const img = item.querySelector('img');
        const captionEl = item.querySelector('.gallery-overlay span');
        if (!img || !lightbox) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = captionEl ? captionEl.textContent : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }
    document.querySelectorAll('.gallery-item').forEach(function (item) {
        item.addEventListener('click', function () { openLightbox(item); });
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(item);
            }
        });
    });
    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    }

    /* ---------- Live estimate request preview ---------- */
    const propertyTypeEl = document.getElementById('propertyType');
    const locationEl = document.getElementById('location');
    const sqmEl = document.getElementById('sqm');
    const prevType = document.getElementById('prevType');
    const prevLocation = document.getElementById('prevLocation');
    const prevSqm = document.getElementById('prevSqm');
    function updateEstimatePreview() {
        if (prevType && propertyTypeEl) prevType.textContent = propertyTypeEl.value || '—';
        if (prevLocation && locationEl) prevLocation.textContent = locationEl.value.trim() || '—';
        if (prevSqm && sqmEl) prevSqm.textContent = sqmEl.value ? sqmEl.value + ' τ.μ.' : '—';
    }
    [propertyTypeEl, locationEl, sqmEl].forEach(function (el) {
        if (el) el.addEventListener('input', updateEstimatePreview);
    });
    updateEstimatePreview();

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const item = btn.closest('.faq-item');
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.toggle('open', !wasOpen);
            btn.setAttribute('aria-expanded', String(!wasOpen));
        });
    });

});

/* ============ FUTURE EFFECTS ============ */
document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Scroll rail: glowing line that loads as you scroll */
    var railFill = document.querySelector('.rail i');
    var railDot = document.querySelector('.rail b');
    function updateRail() {
        if (!railFill) return;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var h = max > 0 ? (window.scrollY / max) * window.innerHeight : 0;
        railFill.style.height = h + 'px';
        railDot.style.top = Math.max(h - 5, 0) + 'px';
    }
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();

    /* Glow cards: spotlight follows the pointer, border line draws itself */
    var fxEls = document.querySelectorAll('.service-card-new, .gallery-item, .about-img-box, .pledge-box, .p-card, .faq-item, .estimator-form');
    fxEls.forEach(function (el) {
        el.classList.add('fx');
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });
    if ('IntersectionObserver' in window) {
        var drawIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    var d = Array.prototype.indexOf.call(en.target.parentNode.children, en.target) * 120;
                    setTimeout(function () { en.target.classList.add('drawn'); }, d);
                    drawIo.unobserve(en.target);
                }
            });
        }, { threshold: 0.2 });
        fxEls.forEach(function (el) { drawIo.observe(el); });
    } else {
        fxEls.forEach(function (el) { el.classList.add('drawn'); });
    }

    /* Cursor glow (desktop only) */
    var cg = document.querySelector('.cursor-glow');
    if (cg && window.matchMedia('(hover: hover)').matches && !reduce) {
        window.addEventListener('pointermove', function (e) {
            cg.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
        }, { passive: true });
    }

    /* 3D tilt on hero logo */
    var tilt = document.querySelector('.logo-glow-wrapper');
    var heroEl = document.querySelector('.hero');
    if (tilt && heroEl && !reduce) {
        heroEl.addEventListener('pointermove', function (e) {
            var r = tilt.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            tilt.style.transform = 'rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg)';
        });
        heroEl.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
    }

    /* Magnetic buttons */
    if (!reduce) document.querySelectorAll('.btn-gold, .btn-outline').forEach(function (b) {
        b.addEventListener('pointermove', function (e) {
            var r = b.getBoundingClientRect();
            b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2) + 'px)';
        });
        b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
});
