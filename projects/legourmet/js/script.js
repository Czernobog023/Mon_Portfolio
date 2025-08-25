// ===== Le Gourmet Restaurant - Main JavaScript =====

// DOM Elements
const preloader = document.querySelector('.preloader');
const header = document.querySelector('.header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const reservationForm = document.getElementById('reservationForm');
const newsletterForm = document.getElementById('newsletterForm');
const modal = document.getElementById('successModal');

// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 1000);
});

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to Top Button
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Mobile Menu Toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active Navigation Link
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Smooth Scroll for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to Top
backToTop?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Menu Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove active class from all tabs and categories
        tabButtons.forEach(btn => btn.classList.remove('active'));
        menuCategories.forEach(category => category.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding category
        button.classList.add('active');
        document.getElementById(tabName)?.classList.add('active');
    });
});

// Reservation Form
reservationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(reservationForm);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (validateReservationForm(data)) {
        // Show success modal
        showModal('Réservation confirmée!', 'Nous vous avons envoyé un email de confirmation.');
        
        // Reset form
        reservationForm.reset();
        
        // In a real application, you would send the data to a server here
        console.log('Reservation data:', data);
    }
});

// Newsletter Form
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        showModal('Inscription réussie!', 'Vous recevrez bientôt nos actualités.');
        newsletterForm.reset();
        
        // In a real application, you would send the email to a server here
        console.log('Newsletter subscription:', email);
    }
});

// Form Validation
function validateReservationForm(data) {
    const { name, email, phone, date, time, guests } = data;
    
    if (!name || !email || !phone || !date || !time || !guests) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return false;
    }
    
    if (!validatePhone(phone)) {
        alert('Veuillez entrer un numéro de téléphone valide.');
        return false;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('La date de réservation ne peut pas être dans le passé.');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Modal Functions
function showModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = modal.querySelector('h3');
    const modalMessage = modal.querySelector('p');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('active');
    
    // Close modal when clicking on X
    modal.querySelector('.modal-close').onclick = () => {
        modal.classList.remove('active');
    };
    
    // Close modal when clicking on OK button
    modal.querySelector('.btn-primary').onclick = () => {
        modal.classList.remove('active');
    };
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    };
}

// Animate on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-fade-up, .animate-fade-up-delay, .animate-fade-up-delay-2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        observer.observe(element);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Set minimum date for reservation (today)
const dateInput = document.querySelector('#date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Gallery Lightbox (Simple Implementation)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // In a real application, you would open a lightbox here
        console.log('Gallery item clicked');
    });
});

// Testimonial Slider (Auto-play)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');

function rotateTestimonials() {
    if (testimonials.length > 0) {
        // This is a simple implementation
        // In production, you would use a proper slider library
        console.log('Rotating testimonials');
    }
}

// Rotate testimonials every 5 seconds
setInterval(rotateTestimonials, 5000);

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic Copyright Year
const footerYear = document.querySelector('.footer-bottom');
if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', year);
}

// Lazy Loading for Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Download Menu PDF (Placeholder)
document.querySelector('.download-menu')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Le téléchargement du menu PDF sera disponible bientôt.');
    // In production, you would trigger a PDF download here
});

// Google Maps Integration (Placeholder)
function initMap() {
    // This would initialize Google Maps
    console.log('Map initialization would go here');
}

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registration successful'))
            .catch(err => console.log('ServiceWorker registration failed'));
    });
}

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    updateActiveLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Le Gourmet website initialized');
    
    // Check if all critical elements are present
    const criticalElements = ['header', 'hero', 'menu', 'reservation'];
    criticalElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`Critical element #${id} not found`);
        }
    });
});