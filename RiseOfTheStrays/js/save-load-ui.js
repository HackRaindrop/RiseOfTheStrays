// Save/Load UI Component
// Provides UI for manual saving and loading

class SaveLoadUI {
    constructor() {
        this.container = null;
        this.saveNotification = null;
        this.lastSaveInfoElement = null;
        this.notificationTimeout = null;
    }

    // Initialize the UI
    initialize() {
        this.createUI();
        this.setupEventListeners();
    }

    // Create the UI elements
    createUI() {
        // Create save/load container
        this.container = document.createElement('div');
        this.container.className = 'save-load-ui';
        this.container.innerHTML = `
            <button class="save-btn" id="manual-save-btn">
                <i class="fas fa-save"></i> Save Game
            </button>
            <button class="load-btn" id="manual-load-btn">
                <i class="fas fa-download"></i> Load Game
            </button>
            <button class="delete-btn" id="delete-save-btn">
                <i class="fas fa-trash"></i> Delete Save
            </button>
        `;

        // Create last save info element
        this.lastSaveInfoElement = document.createElement('div');
        this.lastSaveInfoElement.className = 'last-save-info';
        this.lastSaveInfoElement.textContent = 'No save data';

        // Create save notification
        this.saveNotification = document.createElement('div');
        this.saveNotification.className = 'save-notification';
        this.saveNotification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Game saved successfully!</span>
        `;

        // Add elements to the page
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(this.container);
            header.appendChild(this.lastSaveInfoElement);
        }
        document.body.appendChild(this.saveNotification);

        // Update the last save info
        this.updateLastSaveInfo();
    }

    // Set up event listeners
    setupEventListeners() {
        // Manual save button
        const saveBtn = document.getElementById('manual-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const success = saveSystem.saveGame();
                if (success) {
                    this.showSaveNotification('Game saved successfully!');
                    this.updateLastSaveInfo();
                    gameManager.addMessage('Game saved successfully!');
                } else {
                    gameManager.addMessage('Failed to save game.', true);
                }
            });
        }

        // Manual load button
        const loadBtn = document.getElementById('manual-load-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                if (saveSystem.hasSavedGame()) {
                    this.showConfirmModal(
                        'Load Game',
                        'Loading will overwrite your current progress. Are you sure?',
                        () => {
                            const success = saveSystem.loadGame();
                            if (success) {
                                gameManager.addMessage('Game loaded successfully!', true);
                                this.updateLastSaveInfo();
                            } else {
                                gameManager.addMessage('Failed to load game.', true);
                            }
                        }
                    );
                } else {
                    gameManager.addMessage('No saved game found.', true);
                }
            });
        }

        // Delete save button
        const deleteBtn = document.getElementById('delete-save-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (saveSystem.hasSavedGame()) {
                    this.showConfirmModal(
                        'Delete Save',
                        'This will permanently delete your saved game. Are you sure?',
                        () => {
                            const success = saveSystem.deleteSavedGame();
                            if (success) {
                                gameManager.addMessage('Save data deleted.', true);
                                this.updateLastSaveInfo();
                            } else {
                                gameManager.addMessage('Failed to delete save data.', true);
                            }
                        }
                    );
                } else {
                    gameManager.addMessage('No saved game found.', true);
                }
            });
        }

        // Listen for game saved event
        document.addEventListener('gameSaved', (event) => {
            this.updateLastSaveInfo();
        });

        // Listen for game loaded event
        document.addEventListener('gameLoaded', (event) => {
            this.updateLastSaveInfo();
        });
    }

    // Show save notification
    showSaveNotification(message) {
        // Clear any existing timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        // Update message
        this.saveNotification.querySelector('span').textContent = message;

        // Show notification
        this.saveNotification.classList.add('show');

        // Hide after 3 seconds
        this.notificationTimeout = setTimeout(() => {
            this.saveNotification.classList.remove('show');
        }, 3000);
    }

    // Update last save info
    updateLastSaveInfo() {
        if (saveSystem.hasSavedGame()) {
            const lastSaveTime = saveSystem.getLastSaveTime();
            if (lastSaveTime) {
                const formattedTime = this.formatDateTime(lastSaveTime);
                this.lastSaveInfoElement.textContent = `Last saved: ${formattedTime}`;
            } else {
                const savedData = localStorage.getItem(saveSystem.saveKey);
                if (savedData) {
                    try {
                        const gameData = JSON.parse(savedData);
                        if (gameData.timestamp) {
                            const savedTime = new Date(gameData.timestamp);
                            const formattedTime = this.formatDateTime(savedTime);
                            this.lastSaveInfoElement.textContent = `Last saved: ${formattedTime}`;
                        } else {
                            this.lastSaveInfoElement.textContent = 'Game data saved';
                        }
                    } catch (e) {
                        this.lastSaveInfoElement.textContent = 'Game data saved';
                    }
                } else {
                    this.lastSaveInfoElement.textContent = 'No save data';
                }
            }
        } else {
            this.lastSaveInfoElement.textContent = 'No save data';
        }
    }

    // Format date and time
    formatDateTime(date) {
        if (!date) return '';
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isToday = date >= today;
        const isYesterday = date >= yesterday && date < today;
        
        let formattedDate = '';
        
        if (isToday) {
            formattedDate = 'Today';
        } else if (isYesterday) {
            formattedDate = 'Yesterday';
        } else {
            formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        }
        
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${formattedDate} at ${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    // Show confirmation modal
    showConfirmModal(title, message, onConfirm) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-yes">Yes</button>
                    <button class="confirm-no">No</button>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(modal);
        
        // Add event listeners
        const yesBtn = modal.querySelector('.confirm-yes');
        const noBtn = modal.querySelector('.confirm-no');
        
        yesBtn.addEventListener('click', () => {
            modal.remove();
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        });
        
        noBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Create global save load UI instance
const saveLoadUI = new SaveLoadUI();

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure other components are loaded
    setTimeout(() => {
        saveLoadUI.initialize();
    }, 500);
});
