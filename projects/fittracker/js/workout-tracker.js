// ===== Workout Tracker - Carnet de Musculation =====

class WorkoutTracker {
    constructor() {
        this.storageKey = 'fittracker_workout_sessions';
        this.exercisesKey = 'fittracker_exercises_db';
        this.currentSession = null;
        this.sessions = [];
        this.exercises = this.getDefaultExercises();
        this.init();
    }

    init() {
        this.loadSessions();
        this.loadExercises();
    }

    getDefaultExercises() {
        return {
            chest: [
                { id: 'bench-press', name: 'Développé couché', muscle: 'Pectoraux', equipment: 'Barre' },
                { id: 'incline-press', name: 'Développé incliné', muscle: 'Pectoraux hauts', equipment: 'Barre' },
                { id: 'dumbbell-press', name: 'Développé haltères', muscle: 'Pectoraux', equipment: 'Haltères' },
                { id: 'cable-fly', name: 'Écarté poulie', muscle: 'Pectoraux', equipment: 'Câbles' },
                { id: 'push-ups', name: 'Pompes', muscle: 'Pectoraux', equipment: 'Poids du corps' },
                { id: 'dips', name: 'Dips', muscle: 'Pectoraux bas', equipment: 'Barres parallèles' }
            ],
            back: [
                { id: 'pull-ups', name: 'Tractions', muscle: 'Dos', equipment: 'Barre de traction' },
                { id: 'lat-pulldown', name: 'Tirage vertical', muscle: 'Dorsaux', equipment: 'Poulie' },
                { id: 'rowing', name: 'Rowing barre', muscle: 'Dos', equipment: 'Barre' },
                { id: 'cable-row', name: 'Tirage horizontal', muscle: 'Dos', equipment: 'Câbles' },
                { id: 'deadlift', name: 'Soulevé de terre', muscle: 'Dos complet', equipment: 'Barre' },
                { id: 'shrugs', name: 'Shrugs', muscle: 'Trapèzes', equipment: 'Haltères' }
            ],
            shoulders: [
                { id: 'military-press', name: 'Développé militaire', muscle: 'Épaules', equipment: 'Barre' },
                { id: 'dumbbell-press-shoulders', name: 'Développé haltères épaules', muscle: 'Épaules', equipment: 'Haltères' },
                { id: 'lateral-raises', name: 'Élévations latérales', muscle: 'Deltoïdes', equipment: 'Haltères' },
                { id: 'front-raises', name: 'Élévations frontales', muscle: 'Deltoïdes avant', equipment: 'Haltères' },
                { id: 'rear-delt-fly', name: 'Oiseau', muscle: 'Deltoïdes arrière', equipment: 'Haltères' },
                { id: 'upright-row', name: 'Tirage menton', muscle: 'Épaules', equipment: 'Barre' }
            ],
            arms: [
                { id: 'bicep-curl', name: 'Curl biceps', muscle: 'Biceps', equipment: 'Barre' },
                { id: 'hammer-curl', name: 'Curl marteau', muscle: 'Biceps', equipment: 'Haltères' },
                { id: 'preacher-curl', name: 'Curl pupitre', muscle: 'Biceps', equipment: 'Barre EZ' },
                { id: 'tricep-extension', name: 'Extension triceps', muscle: 'Triceps', equipment: 'Haltères' },
                { id: 'tricep-pushdown', name: 'Pushdown triceps', muscle: 'Triceps', equipment: 'Câbles' },
                { id: 'close-grip-bench', name: 'Développé serré', muscle: 'Triceps', equipment: 'Barre' }
            ],
            legs: [
                { id: 'squat', name: 'Squat', muscle: 'Quadriceps', equipment: 'Barre' },
                { id: 'leg-press', name: 'Presse à cuisses', muscle: 'Quadriceps', equipment: 'Machine' },
                { id: 'leg-curl', name: 'Leg curl', muscle: 'Ischio-jambiers', equipment: 'Machine' },
                { id: 'leg-extension', name: 'Leg extension', muscle: 'Quadriceps', equipment: 'Machine' },
                { id: 'calf-raises', name: 'Mollets debout', muscle: 'Mollets', equipment: 'Machine' },
                { id: 'lunges', name: 'Fentes', muscle: 'Jambes complètes', equipment: 'Haltères' }
            ],
            abs: [
                { id: 'crunches', name: 'Crunchs', muscle: 'Abdominaux', equipment: 'Poids du corps' },
                { id: 'plank', name: 'Planche', muscle: 'Gainage', equipment: 'Poids du corps' },
                { id: 'russian-twist', name: 'Russian twist', muscle: 'Obliques', equipment: 'Poids/Médecine ball' },
                { id: 'leg-raises', name: 'Relevé de jambes', muscle: 'Abdominaux bas', equipment: 'Barre de traction' },
                { id: 'cable-crunch', name: 'Crunch poulie', muscle: 'Abdominaux', equipment: 'Câbles' },
                { id: 'side-plank', name: 'Planche latérale', muscle: 'Obliques', equipment: 'Poids du corps' }
            ]
        };
    }

