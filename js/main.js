/* ==========================================
   PORTFOLIO RÉTRO GAMING - JAVASCRIPT PRINCIPAL
   Interactivité et effets visuels
   ========================================== */

// ==========================================
// CONFIGURATION GLOBALE
// ==========================================

const CONFIG = {
    TYPING_SPEED: 50,
    GLITCH_INTERVAL: 3000,
    COUNTER_DURATION: 2000,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768
};

// ==========================================
// UTILITAIRES
// ==========================================

// Détection mobile
const isMobile = () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;

// Debounce function pour optimiser les performances
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// ==========================================
// GESTION DU DOM
// ==========================================

class DOMManager {
    constructor() {
        this.elements = {};
        this.init();
    }

    init() {
        // Cache des éléments fréquemment utilisés
        this.elements = {
            body: document.body,
            header: document.querySelector('.header'),
            nav: document.querySelector('.nav-menu'),
            hamburger: document.querySelector('.hamburger'),
            sections: document.querySelectorAll('.section'),
            navLinks: document.querySelectorAll('.nav-link[data-section]'),
            statNumbers: document.querySelectorAll('.stat-number'),
            glitchElements: document.querySelectorAll('.cyber-glitch'),
            typingElements: document.querySelectorAll('.typing-text, .typing-effect'),
            contactForm: document.querySelector('#contactForm')
        };
    }

    // Ajouter des classes avec vérification d'existence
    addClass(element, className) {
        if (element && !element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    // Supprimer des classes avec vérification d'existence
    removeClass(element, className) {
        if (element && element.classList.contains(className)) {
            element.classList.remove(className);
        }
    }

    // Toggle class avec vérification d'existence
    toggleClass(element, className) {
        if (element) {
            element.classList.toggle(className);
        }
    }
}

// ==========================================
// NAVIGATION ET MENU
// ==========================================

class Navigation {
    constructor(domManager) {
        this.dom = domManager;
        this.activeSection = 'home';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.createMobileOverlay();
        this.handleInitialSection();
    }

    bindEvents() {
        // Menu hamburger
        if (this.dom.elements.hamburger) {
            this.dom.elements.hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Navigation links
        this.dom.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.navigateToSection(targetSection);
                
                if (isMobile()) {
                    this.closeMobileMenu();
                }
            });
        });

        // Scroll pour la navigation active
        window.addEventListener('scroll', throttle(() => {
            this.updateActiveNavigation();
        }, 100));

        // Fermeture du menu mobile au redimensionnement
        window.addEventListener('resize', debounce(() => {
            if (!isMobile() && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        }, 250));
    }

    createMobileOverlay() {
        // Créer l'overlay pour le menu mobile s'il n'existe pas
        if (!document.querySelector('.nav-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            overlay.addEventListener('click', () => this.closeMobileMenu());
            document.body.appendChild(overlay);
        }
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        this.dom.toggleClass(this.dom.elements.hamburger, 'active');
        this.dom.toggleClass(this.dom.elements.nav, 'active');
        
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            this.dom.toggleClass(overlay, 'active');
        }

        // Empêcher le scroll quand le menu est ouvert
        if (this.isMenuOpen) {
            this.dom.addClass(this.dom.elements.body, 'menu-open');
        } else {
            this.dom.removeClass(this.dom.elements.body, 'menu-open');
        }
    }

    closeMobileMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        this.dom.removeClass(this.dom.elements.hamburger, 'active');
        this.dom.removeClass(this.dom.elements.nav, 'active');
        this.dom.removeClass(this.dom.elements.body, 'menu-open');
        
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            this.dom.removeClass(overlay, 'active');
        }
    }

    navigateToSection(sectionId) {
        // Masquer toutes les sections
        this.dom.elements.sections.forEach(section => {
            this.dom.removeClass(section, 'active');
        });

        // Afficher la section ciblée
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            this.dom.addClass(targetSection, 'active');
            this.activeSection = sectionId;
            
            // Mettre à jour la navigation
            this.updateNavigationState(sectionId);
            
            // Scroll en haut de la section
            if (sectionId !== 'home') {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Déclencher les animations d'entrée
            this.triggerSectionAnimations(targetSection);
        }
    }

    updateNavigationState(activeSection) {
        this.dom.elements.navLinks.forEach(link => {
            this.dom.removeClass(link, 'active');
            if (link.getAttribute('data-section') === activeSection) {
                this.dom.addClass(link, 'active');
            }
        });
    }

    updateActiveNavigation() {
        if (isMobile()) return; // Désactiver sur mobile pour les performances

        const scrollPos = window.scrollY + CONFIG.SCROLL_OFFSET;
        
        this.dom.elements.sections.forEach(section => {
            if (section.classList.contains('active')) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                    const sectionId = section.id;
                    if (sectionId && sectionId !== this.activeSection) {
                        this.activeSection = sectionId;
                        this.updateNavigationState(sectionId);
                    }
                }
            }
        });
    }

    triggerSectionAnimations(section) {
        // Déclencher les animations spécifiques à chaque section
        const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
        
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0) translateY(0) scale(1)';
            }, index * 100);
        });
    }

    handleInitialSection() {
        // Gérer l'ancre dans l'URL au chargement
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            setTimeout(() => {
                this.navigateToSection(hash);
            }, 100);
        }
    }
}

