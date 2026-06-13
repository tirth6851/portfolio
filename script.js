'use strict';

/* ============================================================
   1. Hamburger Menu
   ============================================================ */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const navbar    = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navLinks.classList.toggle('nav-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close when clicking outside the navbar
document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

/* ============================================================
   2. Navbar scroll shadow
   ============================================================ */
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ============================================================
   3. Text Scramble Engine
   ============================================================ */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

/* ============================================================
   4. WebGL Background Shader (Hero)
   ============================================================ */
function initHeroShader() {
    const container = document.getElementById('hero-shader');
    if (!container || !window.THREE) return;
    
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.4 },
        distortion: { value: 0.04 }
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            uniform float xScale;
            uniform float yScale;
            uniform float distortion;
            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
                float d = length(p) * distortion;
                float rx = p.x * (1.0 + d);
                float gx = p.x;
                float bx = p.x * (1.0 - d);
                float r = 0.03 / abs(p.y + sin((rx + time) * xScale) * yScale);
                float g = 0.04 / abs(p.y + sin((gx + time) * xScale) * yScale);
                float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
                gl_FragColor = vec4(r * 0.1, g * 0.4, b * 0.3, 1.0);
            }`
    });

    scene.add(new THREE.Mesh(geometry, material));

    function animate(t) {
        uniforms.time.value = t * 0.0006;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
}

/* ============================================================
   5. Raining Letters (Contact Background)
   ============================================================ */
function initRainingLetters() {
    const canvas = document.getElementById('contact-raining-letters');
    if (!canvas) return;
    const section = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}*^%".split("");
    let width, height, columns, drops;

    function resize() {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
        columns = Math.floor(width / 20);
        drops = new Array(columns).fill(1);
    }

    function draw() {
        ctx.fillStyle = "rgba(5, 8, 9, 0.15)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#198754";
        ctx.font = "15px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    window.addEventListener('resize', resize);
    resize();
    setInterval(draw, 33);
}

/* ============================================================
   6. Animation Initialization
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Start Visual Effects
    initHeroShader();
    initRainingLetters();

    // Setup Scramble Rotations
    const logoEl = document.getElementById('scramble-logo');
    const titleEl = document.getElementById('scramble-hero-title');
    const descEl = document.getElementById('scramble-hero-desc');

    const logoFx = new TextScramble(logoEl);
    const titleFx = new TextScramble(titleEl);
    const descFx = new TextScramble(descEl);

    const logoPhrases = ["Tirth Patel", "CS @ Cleveland State", "Math Minor", "Python & Java"];
    const titlePhrases = ["Engineering Intelligent Systems", "Backend Developer", "Building Future Tech", "Fall 2026 Intern"];
    const descPhrases = [
        "CS @ Cleveland State | GPA 3.54",
        "Seeking Fall 2026 SWE Internship",
        "Recommendation Systems & Backend Development",
        "Building Scalable Python Applications"
    ];

    let counter = 0;
    const rotate = () => {
        logoFx.setText(logoPhrases[counter % logoPhrases.length]);
        titleFx.setText(titlePhrases[counter % titlePhrases.length]);
        descFx.setText(descPhrases[counter % descPhrases.length]).then(() => {
            setTimeout(rotate, 4000);
        });
        counter++;
    };
    rotate();
});

/* ============================================================
   7. 3D Scroll Reveal & Sync
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target); // animate once, then stop watching
        }
    });
}, {
    threshold: 0.12,          // element must be 12% visible to trigger
    rootMargin: '0px 0px -40px 0px'  // triggers 40px before bottom of viewport
});

document.querySelectorAll('.anim').forEach(el => revealObserver.observe(el));

// 3D "Container Scroll" Effect for Projects
window.addEventListener('scroll', () => {
    const projects = document.querySelector('.projects-grid');
    if (!projects) return;
    
    const rect = projects.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    
    if (rect.top < viewHeight && rect.bottom > 0) {
        const progress = Math.min(Math.max((viewHeight - rect.top) / viewHeight, 0), 1);
        const rotateX = 20 - (progress * 20); // Tilt from 20deg to 0deg
        projects.style.transform = `perspective(1000px) rotateX(${rotateX}deg) scale(${0.9 + (progress * 0.1)})`;
    }
}, { passive: true });
