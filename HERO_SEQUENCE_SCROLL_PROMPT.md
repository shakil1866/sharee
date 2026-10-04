# 🎬 Master Prompt & Blueprint: Cinematic Scroll-Driven Canvas Image Sequence Hero Section

> **Purpose:** Use this detailed, production-grade prompt template with any AI coding assistant or frontend developer to build an Apple/High-Fashion luxury scroll-driven hero section with canvas image sequences and stage overlays on any future website.

---

## 📋 Quick Copy-Paste Master Prompt

Copy and paste the prompt below into any AI assistant, replacing the bracketed `[VARIABLES]` with your project details.

```markdown
Build a luxury, Apple-style scroll-driven pinned hero section using an HTML5 Canvas image sequence and sequential stage text overlays.

### 1. Project Parameters & Assets:
- Image Folder / Path: "[FOLDER_PATH]" (e.g., "assets/hero-sequence/frame-%03d.jpg" or "ezgif-frame-001.jpg" to "ezgif-frame-300.jpg")
- Total Number of Frames: [TOTAL_FRAMES] (e.g., 300)
- Brand / Product Theme: [BRAND_NAME_OR_THEME] (e.g., "Luxury Handcrafted Sarees" / "Supercar Reveal" / "High-End Watch")
- Core Libraries: GSAP 3.x, GSAP ScrollTrigger, Lenis Smooth Scroll (vanilla JS & CSS).

### 2. Required Architecture & Features:

#### A. Pinned Canvas Engine (Zero-Flicker & High Performance):
1. Use an `<canvas id="heroCanvas">` with hardware acceleration inside a sticky/pinned container.
2. High-DPI Support: Calculate and clamp devicePixelRatio (`Math.min(window.devicePixelRatio || 1, 2)`) to ensure crisp rendering on 4K/Retina displays without memory bloat.
3. Aspect Ratio Math: Dynamically scale frames using `object-fit: cover` logic (`Math.max(canvas.width / img.width, canvas.height / img.height)`) and center the frame precisely on viewport resize.
4. Progressive Preloading & Nearest-Frame Fallback:
   - Frame 1 must load and paint instantly on DOM ready so there is zero black screen or delay.
   - Rapidly buffer the first 25–30 frames, then progressively load the remaining frames in background idle batches using `requestIdleCallback` or chunked timeouts.
   - Implement an outward fallback search algorithm (`findClosestFrame`) so fast scrubbing never shows a blank/tearing canvas.

#### B. Sequential Stage Text Overlays (Cinematic Chapter Transitions):
1. Place a centered text wrapper (`.hero-text-wrapper`) above the canvas with a radial vignette overlay.
2. Include 3 to 4 sequential stages (`.hero-step`):
   - Stage 1 (0% - 25% Scroll): Main headline, editorial kicker, subtext, and CTA buttons.
   - Stage 2 (25% - 55% Scroll): Act I feature highlight with kicker, title, and description.
   - Stage 3 (55% - 82% Scroll): Act II craftsmanship / detail highlight.
   - Stage 4 (82% - 100% Scroll): Act III final climax / atelier reveal with primary CTA.
3. Transitions: Each stage overlay should smoothly transition in and out using CSS opacity (`opacity: 0 -> 1`), subtle vertical translation (`translateY(25px) -> translateY(0)`), and visibility toggling via the `.active` class.

#### C. Minimalist Luxury Progress & Scroll Indicators:
1. Include a minimalist 2px gold progress bar at the bottom center (`.hero-progress-indicator`) that fills from `0%` to `100%` in real-time as the user scrolls.
2. Include an animated "SCROLL TO DISCOVER" indicator with a sliding thumb line that automatically fades out once scroll begins (`progress > 0.04`).

#### D. GSAP ScrollTrigger Synchronization:
1. Pin the hero container (`pin: true`) over a generous scroll distance (e.g., `end: "+=260%"` or `+=300%`).
2. Bind scrub with `scrub: 0.8` to synchronize with Lenis smooth scrolling.
3. In `onUpdate(self)`:
   - Calculate `self.progress` (0.0 to 1.0) and map it to `sequenceState.frame` (1 to TOTAL_FRAMES).
   - Draw the current frame to canvas.
   - Toggle `.active` on the corresponding stage element based on progress thresholds.
   - Update the width of the progress indicator bar.

#### E. Accessibility & Responsive Design:
1. Support `prefers-reduced-motion`: When active, disable pinning, show the first frame, and stack content cleanly.
2. Fully responsive across mobile (< 768px), tablet, and desktop viewports with fluid typography using `clamp()`.
```

