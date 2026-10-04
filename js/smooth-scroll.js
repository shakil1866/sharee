/**
 * AARANYA — Smooth Scroll Engine
 * Seamless Lenis + GSAP ScrollTrigger Ticker Synchronization
 */

let lenisInstance = null;

function initSmoothScroll() {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || typeof Lenis === 'undefined') {
        console.log('[Aaranya] Standard scrolling active (reduced motion or fallback)');
        return;
    }

    try {
        lenisInstance = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.9,
            smoothTouch: false, // Keep native feel on mobile touch devices
            touchMultiplier: 1.5,
            infinite: false,
        });
        window.lenisInstance = lenisInstance;

        // Synchronize Lenis with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            lenisInstance.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenisInstance.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        }

        // Smooth scroll for in-page anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    if (lenisInstance) {
                        lenisInstance.scrollTo(targetElement, {
                            offset: -30,
                            duration: 1.4,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }

                    // If mobile menu was open, close it
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        document.body.style.overflow = '';
                    }
                }
            });
        });

        console.log('[Aaranya] Lenis smooth scrolling initialized successfully');
    } catch (err) {
        console.warn('[Aaranya] Lenis initialization notice:', err);
    }
}

// Window resize ScrollTrigger refresh helper
window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});
