(function () {
    [...document.querySelectorAll(".control")].forEach(button => {
        button.addEventListener("click", function() {
            document.querySelector(".active-btn").classList.remove("active-btn");
            this.classList.add("active-btn");
            document.querySelector(".active").classList.remove("active");
            document.getElementById(button.dataset.id).classList.add("active");
        })
    });
    document.querySelector(".theme-btn").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    })
})();

var typed = new Typed("#text",{
    strings: ["Web Developer!","Software Developer"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
});


document.addEventListener('DOMContentLoaded', () => {
    const tools = document.querySelectorAll('.tool-card');
    
    // Intersection Observer for slide-in animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150); // Staggered entrance
            }
        });
    }, {
        threshold: 0.3
    });

    tools.forEach(tool => {
        observer.observe(tool);
    });
});


// Add this after your existing JavaScript code
document.querySelectorAll('.main-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Optional: Show a downloading message
        const originalText = this.querySelector('.btn-text').textContent;
        this.querySelector('.btn-text').textContent = 'Downloading...';
        
        // Simulate download process (optional)
        setTimeout(() => {
            this.querySelector('.btn-text').textContent = originalText;
        }, 2000); // Reset text after 2 seconds

        // If you want to check if the file exists first (requires server-side support):
        fetch(this.getAttribute('href'))
            .then(response => {
                if (!response.ok) {
                    e.preventDefault(); // Prevent download if file not found
                    alert('Sorry, the resume file is not available at the moment.');
                }
            })
            .catch(() => {
                e.preventDefault();
                alert('Error connecting to download the resume.');
            });
    });
});



