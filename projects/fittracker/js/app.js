// ===== FitTracker PWA - Main JavaScript =====

// Global Variables
let deferredPrompt;
let currentSection = 'dashboard';
let workoutTimer = null;
let workoutSeconds = 0;
let userManager = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    registerServiceWorker();
    handleInstallPrompt();
    setupEventListeners();
    updateDateTime();
    hideSplashScreen();
});

// Initialize Application
function initializeApp() {
    // Check if app is launched from home screen
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App running in standalone mode');
    }

    // Initialize User Manager
    if (typeof UserManager !== 'undefined') {
        userManager = new UserManager();
        const user = userManager.init();
        console.log('User loaded:', user.name || 'New User');
        // Force UI update after DOM is ready
        userManager.updateUI();
    } else {
        console.error('UserManager not found! Make sure user-manager.js is loaded.');
    }
    
    // Initialize charts if on progress page
    if (document.querySelector('#weight-chart')) {
        initializeCharts();
    }
}

// Register Service Worker for PWA
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// Handle Install Prompt
function handleInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallToast();
    });

    window.addEventListener('appinstalled', () => {
        console.log('App installed successfully');
        hideInstallToast();
    });
}

// Show Install Toast
function showInstallToast() {
    const toast = document.getElementById('install-toast');
    if (toast) {
        toast.style.display = 'block';
        
        document.getElementById('install-btn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User choice: ${outcome}`);
                deferredPrompt = null;
                hideInstallToast();
            }
        });

        document.getElementById('dismiss-btn').addEventListener('click', () => {
            hideInstallToast();
        });
    }
}

// Hide Install Toast
function hideInstallToast() {
    const toast = document.getElementById('install-toast');
    if (toast) {
        toast.style.display = 'none';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    const closeDrawer = document.getElementById('close-drawer');

    menuToggle?.addEventListener('click', () => {
        navDrawer.classList.add('active');
    });

    closeDrawer?.addEventListener('click', () => {
        navDrawer.classList.remove('active');
    });

    // Drawer Navigation
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').substring(1);
            navigateToSection(section);
            navDrawer.classList.remove('active');
        });
    });

    // Bottom Navigation
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Quick Start Button
    document.getElementById('quick-start')?.addEventListener('click', () => {
        startQuickWorkout();
    });

    // Start Workout Button
    document.getElementById('start-workout')?.addEventListener('click', () => {
        startWorkout();
    });

    // Workout Cards
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            startWorkout();
        });
    });

    // Category Tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterWorkouts(tab.textContent);
        });
    });

    // Exercise Filter Chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterExercises(chip.textContent);
        });
    });

    // Exercise Search
    document.getElementById('exercise-search')?.addEventListener('input', (e) => {
        searchExercises(e.target.value);
    });

    // Modal Close
    document.querySelector('.modal-close')?.addEventListener('click', () => {
        closeWorkoutModal();
    });

    // Pause Workout
    document.getElementById('pause-workout')?.addEventListener('click', () => {
        pauseWorkout();
    });

    // Next Exercise
    document.getElementById('next-exercise')?.addEventListener('click', () => {
        nextExercise();
    });

    // Settings Buttons
    document.getElementById('clear-cache')?.addEventListener('click', () => {
        clearCache();
    });

    document.getElementById('export-data')?.addEventListener('click', () => {
        exportUserData();
    });

    document.getElementById('reset-app')?.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser l\'application ?')) {
            resetApp();
        }
    });

    // Edit Profile
    document.getElementById('edit-profile')?.addEventListener('click', () => {
        editProfile();
    });

    // Add Workout
    document.getElementById('add-workout')?.addEventListener('click', () => {
        addNewWorkout();
    });

    // Handle URL parameters
    handleUrlParams();

    // Handle Back Button
    window.addEventListener('popstate', handleBackButton);
}

// Navigate to Section
function navigateToSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = section;

        // Update navigation states
        updateNavigationStates(section);

        // Push to history
        history.pushState({ section }, '', `#${section}`);

        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Update Navigation States
