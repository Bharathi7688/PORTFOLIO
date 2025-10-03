(function () {
    document.addEventListener('DOMContentLoaded', () => {
        // Control buttons for section navigation
        [...document.querySelectorAll(".control")].forEach(button => {
            button.addEventListener("click", function() {
                document.querySelector(".active-btn")?.classList.remove("active-btn");
                this.classList.add("active-btn");
                document.querySelector(".active")?.classList.remove("active");
                const targetSection = document.getElementById(button.dataset.id);
                if (targetSection) {
                    targetSection.classList.add("active");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    console.warn(`Section with ID ${button.dataset.id} not found.`);
                }
            });
        });
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            let tooltip;
            el.addEventListener('mouseenter', function(e) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = el.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            // Position tooltip initially
            const rect = el.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
            tooltip.style.zIndex = 1000;
            tooltip.classList.add('visible');
            });
            el.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
            });
            el.addEventListener('mousemove', function(e) {
            if (tooltip) {
                tooltip.style.left = `${e.clientX - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${e.clientY - tooltip.offsetHeight - 12}px`;
            }
            });
        });

        

        // Tooltip styles
        if (!document.querySelector('style[data-tooltip-style]')) {
            const style = document.createElement('style');
            style.setAttribute('data-tooltip-style', '');
            style.textContent = `
                .custom-tooltip {
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    background: var(--color-secondary, #222);
                    color: #fff;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 0.95em;
                    position: fixed;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .custom-tooltip.visible {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // Theme button toggle
        const themeBtn = document.querySelector(".theme-btn");
        if (!themeBtn) {
            console.error("Theme button not found in the DOM.");
            return;
        }

        const sunIcon = themeBtn.querySelector(".fa-sun");
        const moonIcon = themeBtn.querySelector(".fa-moon");
        if (!sunIcon || !moonIcon) {
            console.error("Sun or Moon icon not found inside '.theme-btn'.");
            return;
        }

        // Initial theme state (dark mode default)
        if (document.body.classList.contains("light-mode")) {
            sunIcon.classList.remove("active-icon");
            moonIcon.classList.add("active-icon");
        } else {
            sunIcon.classList.add("active-icon");
            moonIcon.classList.remove("active-icon");
        }

        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            if (document.body.classList.contains("light-mode")) {
                sunIcon.classList.remove("active-icon");
                moonIcon.classList.add("active-icon");
            } else {
                sunIcon.classList.add("active-icon");
                moonIcon.classList.remove("active-icon");
            }
        });

        // Typed.js animation for role text
        if (typeof Typed !== 'undefined' && document.querySelector("#text")) {
            new Typed("#text", {
                strings: ["Web Developer!", "Software Developer"],
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
                loop: true,
            });
        } else {
            console.warn("Typed.js not loaded or element with ID 'text' not found.");
        }

        // Tool card animation with IntersectionObserver
        const tools = document.querySelectorAll('.tool-card');
        if (tools.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            tools.forEach(tool => observer.observe(tool));
        }

        // 3D text animation control with IntersectionObserver
        const animatedElements = document.querySelectorAll('.right-header > *');
        if (animatedElements.length > 0) {
            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
                });
            }, { threshold: 0.1 });

            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
                textObserver.observe(el);
            });
        }

        // Download buttons
        document.querySelectorAll('.main-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const originalText = this.querySelector('.btn-text')?.textContent || 'Download CV';
                this.querySelector('.btn-text').textContent = 'Downloading...';
                setTimeout(() => {
                    this.querySelector('.btn-text').textContent = originalText;
                }, 2000);
                if (this.href) {
                    window.location.href = this.href;
                }
            });
        });

        // Contact form submission with real-time validation
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            contactForm.addEventListener('input', (e) => {
                const input = e.target;
                if (input.validity.valid) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
                submitBtn.disabled = !contactForm.checkValidity();
            });

            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const form = e.target;
                const successMessage = document.querySelector('.success-message');
                const errorMessage = document.querySelector('.error-message');

                if (successMessage && errorMessage) {
                    successMessage.style.display = 'none';
                    successMessage.classList.remove('visible');
                    errorMessage.style.display = 'none';
                    errorMessage.classList.remove('visible');
                }

                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: new FormData(form),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            setTimeout(() => successMessage.classList.add('visible'), 10);
                        }
                        form.reset();
                        submitBtn.disabled = true;
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    if (errorMessage) {
                        errorMessage.style.display = 'block';
                        setTimeout(() => errorMessage.classList.add('visible'), 10);
                    }
                    console.error('Submission error:', error);
                }
            });
        } else {
            console.warn("Contact form with ID 'contact-form' not found.");
        }

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', () => {
                backToTop.classList.toggle('show', window.scrollY > 300);
            });
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Add focus styles for accessibility
        if (!document.querySelector('style[data-focus]')) {
            const style = document.createElement('style');
            style.setAttribute('data-focus', '');
            style.textContent = '*:focus { outline: 2px solid var(--color-secondary); outline-offset: 2px; }';
            document.head.appendChild(style);
        }
    });

    // Update footer time
    function updateFooterTime() {
        const timeElement = document.getElementById('footer-time');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = `Current Time: ${now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' })}`;
        }
    }
    setInterval(updateFooterTime, 1000);
    updateFooterTime();
})();