// ==========================================
// EFFETS VISUELS ET ANIMATIONS
// ==========================================

class VisualEffects {
    constructor(domManager) {
        this.dom = domManager;
        this.countersAnimated = false;
        this.init();
    }

    init() {
        this.initTypingEffect();
        this.initCounterAnimations();
        this.initGlitchEffects();
        this.initParticleEffects();
        this.bindScrollAnimations();
    }

    // Effet de frappe (typing)
    initTypingEffect() {
        this.dom.elements.typingElements.forEach(element => {
            if (element.classList.contains('typing-text')) {
                this.createTypingEffect(element);
            }
        });
    }

    createTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.visibility = 'visible';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, CONFIG.TYPING_SPEED);
            } else {
                // Animation terminée, ajouter l'effet de curseur clignotant
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Délai avant de commencer l'animation
        setTimeout(typeWriter, 1000);
    }

    // Animation des compteurs
    initCounterAnimations() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.countersAnimated) {
                    this.animateCounters();
                    this.countersAnimated = true;
                }
            });
        }, observerOptions);

        // Observer la section des stats
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounters() {
        this.dom.elements.statNumbers.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = CONFIG.COUNTER_DURATION;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Utiliser une fonction d'easing pour un effet plus fluide
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOut);
                
                element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };
            
            animate();
        });
    }

    // Effets glitch
    initGlitchEffects() {
        if (!isMobile()) { // Désactiver sur mobile pour les performances
            this.dom.elements.glitchElements.forEach(element => {
                this.addRandomGlitch(element);
            });
        }
    }

    addRandomGlitch(element) {
        const glitchInterval = () => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = '';
            }, 50);
            
            // Programmer le prochain glitch
            setTimeout(glitchInterval, CONFIG.GLITCH_INTERVAL + Math.random() * 2000);
        };
        
        // Premier glitch après un délai aléatoire
        setTimeout(glitchInterval, Math.random() * CONFIG.GLITCH_INTERVAL);
    }

    // Effets de particules
    initParticleEffects() {
        if (isMobile()) return; // Désactiver sur mobile

        const particleContainer = document.querySelector('.cyber-particles');
        if (!particleContainer) return;

        // Créer des particules supplémentaires
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Position aléatoire
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            
            // Couleur aléatoire parmi la palette néon
            const colors = ['#00ffff', '#ff0080', '#39ff14', '#8a2be2', '#ff4500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            particleContainer.appendChild(particle);
        }
    }

    // Animations au scroll
    bindScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec classe fade-in
        document.querySelectorAll('.fade-in').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(element);
        });
    }
}

// ==========================================
// GESTION DES FORMULAIRES
// ==========================================

class FormManager {
    constructor(domManager) {
        this.dom = domManager;
        this.init();
    }

    init() {
        if (this.dom.elements.contactForm) {
            this.bindFormEvents();
        }
    }

