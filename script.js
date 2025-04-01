(function () {
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
    var typed = new Typed("#text", {
        strings: ["Web Developer!", "Software Developer"],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true,
    });

    // Tool card observer
    document.addEventListener('DOMContentLoaded', () => {
        const tools = document.querySelectorAll('.tool-card');
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
    });

    // Download buttons
    document.querySelectorAll('.main-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const originalText = this.querySelector('.btn-text').textContent;
            this.querySelector('.btn-text').textContent = 'Downloading...';
            setTimeout(() => {
                this.querySelector('.btn-text').textContent = originalText;
            }, 2000);

            fetch(this.getAttribute('href'))
                .then(response => {
                    if (!response.ok) {
                        e.preventDefault();
                        alert('Sorry, the resume file is not available at the moment.');
                    }
                })
                .catch(() => {
                    e.preventDefault();
                    alert('Error connecting to download the resume.');
                });
        });
    });
})();