function updateNavigationStates(section) {
    // Update drawer links
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${section}`) {
            link.classList.add('active');
        }
    });

    // Update bottom nav
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
}

// Handle Back Button
function handleBackButton(event) {
    if (event.state && event.state.section) {
        navigateToSection(event.state.section);
    }
}

// Handle URL Parameters
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Handle action parameter
    const action = params.get('action');
    if (action === 'start-workout') {
        startQuickWorkout();
    }
    
    // Handle section parameter
    const section = params.get('section');
    if (section) {
        navigateToSection(section);
    }

    // Handle hash navigation
    if (window.location.hash) {
        const hashSection = window.location.hash.substring(1);
        navigateToSection(hashSection);
    }
}

// Start Workout
function startWorkout() {
    const modal = document.getElementById('workout-modal');
    if (modal) {
        modal.classList.add('active');
        startWorkoutTimer();
    }
}

// Start Quick Workout
function startQuickWorkout() {
    navigateToSection('workouts');
    setTimeout(() => {
        startWorkout();
    }, 500);
}

// Start Workout Timer
function startWorkoutTimer() {
    workoutSeconds = 0;
    workoutTimer = setInterval(() => {
        workoutSeconds++;
        updateTimerDisplay();
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    const minutes = Math.floor(workoutSeconds / 60);
    const seconds = workoutSeconds % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = display;
    }
}

// Pause Workout
function pauseWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
        
        const pauseBtn = document.getElementById('pause-workout');
        if (pauseBtn) {
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reprendre';
            pauseBtn.onclick = resumeWorkout;
        }
    }
}

// Resume Workout
function resumeWorkout() {
    startWorkoutTimer();
    
    const pauseBtn = document.getElementById('pause-workout');
    if (pauseBtn) {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        pauseBtn.onclick = pauseWorkout;
    }
}

// Next Exercise
function nextExercise() {
    // Simulate next exercise
    const exercises = ['Squats', 'Pompes', 'Abdos', 'Fentes', 'Burpees'];
    const currentExercise = document.querySelector('.current-exercise h4');
    
    if (currentExercise) {
        const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
        currentExercise.textContent = randomExercise;
        
        // Update progress
        const progressBar = document.querySelector('.exercise-progress .progress-bar');
        if (progressBar) {
            const currentWidth = parseInt(progressBar.style.width) || 0;
            progressBar.style.width = Math.min(currentWidth + 33, 100) + '%';
        }
    }
}

// Close Workout Modal
function closeWorkoutModal() {
    const modal = document.getElementById('workout-modal');
    if (modal) {
        modal.classList.remove('active');
        if (workoutTimer) {
            clearInterval(workoutTimer);
            workoutTimer = null;
        }
    }
}

// Filter Workouts
function filterWorkouts(category) {
    console.log('Filtering workouts by:', category);
    // Implement workout filtering logic here
}

// Filter Exercises
function filterExercises(muscleGroup) {
    console.log('Filtering exercises by:', muscleGroup);
    // Implement exercise filtering logic here
}

// Search Exercises
function searchExercises(query) {
    console.log('Searching exercises:', query);
    // Implement exercise search logic here
}

// Update Date Time
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('fr-FR', options);
    }
}

// Hide Splash Screen
function hideSplashScreen() {
    setTimeout(() => {
        const splash = document.querySelector('.splash-screen');
        if (splash) {
            splash.style.display = 'none';
        }
    }, 2500);
}

// Load User Data
function loadUserData() {
    const userData = localStorage.getItem('fittracker_user');
    if (userData) {
        const user = JSON.parse(userData);
        console.log('User data loaded:', user);
        // Update UI with user data
    }
}

// Save User Data
function saveUserData(data) {
    localStorage.setItem('fittracker_user', JSON.stringify(data));
}

// Export User Data
function exportUserData() {
    const userData = localStorage.getItem('fittracker_user') || '{}';
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fittracker_data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Données exportées avec succès');
}

// Clear Cache
async function clearCache() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        showNotification('Cache vidé avec succès');
    }
}

// Reset App
function resetApp() {
    if (userManager) {
        userManager.reset();
    } else {
        localStorage.clear();
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
        window.location.reload();
    }
}

// Edit Profile
function editProfile() {
    const modalHTML = `
        <div id="editProfileModal" class="modal active">
            <div class="modal-content">
                <button class="modal-close" onclick="closeEditModal()">
                    <i class="fas fa-times"></i>
                </button>
                <h2>Modifier mon profil</h2>
                
                <form id="editProfileForm" style="padding: 20px 0;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Nom</label>
                        <input type="text" id="editName" value="${userManager.user.name}" 
                               style="width: 100%; padding: 10px; background: var(--surface-light); 
                                      border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px;">Âge</label>
                            <input type="number" id="editAge" value="${userManager.user.age}" 
                                   style="width: 100%; padding: 10px; background: var(--surface-light); 
                                          border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px;">Poids (kg)</label>
                            <input type="number" id="editWeight" value="${userManager.user.weight}" 
                                   style="width: 100%; padding: 10px; background: var(--surface-light); 
                                          border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Taille (cm)</label>
                        <input type="number" id="editHeight" value="${userManager.user.height}" 
                               style="width: 100%; padding: 10px; background: var(--surface-light); 
                                      border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Objectif</label>
                        <select id="editGoal" style="width: 100%; padding: 10px; background: var(--surface-light); 
                                                     border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                            <option value="weight-loss" ${userManager.user.goal === 'weight-loss' ? 'selected' : ''}>Perte de poids</option>
                            <option value="muscle-gain" ${userManager.user.goal === 'muscle-gain' ? 'selected' : ''}>Prise de muscle</option>
                            <option value="endurance" ${userManager.user.goal === 'endurance' ? 'selected' : ''}>Endurance</option>
                            <option value="general" ${userManager.user.goal === 'general' ? 'selected' : ''}>Forme générale</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px;">Niveau</label>
                        <select id="editLevel" style="width: 100%; padding: 10px; background: var(--surface-light); 
                                                      border: 1px solid var(--surface-light); border-radius: 8px; color: white;">
                            <option value="beginner" ${userManager.user.level === 'beginner' ? 'selected' : ''}>Débutant</option>
                            <option value="intermediate" ${userManager.user.level === 'intermediate' ? 'selected' : ''}>Intermédiaire</option>
                            <option value="advanced" ${userManager.user.level === 'advanced' ? 'selected' : ''}>Avancé</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <button type="button" onclick="closeEditModal()" 
                                style="flex: 1; padding: 12px; background: var(--surface-light); 
                                       color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Annuler
                        </button>
                        <button type="submit" 
                                style="flex: 1; padding: 12px; background: var(--primary-color); 
                                       color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Sauvegarder
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfile();
    });
}