    bindFormEvents() {
        const form = this.dom.elements.contactForm;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Animation des inputs au focus
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.dom.addClass(input.parentElement, 'focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    this.dom.removeClass(input.parentElement, 'focused');
                }
            });
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validation simple
        if (!this.validateForm(data)) {
            this.showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
        this.showFormMessage('Envoi en cours...', 'loading');
        
        // Simuler l'envoi
        setTimeout(() => {
            // Ici, vous intégreriez votre service d'envoi d'email
            this.showFormMessage('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
            form.reset();
            
            // Créer le mailto link en fallback
            this.createMailtoLink(data);
        }, 2000);
    }

    validateForm(data) {
        const required = ['name', 'email', 'message'];
        return required.every(field => data[field] && data[field].trim() !== '');
    }

    showFormMessage(message, type) {
        // Supprimer les messages existants
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Créer le nouveau message
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        
        // Styles du message
        Object.assign(messageEl.style, {
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            marginTop: 'var(--spacing-md)',
            fontFamily: 'var(--font-secondary)',
            textAlign: 'center',
            border: '1px solid',
            animation: 'fadeIn 0.3s ease'
        });

        // Couleurs selon le type
        switch(type) {
            case 'success':
                Object.assign(messageEl.style, {
                    backgroundColor: 'rgba(57, 255, 20, 0.1)',
                    borderColor: 'var(--neon-green)',
                    color: 'var(--neon-green)'
                });
                break;
            case 'error':
                Object.assign(messageEl.style, {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderColor: '#ff0000',
                    color: '#ff0000'
                });
                break;
            case 'loading':
                Object.assign(messageEl.style, {
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    borderColor: 'var(--neon-cyan)',
                    color: 'var(--neon-cyan)'
                });
                break;
        }

        // Ajouter le message après le formulaire
        this.dom.elements.contactForm.appendChild(messageEl);

        // Supprimer automatiquement après 5 secondes (sauf loading)
        if (type !== 'loading') {
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }
    }

    createMailtoLink(data) {
        // Créer un lien mailto en fallback
        const subject = encodeURIComponent(`Contact depuis le portfolio - ${data.subject || 'Demande de renseignements'}`);
        const body = encodeURIComponent(`
Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone || 'Non renseigné'}
Projet: ${data.project || 'Non spécifié'}

Message:
${data.message}
        `);
        
        const mailtoUrl = `mailto:rayanmaillard023@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoUrl;
    }
}

// ==========================================
// PERFORMANCE ET OPTIMISATIONS
// ==========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.handleReducedMotion();
        this.preventScrollJank();
    }

    optimizeImages() {
        // Lazy loading pour les images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    handleReducedMotion() {
        // Respecter les préférences d'accessibilité
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            
            // Désactiver les effets visuels intensifs
            const effects = document.querySelectorAll('.scanlines, .grid-overlay, .cyber-particles');
            effects.forEach(effect => {
                effect.style.display = 'none';
            });
        }
    }

    preventScrollJank() {
        // Optimiser les performances de scroll
        let ticking = false;
        
        const updateScrollPosition = () => {
            // Mise à jour des éléments qui dépendent du scroll
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }
}

// ==========================================
// GESTIONNAIRE PRINCIPAL
// ==========================================

class PortfolioApp {
    constructor() {
        this.dom = new DOMManager();
        this.navigation = new Navigation(this.dom);
        this.visualEffects = new VisualEffects(this.dom);
        this.formManager = new FormManager(this.dom);
        this.optimizer = new PerformanceOptimizer();
        
        this.init();
    }

    init() {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }

        // Gestion des erreurs globales
        window.addEventListener('error', (e) => {
            console.warn('Erreur capturée:', e.error);
        });
    }

    onDOMReady() {
        // Initialiser les composants qui nécessitent le DOM complet
        this.bindGlobalEvents();
        this.initAccessibility();
        
        // Ajouter une classe pour indiquer que le JS est chargé
        document.documentElement.classList.add('js-loaded');
        
        console.log('Portfolio rétro gaming initialisé ✨');
    }

    bindGlobalEvents() {
        // Gestion du redimensionnement de fenêtre
        window.addEventListener('resize', debounce(() => {
            this.dom.init(); // Re-cache les éléments si nécessaire
        }, 250));

        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause des animations coûteuses quand la page n'est pas visible
            }
        });
    }

    initAccessibility() {
        // Améliorer l'accessibilité
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--neon-cyan)';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
            });
        });

        // Support du clavier pour les éléments interactifs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.navigation.closeMobileMenu();
            }
        });
    }
}

// ==========================================
// INITIALISATION
// ==========================================

// Initialiser l'application dès que possible
const portfolio = new PortfolioApp();

// Exposer certaines fonctions globalement si nécessaire
window.portfolioApp = {
    navigateToSection: (sectionId) => portfolio.navigation.navigateToSection(sectionId),
    toggleMobileMenu: () => portfolio.navigation.toggleMobileMenu(),
    isMobile: isMobile
};


// =======================================================
// SCRIPT POUR LE MENU HAMBURGER
// =======================================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    // Active/désactive le menu et l'icône
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Ferme le menu quand on clique sur un lien
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));
