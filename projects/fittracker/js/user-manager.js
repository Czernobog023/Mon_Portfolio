// ===== User Manager - Gestion complète du profil utilisateur =====

class UserManager {
    constructor() {
        this.storageKey = 'fittracker_user_profile';
        this.workoutsKey = 'fittracker_workouts';
        this.activitiesKey = 'fittracker_activities';
        this.defaultUser = {
            name: '',
            age: '',
            weight: '',
            height: '',
            goal: 'general',
            level: 'beginner',
            avatar: '👤',
            createdAt: new Date().toISOString(),
            stats: {
                totalWorkouts: 0,
                totalCalories: 0,
                totalTime: 0,
                currentStreak: 0,
                bestStreak: 0,
                lastWorkout: null
            },
            preferences: {
                notifications: true,
                reminders: true,
                theme: 'dark',
                units: 'metric' // metric or imperial
            }
        };
        
        this.activities = [];
        this.workouts = [];
    }

    // Initialiser ou récupérer l'utilisateur
    init() {
        const savedUser = localStorage.getItem(this.storageKey);
        if (savedUser) {
            this.user = JSON.parse(savedUser);
        } else {
            this.user = { ...this.defaultUser };
            this.showWelcomeModal();
        }
        
        // Charger les activités et workouts
        this.loadActivities();
        this.loadWorkouts();
        
        // Mettre à jour l'interface avec les données utilisateur
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            this.updateUI();
        }
        