---

## 🛠 Complete Implementation Blueprint & Code Templates

### 1. HTML Structure

```html
<!-- HERO SECTION (Pinned Canvas Scroll & Stage Overlays) -->
<section class="hero-section hero-sequence-section" id="hero" aria-label="Hero Introduction">
    <div class="hero-pin-container" id="heroPinContainer">
        
        <!-- Canvas Visual Backdrop -->
        <div class="hero-visual-box">
            <canvas id="heroCanvas" class="hero-canvas"></canvas>
            <div class="hero-vignette"></div>
        </div>

        <!-- Sequential Stage Overlays -->
        <div class="hero-text-wrapper">
            <!-- Stage 1 -->
            <div class="hero-step step-1 active" id="heroStep1">
                <span class="hero-kicker">STAGE 01 &bull; INTRODUCTION</span>
                <h1 class="hero-title">A SAREE IS A STORY.</h1>
                <p class="hero-desc">Woven with timeless tradition. Designed for the contemporary muse.</p>
                <div class="hero-cta-group">
                    <a href="#collection" class="btn-editorial primary">
                        <span>EXPLORE COLLECTION</span>
                        <span class="btn-arrow">&rarr;</span>
                    </a>
                    <a href="#story" class="btn-editorial secondary">
                        <span>OUR STORY</span>
                    </a>
                </div>
            </div>

            <!-- Stage 2 -->
            <div class="hero-step step-2" id="heroStep2">
                <span class="hero-kicker">STAGE 02 &bull; CRAFTSMANSHIP</span>
                <h2 class="hero-title">CHOREOGRAPHED IN SILK.</h2>
                <p class="hero-desc">Over four hundred thousand warp and weft intersections crafted on ancestral handlooms.</p>
            </div>

            <!-- Stage 3 -->
            <div class="hero-step step-3" id="heroStep3">
                <span class="hero-kicker">STAGE 03 &bull; HERITAGE</span>
                <h2 class="hero-title">PURE ZARI &amp; MEMORY.</h2>
                <p class="hero-desc">Preserving sacred motifs passed down through six generations of master artisans.</p>
            </div>

            <!-- Stage 4 -->
            <div class="hero-step step-4" id="heroStep4">
                <span class="hero-kicker">STAGE 04 &bull; THE HEIRLOOM</span>
                <h2 class="hero-title">HAUTE COUTURE.</h2>
                <p class="hero-desc">An heirloom created to outlive decades with unspoken grace.</p>
                <div class="hero-cta-group">
                    <a href="#collection" class="btn-editorial primary">
                        <span>DISCOVER ATELIER</span>
                        <span class="btn-arrow">&rarr;</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Minimalist Progress Indicator -->
        <div class="hero-progress-indicator" aria-hidden="true">
            <div class="hero-progress-fill" id="heroProgressFill"></div>
        </div>

        <!-- Scroll Indicator -->
        <div class="scroll-indicator" id="heroScrollIndicator" aria-hidden="true">
            <span class="scroll-text">SCROLL TO DISCOVER</span>
            <div class="scroll-line-track">
                <div class="scroll-line-thumb"></div>
            </div>
        </div>
    </div>
</section>
```

---

### 2. CSS Styling (Vanilla CSS)

