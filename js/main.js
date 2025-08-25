// On attend que le document HTML soit entièrement chargé et analysé
document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // SCRIPT POUR LE MENU HAMBURGER (Version Sécurisée)
    // =======================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // On vérifie si les éléments existent AVANT d'ajouter des écouteurs d'événements
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

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
            e.preventDefault(); 

            const targetId = this.getAttribute('href');
            
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

}); // Fin de l'écouteur DOMContentLoaded