        return this.user;
    }

    // Afficher le modal de bienvenue pour nouveau utilisateur
    showWelcomeModal() {
        const modalHTML = `
            <div id="welcomeModal" class="modal active">
                <div class="modal-content welcome-modal">
                    <h2>👋 Bienvenue sur FitTracker!</h2>
                    <p>Configurons votre profil pour personnaliser votre expérience</p>
                    
                    <form id="welcomeForm" class="welcome-form">
                        <div class="form-group">
                            <label>Votre nom</label>
                            <input type="text" id="welcomeName" placeholder="Jean Dupont" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Âge</label>
                                <input type="number" id="welcomeAge" placeholder="25" min="10" max="120">
                            </div>
                            <div class="form-group">
                                <label>Poids (kg)</label>
                                <input type="number" id="welcomeWeight" placeholder="70" min="30" max="300">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Taille (cm)</label>
                            <input type="number" id="welcomeHeight" placeholder="175" min="100" max="250">
                        </div>
                        
                        <div class="form-group">
                            <label>Objectif principal</label>
                            <select id="welcomeGoal">
                                <option value="weight-loss">Perte de poids</option>
                                <option value="muscle-gain">Prise de muscle</option>
                                <option value="endurance">Endurance</option>
                                <option value="general" selected>Forme générale</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Niveau</label>
                            <select id="welcomeLevel">
                                <option value="beginner" selected>Débutant</option>
                                <option value="intermediate">Intermédiaire</option>
                                <option value="advanced">Avancé</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Choisir un avatar</label>
                            <div class="avatar-selector">
                                <button type="button" class="avatar-btn" data-avatar="💪">💪</button>
                                <button type="button" class="avatar-btn" data-avatar="🏃">🏃</button>
                                <button type="button" class="avatar-btn" data-avatar="🚴">🚴</button>
                                <button type="button" class="avatar-btn" data-avatar="🏋️">🏋️</button>
                                <button type="button" class="avatar-btn" data-avatar="🤸">🤸</button>
                                <button type="button" class="avatar-btn active" data-avatar="👤">👤</button>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" id="skipWelcome">Ignorer</button>
                            <button type="submit" class="btn-primary">Commencer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Ajouter le modal au body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup event listeners
        this.setupWelcomeEvents();
    }

    setupWelcomeEvents() {
        const form = document.getElementById('welcomeForm');
        const skipBtn = document.getElementById('skipWelcome');
        const avatarBtns = document.querySelectorAll('.avatar-btn');
        
        // Avatar selection
        avatarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                avatarBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Form submission
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWelcomeData();
        });
        
        // Skip button
        skipBtn?.addEventListener('click', () => {
            this.closeWelcomeModal();
        });
    }

    saveWelcomeData() {
        const activeAvatar = document.querySelector('.avatar-btn.active');
        
        this.user.name = document.getElementById('welcomeName').value || 'Utilisateur';
        this.user.age = document.getElementById('welcomeAge').value || '';
        this.user.weight = document.getElementById('welcomeWeight').value || '';
        this.user.height = document.getElementById('welcomeHeight').value || '';
        this.user.goal = document.getElementById('welcomeGoal').value;
        this.user.level = document.getElementById('welcomeLevel').value;
        this.user.avatar = activeAvatar?.dataset.avatar || '👤';
        
        this.save();
        this.closeWelcomeModal();
        this.updateUI();
        
        // Afficher notification de bienvenue
        this.showNotification(`Bienvenue ${this.user.name}! 🎉`);
    }

    closeWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        if (modal) {
            modal.remove();
        }
    }

    // Sauvegarder l'utilisateur
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
    }

    // Mettre à jour le profil
    updateProfile(data) {
        this.user = { ...this.user, ...data };
        this.save();
        this.updateUI();
    }

    // Mettre à jour les statistiques
    updateStats(workout) {
        this.user.stats.totalWorkouts++;
        this.user.stats.totalCalories += workout.calories || 0;
        this.user.stats.totalTime += workout.duration || 0;
        this.user.stats.lastWorkout = new Date().toISOString();
        
        // Calculer la série actuelle
        this.updateStreak();
        
        this.save();
    }

    updateStreak() {
        const lastWorkout = this.user.stats.lastWorkout;
        if (lastWorkout) {
            const lastDate = new Date(lastWorkout);
            const today = new Date();
            const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                this.user.stats.currentStreak++;
                if (this.user.stats.currentStreak > this.user.stats.bestStreak) {
                    this.user.stats.bestStreak = this.user.stats.currentStreak;
                }
            } else if (diffDays > 1) {
                this.user.stats.currentStreak = 1;
            }
        } else {
            this.user.stats.currentStreak = 1;
        }
    }

    // Ajouter une activité
    addActivity(activity) {
        const newActivity = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...activity
        };
        
        this.activities.unshift(newActivity);
        this.saveActivities();
        this.updateStats(activity);
        
        return newActivity;
    }

    // Charger les activités
    loadActivities() {
        const saved = localStorage.getItem(this.activitiesKey);
        this.activities = saved ? JSON.parse(saved) : [];
        return this.activities;
    }

    // Sauvegarder les activités
    saveActivities() {
        localStorage.setItem(this.activitiesKey, JSON.stringify(this.activities));
    }

    // Charger les workouts
    loadWorkouts() {
        const saved = localStorage.getItem(this.workoutsKey);
        this.workouts = saved ? JSON.parse(saved) : [];
        return this.workouts;
    }

    // Ajouter un workout personnalisé
    addCustomWorkout(workout) {
        const newWorkout = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            ...workout
        };
        
        this.workouts.push(newWorkout);
        localStorage.setItem(this.workoutsKey, JSON.stringify(this.workouts));
        
        return newWorkout;
    }

    // Calculer l'IMC
    calculateBMI() {
        if (this.user.weight && this.user.height) {
            const height = this.user.height / 100; // Convert to meters
            const bmi = this.user.weight / (height * height);
            return bmi.toFixed(1);
        }
        return null;
    }

    // Obtenir le niveau de forme
    getFitnessLevel() {
        const levels = {
            beginner: 'Débutant',
            intermediate: 'Intermédiaire',
            advanced: 'Avancé'
        };
        return levels[this.user.level] || 'Débutant';
    }

    // Obtenir l'objectif
    getGoalText() {
        const goals = {
            'weight-loss': 'Perte de poids',
            'muscle-gain': 'Prise de muscle',
            'endurance': 'Endurance',
            'general': 'Forme générale'
        };
        return goals[this.user.goal] || 'Forme générale';
    }

    // Mettre à jour l'interface utilisateur
    updateUI() {
        // Mettre à jour le profil
        const profileName = document.querySelector('.profile-name');
        const profileLevel = document.querySelector('.profile-level');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        if (profileName) profileName.textContent = this.user.name || 'Utilisateur';
        if (profileLevel) profileLevel.textContent = this.getFitnessLevel();
        if (profileAvatar) profileAvatar.innerHTML = `<span style="font-size: 64px;">${this.user.avatar}</span>`;
        
        // Mettre à jour les stats du profil
        const statElements = document.querySelectorAll('.profile-stat .stat-value');
        if (statElements[0]) statElements[0].textContent = this.user.stats.totalWorkouts;
        if (statElements[1]) statElements[1].textContent = this.user.stats.totalCalories.toLocaleString();
        if (statElements[2]) statElements[2].textContent = this.formatTime(this.user.stats.totalTime);
        
        // Mettre à jour les infos utilisateur
        const ageElement = document.querySelector('.info-item:nth-child(1) .info-value');
        const weightElement = document.querySelector('.info-item:nth-child(2) .info-value');
        const heightElement = document.querySelector('.info-item:nth-child(3) .info-value');
        const goalElement = document.querySelector('.info-item:nth-child(4) .info-value');
        
        if (ageElement) ageElement.textContent = this.user.age ? `${this.user.age} ans` : 'Non renseigné';
        if (weightElement) weightElement.textContent = this.user.weight ? `${this.user.weight} kg` : 'Non renseigné';
        if (heightElement) heightElement.textContent = this.user.height ? `${this.user.height} cm` : 'Non renseigné';
        if (goalElement) goalElement.textContent = this.getGoalText();
        
        // Mettre à jour le dashboard
        this.updateDashboard();
    }

    updateDashboard() {
        // Calories brûlées aujourd'hui
        const todayCalories = this.getTodayCalories();
        const caloriesElement = document.querySelector('.stat-card.calories .stat-value');
        if (caloriesElement) caloriesElement.textContent = todayCalories.toLocaleString();
        
        // Entraînements cette semaine
        const weekWorkouts = this.getWeekWorkouts();
        const workoutsElement = document.querySelector('.stat-card.workouts .stat-value');
        if (workoutsElement) workoutsElement.textContent = weekWorkouts;
        
        // Temps total cette semaine
        const weekTime = this.getWeekTime();
        const timeElement = document.querySelector('.stat-card.duration .stat-value');
        if (timeElement) timeElement.textContent = this.formatTime(weekTime);
        
        // Objectifs (exemple: 3/5)
        const goalsElement = document.querySelector('.stat-card.goals .stat-value');
        if (goalsElement) goalsElement.textContent = `${Math.min(weekWorkouts, 5)}/5`;
        
        // Mettre à jour les activités récentes
        this.updateRecentActivities();
    }

    updateRecentActivities() {
        const activityList = document.querySelector('.activity-list');
        if (!activityList) return;
        
        if (this.activities.length === 0) {
            activityList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <i class="fas fa-dumbbell" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px;"></i>
                    <p>Aucune activité enregistrée</p>
                    <p style="font-size: 14px; margin-top: 10px;">Commencez votre premier entraînement!</p>
                </div>
            `;
        } else {
            activityList.innerHTML = this.activities.slice(0, 3).map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <h4 class="activity-title">${activity.name}</h4>
                        <span class="activity-date">${this.formatDate(activity.date)}</span>
                    </div>
                    <div class="activity-stats">
                        ${activity.distance ? `<span class="stat">${activity.distance} km</span>` : ''}
                        <span class="stat">${activity.duration} min</span>
                        ${activity.calories ? `<span class="stat">${activity.calories} kcal</span>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    getActivityIcon(type) {
        const icons = {
            cardio: 'running',
            strength: 'dumbbell',
            yoga: 'spa',
            cycling: 'biking',
            swimming: 'swimmer'
        };
        return icons[type] || 'dumbbell';
    }

    getTodayCalories() {
        const today = new Date().toDateString();
        return this.activities
            .filter(a => new Date(a.date).toDateString() === today)
            .reduce((sum, a) => sum + (a.calories || 0), 0);
    }

    getWeekWorkouts() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return this.activities.filter(a => new Date(a.date) > weekAgo).length;
    }

    getWeekTime() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return this.activities
            .filter(a => new Date(a.date) > weekAgo)
            .reduce((sum, a) => sum + (a.duration || 0), 0);
    }

    formatTime(minutes) {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Aujourd'hui - ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        } else if (diffDays === 1) {
            return 'Hier';
        } else if (diffDays < 7) {
            const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return days[date.getDay()];
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    }

    showNotification(message) {
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

    // Réinitialiser toutes les données
    reset() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos données?')) {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.activitiesKey);
            localStorage.removeItem(this.workoutsKey);
            this.user = { ...this.defaultUser };
            this.activities = [];
            this.workouts = [];
            location.reload();
        }
    }
}

// CSS pour le modal de bienvenue
const welcomeStyles = `
<style>
.welcome-modal {
    max-width: 500px;
    padding: 30px;
}

.welcome-form {
    margin-top: 30px;
}

.welcome-form .form-group {
    margin-bottom: 20px;
}

.welcome-form label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-primary);
    font-weight: 500;
}

.welcome-form input,
.welcome-form select {
    width: 100%;
    padding: 12px;
    background: var(--surface-light);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 16px;
}

.welcome-form .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.avatar-selector {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.avatar-btn {
    width: 60px;
    height: 60px;
    border: 2px solid var(--surface-light);
    background: var(--surface);
    border-radius: 12px;
    font-size: 32px;
    cursor: pointer;
    transition: var(--transition);
}

.avatar-btn:hover {
    transform: scale(1.1);
}

.avatar-btn.active {
    border-color: var(--primary-color);
    background: rgba(98, 0, 234, 0.2);
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.form-actions button {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    font-weight: 600;
}

.btn-secondary {
    background: var(--surface-light);
    color: var(--text-primary);
    border: none;
    cursor: pointer;
}

.btn-secondary:hover {
    background: var(--surface);
}
</style>
`;

// Ajouter les styles au document
if (!document.querySelector('#welcomeStyles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'welcomeStyles';
    styleElement.innerHTML = welcomeStyles;
    document.head.appendChild(styleElement.firstChild);
}

// Export global
window.UserManager = UserManager;