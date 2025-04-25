// Save System for Rise of the Strays
// Handles saving and loading game data using localStorage

class SaveSystem {
    constructor() {
        this.saveKey = 'riseOfTheStrays_saveData';
        this.autoSaveInterval = 60000; // Auto-save every minute
        this.autoSaveTimer = null;
        this.lastSaveTime = null;
    }

    // Initialize the save system
    initialize() {
        // Start auto-save timer
        this.startAutoSave();

        // Add event listener for page unload to save game
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });

        // Log initialization
        console.log('Save system initialized');
    }

    // Start auto-save timer
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        this.autoSaveTimer = setInterval(() => {
            this.saveGame();
            console.log('Game auto-saved');
        }, this.autoSaveInterval);

        console.log('Auto-save started');
    }

    // Stop auto-save timer
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
            console.log('Auto-save stopped');
        }
    }

    // Save the current game state
    saveGame() {
        try {
            const gameData = this.collectGameData();
            localStorage.setItem(this.saveKey, JSON.stringify(gameData));
            this.lastSaveTime = new Date();

            // Dispatch save event
            const saveEvent = new CustomEvent('gameSaved', {
                detail: { timestamp: this.lastSaveTime }
            });
            document.dispatchEvent(saveEvent);

            return true;
        } catch (error) {
            console.error('Error saving game:', error);
            return false;
        }
    }

    // Load saved game data
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.saveKey);

            if (!savedData) {
                console.log('No saved game found');
                return false;
            }

            const gameData = JSON.parse(savedData);
            this.applyGameData(gameData);

            // Dispatch load event
            const loadEvent = new CustomEvent('gameLoaded', {
                detail: { timestamp: new Date() }
            });
            document.dispatchEvent(loadEvent);

            return true;
        } catch (error) {
            console.error('Error loading game:', error);
            return false;
        }
    }

    // Check if a saved game exists
    hasSavedGame() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    // Delete saved game data
    deleteSavedGame() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('Saved game deleted');
            return true;
        } catch (error) {
            console.error('Error deleting saved game:', error);
            return false;
        }
    }

    // Get the timestamp of the last save
    getLastSaveTime() {
        return this.lastSaveTime;
    }

    // Collect all game data that needs to be saved
    collectGameData() {
        const gameData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            resources: {},
            cats: [],
            base: {},
            buildings: [],
            groups: [],
            training: {},
            gameState: {}
        };

        // Collect resource data
        if (typeof resourceManager !== 'undefined') {
            gameData.resources = {
                food: resourceManager.getResource('food'),
                materials: resourceManager.getResource('materials'),
                medicine: resourceManager.getResource('medicine')
            };
        }

        // Collect cat data
        if (typeof catManager !== 'undefined' && catManager.cats && Array.isArray(catManager.cats)) {
            gameData.cats = catManager.cats.map(cat => {
                const catData = {
                    id: cat.id,
                    name: cat.name,
                    type: cat.type,
                    rarity: cat.rarity,
                    level: cat.level,
                    xp: cat.xp,
                    xpToNext: cat.xpToNext,
                    health: cat.health,
                    happiness: cat.happiness,
                    stats: { ...cat.stats },
                    attributes: { ...cat.attributes },
                    statPoints: cat.statPoints || 0,
                    totalStatPoints: cat.totalStatPoints || 0
                };

                // Add appearance data if it exists
                if (cat.appearance) {
                    catData.appearance = { ...cat.appearance };
                }

                // Add skills if they exist
                if (cat.skills) {
                    catData.skills = { ...cat.skills };
                }

                // Add traits if they exist and are iterable
                if (cat.traits) {
                    try {
                        // Try to use spread operator, which will work if traits is iterable
                        catData.traits = [...cat.traits];
                    } catch (e) {
                        // If traits is not iterable, store as is
                        catData.traits = cat.traits;
                    }
                } else {
                    // If no traits, initialize as empty array
                    catData.traits = [];
                }

                return catData;
            });
        }

        // Collect base data
        if (typeof baseManager !== 'undefined') {
            gameData.base = {
                level: baseManager.level,
                maxCats: baseManager.maxCats
            };
        }

        // Collect building data
        if (typeof buildingManager !== 'undefined' && buildingManager.buildings && Array.isArray(buildingManager.buildings)) {
            gameData.buildings = buildingManager.buildings.map(building => ({
                type: building.type,
                level: building.level,
                production: { ...building.production }
            }));
        }

        // Collect group data
        if (typeof groupManager !== 'undefined' && groupManager.groups && Array.isArray(groupManager.groups)) {
            gameData.groups = groupManager.groups.map(group => {
                const groupData = {
                    id: group.id,
                    name: group.name,
                    status: group.status
                };

                // Check if catIds exists and is iterable
                if (group.catIds && Array.isArray(group.catIds)) {
                    groupData.catIds = [...group.catIds];
                } else {
                    groupData.catIds = [];
                }

                return groupData;
            });
        }

        // Collect training data
        if (typeof trainingManager !== 'undefined') {
            gameData.training = {
                arenaLevel: trainingManager.arenaLevel || 1
            };

            // Check if stations exists and is an array before mapping
            if (trainingManager.stations && Array.isArray(trainingManager.stations)) {
                gameData.training.stations = trainingManager.stations.map(station => ({
                    type: station.type,
                    level: station.level,
                    inUse: station.inUse,
                    catId: station.catId,
                    trainingEndTime: station.trainingEndTime ? station.trainingEndTime.toISOString() : null
                }));
            } else {
                // Initialize as empty array if stations doesn't exist
                gameData.training.stations = [];
            }
        }

        // Collect general game state
        if (typeof gameManager !== 'undefined') {
            gameData.gameState = {
                day: gameManager.day
            };
        }

        return gameData;
    }

    // Apply loaded game data to the game
    applyGameData(gameData) {
        // Apply resource data
        if (gameData.resources && typeof resourceManager !== 'undefined') {
            resourceManager.setResource('food', gameData.resources.food || 0);
            resourceManager.setResource('materials', gameData.resources.materials || 0);
            resourceManager.setResource('medicine', gameData.resources.medicine || 0);
            resourceManager.updateDisplay();
        }

        // Apply cat data
        if (gameData.cats && Array.isArray(gameData.cats) && typeof catManager !== 'undefined') {
            // Clear existing cats
            catManager.cats = [];

            // Add saved cats
            gameData.cats.forEach(catData => {
                const cat = {
                    id: catData.id,
                    name: catData.name,
                    type: catData.type,
                    rarity: catData.rarity,
                    level: catData.level,
                    xp: catData.xp,
                    xpToNext: catData.xpToNext,
                    health: catData.health,
                    happiness: catData.happiness,
                    stats: { ...catData.stats },
                    attributes: { ...catData.attributes },
                    statPoints: catData.statPoints || 0,
                    totalStatPoints: catData.totalStatPoints || 0
                };

                // Add appearance data if it exists
                if (catData.appearance) {
                    cat.appearance = { ...catData.appearance };
                }

                // Add skills if they exist
                if (catData.skills) {
                    cat.skills = { ...catData.skills };
                }

                // Add traits if they exist
                if (catData.traits) {
                    try {
                        // Try to use spread operator, which will work if traits is iterable
                        cat.traits = [...catData.traits];
                    } catch (e) {
                        // If traits is not iterable, store as is
                        cat.traits = catData.traits;
                    }
                } else {
                    // If no traits, initialize as empty array
                    cat.traits = [];
                }

                catManager.cats.push(cat);
            });

            // Update cat display
            if (typeof catManager.updateDisplay === 'function') {
                catManager.updateDisplay();
            }
        }

        // Apply base data
        if (gameData.base && typeof baseManager !== 'undefined') {
            baseManager.level = gameData.base.level || 1;
            baseManager.maxCats = gameData.base.maxCats || 10;
            baseManager.updateDisplay();
        }

        // Apply building data
        if (gameData.buildings && Array.isArray(gameData.buildings) && typeof buildingManager !== 'undefined') {
            // Clear existing buildings
            buildingManager.buildings = [];

            // Add saved buildings
            gameData.buildings.forEach(buildingData => {
                const building = {
                    type: buildingData.type,
                    level: buildingData.level,
                    production: { ...buildingData.production }
                };

                buildingManager.buildings.push(building);
            });

            // Update building display
            if (typeof buildingManager.updateDisplay === 'function') {
                buildingManager.updateDisplay();
            }
        }

        // Apply group data
        if (gameData.groups && Array.isArray(gameData.groups) && typeof groupManager !== 'undefined') {
            // Clear existing groups
            groupManager.groups = [];

            // Add saved groups
            gameData.groups.forEach(groupData => {
                const group = {
                    id: groupData.id,
                    name: groupData.name,
                    status: groupData.status
                };

                // Check if catIds exists and is iterable
                if (groupData.catIds && Array.isArray(groupData.catIds)) {
                    group.catIds = [...groupData.catIds];
                } else {
                    group.catIds = [];
                }

                groupManager.groups.push(group);
            });

            // Update group display
            if (typeof groupManager.updateGroupsDisplay === 'function') {
                groupManager.updateGroupsDisplay();
            } else if (typeof groupManager.updateDisplay === 'function') {
                groupManager.updateDisplay();
            }
        }

        // Apply training data
        if (gameData.training && typeof trainingManager !== 'undefined') {
            trainingManager.arenaLevel = gameData.training.arenaLevel || 1;

            // Clear existing stations
            trainingManager.stations = [];

            // Add saved stations
            if (gameData.training.stations && Array.isArray(gameData.training.stations)) {
                gameData.training.stations.forEach(stationData => {
                    const station = {
                        type: stationData.type,
                        level: stationData.level,
                        inUse: stationData.inUse,
                        catId: stationData.catId,
                        trainingEndTime: stationData.trainingEndTime ? new Date(stationData.trainingEndTime) : null
                    };

                    trainingManager.stations.push(station);
                });
            }

            // Update training display
            if (typeof trainingManager.updateDisplay === 'function') {
                trainingManager.updateDisplay();
            }
        }

        // Apply general game state
        if (gameData.gameState && typeof gameManager !== 'undefined') {
            gameManager.day = gameData.gameState.day || 1;
        }

        // Update all displays
        this.updateAllDisplays();
    }

    // Update all game displays after loading
    updateAllDisplays() {
        // Update resource display
        if (typeof resourceManager !== 'undefined' && typeof resourceManager.updateDisplay === 'function') {
            resourceManager.updateDisplay();
        }

        // Update cat display
        if (typeof catManager !== 'undefined') {
            if (typeof catManager.updateDisplay === 'function') {
                catManager.updateDisplay();
            }
        }

        // Update base display
        if (typeof baseManager !== 'undefined' && typeof baseManager.updateDisplay === 'function') {
            baseManager.updateDisplay();
        }

        // Update building display
        if (typeof buildingManager !== 'undefined') {
            if (typeof buildingManager.updateDisplay === 'function') {
                buildingManager.updateDisplay();
            }
            if (typeof buildingManager.updateBuildButtonStates === 'function') {
                buildingManager.updateBuildButtonStates();
            }
        }

        // Update group display
        if (typeof groupManager !== 'undefined') {
            if (typeof groupManager.updateGroupsDisplay === 'function') {
                groupManager.updateGroupsDisplay();
            } else if (typeof groupManager.updateDisplay === 'function') {
                groupManager.updateDisplay();
            }
        }

        // Update training display
        if (typeof trainingManager !== 'undefined' && typeof trainingManager.updateDisplay === 'function') {
            trainingManager.updateDisplay();
        }
    }
}

// Create global save system instance
const saveSystem = new SaveSystem();

// Initialize the save system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved game and show load prompt if found
    if (saveSystem.hasSavedGame()) {
        showLoadGamePrompt();
    }
});

// Function to show load game prompt
function showLoadGamePrompt() {
    // Create a modal dialog
    const modal = document.createElement('div');
    modal.className = 'save-load-modal';
    modal.innerHTML = `
        <div class="save-load-modal-content">
            <h2>Saved Game Found</h2>
            <p>Would you like to load your previous game?</p>
            <div class="save-load-buttons">
                <button id="load-game-btn">Load Game</button>
                <button id="new-game-btn">Start New Game</button>
            </div>
        </div>
    `;

    // Add modal to the page
    document.body.appendChild(modal);

    // Add event listeners to buttons
    document.getElementById('load-game-btn').addEventListener('click', () => {
        saveSystem.loadGame();
        modal.remove();
        gameManager.addMessage('Game loaded successfully!', true);
    });

    document.getElementById('new-game-btn').addEventListener('click', () => {
        modal.remove();
        saveSystem.initialize(); // Start auto-save for new game
    });
}
