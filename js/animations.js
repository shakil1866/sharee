/**
 * AARANYA — GSAP & ScrollTrigger Animation Architecture
 * Modular, clean, performant, luxury cinematic motion sequences
 */

// Register GSAP Plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/* --------------------------------------------------------------------------
   01. FULLSCREEN VIDEO LOADER ANIMATION
   -------------------------------------------------------------------------- */
function initLoader(onCompleteCallback) {
    const loader = document.getElementById('loader');
    const video = document.getElementById('loaderVideo');

    if (!loader) {
        if (typeof onCompleteCallback === 'function') onCompleteCallback();
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
            if (typeof onCompleteCallback === 'function') onCompleteCallback();
        }, 300);
        return;
    }

    let isCompleted = false;

    function finishLoader() {
        if (isCompleted) return;
        isCompleted = true;

        // Smooth fade out of fullscreen loader overlay
        loader.classList.add('fade-out');

        // Trigger home entrance animations smoothly as fade begins
        if (typeof onCompleteCallback === 'function') {
            onCompleteCallback();
        }

        setTimeout(() => {
            loader.style.display = 'none';
        }, 900);
    }

    if (video) {
        // Ensure muted & playsinline attributes for seamless autoplay across all browsers
        video.muted = true;
        video.playsInline = true;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If autoplay is prevented by browser policy, fade smoothly after short fallback
                setTimeout(finishLoader, 1000);
            });
        }

        // When video finishes playing naturally
        video.addEventListener('ended', finishLoader, { once: true });

        // Smooth cross-fade right as video reaches the final 0.25s
        video.addEventListener('timeupdate', () => {
            if (video.duration && video.currentTime >= video.duration - 0.25) {
                finishLoader();
            }
        });

        // Fail-safe fallbacks (if error or stalled)
        video.addEventListener('error', finishLoader, { once: true });
        setTimeout(finishLoader, 6500); // 6.5s max safety fallback
    } else {
        setTimeout(finishLoader, 1000);
    }
}

/* --------------------------------------------------------------------------
   02. NAVBAR SCROLLTRIGGER
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 100) {
                navbar.classList.add('scrolled');
            } else if (self.scroll() <= 80) {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

/* --------------------------------------------------------------------------
   03. HERO IMAGE SEQUENCE & STAGE OVERLAYS SCROLL ANIMATION
   -------------------------------------------------------------------------- */
