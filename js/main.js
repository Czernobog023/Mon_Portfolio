// =======================================================
// SCRIPT POUR LE MENU HAMBURGER (Version Sécurisée)
// =======================================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// On vérifie si les éléments existent AVANT d'ajouter des écouteurs d'événements
if (hamburger && navMenu) {
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
}

// =======================================================
// SCRIPT POUR LE DÉFILEMENT FLUIDE (SMOOTH SCROLL)
// =======================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Empêche le saut brutal par défaut

        const targetId = this.getAttribute('href');
        
        // Cas spécial pour les liens qui ne mènent nulle part
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