    loadSessions() {
        const saved = localStorage.getItem(this.storageKey);
        this.sessions = saved ? JSON.parse(saved) : [];
    }

    saveSessions() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.sessions));
    }

    loadExercises() {
        const saved = localStorage.getItem(this.exercisesKey);
        if (saved) {
            this.exercises = JSON.parse(saved);
        } else {
            this.saveExercises();
        }
    }

    saveExercises() {
        localStorage.setItem(this.exercisesKey, JSON.stringify(this.exercises));
    }

    startNewSession(name = '') {
        this.currentSession = {
            id: Date.now(),
            name: name || `Séance du ${new Date().toLocaleDateString('fr-FR')}`,
            date: new Date().toISOString(),
            exercises: [],
            totalSets: 0,
            totalReps: 0,
            totalWeight: 0,
            duration: 0,
            startTime: Date.now()
        };
        return this.currentSession;
    }

    addExerciseToSession(exerciseData) {
        if (!this.currentSession) {
            this.startNewSession();
        }

        const exercise = {
            id: Date.now(),
            exerciseId: exerciseData.exerciseId,
            exerciseName: exerciseData.exerciseName,
            sets: exerciseData.sets || [],
            notes: exerciseData.notes || '',
            restTime: exerciseData.restTime || 60 // secondes
        };

        this.currentSession.exercises.push(exercise);
        this.updateSessionStats();
        return exercise;
    }

    addSetToExercise(exerciseIndex, setData) {
        if (!this.currentSession || !this.currentSession.exercises[exerciseIndex]) {
            return false;
        }

        const set = {
            reps: setData.reps,
            weight: setData.weight,
            completed: setData.completed || false,
            timestamp: Date.now()
        };

        this.currentSession.exercises[exerciseIndex].sets.push(set);
        this.updateSessionStats();
        return true;
    }

    updateSet(exerciseIndex, setIndex, setData) {
        if (!this.currentSession || 
            !this.currentSession.exercises[exerciseIndex] || 
            !this.currentSession.exercises[exerciseIndex].sets[setIndex]) {
            return false;
        }

        this.currentSession.exercises[exerciseIndex].sets[setIndex] = {
            ...this.currentSession.exercises[exerciseIndex].sets[setIndex],
            ...setData
        };
        this.updateSessionStats();
        return true;
    }

    removeSet(exerciseIndex, setIndex) {
        if (!this.currentSession || 
            !this.currentSession.exercises[exerciseIndex] || 
            !this.currentSession.exercises[exerciseIndex].sets[setIndex]) {
            return false;
        }

        this.currentSession.exercises[exerciseIndex].sets.splice(setIndex, 1);
        this.updateSessionStats();
        return true;
    }

    updateSessionStats() {
        if (!this.currentSession) return;

        let totalSets = 0;
        let totalReps = 0;
        let totalWeight = 0;

        this.currentSession.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
                if (set.completed) {
                    totalSets++;
                    totalReps += set.reps;
                    totalWeight += (set.weight * set.reps);
                }
            });
        });

        this.currentSession.totalSets = totalSets;
        this.currentSession.totalReps = totalReps;
        this.currentSession.totalWeight = totalWeight;
    }

    finishSession() {
        if (!this.currentSession) return null;

        this.currentSession.endTime = Date.now();
        this.currentSession.duration = Math.round((this.currentSession.endTime - this.currentSession.startTime) / 1000 / 60); // minutes
        
        // Calculer les calories approximatives (formule simplifiée)
        const calories = Math.round(this.currentSession.duration * 5 + (this.currentSession.totalWeight / 100));
        this.currentSession.calories = calories;

        this.sessions.unshift(this.currentSession);
        this.saveSessions();

        // Mettre à jour les stats utilisateur si UserManager est disponible
        if (window.userManager) {
            window.userManager.addActivity({
                type: 'strength',
                name: this.currentSession.name,
                duration: this.currentSession.duration,
                calories: calories,
                details: `${this.currentSession.totalSets} séries, ${this.currentSession.totalReps} reps, ${this.currentSession.totalWeight}kg total`
            });
        }

        const finishedSession = this.currentSession;
        this.currentSession = null;
        return finishedSession;
    }

    getSession(sessionId) {
        return this.sessions.find(s => s.id === sessionId);
    }

    getRecentSessions(limit = 10) {
        return this.sessions.slice(0, limit);
    }

    getExerciseHistory(exerciseId, limit = 10) {
        const history = [];
        
        this.sessions.forEach(session => {
            session.exercises.forEach(exercise => {
                if (exercise.exerciseId === exerciseId) {
                    history.push({
                        date: session.date,
                        sessionName: session.name,
                        sets: exercise.sets,
                        notes: exercise.notes
                    });
                }
            });
        });

        return history.slice(0, limit);
    }

    getPersonalRecords() {
        const records = {};
        
        this.sessions.forEach(session => {
            session.exercises.forEach(exercise => {
                if (!records[exercise.exerciseId]) {
                    records[exercise.exerciseId] = {
                        exerciseName: exercise.exerciseName,
                        maxWeight: 0,
                        maxReps: 0,
                        maxVolume: 0,
                        bestSet: null
                    };
                }
                
                exercise.sets.forEach(set => {
                    if (set.completed) {
                        const volume = set.weight * set.reps;
                        
                        if (set.weight > records[exercise.exerciseId].maxWeight) {
                            records[exercise.exerciseId].maxWeight = set.weight;
                        }
                        
                        if (set.reps > records[exercise.exerciseId].maxReps) {
                            records[exercise.exerciseId].maxReps = set.reps;
                        }
                        
                        if (volume > records[exercise.exerciseId].maxVolume) {
                            records[exercise.exerciseId].maxVolume = volume;
                            records[exercise.exerciseId].bestSet = set;
                        }
                    }
                });
            });
        });
        
        return records;
    }

    getStats() {
        const stats = {
            totalSessions: this.sessions.length,
            totalExercises: 0,
            totalSets: 0,
            totalReps: 0,
            totalWeight: 0,
            totalDuration: 0,
            favoriteExercises: {},
            muscleGroupDistribution: {}
        };

        this.sessions.forEach(session => {
            stats.totalExercises += session.exercises.length;
            stats.totalSets += session.totalSets;
            stats.totalReps += session.totalReps;
            stats.totalWeight += session.totalWeight;
            stats.totalDuration += session.duration;

            session.exercises.forEach(exercise => {
                // Compter les exercices favoris
                if (!stats.favoriteExercises[exercise.exerciseName]) {
                    stats.favoriteExercises[exercise.exerciseName] = 0;
                }
                stats.favoriteExercises[exercise.exerciseName]++;
            });
        });

        // Trier les exercices favoris
        stats.favoriteExercises = Object.entries(stats.favoriteExercises)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

        return stats;
    }

    addCustomExercise(category, exercise) {
        if (!this.exercises[category]) {
            this.exercises[category] = [];
        }
        
        exercise.id = exercise.id || `custom-${Date.now()}`;
        this.exercises[category].push(exercise);
        this.saveExercises();
        return exercise;
    }

    deleteSession(sessionId) {
        const index = this.sessions.findIndex(s => s.id === sessionId);
        if (index !== -1) {
            this.sessions.splice(index, 1);
            this.saveSessions();
            return true;
        }
        return false;
    }
}

// Export global
window.WorkoutTracker = WorkoutTracker;