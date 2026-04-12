'use strict';

/* ============================================================
   Note: document.documentElement.classList.add('js') is called
   via an inline <script> in <head> for progressive enhancement.
   ============================================================ */

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
   3. Targeted scroll animations (2 observers)
   ============================================================ */

// Animation 2: Projects grid — staggered card reveal
const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) {
    const projectsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('projects-revealed');
                projectsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    projectsObserver.observe(projectsGrid);
}

// Animation 3: About content — fade-up on scroll
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
    const aboutObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('about-revealed');
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    aboutObserver.observe(aboutContent);
}