function initHeroAnimation() {
    const hero = document.getElementById('hero');
    const canvas = document.getElementById('heroCanvas');
    const progressFill = document.getElementById('heroProgressFill');
    const scrollIndicator = document.getElementById('heroScrollIndicator');

    const steps = [
        document.getElementById('heroStep1'),
        document.getElementById('heroStep2'),
        document.getElementById('heroStep3'),
        document.getElementById('heroStep4')
    ];

    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const TOTAL_FRAMES = 300;
    const FRAME_PAD = 3;

    // Frame storage & status
    const frames = new Array(TOTAL_FRAMES + 1);
    const loadedStatus = new Uint8Array(TOTAL_FRAMES + 1);
    let renderedFrame = -1;

    const getFrameSrc = (index) => {
        const num = String(index).padStart(FRAME_PAD, '0');
        return `ezgif-2e3a7b58a52652d6-jpg/ezgif-frame-${num}.jpg`;
    };

    // Canvas resize handling with HiDPI support
    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;

        canvas.width = Math.round(displayW * dpr);
        canvas.height = Math.round(displayH * dpr);

        if (renderedFrame > 0) {
            renderFrame(renderedFrame, true);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Find closest loaded frame
    function findClosestFrame(targetIndex) {
        if (loadedStatus[targetIndex] && frames[targetIndex]) {
            return frames[targetIndex];
        }
        for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
            const down = targetIndex - delta;
            if (down >= 1 && loadedStatus[down] && frames[down]) {
                return frames[down];
            }
            const up = targetIndex + delta;
            if (up <= TOTAL_FRAMES && loadedStatus[up] && frames[up]) {
                return frames[up];
            }
        }
        return frames[1] || null;
    }

    // Render frame to canvas with object-fit: cover math
    function renderFrame(frameIndex, force = false) {
        const targetIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIndex)));
        if (!force && targetIndex === renderedFrame) return;

        const img = findClosestFrame(targetIndex);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        // Luxury object-fit: cover
        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const ox = (cw - nw) / 2;
        const oy = (ch - nh) / 2;

        ctx.drawImage(img, 0, 0, iw, ih, ox, oy, nw, nh);
        renderedFrame = targetIndex;
    }

    // Progressive frame loader
    function loadSingleFrame(index, priority = false) {
        if (frames[index]) return;

        const img = new Image();
        if (priority) {
            img.fetchPriority = 'high';
        }
        img.onload = () => {
            loadedStatus[index] = 1;
            frames[index] = img;
            if (renderedFrame === -1 && index === 1) {
                renderFrame(1, true);
            }
        };
        img.src = getFrameSrc(index);
        frames[index] = img;
    }

    // 1. Immediately load frame 1 for instant display
    loadSingleFrame(1, true);

    // 2. Preload first 30 frames rapidly
    for (let i = 2; i <= 30; i++) {
        loadSingleFrame(i, true);
    }

    // 3. Progressively load remainder in smooth batches
    function loadRemainingFrames() {
        let currentChunk = 31;
        const chunkSize = 20;

        function nextChunk() {
            if (currentChunk > TOTAL_FRAMES) return;
            const end = Math.min(currentChunk + chunkSize, TOTAL_FRAMES);
            for (let i = currentChunk; i <= end; i++) {
                loadSingleFrame(i, false);
            }
            currentChunk = end + 1;
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(nextChunk);
            } else {
                setTimeout(nextChunk, 35);
            }
        }
        nextChunk();
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadRemainingFrames);
    } else {
        setTimeout(loadRemainingFrames, 120);
    }

    const sequenceState = { frame: 1 };

    // Build Master Pin Timeline exactly like initCinematicReveal
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=260%',
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
                const progress = self.progress;
                if (progressFill) progressFill.style.width = `${progress * 100}%`;

                // Calculate which step is active (Stage 1 -> Stage 2 -> Stage 3 -> Stage 4)
                let activeIndex = 0;
                if (progress < 0.25) activeIndex = 0;
                else if (progress < 0.55) activeIndex = 1;
                else if (progress < 0.82) activeIndex = 2;
                else activeIndex = 3;

                steps.forEach((step, idx) => {
                    if (step) {
                        step.classList.toggle('active', idx === activeIndex);
                    }
                });

                if (scrollIndicator) {
                    scrollIndicator.style.opacity = progress > 0.04 ? '0' : '1';
                }
            }
        }
    });

    // Animate image sequence smoothly through all 300 frames on scroll
    heroTl.to(sequenceState, {
        frame: TOTAL_FRAMES,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
            renderFrame(sequenceState.frame);
        }
    });
}

/* --------------------------------------------------------------------------
   03.8. SIX MOODS SECTION ANIMATION
   -------------------------------------------------------------------------- */
