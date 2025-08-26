// ===== Gym Notebook UI Controller =====

class GymNotebookUI {
    constructor() {
        this.workoutTracker = null;
        this.sessionTimer = null;
        this.sessionStartTime = null;
        this.init();
    }

    init() {
        // Initialize workout tracker
        if (typeof WorkoutTracker !== 'undefined') {
            this.workoutTracker = new WorkoutTracker();
            this.setupEventListeners();
            this.loadRecentSessions();
            this.loadPersonalRecords();
        } else {
            console.error('WorkoutTracker not loaded');
        }
    }

    setupEventListeners() {
        // Start new session
        document.getElementById('start-gym-session')?.addEventListener('click', () => {
            this.startNewSession();
        });

        // Add exercise to session
        document.getElementById('add-exercise-to-session')?.addEventListener('click', () => {
            this.showExerciseSelector();
        });

        // Pause session
        document.getElementById('pause-session')?.addEventListener('click', () => {
            this.pauseSession();
        });

        // Finish session
        document.getElementById('finish-session')?.addEventListener('click', () => {
            this.finishSession();
        });
    }

    startNewSession() {
        const sessionName = prompt('Nom de la séance (optionnel):', `Séance ${new Date().toLocaleDateString('fr-FR')}`);
        
        if (sessionName !== null) {
            this.workoutTracker.startNewSession(sessionName);
            this.sessionStartTime = Date.now();
            
            // Show current session UI
            document.getElementById('current-gym-session').style.display = 'block';
            document.getElementById('session-name').textContent = sessionName || 'Séance en cours';
            
            // Start timer
            this.startSessionTimer();
            
            // Reset stats
            this.updateSessionStats();
            
            // Clear exercises list
            document.getElementById('session-exercises-list').innerHTML = '';
            
            // Hide start button
            document.getElementById('start-gym-session').style.display = 'none';
        }
    }

