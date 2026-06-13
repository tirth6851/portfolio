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
   3. 3D Scroll Reveal  (Intersection Observer)
   ============================================================
   Elements get an .anim + .anim-* class in the HTML.
   When they enter the viewport, .is-visible is added,
   which resets all transforms to identity (transform: none).
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
