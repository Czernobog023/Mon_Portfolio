// PORTFOLIO OPTIMISÉ - JavaScript Performant
class PortfolioApp {
    constructor() {
        this.initOnDOMReady();
    }

    initOnDOMReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Performance: Requestanimationframe pour éviter les blocages
        requestAnimationFrame(() => {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupLazyLoading();
            this.setupPerformanceOptimizations();
            this.registerServiceWorker();
        });
    }

    // Navigation SPA optimisée
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        const sections = document.querySelectorAll('.section');
        
        // Cache DOM queries pour performance
        this.cache = { navLinks, sections };
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.showSection(targetId);
            }, { passive: false });
        });

        // Gestion du bouton contact hero
        const heroContactBtn = document.querySelector('.hero-section .btn-secondary');
        if (heroContactBtn) {
            heroContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('#contact');
            }, { passive: false });
        }
    }

    showSection(targetId) {
        // Performance: Utilise transform au lieu de display pour éviter reflow
        this.cache.sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            // Animation GPU-accelerated
            targetSection.style.transform = 'translateX(-100%)';
            targetSection.classList.add('active');
            
            requestAnimationFrame(() => {
                targetSection.style.transform = 'translateX(0)';
            });
        }

        // Mise à jour navigation active
        this.cache.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Menu mobile avec debouncing
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;

        let isMenuOpen = false;
        
        hamburger.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            hamburger.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('active', isMenuOpen);
        }, { passive: true });

        // Fermeture automatique sur clic de lien
        navMenu.addEventListener('click', (e) => {
            if (e.target.matches('a')) {
                isMenuOpen = false;
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }, { passive: true });
    }

    // Lazy loading pour les images et contenus
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observer toutes les images lazy
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    // Optimisations de performance
    setupPerformanceOptimizations() {
        // Preload des sections critiques
        this.preloadCriticalSections();
        
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.handleScroll(), 16);
        }, { passive: true });

        // Optimisation CSS animations
        this.optimizeAnimations();
    }

    preloadCriticalSections() {
        // Preload du CSS des animations après le chargement initial
        setTimeout(() => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'css/animations.css';
            document.head.appendChild(link);
        }, 1000);
    }

    handleScroll() {
        // Gestion optimisée du scroll pour effets visuels
        const scrollY = window.pageYOffset;
        
        // Parallax léger sur les éléments
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    optimizeAnimations() {
        // Force l'accélération GPU sur les éléments animés
        const animatedElements = document.querySelectorAll('.terminal-body, .hero-title, .nav-link');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform';
            el.style.backfaceVisibility = 'hidden';
        });
    }

    // Service Worker pour PWA
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Performance: Instanciation optimisée
new PortfolioApp();

// Fonction utilitaire pour les stats de performance
if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`Page load time: ${loadTime}ms`);
            }
        }, 0);
    });
}