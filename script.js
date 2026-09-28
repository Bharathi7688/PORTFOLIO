(function () {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    document.addEventListener('DOMContentLoaded', () => {
        // ---------- Footer year ----------
        const year = $('#year');
        if (year) year.textContent = new Date().getFullYear();

        // ---------- Theme toggle ----------
        const root = document.documentElement;
        const metaTheme = $('meta[name="theme-color"]');
        const applyTheme = (theme) => {
            root.setAttribute('data-theme', theme);
            if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#0a0c16');
        };
        applyTheme(root.getAttribute('data-theme') || 'dark');

        $('#theme-toggle')?.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) {}
        });

        // ---------- Mobile menu ----------
        const menuBtn = $('#menu-toggle');
        const navLinks = $('#nav-links');
        const closeMenu = () => {
            navLinks?.classList.remove('open');
            menuBtn?.setAttribute('aria-expanded', 'false');
            menuBtn?.setAttribute('aria-label', 'Open menu');
        };
        menuBtn?.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        $$('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
        document.addEventListener('click', e => {
            if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
        });

        // ---------- Scroll: nav state, progress bar, back-to-top ----------
        const nav = $('#nav');
        const progress = $('.scroll-progress');
        const toTop = $('#to-top');
        let ticking = false;
        const onScroll = () => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            nav?.classList.toggle('scrolled', y > 20);
            if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            toTop?.classList.toggle('show', y > 600);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
        }, { passive: true });
        onScroll();
        toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

        // ---------- Active nav link (scrollspy) ----------
        const sections = $$('main section[id]');
        const linkFor = id => $(`.nav-link[href="#${id}"]`);
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $$('.nav-link.active').forEach(l => l.classList.remove('active'));
                    linkFor(entry.target.id)?.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(s => spy.observe(s));

        // ---------- Reveal on scroll (staggered per parent) ----------
        const revealEls = $$('.reveal');
        const groups = new Map();
        revealEls.forEach(el => {
            const parent = el.parentElement;
            const i = groups.get(parent) || 0;
            el.style.setProperty('--d', `${Math.min(i * 0.08, 0.5)}s`);
            groups.set(parent, i + 1);
        });
        if ('IntersectionObserver' in window && !reduceMotion) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
            revealEls.forEach(el => io.observe(el));
        } else {
            revealEls.forEach(el => el.classList.add('in'));
        }

        // ---------- Typing effect ----------
        const typedEl = $('#typed');
        if (typedEl) {
            const words = [
                'Software Engineer',
                'Full Stack Developer',
                'Angular & .NET Developer',
                'Flutter Mobile Developer',
                'Certified Design Thinker'
            ];
            if (reduceMotion) {
                typedEl.textContent = words[0];
            } else {
                let w = 0, c = 0, deleting = false;
                const tick = () => {
                    const word = words[w];
                    c += deleting ? -1 : 1;
                    typedEl.textContent = word.slice(0, c);
                    let delay = deleting ? 40 : 85;
                    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
                    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
                    setTimeout(tick, delay);
                };
                setTimeout(tick, 600);
            }
        }

        // ---------- Animated counters ----------
        const counters = $$('.stat-num[data-count]');
        const runCounter = el => {
            const target = +el.dataset.count;
            const suffix = el.dataset.suffix || '';
            if (reduceMotion) { el.textContent = target + suffix; return; }
            const start = performance.now();
            const dur = 1600;
            const step = now => {
                const t = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (t < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        const counterIO = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { runCounter(entry.target); counterIO.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(el => counterIO.observe(el));

        // ---------- Project filters ----------
        const filters = $$('.filter');
        const projects = $$('.project');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                const f = btn.dataset.filter;
                projects.forEach(p => {
                    const show = f === 'all' || p.dataset.cat === f;
                    p.classList.toggle('is-hidden', !show);
                    p.classList.remove('pop');
                    if (show) {
                        p.classList.add('in');
                        void p.offsetWidth; // restart animation
                        p.classList.add('pop');
                    }
                });
            });
        });

        // ---------- Pointer effects (desktop only) ----------
        if (finePointer && !reduceMotion) {
            document.body.classList.add('has-pointer');

            const glow = $('.cursor-glow');
            let gx = 0, gy = 0, tx = 0, ty = 0, glowRaf = null;
            const moveGlow = () => {
                gx += (tx - gx) * 0.12;
                gy += (ty - gy) * 0.12;
                glow.style.transform = `translate(${gx - 260}px, ${gy - 260}px)`;
                glowRaf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(moveGlow) : null;
            };
            window.addEventListener('pointermove', e => {
                tx = e.clientX; ty = e.clientY;
                if (glow && !glowRaf) glowRaf = requestAnimationFrame(moveGlow);
            }, { passive: true });

            // 3D tilt + spotlight
            $$('.tilt, .project').forEach(card => {
                card.addEventListener('pointermove', e => {
                    const r = card.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width;
                    const py = (e.clientY - r.top) / r.height;
                    card.style.setProperty('--mx', `${px * 100}%`);
                    card.style.setProperty('--my', `${py * 100}%`);
                    const lift = card.classList.contains('project') ? ' translateY(-8px)' : '';
                    card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)${lift}`;
                });
                card.addEventListener('pointerleave', () => { card.style.transform = ''; });
            });

            // Magnetic buttons
            $$('.magnetic').forEach(btn => {
                btn.addEventListener('pointermove', e => {
                    const r = btn.getBoundingClientRect();
                    const x = e.clientX - r.left - r.width / 2;
                    const y = e.clientY - r.top - r.height / 2;
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
                });
                btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
            });
        }

        // ---------- Toast ----------
        const toast = $('#toast');
        let toastTimer;
        const showToast = msg => {
            if (!toast) return;
            toast.textContent = msg;
            toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
        };

        $$('a[download]').forEach(a => a.addEventListener('click', () => showToast('Downloading resume…')));

        // ---------- Contact form ----------
        const form = $('#contact-form');
        if (form) {
            const status = $('#form-status');
            const submitBtn = form.querySelector('button[type="submit"]');
            const label = submitBtn.querySelector('.btn-label');
            const fields = $$('input, textarea', form);

            const validate = el => {
                const ok = el.checkValidity();
                el.parentElement.classList.toggle('invalid', !ok);
                return ok;
            };
            fields.forEach(el => {
                el.addEventListener('blur', () => validate(el));
                el.addEventListener('input', () => { if (el.parentElement.classList.contains('invalid')) validate(el); });
            });

            const setStatus = (msg, type) => {
                status.textContent = msg;
                status.className = 'form-status' + (type ? ' ' + type : '');
            };

            form.addEventListener('submit', async e => {
                e.preventDefault();
                const allValid = fields.map(validate).every(Boolean);
                if (!allValid) { setStatus('Please fill in all fields correctly.', 'err'); return; }

                const data = new FormData(form);

                // No Formspree ID configured yet — fall back to the visitor's mail client
                if (form.action.includes('your-form-id')) {
                    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
                    window.location.href = `mailto:bharathiraj7688@gmail.com?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
                    setStatus('Opening your email app…', 'ok');
                    return;
                }

                submitBtn.classList.add('loading');
                label.textContent = 'Sending…';
                setStatus('');
                try {
                    const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
                    if (!res.ok) throw new Error(res.statusText);
                    form.reset();
                    setStatus("Thanks! Your message is on its way — I'll reply soon.", 'ok');
                    showToast('Message sent ✓');
                } catch (err) {
                    setStatus('Something went wrong. Please email me directly.', 'err');
                } finally {
                    submitBtn.classList.remove('loading');
                    label.textContent = 'Send message';
                }
            });
        }
    });
})();
