/* ==========================================================
   VINCENT PORTFOLIO — LUMINOUS HYPER TECH v8 SCRIPT
   Constellation Canvas · 3D Physics Tilt · Magnetic UI · HUD
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SCROLL PROGRESS INDICATOR
    // ==========================================
    let scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) {
        scrollProgress = document.createElement('div');
        scrollProgress.id = 'scroll-progress';
        document.body.prepend(scrollProgress);
    }

    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const percent = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    }, { passive: true });

    // ==========================================
    // 2. LUMINOUS CANVAS PARTICLE NETWORK WITH MOUSE INTERACTION
    // ==========================================
    let canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let mousePos = { x: null, y: null, radius: 160 };

    function resizeCanvas() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('mousemove', e => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mousePos.x = null;
        mousePos.y = null;
    });

    const COLOR_PALETTE = ['#00f0ff', '#8a4bfe', '#ff2a85', '#00f59b', '#ffffff'];

    class Particle {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.75;
            this.vy = (Math.random() - 0.5) * 0.75;
            this.radius = Math.random() * 2.2 + 0.8;
            this.color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
            this.baseAlpha = Math.random() * 0.55 + 0.25;
            this.alpha = this.baseAlpha;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Mouse Repulsion / Attraction
            if (mousePos.x !== null && mousePos.y !== null) {
                const dx = mousePos.x - this.x;
                const dy = mousePos.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mousePos.radius) {
                    const force = (mousePos.radius - dist) / mousePos.radius;
                    this.x -= (dx / dist) * force * 3.5;
                    this.y -= (dy / dist) * force * 3.5;
                    this.alpha = 0.95;
                } else {
                    this.alpha = this.baseAlpha;
                }
            }

            // Boundary Wrap
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        const particleCount = Math.min(Math.floor((W * H) / 10000), 120);
        particles = Array.from({ length: particleCount }, () => new Particle());
    }
    initParticles();

    const CONNECT_DIST = 140;

    function renderConstellation() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECT_DIST) {
                    const opacity = (1 - dist / CONNECT_DIST) * 0.28;
                    ctx.save();
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = '#00f0ff';
                    ctx.lineWidth = 0.8;
                    ctx.shadowColor = '#8a4bfe';
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        renderConstellation();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // ==========================================
    // 3. GLOWING INTERACTIVE CURSOR & TRAIL
    // ==========================================
    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let trailTimer = 0;

    if (dot && ring) {
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';

            trailTimer++;
            if (trailTimer % 2 === 0) {
                spawnLuminousTrail(mouseX, mouseY);
            }
        });

        // Smooth Ring Lerp
        (function loopRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            requestAnimationFrame(loopRing);
        })();

        // Hover Targets
        const hoverTargets = document.querySelectorAll('a, button, input, textarea, .nav-card, .proj-card, .t-item, .cert-item, .c-card, .skill-item, .hero-chip');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hover');
                ring.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hover');
                ring.classList.remove('hover');
            });
        });

        // Click Pulse Burst
        document.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        document.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            neonBurst(mouseX, mouseY);
        });
    }

    function spawnLuminousTrail(x, y) {
        const p = document.createElement('div');
        p.classList.add('trail');
        const size = Math.random() * 6 + 3;
        const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;

        p.style.cssText = `
            left: ${x + offsetX}px;
            top: ${y + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }

    function neonBurst(x, y) {
        const count = 14;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            const angle = (i / count) * Math.PI * 2;
            const dist = 40 + Math.random() * 35;
            const color = COLOR_PALETTE[i % COLOR_PALETTE.length];

            spark.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 12px ${color}, 0 0 24px ${color};
            `;
            document.body.appendChild(spark);

            spark.animate([
                { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 650,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                fill: 'forwards'
            }).onfinish = () => spark.remove();
        }
    }

    // ==========================================
    // 4. LIVE HUD CLOCK IN NAVBAR (MEDAN / WIB UTC+7)
    // ==========================================
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

    // ==========================================
    // 5. NEXT-GEN TYPEWRITER HUD
    // ==========================================
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
        const SPEED_TYPE = 75, SPEED_DEL = 40, PAUSE_END = 1800;

        function runTypewriter() {
            const current = phrases[pIdx];
            if (isDeleting) {
                cIdx--;
                typedEl.textContent = current.substring(0, cIdx);
                if (cIdx === 0) {
                    isDeleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                    setTimeout(runTypewriter, 300);
                    return;
                }
                setTimeout(runTypewriter, SPEED_DEL);
            } else {
                cIdx++;
                typedEl.textContent = current.substring(0, cIdx);
                if (cIdx === current.length) {
                    isDeleting = true;
                    setTimeout(runTypewriter, PAUSE_END);
                    return;
                }
                setTimeout(runTypewriter, SPEED_TYPE);
            }
        }
        setTimeout(runTypewriter, 600);
    }

    // ==========================================
    // 6. 3D PERSPECTIVE CARD TILT WITH DYNAMIC GLARE
    // ==========================================
    function setupCardTilt(cards, maxTilt = 12) {
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = -((y - centerY) / centerY) * maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
                card.style.transition = 'box-shadow 0.1s, border-color 0.1s';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    setupCardTilt(document.querySelectorAll('.nav-card'), 10);
    setupCardTilt(document.querySelectorAll('.proj-card'), 8);
    setupCardTilt(document.querySelectorAll('.skill-item'), 12);
    setupCardTilt(document.querySelectorAll('.cert-item'), 8);

    // ==========================================
    // 7. MAGNETIC BUTTON PHYSICS
    // ==========================================
    function setupMagneticButtons(buttons, factor = 0.35) {
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * factor;
                const dy = (e.clientY - cy) * factor;

                btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
                btn.style.transition = 'transform 0.1s ease';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

    setupMagneticButtons(document.querySelectorAll('.btn'));

    // ==========================================
    // 8. NAVBAR & SCROLL BEHAVIOR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const topBtn = document.getElementById('backToTop');
    const scrollHint = document.getElementById('scrollHint');

    function handleScroll() {
        const y = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', y > 40);
        }
        if (topBtn) {
            topBtn.classList.toggle('show', y > 400);
        }
        if (scrollHint) {
            scrollHint.classList.toggle('gone', y > 80);
        }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Navigation Toggle
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

    // ==========================================
    // 9. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revElements = document.querySelectorAll('.r-up, .r-left, .r-right');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('on');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });

        revElements.forEach(el => obs.observe(el));
    }
    // Fail-safe immediate reveal
    setTimeout(() => {
        revElements.forEach(el => el.classList.add('on'));
    }, 150);

    // ==========================================
    // 10. STAT COUNTER ANIMATION
    // ==========================================
    const counts = document.querySelectorAll('.count[data-n]');
    let hasCounted = false;
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !hasCounted) {
                hasCounted = true;
                counts.forEach(el => {
                    const target = +el.dataset.n;
                    let current = 0;
                    const step = target / (1600 / 16);
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            clearInterval(timer);
                            el.textContent = target;
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, 16);
                });
            }
        });
    }, { threshold: 0.4 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // ==========================================
    // 11. SKILL TABS SYSTEM
    // ==========================================
    document.querySelectorAll('.sk-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sk-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sk-panel').forEach(p => p.classList.remove('show'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) {
                targetPanel.classList.add('show');
                targetPanel.querySelectorAll('.r-up').forEach((el, i) => {
                    el.classList.remove('on');
                    setTimeout(() => el.classList.add('on'), i * 50);
                });
                setupCardTilt(targetPanel.querySelectorAll('.skill-item'), 12);
            }
        });
    });

    // ==========================================
    // 12. PROJECT FILTER SYSTEM
    // ==========================================
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

    // ==========================================
    // 13. EXPERIENCE TABS SYSTEM
    // ==========================================
    document.querySelectorAll('.ex-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.t-list').forEach(l => l.classList.remove('show'));

            tab.classList.add('active');
            const targetList = document.getElementById(tab.dataset.exp);
            if (targetList) {
                targetList.classList.add('show');
                targetList.querySelectorAll('.r-up').forEach((el, i) => {
                    el.classList.remove('on');
                    setTimeout(() => el.classList.add('on'), i * 70);
                });
            }
        });
    });

    // ==========================================
    // 14. CONTACT FORM & OTP VERIFICATION
    // ==========================================
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
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking server...';
            submitBtn.disabled = true;

            const name    = document.getElementById('name').value;
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Invalid email format.');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                return;
            }

            const disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org', 'yopmail.com'];
            if (disposableDomains.includes(email.split('@')[1])) {
                alert('Disposable email address is not allowed.');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                return;
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching verification code...';
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
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                }, 1000);
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

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting message...';
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
                    setTimeout(() => {
                        oForm.style.display = 'none';
                        cForm.style.display = 'block';
                    }, 1000);
                }
            })
            .catch(() => alert('Network error submitting message.'))
            .finally(() => {
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Verify & Send</span> <i class="fas fa-check-circle"></i>';
                    submitBtn.disabled = false;
                }, 1500);
            });
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                oForm.style.display = 'none';
                cForm.style.display = 'block';
                otpCode = null;
                payload = null;
            });
        }
    }

    // Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