function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.remove();
}

function saveProfile() {
    const updatedData = {
        name: document.getElementById('editName').value,
        age: document.getElementById('editAge').value,
        weight: document.getElementById('editWeight').value,
        height: document.getElementById('editHeight').value,
        goal: document.getElementById('editGoal').value,
        level: document.getElementById('editLevel').value
    };
    
    userManager.updateProfile(updatedData);
    closeEditModal();
    showNotification('Profil mis à jour avec succès!');
}

// Add New Workout
function addNewWorkout() {
    console.log('Add new workout');
    // Implement add workout logic
    showNotification('Fonction d\'ajout d\'entraînement en développement');
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Show Update Notification
function showUpdateNotification() {
    if (confirm('Une nouvelle version de l\'application est disponible. Voulez-vous mettre à jour ?')) {
        window.location.reload();
    }
}

// Initialize Charts (for Progress section)
function initializeCharts() {
    const ctx = document.getElementById('weight-chart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                datasets: [{
                    label: 'Poids (kg)',
                    data: [75, 74.8, 74.6, 74.7, 74.5, 74.3, 74.2],
                    borderColor: '#6200EA',
                    backgroundColor: 'rgba(98, 0, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
}

// Request Notification Permission
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            showNotification('Notifications activées !');
        }
    }
}

// Schedule Workout Reminder
function scheduleWorkoutReminder() {
    if ('Notification' in window && Notification.permission === 'granted') {
        // Schedule notification logic here
        console.log('Workout reminder scheduled');
    }
}

// Check Online Status
window.addEventListener('online', () => {
    showNotification('Connexion rétablie');
});

window.addEventListener('offline', () => {
    showNotification('Mode hors-ligne activé');
});

// Handle App Visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('App is visible');
    } else {
        console.log('App is hidden');
    }
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}