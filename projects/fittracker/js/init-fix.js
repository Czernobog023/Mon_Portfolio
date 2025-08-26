// Fix initialization issues - ensure empty state for new users
(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    function initializeFitTracker() {
        console.log('🚀 FitTracker Initialization Fix Running...');
        
        // Check if UserManager exists
        if (typeof window.userManager === 'undefined' || !window.userManager) {
            console.log('⚠️ UserManager not initialized, creating now...');
            if (typeof UserManager !== 'undefined') {
                window.userManager = new UserManager();
                window.userManager.init();
            }
        }
        
        // Force update UI with current user data or empty state
        if (window.userManager) {
            console.log('📊 Updating UI with user data...');
            
            // Get current user data
            const userData = window.userManager.user || window.userManager.defaultUser;
            
            // Update profile section
            const profileName = document.querySelector('.profile-name');
            const profileLevel = document.querySelector('.profile-level');
            const profileAvatar = document.querySelector('.profile-avatar');
            
            if (profileName) {
                profileName.textContent = userData.name || 'Utilisateur';
                console.log('✓ Profile name updated:', profileName.textContent);
            }
            
            if (profileLevel) {
                profileLevel.textContent = `Niveau ${userData.level === 'beginner' ? 'Débutant' : userData.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}`;
            }
            
            if (profileAvatar && userData.avatar) {
                profileAvatar.innerHTML = `<span style="font-size: 64px;">${userData.avatar}</span>`;
            }
            
            // Update profile stats
            const profileStats = document.querySelectorAll('.profile-stat .stat-value');
            if (profileStats.length >= 3) {
                profileStats[0].textContent = userData.stats?.totalWorkouts || '0';
                profileStats[1].textContent = userData.stats?.totalCalories?.toLocaleString() || '0';
                profileStats[2].textContent = userData.stats?.totalTime ? window.userManager.formatTime(userData.stats.totalTime) : '0h';
                console.log('✓ Profile stats updated');
            }
            
            // Update user info
            const infoItems = document.querySelectorAll('.info-item .info-value');
            if (infoItems.length >= 4) {
                infoItems[0].textContent = userData.age ? `${userData.age} ans` : 'Non renseigné';
                infoItems[1].textContent = userData.weight ? `${userData.weight} kg` : 'Non renseigné';
                infoItems[2].textContent = userData.height ? `${userData.height} cm` : 'Non renseigné';
                infoItems[3].textContent = window.userManager.getGoalText ? window.userManager.getGoalText() : 'Forme générale';
                console.log('✓ User info updated');
            }
            
            // Update dashboard stats
            const dashboardStats = document.querySelectorAll('.stat-card .stat-value');
            if (dashboardStats.length >= 4) {
                // Calories aujourd'hui
                dashboardStats[0].textContent = window.userManager.getTodayCalories ? window.userManager.getTodayCalories() : '0';
                // Entraînements cette semaine
                dashboardStats[1].textContent = window.userManager.getWeekWorkouts ? window.userManager.getWeekWorkouts() : '0';
                // Temps total cette semaine
                const weekTime = window.userManager.getWeekTime ? window.userManager.getWeekTime() : 0;
                dashboardStats[2].textContent = window.userManager.formatTime ? window.userManager.formatTime(weekTime) : '0m';
                // Objectifs
                const weekWorkouts = window.userManager.getWeekWorkouts ? window.userManager.getWeekWorkouts() : 0;
                dashboardStats[3].textContent = `${Math.min(weekWorkouts, 5)}/5`;
                console.log('✓ Dashboard stats updated');
            }
            
            // Update recent activities
            if (window.userManager.updateRecentActivities) {
                window.userManager.updateRecentActivities();
                console.log('✓ Recent activities updated');
            }
            
            console.log('✅ FitTracker UI fully updated!');
        } else {
            console.error('❌ UserManager could not be initialized');
        }
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFitTracker);
    } else {
        // DOM already loaded, run immediately
        setTimeout(initializeFitTracker, 100); // Small delay to ensure all scripts are loaded
    }
    
    // Also expose globally for debugging
    window.forceUpdateFitTracker = initializeFitTracker;
})();