function initMoodsAnimation() {
    const moodsSection = document.getElementById('moods');
    if (!moodsSection) return;

    const kicker = moodsSection.querySelector('.moods-kicker');
    const title = moodsSection.querySelector('.moods-title');
    const script = moodsSection.querySelector('.moods-script');
    const desc = moodsSection.querySelector('.moods-desc');
    const cards = moodsSection.querySelectorAll('.mood-card');

    const headerTl = gsap.timeline({
        scrollTrigger: {
            trigger: moodsSection,
            start: 'top 80%'
        }
    });

    if (kicker) {
        headerTl.from(kicker, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

    if (title || script) {
        headerTl.from([title, script], {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, '-=0.4');
    }

    if (desc) {
        headerTl.from(desc, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.5');
    }

    if (cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 45,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: moodsSection.querySelector('.moods-grid') || moodsSection,
                start: 'top 82%'
            }
        });
    }
}

/* --------------------------------------------------------------------------
   04. PHILOSOPHY SECTION ANIMATION
   -------------------------------------------------------------------------- */
function initPhilosophyAnimation() {
    const philosophy = document.getElementById('philosophy');
    if (!philosophy) return;

    const img = philosophy.querySelector('.philosophy-image');
    const mask = philosophy.querySelector('.image-reveal-mask');
    const badge = philosophy.querySelector('.section-badge');
    const heading = philosophy.querySelector('.philosophy-heading');
    const hairline = philosophy.querySelector('.gold-hairline');
    const bodyText = philosophy.querySelectorAll('.philosophy-body p');
    const stats = philosophy.querySelector('.philosophy-stats');
    const action = philosophy.querySelector('.philosophy-action');

    // Image Mask Clip-Path Reveal
    if (mask) {
        gsap.fromTo(mask, 
            { clipPath: 'inset(100% 0% 0% 0%)' }, 
            {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.4,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: philosophy,
                    start: 'top 75%'
                }
            }
        );
    }

    // Parallax on image inside mask
    if (img) {
        gsap.to(img, {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
                trigger: philosophy,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // Text Elements Stagger
    const textTl = gsap.timeline({
        scrollTrigger: {
            trigger: philosophy.querySelector('.philosophy-right'),
            start: 'top 78%'
        }
    });

    textTl.from([badge, heading], {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out'
    });

    if (hairline) {
        textTl.from(hairline, {
            scaleX: 0,
            transformOrigin: 'left',
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.5');
    }

    textTl.from(bodyText, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
    }, '-=0.4');

    if (stats) {
        textTl.from(stats, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');
    }

    if (action) {
        textTl.from(action, {
            opacity: 0,
            y: 20,
            duration: 0.6
        }, '-=0.4');
    }
}

/* --------------------------------------------------------------------------
   04.5. DRIFT SIGNATURES SLIDER
   -------------------------------------------------------------------------- */
function initDriftSlider() {
    const track     = document.getElementById('driftTrack');
    const container = document.getElementById('driftTrackContainer');
    const prevBtn   = document.getElementById('driftPrev');
    const nextBtn   = document.getElementById('driftNext');
    const section   = document.getElementById('drift-signatures');

    if (!track || !container) return;

    const cards = Array.from(track.querySelectorAll('.drift-card'));
    if (!cards.length) return;

    const TOTAL          = cards.length;
    const TRANSITION_MS  = 550;  // keep in sync with .drift-track transition
    const AUTOPLAY_MS    = 1600; // fast auto-rotation
    const DRAG_THRESHOLD = 50;

    let index = TOTAL; // first real card, sitting after the leading clones
    let offsets = [];
    let autoplayTimer = null;
    let loopTimer = null;
    let resizeRaf = null;
    let inView = false;
    let startX = 0;
    let startIndex = 0;
    let isDragging = false;

    // Loop clones turn the track into [N-1 ... 0 | 0 ... N-1 | 0 ... N-1],
    // so it can travel forever in both directions with no visible edge.
    cards.slice().reverse().forEach(card => track.insertBefore(makeClone(card), track.firstChild));
    cards.forEach(card => track.appendChild(makeClone(card)));

    function makeClone(card) {
        const clone = card.cloneNode(true);
        clone.classList.add('drift-card--clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('onclick');
        clone.removeAttribute('data-cursor');
        return clone;
    }

    // Cards vary in width (featured card is wider), so offsets come from the DOM
    function measure() {
        const all = Array.from(track.children);
        if (!all.length) return;
        const origin = all[0].getBoundingClientRect().left;
        offsets = all.map(el => el.getBoundingClientRect().left - origin);
    }

    function paint(animate) {
        track.style.transition = animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none';
        track.style.transform = `translateX(-${offsets[index] || 0}px)`;
    }

    // Once the slide-in lands on a clone, jump silently to the identical real
    // card so the loop never shows an edge or a blank gap.
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
        if (!inView) return;
        autoplayTimer = setInterval(() => move(1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        move(-1);
        startAutoplay();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        move(1);
        startAutoplay();
    });

    // Pause autoplay on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
            measure();
            normalizeLoop();
            paint(false);
        });
    });

    // Drag to slide
    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startIndex = index;
        clearTimeout(loopTimer);
        track.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        track.style.transform = `translateX(-${(offsets[startIndex] || 0) + (startX - e.clientX)}px)`;
    });

    window.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > DRAG_THRESHOLD) {
            move(diff > 0 ? 1 : -1);
        } else {
            paint(true);
        }
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startIndex = index;
        isDragging = true;
        clearTimeout(loopTimer);
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].clientX;
        track.style.transform = `translateX(-${(offsets[startIndex] || 0) + diff}px)`;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > DRAG_THRESHOLD) {
            move(diff > 0 ? 1 : -1);
        } else {
            paint(true);
        }
    });

    // Only rotate while the section is on screen
    if (typeof IntersectionObserver !== 'undefined' && section) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                inView = entry.isIntersecting;
                if (inView) {
                    measure();
                    normalizeLoop();
                    paint(false);
                    startAutoplay();
                } else {
                    stopAutoplay();
                }
            });
        }, { threshold: 0.15 });
        observer.observe(section);
    } else {
        inView = true;
    }

    measure();
    paint(false);
    startAutoplay();

    // Entrance animation
    if (section && typeof gsap !== 'undefined') {
        gsap.from(section.querySelector('.drift-header'), {
            opacity: 0,
            y: 35,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%' }
        });

        gsap.from(cards, {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: track, start: 'top 85%' }
        });
    }
}

