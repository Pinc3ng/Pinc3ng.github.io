/* ==========================================
   VINCENT PORTFOLIO — HYPER v7 SCRIPT
   Particles · Typewriter · 3D Tilt · Magnetic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // SCROLL PROGRESS BAR
    // ==========================================
    const scrollBar = document.createElement('div');
    scrollBar.id = 'scroll-bar';
    document.body.prepend(scrollBar);

    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollBar.style.width = pct + '%';
    }, { passive: true });

    // ==========================================
    // PARTICLE CANVAS BACKGROUND
    // ==========================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resizeCanvas() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    const COLORS = ['#7c3aed', '#a78bfa', '#06b6d4', '#67e8f9', '#ec4899'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - .5) * 0.5;
            this.vy = (Math.random() - .5) * 0.5;
            this.r  = Math.random() * 1.8 + 0.5;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -5 || this.x > W+5 || this.y < -5 || this.y > H+5) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor(W * H / 12000), 100);
        particles = Array.from({ length: count }, () => new Particle());
    }
    initParticles();

    const MAX_DIST = 130;

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < MAX_DIST) {
                    const alpha = (1 - dist / MAX_DIST) * 0.18;
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = '#7c3aed';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    let animId;
    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // CURSOR
    // ==========================================
    const dot  = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');

    let mx = 0, my = 0, rx = 0, ry = 0;
    let trailCount = 0;

    if (dot && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
            trailCount++;
            if (trailCount % 3 === 0) spawnTrail(mx, my);
        });

        (function trackRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(trackRing);
        })();

        document.querySelectorAll('a, button, input, textarea, .nav-card, .proj-card, .t-item, .cert-item, .c-card, .skill-item').forEach(el => {
            el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
        });

        document.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(0.6)';
        });
        document.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(1)';
            clickBurst(mx, my);
        });
    }

    // Trail
    const TC = ['#7c3aed','#a78bfa','#06b6d4','#67e8f9','#ec4899'];
    function spawnTrail(x, y) {
        const p = document.createElement('div');
        p.classList.add('trail');
        const sz = Math.random() * 5 + 2;
        const ox = (Math.random() - .5) * 10;
        const oy = (Math.random() - .5) * 10;
        const c  = TC[Math.floor(Math.random() * TC.length)];
        p.style.cssText = `left:${x+ox}px;top:${y+oy}px;width:${sz}px;height:${sz}px;background:${c};box-shadow:0 0 6px ${c};`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 650);
    }

    // Click burst
    const BC = ['#7c3aed','#06b6d4','#ec4899','#a78bfa','#67e8f9'];
    function clickBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            const angle = (i / 12) * Math.PI * 2;
            const d = 35 + Math.random() * 30;
            const c = BC[i % BC.length];
            p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:6px;height:6px;background:${c};border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 10px ${c},0 0 20px ${c};`;
            document.body.appendChild(p);
            p.animate([
                { transform: 'translate(-50%,-50%) scale(1.2)', opacity: 0.9 },
                { transform: `translate(calc(-50% + ${Math.cos(angle)*d}px), calc(-50% + ${Math.sin(angle)*d}px)) scale(0)`, opacity: 0 }
            ], { duration: 650, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' })
            .onfinish = () => p.remove();
        }
    }

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    const typedEl = document.querySelector('.hero-typed');
    if (typedEl) {
        const words = ['Full Stack Dev', 'Web Developer', 'UI/UX Enthusiast', 'Problem Solver', 'CS Student'];
        let wordIdx = 0, charIdx = 0, deleting = false;
        const DELAY_TYPE = 85, DELAY_DEL = 45, DELAY_PAUSE = 1800;

        function typeWord() {
            const word = words[wordIdx];
            if (deleting) {
                charIdx--;
                typedEl.textContent = word.substring(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    wordIdx = (wordIdx + 1) % words.length;
                    setTimeout(typeWord, 320);
                    return;
                }
                setTimeout(typeWord, DELAY_DEL);
            } else {
                charIdx++;
                typedEl.textContent = word.substring(0, charIdx);
                if (charIdx === word.length) {
                    deleting = true;
                    setTimeout(typeWord, DELAY_PAUSE);
                    return;
                }
                setTimeout(typeWord, DELAY_TYPE);
            }
        }
        setTimeout(typeWord, 800);
    }

    // ==========================================
    // 3D CARD TILT
    // ==========================================
    function applyTilt(cards, intensity = 12) {
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                const rotX = -dy * intensity;
                const rotY = dx * intensity;
                card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
                card.style.transition = 'box-shadow .1s, border-color .1s';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all .4s cubic-bezier(0.16,1,0.3,1)';
            });
        });
    }
    applyTilt(document.querySelectorAll('.nav-card'), 10);
    applyTilt(document.querySelectorAll('.proj-card'), 8);
    applyTilt(document.querySelectorAll('.cert-item'), 8);
    applyTilt(document.querySelectorAll('.skill-item'), 12);

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    function applyMagnetic(btns, strength = 0.4) {
        btns.forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * strength;
                const dy = (e.clientY - cy) * strength;
                btn.style.transform = `translate(${dx}px, ${dy}px)`;
                btn.style.transition = 'transform .1s ease';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'all .4s cubic-bezier(0.16,1,0.3,1)';
            });
        });
    }
    applyMagnetic(document.querySelectorAll('.btn'));

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar = document.getElementById('navbar');
    const topBtn = document.getElementById('backToTop');
    const scrollHint = document.getElementById('scrollHint');

    function updateNavbar() {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 40);
        if (topBtn) topBtn.classList.toggle('show', y > 500);
        if (scrollHint) scrollHint.classList.toggle('gone', y > 80);
    }
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile nav
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => { toggle.classList.toggle('open'); menu.classList.toggle('open'); });
        menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('open'); menu.classList.remove('open'); }));
    }

    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    const revEls = document.querySelectorAll('.r-up, .r-left, .r-right');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } });
        }, { threshold: 0.01, rootMargin: '60px 0px 60px 0px' });
        revEls.forEach(el => obs.observe(el));
    }
    function revealAll() { revEls.forEach(el => el.classList.add('on')); }
    revealAll();
    setTimeout(revealAll, 150);
    window.addEventListener('load', revealAll);

    // ==========================================
    // STAT COUNTER
    // ==========================================
    const counts = document.querySelectorAll('.count[data-n]');
    let counted = false;
    const statsObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !counted) {
                counted = true;
                counts.forEach(el => {
                    const target = +el.dataset.n;
                    let cur = 0;
                    const step = target / (1800 / 16);
                    const t = setInterval(() => {
                        cur += step;
                        el.textContent = Math.floor(cur >= target ? (clearInterval(t), target) : cur);
                    }, 16);
                });
            }
        });
    }, { threshold: .5 });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObs.observe(heroStats);

    // ==========================================
    // SKILL TABS
    // ==========================================
    document.querySelectorAll('.sk-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sk-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sk-panel').forEach(p => p.classList.remove('show'));
            tab.classList.add('active');
            const panel = document.getElementById(tab.dataset.tab);
            if (panel) {
                panel.classList.add('show');
                panel.querySelectorAll('.r-up').forEach((el, i) => {
                    el.classList.remove('on');
                    setTimeout(() => el.classList.add('on'), i * 55);
                });
                // Re-apply tilt to newly shown items
                applyTilt(panel.querySelectorAll('.skill-item'), 12);
            }
        });
    });

    // ==========================================
    // PROJECT FILTER
    // ==========================================
    document.querySelectorAll('.f-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.f;
            document.querySelectorAll('.proj-card').forEach(c => {
                (f === 'all' || c.dataset.cat === f) ? c.classList.remove('hidden') : c.classList.add('hidden');
            });
        });
    });

    // ==========================================
    // EXPERIENCE TABS
    // ==========================================
    document.querySelectorAll('.ex-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.ex-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.t-list').forEach(l => l.classList.remove('show'));
            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.exp);
            if (target) {
                target.classList.add('show');
                target.querySelectorAll('.r-up').forEach((el, i) => { el.classList.remove('on'); setTimeout(() => el.classList.add('on'), i * 75); });
            }
        });
    });

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const cForm  = document.getElementById('contactForm');
    const oForm  = document.getElementById('otpForm');
    const sentEl = document.getElementById('otpSentEmail');
    const backBtn = document.getElementById('backToFormBtn');
    let otp = null, pending = null;

    if (typeof emailjs !== 'undefined') emailjs.init("8WICibyAmSJJPRE7l");

    if (cForm && oForm) {
        cForm.addEventListener('submit', async e => {
            e.preventDefault();
            const btn = cForm.querySelector('[type=submit]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
            btn.disabled = true;

            const name    = document.getElementById('name').value;
            const email   = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value;

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Invalid email format.'); btn.innerHTML = orig; btn.disabled = false; return;
            }

            const disposable = ['mailinator.com','10minutemail.com','tempmail.com','temp-mail.org','yopmail.com'];
            if (disposable.includes(email.split('@')[1])) {
                alert('Disposable email not allowed.'); btn.innerHTML = orig; btn.disabled = false; return;
            }

            try {
                const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${email.split('@')[1]}&type=MX`, { headers: { accept: 'application/dns-json' } });
                const d = await res.json();
                if (!d.Answer?.length) { alert('Email domain has no mail server.'); btn.innerHTML = orig; btn.disabled = false; return; }
            } catch {}

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending code...';
            otp = Math.floor(100000 + Math.random() * 900000).toString();
            pending = { name, email, message };

            try {
                await emailjs.send("service_hsy4kz2","template_kkcx5ol",{ to_email: email, otp_code: otp });
                if (sentEl) sentEl.textContent = email;
                cForm.style.display = 'none';
                oForm.style.display = 'block';
                document.getElementById('otpCode').value = '';
            } catch {
                alert('Failed to send verification email.');
            } finally {
                setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 1500);
            }
        });

        oForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = oForm.querySelector('[type=submit]');
            const code = document.getElementById('otpCode').value;
            if (code !== otp) { btn.textContent = 'Wrong code'; setTimeout(() => btn.innerHTML = '<span>Verify & Send</span><i class="fas fa-check-circle"></i>', 1500); return; }
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            fetch('https://formsubmit.co/ajax/vinss37926@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ ...pending, _subject: `Portfolio contact from ${pending.name}` })
            })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    alert('Message sent successfully!');
                    cForm.reset(); oForm.reset(); otp = null; pending = null;
                    setTimeout(() => { oForm.style.display = 'none'; cForm.style.display = 'block'; }, 1000);
                }
            })
            .catch(() => alert('Failed to send message.'))
            .finally(() => { setTimeout(() => { btn.innerHTML = '<span>Verify & Send</span><i class="fas fa-check-circle"></i>'; btn.disabled = false; }, 1500); });
        });

        if (backBtn) backBtn.addEventListener('click', () => { oForm.style.display = 'none'; cForm.style.display = 'block'; otp = null; pending = null; });
    }

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const el = document.querySelector(a.getAttribute('href'));
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

});
