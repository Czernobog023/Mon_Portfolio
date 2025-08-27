// PORTFOLIO OPTIMISÉ - JavaScript Performant v2.0
console.log('🚀 Portfolio JS Optimisé v2.0 - Chargé avec animations épiques!');

class PortfolioApp {
    constructor() {
        console.log('⚡ Initialisation PortfolioApp avec animations OVER 9000');
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
            this.setupSideMenu();
            this.setupCounterAnimations();
            this.setupAboutAnimations();
            this.setupEmailSystem();
            this.setupLazyLoading();
            this.setupPerformanceOptimizations();
            this.registerServiceWorker();
        });
    }

    // Navigation SPA optimisée
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .hero-section a[href^="#"]');
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

        // Gestion spécifique du bouton contact hero (celui avec href="#contact")
        const heroContactBtn = document.querySelector('.hero-section a[href="#contact"]');
        if (heroContactBtn) {
            heroContactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection('#contact');
            }, { passive: false });
        }
    }

    showSection(targetId) {
        // Feedback visuel pour navigation
        this.showFeedback(`Navigation vers ${targetId.replace('#', '').toUpperCase()}...`);
        
        // Performance: Utilise transform au lieu de display pour éviter reflow
        this.cache.sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            // Animation GPU-accelerated avec effet fade
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            targetSection.classList.add('active');
            
            requestAnimationFrame(() => {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
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

    // Menu latéral cyber avec effets
    setupSideMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Effet visuel de sélection
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Actions selon l'élément cliqué
                const text = item.querySelector('span').textContent;
                this.handleSideMenuAction(text);
            }, { passive: true });

            // Animation d'apparition échelonnée
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    handleSideMenuAction(action) {
        // Feedback visuel
        this.showFeedback(`Chargement: ${action}...`);
        
        switch(action) {
            case 'LICENCES DE CODE':
                this.showSection('#about');
                break;
            case 'RÉALISATIONS WEB':
                window.open('projets.html', '_blank');
                break;
            case 'RAPPORTS':
                window.open('services.html', '_blank');
                break;
            case 'PORTFOLIO':
                this.showSection('#home');
                break;
            case 'PROFIL PRO':
                this.showSection('#contact');
                break;
        }
    }

    // Affiche un message de feedback temporaire
    showFeedback(message) {
        // Crée ou met à jour le toast de feedback
        let toast = document.querySelector('.feedback-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'feedback-toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');
        
        // Masque automatiquement après 2 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // Animation des compteurs avec effet "OVER 9000!"
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        console.log('🎮 Configuration animations compteurs:', counters.length, 'compteurs trouvés');
        
        if ('IntersectionObserver' in window) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        this.animateCounter(counter);
                        counterObserver.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const isSpecial = counter.dataset.special === 'true';
        const duration = isSpecial ? 3000 : 2000; // Plus long pour l'effet spécial
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Fonction d'easing pour effet plus dramatique
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target * easeOut));
            
            if (isSpecial && current > 9000) {
                // Effet "OVER 9000!" style Dragon Ball Z
                console.log('🔥 OVER 9000 EFFECT ACTIVÉ!');
                counter.textContent = "OVER 9000!";
                counter.classList.add('over-9000');
                this.showFeedback("IT'S OVER 9000! ⚡");
                
                // Animation de secousse avec particules
                const statCard = counter.parentElement.parentElement;
                statCard.classList.add('power-up');
                this.createPowerUpParticles(statCard);
                
                setTimeout(() => {
                    statCard.classList.remove('power-up');
                }, 1000);
            } else {
                counter.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Créer des particules d'énergie pour l'effet "over 9000"
    createPowerUpParticles(element) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'power-particle';
            
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            document.body.appendChild(particle);
            
            // Animation des particules
            const angle = (i / 20) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let posX = 0;
            let posY = 0;
            let opacity = 1;
            
            const animateParticle = () => {
                posX += vx * 0.016; // 60fps
                posY += vy * 0.016;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animateParticle);
        }
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

    // Système de popup email
    setupEmailSystem() {
        // Créer la popup email si elle n'existe pas
        if (!document.getElementById('email-popup')) {
            this.createEmailPopup();
        }

        // Attacher les événements aux boutons email
        document.querySelectorAll('[data-email-context]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const context = button.dataset.emailContext;
                this.showEmailPopup(context);
            });
        });
    }

    createEmailPopup() {
        const popup = document.createElement('div');
        popup.id = 'email-popup';
        popup.className = 'email-popup-overlay';
        popup.innerHTML = `
            <div class="email-popup">
                <div class="popup-header">
                    <div class="popup-title">
                        <i class="fas fa-envelope"></i>
                        <span>CONTACT EMAIL</span>
                    </div>
                    <button class="popup-close" id="popup-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="popup-body">
                    <div class="email-info">
                        <div class="email-address">rayanmaillard023@gmail.com</div>
                        <div class="email-subject" id="popup-subject"></div>
                    </div>
                    <div class="email-options">
                        <button class="email-option gmail-option" id="gmail-btn">
                            <i class="fab fa-google"></i>
                            <span>Ouvrir dans Gmail</span>
                        </button>
                        <button class="email-option outlook-option" id="outlook-btn">
                            <i class="fas fa-envelope"></i>
                            <span>Ouvrir dans Outlook</span>
                        </button>
                        <button class="email-option copy-option" id="copy-btn">
                            <i class="fas fa-copy"></i>
                            <span>Copier l'email</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        // Attacher les événements aux boutons de la popup
        popup.querySelector('#popup-close-btn').addEventListener('click', () => this.closeEmailPopup());
        popup.querySelector('#gmail-btn').addEventListener('click', () => this.openGmail());
        popup.querySelector('#outlook-btn').addEventListener('click', () => this.openOutlook());
        popup.querySelector('#copy-btn').addEventListener('click', () => this.copyEmail());
        
        // Fermer en cliquant sur l'overlay
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeEmailPopup();
            }
        });
    }

    showEmailPopup(context) {
        const popup = document.getElementById('email-popup');
        const subjectElement = document.getElementById('popup-subject');
        
        // Définir le sujet selon le contexte
        const subjects = {
            'contact': 'Contact Professionnel - Projet Web',
            'footer': 'Demande d\'Information - Services Web',
            'cv': 'Candidature - Contact CV',
            'mission': 'Nouveau Projet Web - Mission',
            'general': 'Contact Portfolio'
        };

        const subject = subjects[context] || subjects['general'];
        subjectElement.textContent = `Sujet: ${subject}`;
        
        // Stocker le contexte pour utilisation dans les fonctions
        popup.dataset.currentContext = context;
        popup.dataset.currentSubject = subject;
        
        // Afficher la popup
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeEmailPopup() {
        const popup = document.getElementById('email-popup');
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    openGmail() {
        const popup = document.getElementById('email-popup');
        const subject = popup.dataset.currentSubject;
        const context = popup.dataset.currentContext;
        
        const bodies = {
            'contact': 'Bonjour Rayan,%0A%0AJe vous contacte pour discuter d\'un projet web.%0A%0AType de projet : %0ABudget approximatif : %0ADélai souhaité : %0A%0ADescription : %0A%0ACordialement,',
            'footer': 'Bonjour Rayan,%0A%0AJe vous contacte pour en savoir plus sur vos services web.%0A%0AJe suis intéressé(e) par : %0A%0AMon projet : %0A%0ACordialement,',
            'cv': 'Bonjour Rayan,%0A%0AJ\'ai consulté votre CV et j\'aimerais discuter avec vous.%0A%0APoste : %0AEntreprise : %0A%0ACordialement,',
            'mission': 'Bonjour Rayan,%0A%0AJe souhaite discuter d\'un projet web.%0A%0AType de projet: %0ABudget approximatif: %0ADélai souhaité: %0A%0ADescription du projet: %0A%0AMerci!',
            'general': 'Bonjour Rayan,%0A%0A%0A%0ACordialement,'
        };

        const body = bodies[context] || bodies['general'];
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=rayanmaillard023@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`;
        
        window.open(gmailUrl, '_blank');
        this.closeEmailPopup();
        this.showFeedback('Gmail ouvert dans un nouvel onglet! 📧');
    }

    openOutlook() {
        const popup = document.getElementById('email-popup');
        const subject = popup.dataset.currentSubject;
        const context = popup.dataset.currentContext;
        
        const bodies = {
            'contact': 'Bonjour Rayan,%0A%0AJe vous contacte pour discuter d\'un projet web.%0A%0AType de projet : %0ABudget approximatif : %0ADélai souhaité : %0A%0ADescription : %0A%0ACordialement,',
            'footer': 'Bonjour Rayan,%0A%0AJe vous contacte pour en savoir plus sur vos services web.%0A%0AJe suis intéressé(e) par : %0A%0AMon projet : %0A%0ACordialement,',
            'cv': 'Bonjour Rayan,%0A%0AJ\'ai consulté votre CV et j\'aimerais discuter avec vous.%0A%0APoste : %0AEntreprise : %0A%0ACordialement,',
            'mission': 'Bonjour Rayan,%0A%0AJe souhaite discuter d\'un projet web.%0A%0AType de projet: %0ABudget approximatif: %0ADélai souhaité: %0A%0ADescription du projet: %0A%0AMerci!',
            'general': 'Bonjour Rayan,%0A%0A%0A%0ACordialement,'
        };

        const body = bodies[context] || bodies['general'];
        const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=rayanmaillard023@gmail.com&subject=${encodeURIComponent(subject)}&body=${body}`;
        
        window.open(outlookUrl, '_blank');
        this.closeEmailPopup();
        this.showFeedback('Outlook ouvert dans un nouvel onglet! 📧');
    }

    async copyEmail() {
        try {
            await navigator.clipboard.writeText('rayanmaillard023@gmail.com');
            this.closeEmailPopup();
            this.showFeedback('Email copié dans le presse-papier! 📋');
        } catch (err) {
            // Fallback pour navigateurs plus anciens
            const textArea = document.createElement('textarea');
            textArea.value = 'rayanmaillard023@gmail.com';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.closeEmailPopup();
            this.showFeedback('Email copié! 📋');
        }
    }

    // Animation de la section About Terminal
    setupAboutAnimations() {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        // Observer d'intersection pour déclencher les animations
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    this.animateAboutSection();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        aboutObserver.observe(aboutSection);
    }

    animateAboutSection() {
        // Animation des stats dans la section about
        const aboutStats = document.querySelectorAll('.about-terminal .stat-value[data-target]');
        aboutStats.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            this.animateCounter(stat, target);
        });

        // Animation des barres de niveau
        const levelBars = document.querySelectorAll('.level-bar[data-level]');
        setTimeout(() => {
            levelBars.forEach(bar => {
                const level = bar.dataset.level;
                bar.style.setProperty('--level', level + '%');
            });
        }, 500);

        // Animation de la barre de téléchargement
        const progressFill = document.querySelector('.progress-fill[data-progress]');
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = '100%';
            }, 1000);
        }

        // Mettre à jour le timestamp
        const timestamp = document.getElementById('lastUpdate');
        if (timestamp) {
            const now = new Date();
            const timeString = now.toLocaleString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            timestamp.textContent = timeString;
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