/* --------------------------------------------------------------------------
   07. HORIZONTAL RUNWAY SCROLL (Desktop Pinned Runway)
   -------------------------------------------------------------------------- */
function initHorizontalCollection() {
    const showcaseSection = document.getElementById('horizontal-showcase');
    const track = document.getElementById('horizontalTrack');

    if (!showcaseSection || !track) return;

    // Only apply pin horizontal scroll on desktop (>= 992px)
    ScrollTrigger.matchMedia({
        '(min-width: 992px)': function() {
            const totalScrollWidth = track.scrollWidth - window.innerWidth + 80;

            gsap.to(track, {
                x: -totalScrollWidth,
                ease: 'none',
                scrollTrigger: {
                    trigger: showcaseSection,
                    start: 'top top',
                    end: () => `+=${totalScrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        },
        '(max-width: 991px)': function() {
            // Clean reset for mobile natural scrolling
            gsap.set(track, { clearProps: 'all' });
        }
    });
}

/* --------------------------------------------------------------------------
   08. FEATURED SAREE ANIMATION
   -------------------------------------------------------------------------- */
function initFeaturedSaree() {
    const section = document.getElementById('featured');
    if (!section) return;

    const imgFrame = section.querySelector('.featured-image-frame');
    const title = section.querySelector('.featured-title');
    const specs = section.querySelector('.featured-spec-grid');

    if (imgFrame) {
        gsap.from(imgFrame, {
            opacity: 0,
            y: 60,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%'
            }
        });
    }

    if (title) {
        gsap.from(title, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%'
            }
        });
    }

    if (specs) {
        gsap.from(specs.children, {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: specs,
                start: 'top 85%'
            }
        });
    }
}

/* --------------------------------------------------------------------------
   09. CRAFT / WEAVING SECTION ANIMATIONS
   -------------------------------------------------------------------------- */
function initCraftAnimation() {
    const rows = document.querySelectorAll('.craft-step-row');
    if (!rows.length) return;

    rows.forEach((row) => {
        const visual = row.querySelector('.craft-visual');
        const content = row.querySelector('.craft-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: 'top 80%'
            }
        });

        if (visual) {
            tl.from(visual, {
                opacity: 0,
                x: row.classList.contains('reverse') ? 50 : -50,
                duration: 1,
                ease: 'power3.out'
            }, 0);
        }

        if (content) {
            tl.from(content, {
                opacity: 0,
                y: 40,
                duration: 0.9,
                ease: 'power2.out'
            }, 0.15);
        }
    });
}

/* --------------------------------------------------------------------------
   10. ARTISAN PARALLAX ANIMATION
   -------------------------------------------------------------------------- */
function initArtisanParallax() {
    const section = document.getElementById('artisan');
    if (!section) return;

    const img = section.querySelector('.artisan-img');
    const textCol = section.querySelector('.artisan-text-col');

    if (img) {
        gsap.to(img, {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    if (textCol) {
        gsap.from(textCol.children, {
            opacity: 0,
            y: 35,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%'
            }
        });
    }
}

/* --------------------------------------------------------------------------
   12. BRAND QUOTE ANIMATION
   -------------------------------------------------------------------------- */
function initBrandQuote() {
    const section = document.getElementById('quote');
    if (!section) return;

    const quote = section.querySelector('.editorial-main-quote');
    const sig = section.querySelector('.quote-signature');

    if (quote) {
        gsap.from(quote, {
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%'
            }
        });
    }

    if (sig) {
        gsap.from(sig, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 75%'
            }
        });
    }
}

/* --------------------------------------------------------------------------
   16. FINAL CTA ANIMATION
   -------------------------------------------------------------------------- */
function initFinalCTA() {
    const section = document.getElementById('contact');
    if (!section) return;

    const bgImg = section.querySelector('.final-cta-bg-img');
    const lines = section.querySelectorAll('.final-line');
    const desc = section.querySelector('.final-cta-desc');
    const form = section.querySelector('.final-form-box');

    if (bgImg) {
        gsap.to(bgImg, {
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%'
        }
    });

    if (lines.length) {
        tl.from(lines, {
            opacity: 0,
            y: 50,
            stagger: 0.18,
            duration: 1.1,
            ease: 'power3.out'
        });
    }

    if (desc) {
        tl.from(desc, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.6');
    }

    if (form) {
        tl.from(form, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5');
    }
}
