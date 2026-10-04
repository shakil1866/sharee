/**
 * AARANYA — Interactive Features & UI Controllers
 * Modals, Swatches, Draping Steps, Testimonials, Floating Previews, Mobile Drawer
 */

// Saree Dossier Data for Quick View Modal
const sareeDossierData = {
    banarasi: {
        title: 'THE SACRED BANARASI KATAN',
        edition: 'EDITION NO. 01 &bull; VARANASI ATELIER',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
        description: 'Handwoven in the ancient river city of Varanasi on traditional pit-looms. Crafted from three-ply pure mulberry silk and woven with raised kadwa flora using 24K electroplated gold zari wires.',
        specs: [
            { key: 'Silk Composition', val: '100% Katan Mulberry' },
            { key: 'Zari Origin', val: 'Real Silver Base Gold-Plated' },
            { key: 'Weave Duration', val: '140 Artisan Hours' },
            { key: 'Provenance', val: 'Varanasi Master Guild' }
        ],
        price: 'USD $1,850'
    },
    kanjeevaram: {
        title: 'IMPERIAL KANJEEVARAM SILK',
        edition: 'EDITION NO. 02 &bull; KANCHIPURAM ATELIER',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1600&auto=format&fit=crop',
        description: 'Known for its heavy structure and lustrous sheen, this piece features authentic Korvai interlocking techniques joining emerald body and contrast ruby borders with temple gopuram motifs.',
        specs: [
            { key: 'Silk Weight', val: 'Three-Ply High Twist Silk' },
            { key: 'Border Type', val: 'Interlocking Double Korvai' },
            { key: 'Weave Duration', val: '110 Artisan Hours' },
            { key: 'Provenance', val: 'Kanchipuram Heritage Guild' }
        ],
        price: 'USD $2,100'
    },
    organza: {
        title: 'TISSUE SILK ORGANZA',
        edition: 'EDITION NO. 03 &bull; JAIPUR & VARANASI',
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600&auto=format&fit=crop',
        description: 'Translucent and whisper-light. Woven with gossamer silk warp and silver tissue weft, finished with delicate hand-painted Chanderi florals and scalloped gota patti embroidery.',
        specs: [
            { key: 'Fabric Hand', val: 'Ultra-Crisp Gossamer Sheer' },
            { key: 'Embroidery', val: 'Hand-Cut Marodi & Gota Patti' },
            { key: 'Weave Duration', val: '75 Artisan Hours' },
            { key: 'Provenance', val: 'Jaipur Atelier' }
        ],
        price: 'USD $1,420'
    },
    linen: {
        title: 'MONSOON ORGANIC LINEN',
        edition: 'EDITION NO. 04 &bull; BENGAL ATELIER',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop',
        description: 'Spun from 100-count certified French organic flax. Woven using the legendary Bengali Jamdani discontinuous weft technique without any pre-drawn stencils.',
        specs: [
            { key: 'Yarn Count', val: '100s Organic Fine Flax' },
            { key: 'Inlay Technique', val: 'Direct Freehand Jamdani' },
            { key: 'Weave Duration', val: '95 Artisan Hours' },
            { key: 'Provenance', val: 'Phulia Weavers Collective' }
        ],
        price: 'USD $1,150'
    },
    bridal: {
        title: 'THE MAHARANI BRIDAL HEIRLOOM',
        edition: 'EDITION NO. 05 &bull; HAUTE ATELIER COUTURE',
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1600&auto=format&fit=crop',
        description: 'Our apex bridal creation. Six months in the making. Pure crimson katan silk adorned with real gold bullion wire, uncut polki beads, and intricate Dabka embroidery across the grand pallu.',
        specs: [
            { key: 'Artisan Hours', val: '480 Dedicated Hours' },
            { key: 'Zardozi Work', val: '24K Gold Plated Bullion Wire' },
            { key: 'Weight', val: '1,450 Grams Royal Weight' },
            { key: 'Provenance', val: 'Aaranya Private Vault' }
        ],
        price: 'USD $4,200'
    }
};

/* --------------------------------------------------------------------------
   MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.getElementById('mobileMenuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* --------------------------------------------------------------------------
   DRAPING INTERACTIVE CONTROLLER
   -------------------------------------------------------------------------- */
