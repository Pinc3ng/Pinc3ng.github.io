/* ==========================================
   PERSONAL PORTFOLIO - JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 100) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (id && scrollY >= top && scrollY < top + height) {
                const hasMatchingLink = Array.from(navLinks).some(link => link.getAttribute('data-section') === id);
                if (hasMatchingLink) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-section') === id) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // STAT COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            if (!target) return;
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                num.textContent = Math.floor(current);
            }, 16);
        });
    }

    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats observer
    const heroMeta = document.querySelector('.hero-meta');
    if (heroMeta) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroMeta);
    }

    // ==========================================
    // SKILLS TABS
    // ==========================================
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillPanels = document.querySelectorAll('.skills-panel');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            skillPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');

                    // Re-trigger reveal for newly visible items
                    const items = panel.querySelectorAll('.reveal-up');
                    items.forEach(item => {
                        item.classList.remove('revealed');
                        setTimeout(() => item.classList.add('revealed'), 50);
                    });
                }
            });
        });
    });

    // ==========================================
    // PROJECT FILTER
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    card.offsetHeight; // reflow
                    card.style.animation = '';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // EXPERIENCE TABS
    // ==========================================
    const expTabs = document.querySelectorAll('.exp-tab');
    const workTimeline = document.getElementById('workTimeline');
    const educationTimeline = document.getElementById('educationTimeline');

    expTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetExp = tab.getAttribute('data-exp');

            expTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (targetExp === 'work') {
                workTimeline.classList.add('active');
                educationTimeline.classList.remove('active');
            } else {
                workTimeline.classList.remove('active');
                educationTimeline.classList.add('active');
            }

            // Re-trigger reveal for newly visible timeline items
            const activeTimeline = targetExp === 'work' ? workTimeline : educationTimeline;
            const items = activeTimeline.querySelectorAll('.reveal-up');
            items.forEach((item, i) => {
                item.classList.remove('revealed');
                setTimeout(() => item.classList.add('revealed'), i * 100);
            });
        });
    });

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.color = '#fff';

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
