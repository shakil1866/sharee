/**
 * AARANYA — Luxury Custom Cursor
 * Magnetic tracking, smooth physics, contextual hover states (VIEW, EXPLORE)
 */

function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;

    // Disable on touch / mobile devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }

    const dot = cursor.querySelector('.cursor-dot');
    const outline = cursor.querySelector('.cursor-outline');
    const textSpan = cursor.querySelector('.cursor-text');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    // Use GSAP quickSetter for ultra high-performance 60/120fps tracking
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setOutlineX = gsap.quickSetter(outline, 'x', 'px');
    const setOutlineY = gsap.quickSetter(outline, 'y', 'px');

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        setDotX(mouseX);
        setDotY(mouseY);
    });

    // Smooth ticker animation for trailing ring
    gsap.ticker.add(() => {
        const speed = 0.18;
        outlineX += (mouseX - outlineX) * speed;
        outlineY += (mouseY - outlineY) * speed;
        setOutlineX(outlineX);
        setOutlineY(outlineY);
    });

    // Contextual Hover States
    const interactiveElements = document.querySelectorAll('[data-cursor], a, button, .discover-item, .editorial-card, .social-item');

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            const cursorType = el.getAttribute('data-cursor');
            if (cursorType === 'VIEW') {
                cursor.classList.add('active-view');
                cursor.classList.remove('active-explore');
                if (textSpan) textSpan.textContent = 'VIEW';
            } else if (cursorType === 'EXPLORE') {
                cursor.classList.add('active-explore');
                cursor.classList.remove('active-view');
                if (textSpan) textSpan.textContent = 'EXPLORE';
            } else {
                cursor.classList.add('active-view');
                if (textSpan) textSpan.textContent = '✦';
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active-view', 'active-explore');
            if (textSpan) textSpan.textContent = '';
        });
    });

    // Hide cursor when leaving browser window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}
