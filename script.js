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
   3. Matrix Text Engine (Adapted from Kokonut UI)
   ============================================================ */
class MatrixText {
    constructor(el, options = {}) {
        this.el = el;
        this.text = options.text || el.innerText;
        this.duration = options.duration || 500;
        this.interval = options.interval || 100;
        this.initialDelay = options.initialDelay || 200;
    }

    async animate() {
        const chars = this.text.split('');
        this.el.innerHTML = '';
        const spans = chars.map(c => {
            const s = document.createElement('span');
            s.className = 'matrix-span';
            s.innerText = c;
            s.style.minWidth = c === ' ' ? '0.4em' : '0.6em';
            this.el.appendChild(s);
            return { el: s, char: c };
        });

        return new Promise(resolve => {
            setTimeout(() => {
                spans.forEach((span, i) => {
                    setTimeout(() => this.animateLetter(span), i * this.interval);
                });
                setTimeout(resolve, (spans.length * this.interval) + this.duration);
            }, this.initialDelay);
        });
    }

    animateLetter(span) {
        if (span.char === ' ') return;
        
        const originalChar = span.char;
        const scrambleInterval = setInterval(() => {
            span.innerText = Math.random() > 0.5 ? '1' : '0';
            span.style.color = '#00ff00';
            span.style.textShadow = '0 2px 4px rgba(0, 255, 0, 0.5)';
        }, 50);

        setTimeout(() => {
            clearInterval(scrambleInterval);
            span.innerText = originalChar;
            span.style.color = '';
            span.style.textShadow = '';
        }, this.duration);
    }

    setText(newText) {
        this.text = newText;
        return this.animate();
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

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `void main() { gl_Position = vec4( position, 1.0 ); }`,
        fragmentShader: `
            #define TWO_PI 6.2831853072
            #define PI 3.14159265359
            precision highp float;
            uniform vec2 resolution;
            uniform float time;

            void main(void) {
                vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
                float t = time*0.05;
                float lineWidth = 0.002;
                vec3 color = vec3(0.0);
                for(int j = 0; j < 3; j++){
                    for(int i=0; i < 5; i++){
                        color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
                    }
                }
                gl_FragColor = vec4(color[0],color[1],color[2],1.0);
            }`
    });

    scene.add(new THREE.Mesh(geometry, material));

    function animate(t) {
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.resolution.value.x = renderer.domElement.width;
        uniforms.resolution.value.y = renderer.domElement.height;
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

    const logoFx = new MatrixText(logoEl);
    const titleFx = new MatrixText(titleEl);
    const descFx = new MatrixText(descEl);

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
        projects.style.transform = `perspective(1200px) rotateX(${rotateX}deg) scale(${0.95 + (progress * 0.05)})`;
    }
}, { passive: true });
