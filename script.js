/* ==========================================
   VINCENT PORTFOLIO — MINIMAL SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

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
            if (trailCount % 4 === 0) spawnTrail(mx, my);
        });

        (function trackRing() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(trackRing);
        })();

        // hover state
        document.querySelectorAll('a, button, input, textarea, .nav-card, .proj-card, .t-item, .cert-item, .c-card, .skill-item').forEach(el => {
            el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
            el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
        });

        // click effect
        document.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(0.65)';
        });
        document.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%,-50%) scale(1)';
            clickBurst(mx, my);
        });
    }

    // Trail
    const grays = ['#fff','#ccc','#aaa','#888','#666'];
    function spawnTrail(x, y) {
        const p = document.createElement('div');
        p.classList.add('trail');
        const sz = Math.random() * 5 + 2;
        const ox = (Math.random() - .5) * 8;
        const oy = (Math.random() - .5) * 8;
        const c  = grays[Math.floor(Math.random() * grays.length)];
        p.style.cssText = `left:${x+ox}px;top:${y+oy}px;width:${sz}px;height:${sz}px;background:${c};`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }

    // Click burst
    function clickBurst(x, y) {
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const d = 30 + Math.random() * 25;
            p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:5px;height:5px;
                background:#fff;border-radius:50%;pointer-events:none;z-index:99999;
                transform:translate(-50%,-50%);`;
            document.body.appendChild(p);
            p.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: .7 },
                { transform: `translate(calc(-50% + ${Math.cos(angle)*d}px), calc(-50% + ${Math.sin(angle)*d}px)) scale(0)`, opacity: 0 }
            ], { duration: 500, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' })
            .onfinish = () => p.remove();
        }
    }

    // ==========================================
    // NAVBAR
    // ==========================================
    const navbar  = document.getElementById('navbar');
    const topBtn  = document.getElementById('backToTop');
    const scrollHint = document.getElementById('scrollHint');

    function updateNavbar() {
        const y = window.scrollY;
        if (navbar) {
            if (y > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (topBtn) { y > 500 ? topBtn.classList.add('show') : topBtn.classList.remove('show'); }
        if (scrollHint) { y > 80 ? scrollHint.classList.add('gone') : scrollHint.classList.remove('gone'); }
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile nav
    const toggle = document.getElementById('navToggle');
    const menu   = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            menu.classList.toggle('open');
        });
        menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
            toggle.classList.remove('open');
            menu.classList.remove('open');
        }));
    }

    // ==========================================
    // SCROLL REVEAL
    // ==========================================
    const revEls = document.querySelectorAll('.r-up, .r-left, .r-right');
    const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); revObs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revEls.forEach(el => revObs.observe(el));

    // Initial above-fold reveal
    setTimeout(() => {
        revEls.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('on');
        });
    }, 80);

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
                    setTimeout(() => el.classList.add('on'), i * 60);
                });
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
                target.querySelectorAll('.r-up').forEach((el, i) => {
                    el.classList.remove('on');
                    setTimeout(() => el.classList.add('on'), i * 80);
                });
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

    // ==========================================

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const el = document.querySelector(a.getAttribute('href'));
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

});
