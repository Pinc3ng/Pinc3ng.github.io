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
    // CONTACT FORM & OTP VERIFICATION (FRONTEND ONLY)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const otpForm = document.getElementById('otpForm');
    const otpSentEmail = document.getElementById('otpSentEmail');
    const backToFormBtn = document.getElementById('backToFormBtn');

    // Store data temporarily between steps
    let generatedOtp = null;
    let pendingFormData = null;

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("8WICibyAmSJJPRE7l");
    }

    if (contactForm && otpForm) {
        // Handle contact form submission (Generates and sends OTP)
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking Email...';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value;

            // 1. Basic format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Email',
                    text: 'The email format you entered is incorrect.',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#ef4444'
                });
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                return;
            }

            // 2. Blacklist of temporary/disposable email domains
            const disposableDomains = [
                'mailinator.com', '10minutemail.com', 'tempmail.com', 'temp-mail.org',
                'yopmail.com', 'guerrillamail.com', 'sharklasers.com', 'dispostable.com',
                'getairmail.com', 'maildrop.cc', 'tempmailaddress.com'
            ];
            const domain = email.split('@')[1].toLowerCase();
            if (disposableDomains.includes(domain)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email Unavailable',
                    text: 'Disposable or temporary email addresses are not allowed.',
                    background: '#1a1a1a',
                    color: '#fff',
                    confirmButtonColor: '#ef4444'
                });
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                return;
            }

            // 3. DNS MX Record check (checks if domain actually has mail servers)
            try {
                const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
                    headers: { 'accept': 'application/dns-json' }
                });
                const dnsData = await dnsResponse.json();

                if (!dnsData.Answer || dnsData.Answer.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Email Unavailable',
                        text: 'The email domain is not registered or cannot receive messages.',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#ef4444'
                    });
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    return;
                }
            } catch (error) {
                console.warn('DNS validation failed, bypassing to prevent blocking users:', error);
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Code...';

            // Generate 6-digit OTP locally
            generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            // Save form data for later
            pendingFormData = { name, email, message };

            // Send OTP via EmailJS
            emailjs.send("service_hsy4kz2", "template_kkcx5ol", {
                to_email: email,
                otp_code: generatedOtp
            })
                .then(function (response) {
                    console.log("EmailJS Success:", response.status, response.text);
                    if (otpSentEmail) {
                        otpSentEmail.textContent = email;
                    }

                    // Switch to OTP form
                    contactForm.style.display = 'none';
                    otpForm.style.display = 'block';
                    document.getElementById('otpCode').value = '';

                    Swal.fire({
                        icon: 'success',
                        title: 'Code Sent!',
                        text: 'Please check your email for the 6-digit verification code.',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#6366f1'
                    });
                }, function (error) {
                    console.error("EmailJS Error:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to send verification email. Please try again.',
                        background: '#1a1a1a',
                        color: '#fff',
                        confirmButtonColor: '#6366f1'
                    });
                    submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
                    submitBtn.style.background = '#ef4444';
                })
                .finally(() => {
                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2000);
                });
        });

        // Handle OTP verification and final form submission
        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = otpForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            const otpCode = document.getElementById('otpCode').value;

            if (otpCode !== generatedOtp) {
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Invalid Code';
                submitBtn.style.background = '#ef4444';
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                }, 2000);
                return;
            }

            // OTP matches! Submit data to FormSubmit
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            fetch('https://formsubmit.co/ajax/vinss37926@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: pendingFormData.name,
                    email: pendingFormData.email,
                    message: pendingFormData.message,
                    _subject: `New Portfolio Contact from ${pendingFormData.name}`
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Message Sent!',
                            text: 'Your email has been verified and message delivered successfully.',
                            background: '#1a1a1a',
                            color: '#fff',
                            confirmButtonColor: '#22c55e'
                        });

                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Verified & Sent!';
                        submitBtn.style.background = '#22c55e';

                        // Reset everything
                        contactForm.reset();
                        otpForm.reset();
                        generatedOtp = null;
                        pendingFormData = null;

                        setTimeout(() => {
                            otpForm.style.display = 'none';
                            contactForm.style.display = 'block';
                        }, 2500);
                    } else {
                        throw new Error("FormSubmit failed");
                    }
                })
                .catch(error => {
                    console.error('Error submitting to FormSubmit:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Submission Failed',
                        text: 'Email verified, but failed to deliver the message.',
                        background: '#1a1a1a',
                        color: '#fff'
                    });
                    submitBtn.innerHTML = '<i class="fas fa-times"></i> Error Occurred';
                    submitBtn.style.background = '#ef4444';
                })
                .finally(() => {
                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 2500);
                });
        });

        // Handle back button on OTP form
        if (backToFormBtn) {
            backToFormBtn.addEventListener('click', () => {
                otpForm.style.display = 'none';
                contactForm.style.display = 'block';
                generatedOtp = null;
                pendingFormData = null;
            });
        }
    }

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

    // ==========================================
    // MUSIC PLAYER TOGGLE
    // ==========================================
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (musicToggle && bgMusic) {
        bgMusic.volume = 0.5;

        bgMusic.addEventListener('play', () => {
            musicToggle.classList.add('playing');
        });

        bgMusic.addEventListener('pause', () => {
            musicToggle.classList.remove('playing');
        });

        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().catch(e => console.log('Autoplay prevented', e));
            } else {
                bgMusic.pause();
            }
        });

        // Helper to remove all interaction listeners once music starts
        const removeInteractionListeners = () => {
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('scroll', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
            document.removeEventListener('mousemove', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
        };

        // 1. Try to play immediately on load
        const tryImmediatePlay = () => {
            bgMusic.play()
                .then(() => {
                    console.log('Autoplay succeeded immediately!');
                    removeInteractionListeners();
                })
                .catch((error) => {
                    console.log('Autoplay blocked by browser policy, waiting for first interaction...', error);
                });
        };

        // 2. Fallback: play on first user interaction if blocked
        const startOnInteraction = () => {
            if (bgMusic.paused) {
                bgMusic.play()
                    .then(() => {
                        removeInteractionListeners();
                    })
                    .catch((err) => console.log('Play failed on interaction', err));
            } else {
                removeInteractionListeners();
            }
        };

        // Run the immediate play attempt
        tryImmediatePlay();

        // Register interaction fallbacks (using once: true is not enough if it fails, so we handle removal manually)
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('scroll', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
        document.addEventListener('mousemove', startOnInteraction);
        document.addEventListener('touchstart', startOnInteraction);
    }

});