    startSessionTimer() {
        this.sessionTimer = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('session-timer').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    pauseSession() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
            document.getElementById('pause-session').innerHTML = '<i class="fas fa-play"></i> Reprendre';
        } else {
            this.startSessionTimer();
            document.getElementById('pause-session').innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    finishSession() {
        if (confirm('Terminer la séance?')) {
            clearInterval(this.sessionTimer);
            const session = this.workoutTracker.finishSession();
            
            if (session) {
                // Show summary
                alert(`Séance terminée!\n\nDurée: ${session.duration} min\nExercices: ${session.exercises.length}\nSéries: ${session.totalSets}\nVolume total: ${session.totalWeight} kg`);
                
                // Hide current session
                document.getElementById('current-gym-session').style.display = 'none';
                document.getElementById('start-gym-session').style.display = 'block';
                
                // Reload recent sessions
                this.loadRecentSessions();
                this.loadPersonalRecords();
            }
        }
    }

    showExerciseSelector() {
        const modalHTML = `
            <div id="exercise-selector-modal" class="exercise-modal">
                <div class="exercise-modal-content">
                    <div class="exercise-modal-header">
                        <h3>Sélectionner un exercice</h3>
                    </div>
                    <div class="exercise-categories">
                        <button class="category-btn active" data-category="chest">Pectoraux</button>
                        <button class="category-btn" data-category="back">Dos</button>
                        <button class="category-btn" data-category="shoulders">Épaules</button>
                        <button class="category-btn" data-category="arms">Bras</button>
                        <button class="category-btn" data-category="legs">Jambes</button>
                        <button class="category-btn" data-category="abs">Abdos</button>
                    </div>
                    <div class="exercise-modal-body">
                        <div class="exercise-select-list" id="exercise-select-list">
                            <!-- Exercises will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadExercisesByCategory(btn.dataset.category);
            });
        });
        
        // Load initial category
        this.loadExercisesByCategory('chest');
        
        // Close on outside click
        document.getElementById('exercise-selector-modal').addEventListener('click', (e) => {
            if (e.target.id === 'exercise-selector-modal') {
                e.target.remove();
            }
        });
    }

    loadExercisesByCategory(category) {
        const exercises = this.workoutTracker.exercises[category] || [];
        const listEl = document.getElementById('exercise-select-list');
        
        listEl.innerHTML = exercises.map(ex => `
            <div class="exercise-select-item" data-exercise='${JSON.stringify(ex)}'>
                <div>
                    <div class="exercise-select-name">${ex.name}</div>
                    <div class="exercise-select-muscle">${ex.muscle}</div>
                </div>
                <div class="exercise-select-equipment">${ex.equipment}</div>
            </div>
        `).join('');
        
        // Add click handlers
        listEl.querySelectorAll('.exercise-select-item').forEach(item => {
            item.addEventListener('click', () => {
                const exercise = JSON.parse(item.dataset.exercise);
                this.addExerciseToCurrentSession(exercise);
                document.getElementById('exercise-selector-modal').remove();
            });
        });
    }

    addExerciseToCurrentSession(exercise) {
        const exerciseData = {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: []
        };
        
        const addedExercise = this.workoutTracker.addExerciseToSession(exerciseData);
        const exerciseIndex = this.workoutTracker.currentSession.exercises.length - 1;
        
        const exerciseHTML = `
            <div class="exercise-item" data-exercise-index="${exerciseIndex}">
                <div class="exercise-header">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-actions">
                        <button onclick="gymNotebookUI.removeExercise(${exerciseIndex})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="sets-table">
                    <div class="sets-table-header">
                        <span>Set</span>
                        <span>Reps</span>
                        <span>Poids (kg)</span>
                        <span>Repos (s)</span>
                        <span>✓</span>
                    </div>
                    <div class="sets-list" id="sets-list-${exerciseIndex}">
                        <!-- Sets will be added here -->
                    </div>
                    <button class="add-set-btn" onclick="gymNotebookUI.addSet(${exerciseIndex})">
                        + Ajouter une série
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('session-exercises-list').insertAdjacentHTML('beforeend', exerciseHTML);
        
        // Add first set automatically
        this.addSet(exerciseIndex);
        this.updateSessionStats();
    }

    addSet(exerciseIndex) {
        const setIndex = this.workoutTracker.currentSession.exercises[exerciseIndex].sets.length;
        
        // Get previous set data for convenience
        const prevSet = setIndex > 0 ? 
            this.workoutTracker.currentSession.exercises[exerciseIndex].sets[setIndex - 1] : 
            { reps: 10, weight: 20 };
        
        const setHTML = `
            <div class="set-row" data-set-index="${setIndex}">
                <div class="set-number">${setIndex + 1}</div>
                <input type="number" class="set-input" id="reps-${exerciseIndex}-${setIndex}" 
                       value="${prevSet.reps}" min="1" max="100" 
                       onchange="gymNotebookUI.updateSet(${exerciseIndex}, ${setIndex})">
                <input type="number" class="set-input" id="weight-${exerciseIndex}-${setIndex}" 
                       value="${prevSet.weight}" min="0" step="2.5" 
                       onchange="gymNotebookUI.updateSet(${exerciseIndex}, ${setIndex})">
                <input type="number" class="set-input" id="rest-${exerciseIndex}-${setIndex}" 
                       value="60" min="0" step="15">
                <input type="checkbox" class="set-checkbox" id="done-${exerciseIndex}-${setIndex}"
                       onchange="gymNotebookUI.updateSet(${exerciseIndex}, ${setIndex})">
            </div>
        `;
        
        document.getElementById(`sets-list-${exerciseIndex}`).insertAdjacentHTML('beforeend', setHTML);
        
        // Add set to tracker
        this.workoutTracker.addSetToExercise(exerciseIndex, {
            reps: prevSet.reps,
            weight: prevSet.weight,
            completed: false
        });
    }

    updateSet(exerciseIndex, setIndex) {
        const reps = parseInt(document.getElementById(`reps-${exerciseIndex}-${setIndex}`).value) || 0;
        const weight = parseFloat(document.getElementById(`weight-${exerciseIndex}-${setIndex}`).value) || 0;
        const completed = document.getElementById(`done-${exerciseIndex}-${setIndex}`).checked;
        
        this.workoutTracker.updateSet(exerciseIndex, setIndex, {
            reps: reps,
            weight: weight,
            completed: completed
        });
        
        this.updateSessionStats();
    }

    removeExercise(exerciseIndex) {
        if (confirm('Supprimer cet exercice?')) {
            this.workoutTracker.currentSession.exercises.splice(exerciseIndex, 1);
            document.querySelector(`[data-exercise-index="${exerciseIndex}"]`).remove();
            this.updateSessionStats();
        }
    }

    updateSessionStats() {
        if (!this.workoutTracker.currentSession) return;
        
        const session = this.workoutTracker.currentSession;
        document.getElementById('session-exercises').textContent = session.exercises.length;
        document.getElementById('session-sets').textContent = session.totalSets;
        document.getElementById('session-volume').textContent = `${session.totalWeight} kg`;
    }

    loadRecentSessions() {
        const sessions = this.workoutTracker.getRecentSessions(5);
        const listEl = document.getElementById('recent-sessions-list');
        
        if (sessions.length === 0) {
            listEl.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucune séance enregistrée</p>';
            return;
        }
        
        listEl.innerHTML = sessions.map(session => `
            <div class="session-history-item" onclick="gymNotebookUI.showSessionDetails('${session.id}')">
                <div class="session-info">
                    <div class="session-date">${new Date(session.date).toLocaleDateString('fr-FR')}</div>
                    <div class="session-title">${session.name}</div>
                    <div class="session-summary">
                        <span><i class="fas fa-dumbbell"></i> ${session.exercises.length} exercices</span>
                        <span><i class="fas fa-repeat"></i> ${session.totalSets} séries</span>
                        <span><i class="fas fa-weight"></i> ${session.totalWeight} kg</span>
                        <span><i class="fas fa-clock"></i> ${session.duration} min</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadPersonalRecords() {
        const records = this.workoutTracker.getPersonalRecords();
        const listEl = document.getElementById('personal-records-list');
        
        const recordsArray = Object.entries(records).slice(0, 6);
        
        if (recordsArray.length === 0) {
            listEl.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Aucun record enregistré</p>';
            return;
        }
        
        listEl.innerHTML = recordsArray.map(([exerciseId, record]) => `
            <div class="record-card">
                <div class="record-exercise">${record.exerciseName}</div>
                <div class="record-stats">
                    <div class="record-stat">
                        <span class="record-label">Poids max</span>
                        <span class="record-value">${record.maxWeight} kg</span>
                    </div>
                    <div class="record-stat">
                        <span class="record-label">Reps max</span>
                        <span class="record-value">${record.maxReps}</span>
                    </div>
                    <div class="record-stat">
                        <span class="record-label">Volume max</span>
                        <span class="record-value">${record.maxVolume} kg</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showSessionDetails(sessionId) {
        const session = this.workoutTracker.getSession(parseInt(sessionId));
        if (!session) return;
        
        let details = `Séance: ${session.name}\n`;
        details += `Date: ${new Date(session.date).toLocaleDateString('fr-FR')}\n`;
        details += `Durée: ${session.duration} minutes\n\n`;
        
        session.exercises.forEach(ex => {
            details += `${ex.exerciseName}:\n`;
            ex.sets.forEach((set, i) => {
                if (set.completed) {
                    details += `  Set ${i+1}: ${set.reps} reps @ ${set.weight}kg\n`;
                }
            });
        });
        
        details += `\nTotal: ${session.totalSets} séries, ${session.totalReps} reps, ${session.totalWeight}kg`;
        
        alert(details);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gymNotebookUI = new GymNotebookUI();
    });
} else {
    window.gymNotebookUI = new GymNotebookUI();
}