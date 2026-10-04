/**
 * AARANYA — Main Orchestrator
 * Execution sequence, initialization lifecycle & global event bindings
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c AARANYA %c The Art of Draping ', 'background: #211B17; color: #F8F4EC; padding: 4px 8px; font-family: serif; font-size: 14px;', 'background: #641E2A; color: #B99A5B; padding: 4px 8px; font-size: 14px;');

    // 1. Initialize Lenis Smooth Scrolling
    if (typeof initSmoothScroll === 'function') {
        initSmoothScroll();
    }

    // 2. Initialize Luxury Custom Cursor (Desktop)
    if (typeof initCustomCursor === 'function') {
        initCustomCursor();
    }

    // 3. Initialize Interactive Components
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initDrapingInteractive === 'function') initDrapingInteractive();
    if (typeof initFeaturedSwatches === 'function') initFeaturedSwatches();
    if (typeof initDiscoverFloatingPreview === 'function') initDiscoverFloatingPreview();
    if (typeof initTestimonialsSlider === 'function') initTestimonialsSlider();
    if (typeof initMoodsCarousel === 'function') initMoodsCarousel();
    if (typeof initJournalCarousel === 'function') initJournalCarousel();

    // 4. Initialize Loader and trigger Motion Sequences
    if (typeof initLoader === 'function') {
        initLoader(() => {
            // Trigger all GSAP sequences once loading curtain clears
            if (typeof initNavbar === 'function') initNavbar();
            if (typeof initHeroAnimation === 'function') initHeroAnimation();
            if (typeof initMoodsAnimation === 'function') initMoodsAnimation();
            if (typeof initPhilosophyAnimation === 'function') initPhilosophyAnimation();
            if (typeof initDriftSlider === 'function') initDriftSlider();
            if (typeof initHorizontalCollection === 'function') initHorizontalCollection();
            if (typeof initFeaturedSaree === 'function') initFeaturedSaree();
            if (typeof initCraftAnimation === 'function') initCraftAnimation();
            if (typeof initArtisanParallax === 'function') initArtisanParallax();
            if (typeof initBrandQuote === 'function') initBrandQuote();
            if (typeof initFinalCTA === 'function') initFinalCTA();

            // Refresh ScrollTrigger calculations
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 100);
            }
        });
    }
});

// --- Journal Carousel Logic (Seamless Infinite Loop) ---
function initJournalCarousel() {
    const carousel = document.getElementById('journalCarousel');
    const prevBtn = document.getElementById('journalPrev');
    const nextBtn = document.getElementById('journalNext');
    if (!carousel || !prevBtn || !nextBtn) return;

    const slides = Array.from(carousel.querySelectorAll('.slide'));
    if (!slides.length) return;

    const TOTAL = slides.length;
    const TRANSITION_MS = 600;
    const AUTOPLAY_DELAY = 3000; // 3 seconds per slide
    const DRAG_THRESHOLD = 50;

    let index = TOTAL; // first real slide, sitting after the leading clones
    let step = 0;
    let autoplayTimer = null;
    let loopTimer = null;
    let resizeRaf = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = null;

    // Track layout: [N-1 ... 0 | 0 ... N-1 | 0 ... N-1]
    // One cloned set on each side lets the track travel forever in both directions.
    slides.slice().reverse().forEach(slide => carousel.insertBefore(makeClone(slide), carousel.firstChild));
    slides.forEach(slide => carousel.appendChild(makeClone(slide)));

    function makeClone(slide) {
        const clone = slide.cloneNode(true);
        clone.classList.add('slide-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('tabindex', '-1');
        clone.removeAttribute('href');
        clone.removeAttribute('data-cursor');
        return clone;
    }

    function measure() {
        const styles = window.getComputedStyle(carousel);
        const rawGap = styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : styles.gap;
        const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const gap = rawGap && rawGap.includes('rem') ? parseFloat(rawGap) * rootFont : parseFloat(rawGap) || 0;
        step = slides[0].offsetWidth + gap;
    }

    function paint(animate) {
        carousel.style.transition = animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none';
        carousel.style.transform = `translateX(${-index * step}px)`;
    }

    // After the slide-in animation lands on a clone, jump (without animation)
    // to the identical real slide so the loop never shows an edge.
    function normalizeLoop() {
        if (index >= TOTAL * 2) {
            index -= TOTAL;
            paint(false);
        } else if (index < TOTAL) {
            index += TOTAL;
            paint(false);
        }
    }

    function move(delta, animate = true) {
        index += delta;
        paint(animate);
        clearTimeout(loopTimer);
        loopTimer = setTimeout(normalizeLoop, TRANSITION_MS + 40);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => move(1), AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    nextBtn.addEventListener('click', () => {
        move(1);
        startAutoplay(); // Reset timer on manual action
    });

    prevBtn.addEventListener('click', () => {
        move(-1);
        startAutoplay(); // Reset timer on manual action
    });

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            measure();
            normalizeLoop();
            paint(false);
        });
    });

    // Touch/Drag Implementation
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart, {passive: true});
    carousel.addEventListener('mouseup', dragEnd);
    carousel.addEventListener('mouseleave', dragEnd);
    carousel.addEventListener('touchend', dragEnd);
    carousel.addEventListener('mousemove', dragAction);
    carousel.addEventListener('touchmove', dragAction, {passive: true});

    function dragStart(e) {
        clearTimeout(loopTimer);
        isDragging = true;
        startPos = getPositionX(e);
        const transformMatrix = window.getComputedStyle(carousel).transform;
        prevTranslate = transformMatrix !== 'none' ? parseFloat(transformMatrix.split(',')[4]) : 0;
        currentTranslate = prevTranslate;
        carousel.style.transition = 'none';
        animationID = requestAnimationFrame(animation);
    }

    function dragAction(e) {
        if (!isDragging) return;
        currentTranslate = prevTranslate + (getPositionX(e) - startPos);
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;
        if (movedBy <= -DRAG_THRESHOLD) {
            move(1);
        } else if (movedBy >= DRAG_THRESHOLD) {
            move(-1);
        } else {
            paint(true);
        }
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        if (isDragging) {
            carousel.style.transform = `translateX(${currentTranslate}px)`;
            animationID = requestAnimationFrame(animation);
        }
    }

    // Initial setup with a small delay to allow CSS layout to settle
    setTimeout(() => {
        measure();
        paint(false);
        startAutoplay();
    }, 100);
}

// --- Moods Rail Auto-Scroll (horizontal snap rail on mobile) ---
function initMoodsCarousel() {
    const grid = document.querySelector('.moods-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.mood-card'));
    if (cards.length < 2) return;

    // Honour reduced-motion users: they keep manual swipe only
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const AUTOPLAY_MS = 1000;
    const IDLE_RESUME_MS = 2500;

    let step = 0;
    let timer = null;
    let resumeTimer = null;
    let inView = false;
    let userActive = false;

    function isRail() {
        return grid.scrollWidth - grid.clientWidth > 2;
    }

    function measure() {
        const styles = window.getComputedStyle(grid);
        const rawGap = styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : styles.gap;
        const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const gap = rawGap && rawGap.includes('rem') ? parseFloat(rawGap) * rootFont : parseFloat(rawGap) || 0;
        step = cards[0].offsetWidth + gap;
    }

    // One card per tick; the last card wraps back to the first
    function tick() {
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (grid.scrollLeft >= maxScroll - 2) {
            grid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            grid.scrollBy({ left: step, behavior: 'smooth' });
        }
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function start() {
        stop();
        if (!inView || userActive || !isRail()) return;
        timer = setInterval(tick, AUTOPLAY_MS);
    }

    // Hand control back to the user while they swipe, then resume
    ['pointerdown', 'touchstart', 'wheel'].forEach(evt => {
        grid.addEventListener(evt, () => {
            userActive = true;
            stop();
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => {
                userActive = false;
                start();
            }, IDLE_RESUME_MS);
        }, { passive: true });
    });

    window.addEventListener('resize', () => {
        measure();
        start();
    });

    // Only tick while the rail is on screen
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                inView = entry.isIntersecting;
                if (inView) {
                    measure();
                    start();
                } else {
                    stop();
                }
            });
        }, { threshold: 0.2 });
        observer.observe(grid);
    } else {
        inView = true;
    }

    // Initial setup once layout has settled
    setTimeout(() => {
        measure();
        start();
    }, 300);
}
