// --- 1. TYPING EFFECT (Only runs if element exists) ---
const textElement = document.getElementById('typing-text');
if (textElement) {
    const phrases = ["// initializing_logic...", "// executing_vision...", "// compiling_dreams..."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            textElement.innerText = currentPhrase.substring(0, charIndex--);
        } else {
            textElement.innerText = currentPhrase.substring(0, charIndex++);
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        setTimeout(typeEffect, typeSpeed);
    }
    document.addEventListener('DOMContentLoaded', typeEffect);
}

// --- 2. SCROLL REVEAL ANIMATION (Global) ---
const revealElements = document.querySelectorAll('.reveal');
function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// --- 3. STATS COUNTER (Only runs if element exists) ---
const stats = document.querySelectorAll('.stat-number');
if (stats.length > 0) {
    let hasAnimatedStats = false;
    function animateStats() {
        // Find a parent section to trigger the animation
        const section = stats[0].closest('.section');
        // Safety check if section exists
        if (!section) return;

        const triggerPoint = section.getBoundingClientRect().top;
        
        if (triggerPoint < window.innerHeight && !hasAnimatedStats) {
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const increment = target / 100;
                let current = 0;
                const updateCount = () => {
                    current += increment;
                    if(current < target) {
                        stat.innerText = Math.ceil(current);
                        setTimeout(updateCount, 20);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCount();
            });
            hasAnimatedStats = true;
        }
    }
    window.addEventListener('scroll', animateStats);
}

// --- 4. FAQ ACCORDION ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if(question){
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    }
});

// --- 5. CONTACT FORM HANDLING (Sends Email via Web3Forms) ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page reload
        
        const btn = this.querySelector('button');
        const originalText = btn.innerText;
        
        // 1. Change button to loading state
        btn.innerText = "TRANSMITTING...";
        btn.style.opacity = "0.7";

        // 2. Prepare the data
        const formData = new FormData(this);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // 3. Send data to Web3Forms API
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                // Success!
                btn.innerText = "DATA TRANSMITTED ✓";
                btn.style.background = "var(--primary)";
                btn.style.color = "var(--bg)"; // Black text on Green button
                contactForm.reset(); // Clear the form fields
            } else {
                // Error from server
                console.log(response);
                btn.innerText = "TRANSMISSION FAILED ⚠";
                btn.style.background = "red";
                btn.style.color = "white";
            }
        })
        .catch(error => {
            console.log(error);
            btn.innerText = "ERROR ⚠";
            btn.style.background = "red";
        })
        .finally(() => {
            // Reset button after 4 seconds
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "transparent";
                btn.style.color = "var(--primary)";
                btn.style.opacity = "1";
            }, 4000);
        });
    });
}