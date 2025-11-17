// Function to start the decision-making process
function startDecision() {
    // Show loading animation
    const button = document.querySelector('.cta-button');
    const originalText = button.innerHTML;

    button.innerHTML = 'Memulai...';
    button.disabled = true;
    button.style.opacity = '0.7';

    // Simulate loading and redirect to AHP page
    setTimeout(() => {
        window.location.href = '/page1';
    }, 800);
}

// Add smooth scroll behavior for better UX
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('.method-section, .criteria-section, .flow-section, .cta-section, .info-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add hover effect to criteria cards
    const criteriaCards = document.querySelectorAll('.criteria-card');
    criteriaCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add counter animation to step numbers
    animateStepNumbers();

    // Add parallax effect to hero header
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroHeader = document.querySelector('.hero-header');
        if (heroHeader) {
            heroHeader.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        // Press Enter on CTA button
        if (e.key === 'Enter' && document.activeElement.classList.contains('cta-button')) {
            startDecision();
        }
    });

    // Add tooltip information (optional enhancement)
    addTooltips();

    console.log('Landing page initialized successfully');
});

/**
 * Animate step numbers with counting effect
 */
function animateStepNumbers() {
    const stepNumbers = document.querySelectorAll('.step-number');

    stepNumbers.forEach((stepNumber, index) => {
        const targetNumber = index + 1;
        let currentNumber = 0;
        const duration = 1000; // 1 second
        const interval = duration / targetNumber;

        const counter = setInterval(() => {
            currentNumber++;
            stepNumber.textContent = currentNumber;

            if (currentNumber >= targetNumber) {
                clearInterval(counter);
            }
        }, interval);
    });
}

/**
 * Add tooltips to badges for additional information
 */
function addTooltips() {
    const benefitBadges = document.querySelectorAll('.badge-benefit');
    const costBadges = document.querySelectorAll('.badge-cost');

    benefitBadges.forEach(badge => {
        badge.title = 'Kriteria Benefit: Nilai lebih tinggi lebih baik';
    });

    costBadges.forEach(badge => {
        badge.title = 'Kriteria Cost: Nilai lebih rendah lebih baik';
    });
}

/**
 * Handle button keyboard accessibility
 */
document.addEventListener('DOMContentLoaded', function () {
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        // Make button keyboard accessible
        ctaButton.setAttribute('tabindex', '0');
        ctaButton.setAttribute('role', 'button');
        ctaButton.setAttribute('aria-label', 'Mulai proses analisis pemilihan SSD NVMe');

        // Handle keyboard events
        ctaButton.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startDecision();
            }
        });
    }
});

/**
 * Add dynamic year to footer (if needed)
 */
function updateFooterYear() {
    const footer = document.querySelector('.footer');
    if (footer) {
        const currentYear = new Date().getFullYear();
        const yearElement = document.createElement('p');
        yearElement.className = 'footer-note';
        yearElement.textContent = `© ${currentYear} - All Rights Reserved`;
        yearElement.style.marginTop = '10px';
        footer.appendChild(yearElement);
    }
}

// Call footer update on load
document.addEventListener('DOMContentLoaded', updateFooterYear);

/**
 * Add loading screen effect
 */
function showLoadingScreen() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-screen';
    loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Memuat halaman AHP...</p>
        </div>
    `;

    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 126, 234, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loading-content {
            text-align: center;
            color: white;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-content p {
            font-size: 1.2em;
            font-weight: 500;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(loadingDiv);
}

/**
 * Prevent multiple clicks on CTA button
 */
let isNavigating = false;

document.addEventListener('DOMContentLoaded', function () {
    const ctaButton = document.querySelector('.cta-button');

    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            if (isNavigating) {
                e.preventDefault();
                return;
            }
            isNavigating = true;
        });
    }
});

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startDecision,
        animateStepNumbers,
        addTooltips
    };
}