```css
/* Container & Pinning */
.hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #211B17;
}

.hero-pin-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-visual-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.hero-canvas {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    pointer-events: none;
}

.hero-vignette {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(33, 27, 23, 0.25) 20%, rgba(33, 27, 23, 0.85) 100%);
    pointer-events: none;
    z-index: 2;
}

/* Stage Overlays */
.hero-text-wrapper {
    position: relative;
    z-index: 3;
    max-width: 860px;
    text-align: center;
    padding: 0 1.5rem;
    width: 100%;
}

.hero-step {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(25px);
    width: 100%;
    max-width: 860px;
    padding: 0 1.5rem;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.5s;
    color: #F8F4EC;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-step.active {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) translateY(0);
    pointer-events: auto;
}

.hero-kicker {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.26em;
    color: #B99A5B;
    margin-bottom: 1.2rem;
    text-transform: uppercase;
}

.hero-title {
    font-size: clamp(2.4rem, 6vw, 5.2rem);
    line-height: 1.05;
    color: #F8F4EC;
    margin-bottom: 1.2rem;
    text-shadow: 0 4px 25px rgba(0, 0, 0, 0.65);
    font-family: serif;
    font-weight: 300;
}

.hero-desc {
    font-size: clamp(0.95rem, 1.25vw, 1.15rem);
    line-height: 1.65;
    color: rgba(248, 244, 236, 0.9);
    max-width: 600px;
    margin: 0 auto 2rem;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
}

.hero-cta-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
}

/* Progress Indicator */
.hero-progress-indicator {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    height: 2px;
    background: rgba(248, 244, 236, 0.2);
    z-index: 4;
}

.hero-progress-fill {
    width: 0%;
    height: 100%;
    background: #B99A5B;
    transition: width 0.08s linear;
}

/* Scroll Down Line */
.scroll-indicator {
    position: absolute;
    bottom: 2.2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.scroll-text {
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    color: #D4B779;
}

.scroll-line-track {
    width: 1px;
    height: 44px;
    background-color: rgba(248, 244, 236, 0.25);
    position: relative;
    overflow: hidden;
}

.scroll-line-thumb {
    width: 100%;
    height: 18px;
    background-color: #B99A5B;
    position: absolute;
    top: -18px;
    animation: scrollSlide 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes scrollSlide {
    0% { top: -18px; opacity: 0; }
    30% { opacity: 1; }
    80% { top: 44px; opacity: 1; }
    100% { top: 44px; opacity: 0; }
}
```

---

### 3. JavaScript Animation Engine (GSAP + ScrollTrigger + Canvas)

