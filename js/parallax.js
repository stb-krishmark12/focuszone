// Parallax effect handler
// Will be implemented in later steps 

class ParallaxEffect {
    constructor() {
        // Get all elements that need parallax effect
        this.features = document.querySelectorAll('.feature-item');
        this.lastScrollPosition = window.scrollY;
        this.ticking = false;
        
        // Initialize the effect
        this.init();
    }

    init() {
        // Add initial opacity to features
        this.features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(50px)';
            feature.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        // Add scroll event listener
        window.addEventListener('scroll', () => this.onScroll());
        
        // Initial check for elements in viewport
        this.checkElements();
    }

    onScroll() {
        this.lastScrollPosition = window.scrollY;
        
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.checkElements();
                this.ticking = false;
            });
            
            this.ticking = true;
        }
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Element is considered in viewport when it's top is in the bottom 80% of the screen
        return rect.top <= windowHeight * 0.8;
    }

    checkElements() {
        this.features.forEach(feature => {
            if (this.isElementInViewport(feature)) {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }
        });
    }
}

// Initialize parallax effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        new ParallaxEffect();
    } else {
        // If user prefers reduced motion, show elements without animation
        document.querySelectorAll('.feature-item').forEach(feature => {
            feature.style.opacity = '1';
            feature.style.transform = 'none';
        });
    }
}); 