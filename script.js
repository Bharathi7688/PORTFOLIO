(function () {
    // Wait for DOM to load before running any DOM-dependent code
    document.addEventListener('DOMContentLoaded', () => {
        // Control buttons
        [...document.querySelectorAll(".control")].forEach(button => {
            button.addEventListener("click", function() {
                document.querySelector(".active-btn")?.classList.remove("active-btn");
                this.classList.add("active-btn");
                document.querySelector(".active")?.classList.remove("active");
                document.getElementById(button.dataset.id)?.classList.add("active");
            });
        });

       

        // Theme button toggle
        const themeBtn = document.querySelector(".theme-btn");
        if (!themeBtn) {
            console.error("Theme button not found in the DOM. Ensure '.theme-btn' exists in your HTML.");
            return;
        }

        const sunIcon = themeBtn.querySelector(".fa-sun");
        const moonIcon = themeBtn.querySelector(".fa-moon");
        if (!sunIcon || !moonIcon) {
            console.error("Sun or Moon icon not found inside '.theme-btn'. Check Font Awesome classes.");
            return;
        }

        // Initial state (dark mode default)
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

        // Typed.js animation
        if (document.querySelector("#text")) {
            new Typed("#text", {
                strings: ["Web Developer!", "Software Developer"],
                typeSpeed: 100,
                backSpeed: 100,
                backDelay: 1000,
                loop: true,
            });
        } else {
            console.warn("Element with ID 'text' not found for Typed.js animation.");
        }

        // Tool card observer
        const tools = document.querySelectorAll('.tool-card');
        if (tools.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate');
                        }, index * 150);
                    }
                });
            }, { threshold: 0.3 });

            tools.forEach(tool => observer.observe(tool));
        }

        // Download buttons
        document.querySelectorAll('.main-btn').forEach(button => {
            button.addEventListener('click', function() {
                const originalText = this.querySelector('.btn-text').textContent;
                this.querySelector('.btn-text').textContent = 'Downloading...';
                setTimeout(() => {
                    this.querySelector('.btn-text').textContent = originalText;
                }, 2000);
                // Let the browser handle the download naturally via the <a> tag's download attribute
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const form = e.target;
                const successMessage = document.querySelector('.success-message');
                const errorMessage = document.querySelector('.error-message');

                // Reset messages
                successMessage.style.display = 'none';
                successMessage.classList.remove('visible');
                errorMessage.style.display = 'none';
                errorMessage.classList.remove('visible');

                try {
                    
                    const response = await fetch(form.action || 'FORM_KEY', {
                        method: form.method,
                        body: new FormData(form),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        successMessage.style.display = 'block';
                        setTimeout(() => successMessage.classList.add('visible'), 10);
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (error) {
                    errorMessage.style.display = 'block';
                    setTimeout(() => errorMessage.classList.add('visible'), 10);
                    console.error('Submission error:', error);
                }
            });
        } else {
            console.warn("Contact form with ID 'contact-form' not found.");
        }
    });
})();


function updateFooterTime() {
    const timeElement = document.getElementById('footer-time');
    const now = new Date();
    timeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
  }
  setInterval(updateFooterTime, 1000);
  updateFooterTime();