```javascript
/**
 * Pinned Image Sequence + Stage Overlays Engine
 */
function initHeroSequenceAnimation({
    heroId = 'hero',
    canvasId = 'heroCanvas',
    totalFrames = 300,
    framePathGenerator = (i) => `ezgif-frame-${String(i).padStart(3, '0')}.jpg`,
    pinDuration = '+=260%',
    scrubSpeed = 0.8
}) {
    const hero = document.getElementById(heroId);
    const canvas = document.getElementById(canvasId);
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

    const frames = new Array(totalFrames + 1);
    const loadedStatus = new Uint8Array(totalFrames + 1);
    let renderedFrame = -1;

    // 1. Retina / HiDPI Canvas Resizing
    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);

        if (renderedFrame > 0) {
            renderFrame(renderedFrame, true);
        }
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 2. Outward Fallback Search (Prevents blank frames during fast scrolling)
    function findClosestFrame(targetIndex) {
        if (loadedStatus[targetIndex] && frames[targetIndex]) {
            return frames[targetIndex];
        }
        for (let delta = 1; delta < totalFrames; delta++) {
            const down = targetIndex - delta;
            if (down >= 1 && loadedStatus[down] && frames[down]) return frames[down];
            const up = targetIndex + delta;
            if (up <= totalFrames && loadedStatus[up] && frames[up]) return frames[up];
        }
        return frames[1] || null;
    }

    // 3. Object-Fit: Cover Canvas Renderer
    function renderFrame(frameIndex, force = false) {
        const targetIndex = Math.max(1, Math.min(totalFrames, Math.round(frameIndex)));
        if (!force && targetIndex === renderedFrame) return;

        const img = findClosestFrame(targetIndex);
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;

        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const ox = (cw - nw) / 2;
        const oy = (ch - nh) / 2;

        ctx.drawImage(img, 0, 0, iw, ih, ox, oy, nw, nh);
        renderedFrame = targetIndex;
    }

    // 4. Single Frame Loader
    function loadSingleFrame(index, priority = false) {
        if (frames[index]) return;
        const img = new Image();
        if (priority) img.fetchPriority = 'high';
        img.onload = () => {
            loadedStatus[index] = 1;
            frames[index] = img;
            if (renderedFrame === -1 && index === 1) {
                renderFrame(1, true);
            }
        };
        img.src = framePathGenerator(index);
        frames[index] = img;
    }

    // Immediate Frame 1 & initial buffer
    loadSingleFrame(1, true);
    for (let i = 2; i <= 30; i++) loadSingleFrame(i, true);

    // 5. Progressive Background Chunk Loader
    function loadRemainingFrames() {
        let currentChunk = 31;
        const chunkSize = 20;

        function nextChunk() {
            if (currentChunk > totalFrames) return;
            const end = Math.min(currentChunk + chunkSize, totalFrames);
            for (let i = currentChunk; i <= end; i++) loadSingleFrame(i, false);
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

    // 6. GSAP ScrollTrigger Pinned Timeline
    const sequenceState = { frame: 1 };

    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: pinDuration,
            pin: true,
            scrub: scrubSpeed,
            onUpdate: (self) => {
                const progress = self.progress;
                if (progressFill) progressFill.style.width = `${progress * 100}%`;

                // Sequential Stage Thresholds
                let activeIndex = 0;
                if (progress < 0.25) activeIndex = 0;
                else if (progress < 0.55) activeIndex = 1;
                else if (progress < 0.82) activeIndex = 2;
                else activeIndex = 3;

                steps.forEach((step, idx) => {
                    if (step) step.classList.toggle('active', idx === activeIndex);
                });

                if (scrollIndicator) {
                    scrollIndicator.style.opacity = progress > 0.04 ? '0' : '1';
                }
            }
        }
    });

    heroTl.to(sequenceState, {
        frame: totalFrames,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
            renderFrame(sequenceState.frame);
        }
    });
}
```

---

## 💡 Adapting for Future Industries & Use-Cases

| Industry | Visual Asset (300 Frames) | Stage 1 (0% - 25%) | Stage 2 (25% - 55%) | Stage 3 (55% - 82%) | Stage 4 (82% - 100%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Luxury Fashion / Saree** | Model 360° Drape / Fabric Flow | *A Saree is a Story* | *Choreographed in Silk* | *Pure Zari & Memory* | *The Atelier Collection* |
| **Supercar / Automotive** | 3D Car Spin & Aerodynamic Reveal | *Pure Power Unleashed* | *Carbon Fiber Chassis* | *Twin-Turbo V8 Engine* | *Reserve Your Drive* |
| **Luxury Watch / Horology** | Exploded Movement & Case Assembly | *Precision in Motion* | *Hand-Polished Tourbillon* | *Sapphire Crystal & Gold* | *Explore Timepieces* |
| **Consumer Tech / Headphones** | 3D Product Rotation & Driver Explode | *Sound Reimagined* | *Custom Acoustic Drivers* | *Active Noise Cancelling* | *Order Now* |
| **Architecture / Real Estate** | Drone Descent to Living Space | *Architectural Splendor* | *Floor-to-Ceiling Glass* | *Bespoke Italian Marble* | *Schedule Private Tour* |