function initDrapingInteractive() {
    const tabs = document.querySelectorAll('.drape-tab');
    const panels = document.querySelectorAll('.drape-panel');

    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const stepNum = tab.getAttribute('data-step');

            // Set active tab
            tabs.forEach((t) => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            // Switch active panel with subtle fade
            panels.forEach((p) => {
                if (p.getAttribute('data-panel') === stepNum) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   FEATURED SAREE SWATCH SWITCHER
   -------------------------------------------------------------------------- */
function initFeaturedSwatches() {
    const swatches = document.querySelectorAll('.swatch-btn');
    const featuredHeroImg = document.getElementById('featuredHeroImg');

    if (!swatches.length || !featuredHeroImg) return;

    const variations = {
        'vermilion': 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2000&auto=format&fit=crop',
        'antique-gold': 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=2000&auto=format&fit=crop',
        'midnight': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop'
    };

    swatches.forEach((btn) => {
        btn.addEventListener('click', () => {
            const weave = btn.getAttribute('data-weave');
            if (!variations[weave]) return;

            swatches.forEach((s) => s.classList.remove('active'));
            btn.classList.add('active');

            // Smooth crossfade image change
            gsap.to(featuredHeroImg, {
                opacity: 0.3,
                scale: 0.98,
                duration: 0.3,
                onComplete: () => {
                    featuredHeroImg.src = variations[weave];
                    gsap.to(featuredHeroImg, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   DISCOVER COLLECTION FLOATING IMAGE PREVIEW
   -------------------------------------------------------------------------- */
function initDiscoverFloatingPreview() {
    const items = document.querySelectorAll('.discover-item');
    const previewBox = document.getElementById('discoverFloatingPreview');
    const previewImg = document.getElementById('discoverPreviewImg');

    if (!items.length) return;

    // Shared by every input type: expose the row artwork to CSS (mobile thumbnail)
    // and make the row tappable, since the desktop-only preview never runs on touch.
    items.forEach((item) => {
        const imgSrc = item.getAttribute('data-image');
        if (imgSrc) item.style.setProperty('--discover-thumb', `url("${imgSrc}")`);

        item.addEventListener('click', () => {
            const cat = item.getAttribute('data-category');
            if (cat && typeof openQuickView === 'function') openQuickView(cat);
        });
    });

    if (!previewBox || !previewImg) return;

    // Only active on desktop fine pointer
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX + 40;
        targetY = e.clientY;
    });

    gsap.ticker.add(() => {
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        previewBox.style.left = `${currentX}px`;
        previewBox.style.top = `${currentY}px`;
    });

    items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-image');
            if (imgSrc) {
                previewImg.src = imgSrc;
                previewBox.classList.add('active');
            }
        });

        item.addEventListener('mouseleave', () => {
            previewBox.classList.remove('active');
        });
    });
}

/* --------------------------------------------------------------------------
   TESTIMONIALS SLIDER
   -------------------------------------------------------------------------- */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testi-dot');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;

    function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
            resetAutoplay();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            showSlide(idx);
            resetAutoplay();
        });
    });

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 6000);
    }

    function resetAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        startAutoplay();
    }

    startAutoplay();
}

/* --------------------------------------------------------------------------
   QUICK VIEW ATELIER MODAL
   -------------------------------------------------------------------------- */
function openQuickView(categoryKey) {
    const modal = document.getElementById('quickViewModal');
    const bodyContent = document.getElementById('modalBodyContent');
    const data = sareeDossierData[categoryKey];

    if (!modal || !bodyContent || !data) return;

    const specsHtml = data.specs.map(s => `
        <div class="spec-row" style="display:flex; justify-content:space-between; padding:0.6rem 0; border-bottom:1px solid rgba(33,27,23,0.08); font-size:0.85rem;">
            <span style="color:rgba(33,27,23,0.6);">${s.key}</span>
            <strong style="color:var(--color-dark-brown);">${s.val}</strong>
        </div>
    `).join('');

    bodyContent.innerHTML = `
        <div class="modal-grid-content">
            <div class="modal-media">
                <img src="${data.image}" alt="${data.title}">
            </div>
            <div class="modal-info-pane">
                <div>
                    <span style="font-size:0.72rem; font-weight:600; letter-spacing:0.2em; color:var(--color-burgundy);">${data.edition}</span>
                    <h3 style="font-size:2.2rem; margin:0.4rem 0 1rem; color:var(--color-dark-brown); line-height:1.1;">${data.title}</h3>
                    <p style="font-size:0.95rem; color:rgba(33,27,23,0.8); line-height:1.7; margin-bottom:1.5rem;">${data.description}</p>
                    <div style="margin-bottom:2rem;">
                        ${specsHtml}
                    </div>
                </div>
                <div>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
                        <span style="font-size:0.75rem; letter-spacing:0.12em; color:rgba(33,27,23,0.6);">ATELIER VALUATION:</span>
                        <span style="font-family:var(--font-heading); font-size:1.6rem; color:var(--color-burgundy); font-weight:600;">${data.price}</span>
                    </div>
                    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                        <a href="#contact" onclick="closeQuickView()" class="btn-editorial primary" style="flex-grow:1; justify-content:center;">
                            <span>INQUIRE ATELIER ACQUISITION</span>
                            <span class="btn-arrow">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
    }
});

/* --------------------------------------------------------------------------
   NEWSLETTER / APPOINTMENT FORM HANDLER
   -------------------------------------------------------------------------- */
function handleAtelierSubmit(e) {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    const input = e.target.querySelector('input[type="email"]');
    
    if (feedback) {
        feedback.textContent = '✦ Thank you. Our concierge will contact you within 24 hours to schedule your private salon viewing.';
        feedback.style.color = '#B99A5B';
    }
    if (input) {
        input.value = '';
    }
}
