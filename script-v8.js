/* ==========================================================
   VINCENT PORTFOLIO — 60-120 FPS ULTRA SMOOTH SCRIPT
   High Performance · Zero Lag · GPU Optimized
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL PROGRESS
    const scrollProgress = document.getElementById('scroll-progress');
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (scrollProgress) {
                    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const percent = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
                    scrollProgress.style.width = percent + '%';
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // 2. ULTRA LIGHTWEIGHT HIGH-FPS CANVAS (NO HEAVY SHADOW BLUR)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: true });
        let W = 0, H = 0;
        let particles = [];
        let mouseX = -1000, mouseY = -1000;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', () => {
            resize();
            initParticles();
        }, { passive: true });

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        }, { passive: true });

        const COLORS = ['rgba(0, 240, 255, 0.7)', 'rgba(138, 75, 254, 0.7)', 'rgba(255, 42, 133, 0.6)', 'rgba(0, 245, 155, 0.7)'];

        class Particle {
            constructor() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.r = Math.random() * 1.6 + 0.8;
                this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Gentle mouse repulsion (fast squared distance check)
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 16000 && distSq > 0) { // ~125px radius
                    const force = (16000 - distSq) / 16000;
                    this.x -= (dx / Math.sqrt(distSq)) * force * 2.2;
                    this.y -= (dy / Math.sqrt(distSq)) * force * 2.2;
                }

                if (this.x < -10) this.x = W + 10;
                if (this.x > W + 10) this.x = -10;
                if (this.y < -10) this.y = H + 10;
                if (this.y > H + 10) this.y = -10;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 6.283);
                ctx.fill();
            }
        }

        function initParticles() {
            // Keep count optimized for 120 FPS performance (35 to 55 max)
            const count = Math.min(Math.floor(W / 28), 50);
            particles = Array.from({ length: count }, () => new Particle());
        }
        initParticles();

        const MAX_DIST_SQ = 120 * 120; // 14400

        function loop() {
            ctx.clearRect(0, 0, W, H);

            // Draw connecting lines with zero heavy shadowBlur
            ctx.lineWidth = 0.75;
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < MAX_DIST_SQ) {
                        const alpha = (1 - distSq / MAX_DIST_SQ) * 0.22;
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    // 3. HARDWARE-ACCELERATED CURSOR (60FPS TRANSFORM)
    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    let mX = -100, mY = -100;
    let rX = -100, rY = -100;

    if (dot && ring) {
        window.addEventListener('mousemove', e => {
            mX = e.clientX;
            mY = e.clientY;
            dot.style.transform = `translate3d(${mX}px, ${mY}px, 0) translate(-50%, -50%)`;
        }, { passive: true });

        function animateRing() {
            rX += (mX - rX) * 0.18;
            rY += (mY - rY) * 0.18;
            ring.style.transform = `translate3d(${rX}px, ${rY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        }
        requestAnimationFrame(animateRing);

        const hoverEls = document.querySelectorAll('a, button, input, textarea, .nav-card, .proj-card, .t-item, .cert-item, .skill-item, .hero-chip');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hover');
                ring.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hover');
                ring.classList.remove('hover');
            });
        });
    }

    // 4. LIVE HUD CLOCK
    const hudTime = document.getElementById('hudTime');
    if (hudTime) {
        function updateClock() {
            const now = new Date();
            const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            hudTime.textContent = now.toLocaleTimeString('en-GB', options) + ' WIB';
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // 5. TYPEWRITER (CLEAN INTERVAL)
    const typedEl = document.querySelector('.hero-typed');
    if (typedEl) {
        const phrases = [
            'Informatics Student @ UPH',
            'Full Stack Web Developer',
            'Creative UI/UX Designer',
            'Tech Entrepreneur Mindset',
            'Open for Collaborations'
        ];
        let pIdx = 0, cIdx = 0, isDeleting = false;

        function runType() {
            const current = phrases[pIdx];
            if (isDeleting) {
                cIdx--;
                typedEl.textContent = current.substring(0, cIdx);
                if (cIdx === 0) {
                    isDeleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                    setTimeout(runType, 300);
                    return;
                }
                setTimeout(runType, 35);
            } else {
                cIdx++;
                typedEl.textContent = current.substring(0, cIdx);
                if (cIdx === current.length) {
                    isDeleting = true;
                    setTimeout(runType, 1800);
                    return;
                }
                setTimeout(runType, 70);
            }
        }
        setTimeout(runType, 500);
    }

    // 6. 3D CARD TILT (REQUEST ANIMATION FRAME OPTIMIZED)
    function setupTilt(cards, maxDeg = 8) {
        cards.forEach(card => {
            let rafId = null;
            card.addEventListener('mousemove', e => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    card.style.transform = `perspective(800px) rotateX(${(-y * maxDeg).toFixed(1)}deg) rotateY(${(x * maxDeg).toFixed(1)}deg) translateY(-6px)`;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.transform = '';
            });
        });
    }

    setupTilt(document.querySelectorAll('.nav-card'), 8);
    setupTilt(document.querySelectorAll('.proj-card'), 6);
    setupTilt(document.querySelectorAll('.skill-item'), 8);
    setupTilt(document.querySelectorAll('.cert-item'), 6);

    // 7. NAVBAR SCROLL
    const navbar = document.getElementById('navbar');
    const topBtn = document.getElementById('backToTop');
    const scrollHint = document.getElementById('scrollHint');

    function checkScroll() {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 40);
        if (topBtn) topBtn.classList.toggle('show', y > 400);
        if (scrollHint) scrollHint.classList.toggle('gone', y > 80);
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    if (topBtn) {
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Mobile nav
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 8. SCROLL REVEAL (INTERSECTION OBSERVER)
    const revElements = document.querySelectorAll('.r-up, .r-left, .r-right');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('on');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        revElements.forEach(el => obs.observe(el));
    }
    // Fail-safe
    setTimeout(() => {
        revElements.forEach(el => el.classList.add('on'));
    }, 100);

    // 9. STAT COUNTERS
    const counts = document.querySelectorAll('.count[data-n]');
    let hasCounted = false;
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !hasCounted) {
                hasCounted = true;
                counts.forEach(el => {
                    const target = +el.dataset.n;
                    let current = 0;
                    const step = target / 50;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            clearInterval(timer);
                            el.textContent = target;
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, 20);
                });
            }
        });
    }, { threshold: 0.3 });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // 10. SKILL TABS
    document.querySelectorAll('.sk-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sk-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sk-panel').forEach(p => p.classList.remove('show'));
            tab.classList.add('active');
            const panel = document.getElementById(tab.dataset.tab);
            if (panel) {
                panel.classList.add('show');
                panel.querySelectorAll('.r-up').forEach(el => el.classList.add('on'));
            }
        });
    });

    // 11. PROJECT FILTER
    document.querySelectorAll('.f-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.f;
            document.querySelectorAll('.proj-card').forEach(card => {
                if (filter === 'all' || card.dataset.cat === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 12. EXPERIENCE TABS
    document.querySelectorAll('.ex-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.t-list').forEach(l => l.classList.remove('show'));
            tab.classList.add('active');
            const targetList = document.getElementById(tab.dataset.exp);
            if (targetList) {
                targetList.classList.add('show');
                targetList.querySelectorAll('.r-up').forEach(el => el.classList.add('on'));
            }
        });
    });

    // 13. CONTACT FORM
    const cForm   = document.getElementById('contactForm');
    const oForm   = document.getElementById('otpForm');
    const sentEl  = document.getElementById('otpSentEmail');
    const backBtn = document.getElementById('backToFormBtn');
    let otpCode = null, payload = null;

    if (typeof emailjs !== 'undefined') {
        emailjs.init("8WICibyAmSJJPRE7l");
    }

    if (cForm && oForm) {
        cForm.addEventListener('submit', async e => {
            e.preventDefault();
            const submitBtn = cForm.querySelector('[type=submit]');
            const orig = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const name    = document.getElementById('name').value;
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value;

            otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            payload = { name, email, message };

            try {
                await emailjs.send("service_hsy4kz2", "template_kkcx5ol", { to_email: email, otp_code: otpCode });
                if (sentEl) sentEl.textContent = email;
                cForm.style.display = 'none';
                oForm.style.display = 'block';
                document.getElementById('otpCode').value = '';
            } catch (err) {
                alert('Verification email could not be sent. Please try again.');
            } finally {
                submitBtn.innerHTML = orig;
                submitBtn.disabled = false;
            }
        });

        oForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = oForm.querySelector('[type=submit]');
            const codeInput = document.getElementById('otpCode').value;

            if (codeInput !== otpCode) {
                submitBtn.textContent = '❌ Invalid Code';
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Verify & Send</span> <i class="fas fa-check-circle"></i>';
                }, 1500);
                return;
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            fetch('https://formsubmit.co/ajax/vinss37926@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ ...payload, _subject: `Portfolio message from ${payload.name}` })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert('Message received successfully! I will respond promptly.');
                    cForm.reset();
                    oForm.reset();
                    otpCode = null;
                    payload = null;
                    oForm.style.display = 'none';
                    cForm.style.display = 'block';
                }
            })
            .catch(() => alert('Network error submitting message.'))
            .finally(() => {
                submitBtn.innerHTML = '<span>Verify & Send</span> <i class="fas fa-check-circle"></i>';
                submitBtn.disabled = false;
            });
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                oForm.style.display = 'none';
                cForm.style.display = 'block';
            });
        }
    }
});
