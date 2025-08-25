// On attend que le document HTML soit entièrement chargé et analysé
document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // GESTIONNAIRE DE NAVIGATION (Single Page App)
    // =======================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const heroContactButton = document.querySelector('.hero-section .btn-secondary');

    function changeSection(targetId) {
        // Cacher toutes les sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section cible
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Mettre à jour le lien actif dans la navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Ajoute un écouteur sur chaque lien de la navigation principale
    navLinks.forEach(link => {
        // On ne gère que les liens internes (qui commencent par #)
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche le comportement par défaut
                changeSection(targetId);
            });
        }
    });
    
    // Gère spécifiquement le bouton "ME CONTACTER" de la section d'accueil
    if (heroContactButton) {
        heroContactButton.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = heroContactButton.getAttribute('href');
            changeSection(targetId);
        });
    }

    // =======================================================
    // SCRIPT POUR LE MENU HAMBURGER (Version Sécurisée)
    // =======================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // On s'assure que le menu se ferme quand on clique sur un lien
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Ajout pour les boutons "Demander un devis" sur la page services.html
    // Note : Cela ne peut fonctionner que si la page services.html est fusionnée avec index.html
    // Pour l'instant, ces boutons redirigeront vers l'accueil
    // Pour une solution complète, il faudrait transformer tout le site en un seul fichier HTML.

});
