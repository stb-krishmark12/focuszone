// Scroll Animation Handler
class ScrollAnimations {
    constructor() {
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.animationClasses = {
            'fade-up': 'animate-fade-up',
            'fade-in': 'animate-fade-in',
            'slide-in': 'animate-slide-in',
            'scale-in': 'animate-scale-in'
        };

        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animate;
                    if (animation && this.animationClasses[animation]) {
                        element.classList.add(this.animationClasses[animation]);
                        this.observer.unobserve(element);
                    }
                }
            });
        }, this.options);

        // Observe all elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
}); 