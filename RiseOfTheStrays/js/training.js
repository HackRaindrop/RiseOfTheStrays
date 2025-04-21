// Training system for cats
class TrainingManager {
    // This class depends on gameManager and catManager being defined
    constructor() {
        // Training arena level and upgrade properties
        this.arenaLevel = 1;
        this.arenaUpgradeCost = 15; // Starting upgrade cost (materials)
        this.xpMultiplier = 1.0; // Base XP multiplier

        // Training stations with their properties
        this.trainingStations = [
            {
                id: 1,
                name: "Basic Training Ground",
                description: "A simple training area for basic skills. Low XP gain but short cooldown.",
                xpPerMinute: 20, // Increased from 5
                maxDuration: 2, // minutes (reduced from 30)
                cooldown: 0.5, // minutes (reduced from 7)
                unlockLevel: 1,
                inUse: false,
                cooldownUntil: null,
                assignedCat: null,
                trainingEndTime: null,
                icon: "🏋️",
                position: 0 // Position in the grid
            },
            {
                id: 2,
                name: "Advanced Gym",
                description: "More intensive training with specialized equipment. Medium XP gain.",
                xpPerMinute: 40, // Increased from 10
                maxDuration: 4, // minutes (reduced from 60)
                cooldown: 1, // minutes (reduced from 15)
                unlockLevel: 3,
                inUse: false,
                cooldownUntil: null,
                assignedCat: null,
                trainingEndTime: null,
                icon: "💪",
                position: 1 // Position in the grid
            },
            {
                id: 3,
                name: "Elite Dojo",
                description: "High-intensity training for experienced cats. High XP gain but long cooldown.",
                xpPerMinute: 80, // Increased from 20
                maxDuration: 7, // minutes (reduced from 120)
                cooldown: 2, // minutes (reduced from 30)
                unlockLevel: 5,
                inUse: false,
                cooldownUntil: null,
                assignedCat: null,
                trainingEndTime: null,
                icon: "🥋",
                position: 2 // Position in the grid
            }
        ];

        // Track cats that are on cooldown after training
        this.catCooldowns = {};

        // Track the currently active/selected training station
        this.activeStationId = null;

        // Initialize the update intervals
        this.statusInterval = setInterval(() => this.checkTrainingStatus(), 10000); // Check training status every 10 seconds
        this.progressInterval = setInterval(() => this.updateProgressBars(), 1000); // Update progress bars every second

        // Set the first training station as active by default
        if (this.trainingStations.length > 0) {
            this.activeStationId = this.trainingStations[0].id;
        }


        // Initialize the display
        this.updateDisplay();
    }

    // Assign a cat to a training station
    assignCatToTraining(catId, stationId, duration) {
        const cat = catManager.cats.find(c => c.id === catId);
        const station = this.trainingStations.find(s => s.id === stationId);

        if (!cat || !station) {
            gameManager.addMessage("Invalid cat or training station.");
            return false;
        }

        // Check if the cat is on cooldown
        if (this.isCatOnCooldown(catId)) {
            gameManager.addMessage(`${cat.name} is still tired from previous training. Please wait until they recover.`);
            return false;
        }

        // Check if the station is available
        if (station.inUse || this.isStationOnCooldown(stationId)) {
            gameManager.addMessage(`${station.name} is currently unavailable. Please try another station or wait.`);
            return false;
        }

        // Check if the cat meets the level requirement
        if (cat.level < station.unlockLevel) {
            gameManager.addMessage(`${cat.name} needs to be at least level ${station.unlockLevel} to use ${station.name}.`);
            return false;
        }

        // Validate duration
        const validDuration = Math.min(Math.max(1, duration), station.maxDuration); // Minimum reduced from 5 to 1

        // Calculate end time
        const now = Date.now();
        const endTime = now + (validDuration * 60 * 1000); // Convert minutes to milliseconds

        // Update station status
        station.inUse = true;
        station.assignedCat = catId;
        station.duration = validDuration; // Store the duration for progress calculation
        station.trainingEndTime = endTime;

        // Add message
        gameManager.addMessage(`${cat.name} has started training at ${station.name} for ${validDuration} minutes.`);

        // Update the display
        this.updateDisplay();

        // If this was the active station, update its details
        if (this.activeStationId === stationId) {
            this.showTrainingBaseDetails(stationId);
        }

        return true;
    }

    // Check if a cat is on cooldown
    isCatOnCooldown(catId) {
        if (!this.catCooldowns[catId]) return false;
        return Date.now() < this.catCooldowns[catId];
    }

    // Check if a station is on cooldown
    isStationOnCooldown(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station || !station.cooldownUntil) return false;
        return Date.now() < station.cooldownUntil;
    }

    // Get remaining cooldown time for a cat in minutes
    getCatCooldownRemaining(catId) {
        if (!this.isCatOnCooldown(catId)) return 0;

        const remainingMs = this.catCooldowns[catId] - Date.now();
        return Math.ceil(remainingMs / (60 * 1000)); // Convert ms to minutes
    }

    // Get remaining cooldown time for a station in minutes
    getStationCooldownRemaining(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station || !this.isStationOnCooldown(stationId)) return 0;

        const remainingMs = station.cooldownUntil - Date.now();
        return Math.ceil(remainingMs / (60 * 1000)); // Convert ms to minutes
    }

    // Get remaining training time for a station in minutes
    getTrainingTimeRemaining(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station || !station.inUse || !station.trainingEndTime) return 0;

        const remainingMs = station.trainingEndTime - Date.now();
        return Math.max(0, Math.ceil(remainingMs / (60 * 1000))); // Convert ms to minutes
    }

    // Check the status of all training stations
    checkTrainingStatus() {
        const now = Date.now();
        let updated = false;

        this.trainingStations.forEach(station => {
            // Check if training is complete
            if (station.inUse && station.trainingEndTime && now >= station.trainingEndTime) {
                this.completeTraining(station.id);
                updated = true;
            }

            // Check if cooldown is complete
            if (!station.inUse && station.cooldownUntil && now >= station.cooldownUntil) {
                station.cooldownUntil = null;
                updated = true;
            }
        });

        // Check cat cooldowns
        Object.keys(this.catCooldowns).forEach(catId => {
            if (now >= this.catCooldowns[catId]) {
                delete this.catCooldowns[catId];
                const cat = catManager.cats.find(c => c.id === parseInt(catId));
                if (cat) {
                    gameManager.addMessage(`${cat.name} has recovered and is ready for training again.`);
                }
                updated = true;
            }
        });

        if (updated) {
            this.updateDisplay();

            // Update any active station details
            if (this.activeStationId) {
                this.showTrainingBaseDetails(this.activeStationId);
            }
        }
    }

    // Complete training for a station
    completeTraining(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station || !station.inUse) return;

        const catId = station.assignedCat;
        const cat = catManager.cats.find(c => c.id === catId);

        if (cat) {
            // Calculate training duration in minutes
            const trainingStartTime = station.trainingEndTime - (station.maxDuration * 60 * 1000);
            const actualDuration = (Date.now() - trainingStartTime) / (60 * 1000);
            const cappedDuration = Math.min(actualDuration, station.maxDuration);

            // Calculate XP gained with arena multiplier
            const xpGained = Math.floor(this.getEffectiveXPPerMinute(stationId) * cappedDuration);

            // Add XP to the cat
            const result = catManager.addXP(catId, xpGained);

            // Add message
            gameManager.addMessage(`${cat.name} has completed training at ${station.name} and gained ${result.xpGained} XP!`);

            // Set cat cooldown
            const catCooldownTime = Date.now() + (station.cooldown * 60 * 1000 / 4); // Cat cooldown is quarter of station cooldown
            this.catCooldowns[catId] = catCooldownTime;
        }

        // Set station cooldown
        station.inUse = false;
        station.assignedCat = null;
        station.trainingEndTime = null;
        station.cooldownUntil = Date.now() + (station.cooldown * 60 * 1000);

        // Update the display
        this.updateDisplay();

        // If this was the active station, update its details
        if (this.activeStationId === stationId) {
            this.showTrainingBaseDetails(stationId);
        }
    }

    // Cancel training for a station
    cancelTraining(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station || !station.inUse) return;

        const catId = station.assignedCat;
        const cat = catManager.cats.find(c => c.id === catId);

        if (cat) {
            // Calculate partial XP for time spent
            const trainingStartTime = station.trainingEndTime - (station.maxDuration * 60 * 1000);
            const actualDuration = (Date.now() - trainingStartTime) / (60 * 1000);

            // Only award XP if they trained for at least 1 minute
            if (actualDuration >= 1) { // Minimum reduced from 5 to 1
                const xpGained = Math.floor(this.getEffectiveXPPerMinute(stationId) * actualDuration * 0.5); // Penalty for canceling
                const result = catManager.addXP(catId, xpGained);
                gameManager.addMessage(`${cat.name}'s training was canceled. They gained ${result.xpGained} XP for partial training.`);
            } else {
                gameManager.addMessage(`${cat.name}'s training was canceled. They didn't train long enough to gain any XP.`);
            }

            // Set a shorter cat cooldown for cancellation
            const catCooldownTime = Date.now() + (station.cooldown * 60 * 1000 / 8); // Eighth cooldown for cancellation
            this.catCooldowns[catId] = catCooldownTime;
        }

        // Set a shorter station cooldown for cancellation
        station.inUse = false;
        station.assignedCat = null;
        station.trainingEndTime = null;
        station.cooldownUntil = Date.now() + (station.cooldown * 60 * 1000 / 4); // Quarter cooldown for cancellation

        this.updateDisplay();

        // If this was the active station, update its details
        if (this.activeStationId === stationId) {
            this.showTrainingBaseDetails(stationId);
        }
    }

    // Get available cats for training (not on cooldown)
    getAvailableCats() {
        return catManager.cats.filter(cat => !this.isCatOnCooldown(cat.id));
    }

    // Update all progress bars in real-time
    updateProgressBars() {
        // Only update if we have an active station
        if (!this.activeStationId) return;

        const station = this.trainingStations.find(s => s.id === this.activeStationId);
        if (!station) return;

        // Get the progress bar element
        const progressBar = document.querySelector('.training-base-progress-bar');
        if (!progressBar) return;

        // Update based on station state
        if (station.inUse && station.trainingEndTime) {
            // Training in progress - update the progress bar
            const now = Date.now();
            const totalTime = station.duration * 60 * 1000; // Convert minutes to milliseconds
            const remainingTime = Math.max(0, station.trainingEndTime - now);
            const elapsedTime = totalTime - remainingTime;

            // Calculate progress percentage
            const progressPercent = Math.max(0, Math.min(100, (elapsedTime / totalTime * 100)));

            // Update the progress bar width
            progressBar.style.width = `${progressPercent}%`;

            // Update the time remaining text if it exists
            const timeRemainingElement = document.querySelector('.training-base-time-remaining');
            if (timeRemainingElement) {
                const minutesRemaining = Math.ceil(remainingTime / 60000);
                timeRemainingElement.textContent = `${minutesRemaining} min remaining`;
            }

            // Update the progress percentage text if it exists
            const progressPercentElement = document.querySelector('.training-base-progress-percent');
            if (progressPercentElement) {
                progressPercentElement.textContent = `${Math.round(progressPercent)}% complete`;
            }
        } else if (!station.inUse && station.cooldownUntil && station.cooldownUntil > Date.now()) {
            // Cooldown in progress - update the cooldown progress bar
            const now = Date.now();
            const totalCooldown = station.cooldown * 60 * 1000; // Convert minutes to milliseconds
            const remainingCooldown = Math.max(0, station.cooldownUntil - now);
            const elapsedCooldown = totalCooldown - remainingCooldown;

            // Calculate cooldown progress percentage
            const cooldownProgress = Math.max(0, Math.min(100, (elapsedCooldown / totalCooldown * 100)));

            // Update the progress bar width
            progressBar.style.width = `${cooldownProgress}%`;

            // Update the time remaining text if it exists
            const timeRemainingElement = document.querySelector('.training-base-time-remaining');
            if (timeRemainingElement) {
                const minutesRemaining = Math.ceil(remainingCooldown / 60000);
                timeRemainingElement.textContent = `${minutesRemaining} min remaining`;
            }

            // Update the progress percentage text if it exists
            const progressPercentElement = document.querySelector('.training-base-progress-percent');
            if (progressPercentElement) {
                progressPercentElement.textContent = `${Math.round(cooldownProgress)}% complete`;
            }
        }
    }

    // Get available training stations (not in use and not on cooldown)
    getAvailableStations() {
        return this.trainingStations.filter(station =>
            !station.inUse && !this.isStationOnCooldown(station.id));
    }



    // Update the training display
    updateDisplay() {
        // Update the training bases list
        this.updateTrainingBasesList();

        // Update the active training base details if any
        if (this.activeStationId) {
            this.showTrainingBaseDetails(this.activeStationId);
        } else if (this.trainingStations.length > 0) {
            // If no active station but we have stations, show the first one
            this.activeStationId = this.trainingStations[0].id;
            this.showTrainingBaseDetails(this.activeStationId);
        }

        // Update the training container (legacy, kept for compatibility)
        const trainingContainer = document.getElementById('training-container');
        if (trainingContainer) {
            trainingContainer.style.display = 'none';
        }

        // Ensure the training section is visible within the base facilities
        const trainingSection = document.getElementById('training-section');
        if (trainingSection) {
            trainingSection.style.display = 'block';
        }

        // Update the arena display
        this.updateArenaDisplay();
    }

    // Update the training bases list in the sidebar
    updateTrainingBasesList() {
        const basesList = document.querySelector('.training-bases-list');
        if (!basesList) return;

        basesList.innerHTML = '';

        // Create training bases list items
        this.trainingStations.sort((a, b) => a.position - b.position).forEach(station => {
            // Determine station status
            let statusClass = '';
            let statusText = '';

            if (station.inUse) {
                statusClass = 'status-in-use';
                statusText = `In use (${this.getTrainingTimeRemaining(station.id)} min left)`;
            } else if (this.isStationOnCooldown(station.id)) {
                statusClass = 'status-cooldown';
                statusText = `Cooling down (${this.getStationCooldownRemaining(station.id)} min left)`;
            } else {
                statusClass = 'status-available';
                statusText = 'Available';
            }

            // Create base item element
            const baseItem = document.createElement('div');
            baseItem.className = 'training-base-item';
            if (this.activeStationId === station.id) {
                baseItem.classList.add('active');
            }
            baseItem.setAttribute('data-station-id', station.id);

            // Create base item HTML
            baseItem.innerHTML = `
                <div class="training-base-name">
                    <span class="training-base-icon">${station.icon}</span>
                    ${station.name}
                </div>
                <div class="training-base-level">Required Level: ${station.unlockLevel}</div>
                <div class="training-base-status ${statusClass}">${statusText}</div>
            `;

            // Add click event to show details
            baseItem.addEventListener('click', () => {
                this.showTrainingBaseDetails(station.id);
            });

            basesList.appendChild(baseItem);
        });
    }

    // Show details for a specific training base
    showTrainingBaseDetails(stationId) {
        // Set the active station
        this.activeStationId = stationId;

        // Update the active class in the list
        document.querySelectorAll('.training-base-item').forEach(item => {
            if (parseInt(item.getAttribute('data-station-id')) === stationId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station) return;

        const detailsContainer = document.querySelector('.training-base-details');
        if (!detailsContainer) return;

        // Remove placeholder if present
        const placeholder = detailsContainer.querySelector('.training-base-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Check if detail content already exists
        let detailContent = detailsContainer.querySelector(`.training-base-detail-content[data-station-id="${stationId}"]`);

        // If not, create it
        if (!detailContent) {
            detailContent = document.createElement('div');
            detailContent.className = 'training-base-detail-content';
            detailContent.setAttribute('data-station-id', stationId);
            detailsContainer.appendChild(detailContent);
        }

        // Hide all other detail contents
        document.querySelectorAll('.training-base-detail-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show this detail content
        detailContent.classList.add('active');

        // Determine if station is in use or on cooldown
        const isInUse = station.inUse;
        const isOnCooldown = this.isStationOnCooldown(stationId);

        // Get assigned cat info if any
        let assignedCat = null;
        if (station.assignedCat) {
            assignedCat = catManager.cats.find(c => c.id === station.assignedCat);
        }

        // Create the content based on station state
        if (isInUse && assignedCat) {
            // Training in progress view
            const remainingTime = this.getTrainingTimeRemaining(stationId);
            const totalTime = station.maxDuration;
            // Calculate elapsed time and progress percentage
            const elapsedTime = totalTime - remainingTime;
            const progressPercent = Math.max(0, Math.min(100, (elapsedTime / totalTime * 100)));

            // Calculate training progress

            // Force an immediate update of the progress bar
            this.updateProgressBars();

            detailContent.innerHTML = `
                <div class="training-base-header">
                    <div class="training-base-header-icon">${station.icon}</div>
                    <div class="training-base-header-info">
                        <div class="training-base-header-name">${station.name}</div>
                        <div class="training-base-header-description">${station.description}</div>
                    </div>
                </div>

                <div class="training-base-stats">
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">XP Rate</div>
                        <div class="training-base-stat-value">${this.getEffectiveXPPerMinute(stationId)} XP/min</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Arena Bonus</div>
                        <div class="training-base-stat-value">+${Math.floor((this.xpMultiplier - 1) * 100)}%</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Duration</div>
                        <div class="training-base-stat-value">${station.maxDuration} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Cooldown</div>
                        <div class="training-base-stat-value">${station.cooldown} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Required Level</div>
                        <div class="training-base-stat-value">${station.unlockLevel}</div>
                    </div>
                </div>

                <div class="training-base-in-use">
                    <h3>Training in Progress</h3>

                    <div class="training-base-assigned-cat">
                        <div class="training-base-assigned-cat-info">
                            <div class="training-base-assigned-cat-name">${assignedCat.name}</div>
                            <div class="training-base-assigned-cat-level">Level ${assignedCat.level} <span class="training-base-cat-type">${assignedCat.type}</span></div>
                        </div>
                    </div>

                    <div class="training-base-progress">
                        <div class="training-base-progress-bar-container">
                            <div class="training-base-progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="training-base-progress-text">
                            <span>${remainingTime} minutes remaining</span>
                            <span class="training-base-progress-percent">${Math.round(progressPercent)}% complete</span>
                        </div>
                    </div>

                    <div class="training-base-actions">
                        <button class="training-base-action-btn training-base-cancel-btn" data-station-id="${stationId}">Cancel Training</button>
                    </div>
                </div>
            `;

            // Add event listener for cancel button
            detailContent.querySelector('.training-base-cancel-btn').addEventListener('click', () => {
                this.cancelTraining(stationId);
            });

        } else if (isOnCooldown) {
            // Cooldown view
            const remainingCooldown = this.getStationCooldownRemaining(stationId);
            const cooldownProgress = Math.max(0, Math.min(100, ((station.cooldown - remainingCooldown) / station.cooldown * 100)));

            // Calculate cooldown progress

            detailContent.innerHTML = `
                <div class="training-base-header">
                    <div class="training-base-header-icon">${station.icon}</div>
                    <div class="training-base-header-info">
                        <div class="training-base-header-name">${station.name}</div>
                        <div class="training-base-header-description">${station.description}</div>
                    </div>
                </div>

                <div class="training-base-stats">
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">XP Rate</div>
                        <div class="training-base-stat-value">${this.getEffectiveXPPerMinute(stationId)} XP/min</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Arena Bonus</div>
                        <div class="training-base-stat-value">+${Math.floor((this.xpMultiplier - 1) * 100)}%</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Duration</div>
                        <div class="training-base-stat-value">${station.maxDuration} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Cooldown</div>
                        <div class="training-base-stat-value">${station.cooldown} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Required Level</div>
                        <div class="training-base-stat-value">${station.unlockLevel}</div>
                    </div>
                </div>

                <div class="training-base-in-use">
                    <h3>Facility Cooling Down</h3>

                    <div class="training-base-progress">
                        <div class="training-base-progress-bar-container">
                            <div class="training-base-progress-bar" style="width: ${cooldownProgress}%"></div>
                        </div>
                        <div class="training-base-progress-text">
                            <span>${remainingCooldown} minutes remaining</span>
                            <span class="training-base-progress-percent">${Math.round(cooldownProgress)}% complete</span>
                        </div>
                    </div>
                </div>
            `;

        } else {
            // Available for training view
            detailContent.innerHTML = `
                <div class="training-base-header">
                    <div class="training-base-header-icon">${station.icon}</div>
                    <div class="training-base-header-info">
                        <div class="training-base-header-name">${station.name}</div>
                        <div class="training-base-header-description">${station.description}</div>
                    </div>
                </div>

                <div class="training-base-stats">
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">XP Rate</div>
                        <div class="training-base-stat-value">${this.getEffectiveXPPerMinute(stationId)} XP/min</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Arena Bonus</div>
                        <div class="training-base-stat-value">+${Math.floor((this.xpMultiplier - 1) * 100)}%</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Duration</div>
                        <div class="training-base-stat-value">${station.maxDuration} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Cooldown</div>
                        <div class="training-base-stat-value">${station.cooldown} minutes</div>
                    </div>
                    <div class="training-base-stat">
                        <div class="training-base-stat-label">Required Level</div>
                        <div class="training-base-stat-value">${station.unlockLevel}</div>
                    </div>
                </div>

                <div class="training-base-cat-selection">
                    <h3>Select a Cat for Training</h3>
                    <div class="training-base-cat-list">
                        ${this.getAvailableCatsHTML(stationId)}
                    </div>
                </div>

                <div class="training-base-duration">
                    <label class="training-base-duration-label">Training Duration (minutes):</label>
                    <input type="range" class="training-base-duration-slider" min="1" max="${station.maxDuration}" value="${Math.min(Math.floor(station.maxDuration/2), station.maxDuration)}">
                    <span class="training-base-duration-display">${Math.min(Math.floor(station.maxDuration/2), station.maxDuration)} minutes</span>
                    <div class="training-base-xp-estimate">Estimated XP: <span class="training-base-xp-value">${this.getEffectiveXPPerMinute(stationId) * Math.min(Math.floor(station.maxDuration/2), station.maxDuration)}</span></div>
                </div>

                <div class="training-base-actions">
                    <button class="training-base-action-btn training-base-start-btn" data-station-id="${stationId}" disabled>Start Training</button>
                </div>
            `;

            // Add event listeners
            const durationSlider = detailContent.querySelector('.training-base-duration-slider');
            const durationDisplay = detailContent.querySelector('.training-base-duration-display');
            const xpEstimate = detailContent.querySelector('.training-base-xp-value');
            const startButton = detailContent.querySelector('.training-base-start-btn');

            // Duration slider event
            durationSlider.addEventListener('input', () => {
                const duration = parseInt(durationSlider.value);
                durationDisplay.textContent = `${duration} minutes`;
                xpEstimate.textContent = this.getEffectiveXPPerMinute(stationId) * duration;
            });

            // Cat selection event
            detailContent.querySelectorAll('.training-base-cat-item').forEach(catItem => {
                catItem.addEventListener('click', () => {
                    // Remove selected class from all cats
                    detailContent.querySelectorAll('.training-base-cat-item').forEach(item => {
                        item.classList.remove('selected');
                    });

                    // Add selected class to clicked cat
                    catItem.classList.add('selected');

                    // Enable start button
                    startButton.disabled = false;
                });
            });

            // Start training button event
            startButton.addEventListener('click', () => {
                const selectedCat = detailContent.querySelector('.training-base-cat-item.selected');
                if (selectedCat) {
                    const catId = parseInt(selectedCat.getAttribute('data-cat-id'));
                    const duration = parseInt(durationSlider.value);
                    this.assignCatToTraining(catId, stationId, duration);
                } else {
                    gameManager.addMessage("Please select a cat for training.");
                }
            });
        }
    }

    // Generate HTML for available cats
    getAvailableCatsHTML(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station) return '<div class="no-cats-available">Error: Station not found</div>';

        // Get available cats that meet the level requirement
        const availableCats = this.getAvailableCats().filter(cat => cat.level >= station.unlockLevel);

        if (availableCats.length === 0) {
            return '<div class="no-cats-available">No cats available for training at this facility.</div>';
        }

        return availableCats.map(cat => `
            <div class="training-base-cat-item" data-cat-id="${cat.id}">
                <div class="training-base-cat-name">${cat.name}</div>
                <div class="training-base-cat-level">Level ${cat.level}</div>
                <div class="training-base-cat-type">${cat.type}</div>
            </div>
        `).join('');
    }

    // Show modal to assign a cat to training
    showAssignCatModal(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station) return;

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'assign-training-modal';
        modalContainer.className = 'modal';

        // Get available cats
        const availableCats = this.getAvailableCats().filter(cat => cat.level >= station.unlockLevel);

        // Create cat selection options
        let catOptions = '';
        if (availableCats.length > 0) {
            availableCats.forEach(cat => {
                catOptions += `
                    <div class="cat-option" data-cat-id="${cat.id}">
                        <div class="cat-option-name">${cat.name}</div>
                        <div class="cat-option-level">Level ${cat.level}</div>
                        <div class="cat-option-type">${cat.type}</div>
                    </div>
                `;
            });
        } else {
            catOptions = '<div class="no-cats-available">No cats available for training at this station.</div>';
        }

        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Assign Cat to ${station.name}</h3>
                <div class="station-info">
                    <div class="station-icon">${station.icon}</div>
                    <div class="station-description">${station.description}</div>
                    <div class="station-xp-rate">XP Rate: ${this.getEffectiveXPPerMinute(stationId)} XP/min</div>
                    <div class="station-xp-bonus">Arena Bonus: +${Math.floor((this.xpMultiplier - 1) * 100)}%</div>
                </div>

                <div class="training-duration-selector">
                    <label for="training-duration">Training Duration (minutes):</label>
                    <input type="range" id="training-duration" min="1" max="${station.maxDuration}" value="${Math.min(Math.floor(station.maxDuration/2), station.maxDuration)}">
                    <span id="duration-display">${Math.min(Math.floor(station.maxDuration/2), station.maxDuration)} minutes</span>
                    <div class="xp-estimate">Estimated XP: <span id="xp-estimate">${this.getEffectiveXPPerMinute(stationId) * Math.min(Math.floor(station.maxDuration/2), station.maxDuration)}</span></div>
                </div>

                <div class="cat-selection">
                    <h4>Select a Cat</h4>
                    <div class="cat-options-container">
                        ${catOptions}
                    </div>
                </div>

                <div class="modal-actions">
                    <button id="confirm-training-btn" ${availableCats.length === 0 ? 'disabled' : ''}>Start Training</button>
                    <button id="cancel-modal-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners
        const durationInput = document.getElementById('training-duration');
        const durationDisplay = document.getElementById('duration-display');
        const xpEstimate = document.getElementById('xp-estimate');

        durationInput.addEventListener('input', () => {
            const duration = parseInt(durationInput.value);
            durationDisplay.textContent = `${duration} minutes`;
            xpEstimate.textContent = this.getEffectiveXPPerMinute(stationId) * duration;
        });

        let selectedCatId = null;

        document.querySelectorAll('.cat-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.cat-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Add selected class to clicked option
                option.classList.add('selected');

                // Store selected cat ID
                selectedCatId = parseInt(option.getAttribute('data-cat-id'));
            });
        });

        document.getElementById('confirm-training-btn').addEventListener('click', () => {
            if (selectedCatId) {
                const duration = parseInt(durationInput.value);
                this.assignCatToTraining(selectedCatId, stationId, duration);
                this.closeModal(modalContainer);
            } else {
                gameManager.addMessage("Please select a cat for training.");
            }
        });

        document.getElementById('cancel-modal-btn').addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        modalContainer.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Close modal
    closeModal(modalContainer) {
        // Add the hide animation class
        const modalContent = modalContainer.querySelector('.modal-content');
        modalContent.classList.remove('show');
        modalContent.classList.add('hide');

        // Remove the modal after animation completes
        setTimeout(() => {
            modalContainer.remove();
        }, 300); // Match this with the CSS animation duration
    }

    // Get the arena level
    getArenaLevel() {
        return this.arenaLevel;
    }

    // Get the arena upgrade cost
    getArenaUpgradeCost() {
        return this.arenaUpgradeCost;
    }

    // Get the current XP multiplier
    getXPMultiplier() {
        return this.xpMultiplier;
    }

    // Calculate the effective XP per minute for a station
    getEffectiveXPPerMinute(stationId) {
        const station = this.trainingStations.find(s => s.id === stationId);
        if (!station) return 0;

        return Math.floor(station.xpPerMinute * this.xpMultiplier);
    }

    // Upgrade the training arena if enough resources are available
    upgradeArena() {
        console.log('upgradeArena method called');

        try {
            // Get current values
            const currentCost = this.arenaUpgradeCost;
            const currentMaterials = resourceManager.getResource('materials');

            console.log('Current level:', this.arenaLevel);
            console.log('Current cost:', currentCost);
            console.log('Current materials:', currentMaterials);

            // Check if enough resources are available
            if (currentMaterials < currentCost) {
                console.log('Not enough materials');
                gameManager.addMessage(`Not enough materials to upgrade Training Arena! Need ${currentCost} materials.`);
                return false;
            }

            console.log('Deducting resources...');
            // Deduct resources
            const resourceDeducted = resourceManager.useResource('materials', currentCost);
            console.log('Resource deduction result:', resourceDeducted);

            if (!resourceDeducted) {
                console.log('Failed to deduct resources');
                gameManager.addMessage(`Error: Failed to deduct materials for upgrade.`);
                return false;
            }

            // Increment arena level
            this.arenaLevel++;
            console.log('New arena level:', this.arenaLevel);

            // Update XP multiplier
            this.xpMultiplier = 1.0 + ((this.arenaLevel - 1) * 0.1);
            console.log('New XP multiplier:', this.xpMultiplier);

            // Update upgrade cost for next level
            this.arenaUpgradeCost = Math.floor(currentCost * 1.5);
            console.log('New upgrade cost:', this.arenaUpgradeCost);

            // Update UI
            this.updateArenaDisplay();

            // Update training stations
            this.updateTrainingBasesList();
            if (this.activeStationId) {
                this.showTrainingBaseDetails(this.activeStationId);
            }

            // Show success message
            gameManager.addMessage(`Training Arena upgraded to level ${this.arenaLevel}! XP gain increased by ${Math.floor((this.xpMultiplier - 1) * 100)}%.`);

            console.log('Upgrade completed successfully');
            return true;
        } catch (error) {
            console.error('Error in upgradeArena:', error);
            gameManager.addMessage(`Error upgrading Training Arena: ${error.message}`);
            return false;
        }
    }



    // Update the arena display
    updateArenaDisplay() {
        console.log('Updating arena display');
        // Update arena level and upgrade button
        const arenaLevelElement = document.getElementById('arena-level-value');
        const upgradeArenaButton = document.getElementById('upgrade-arena');

        if (arenaLevelElement) {
            arenaLevelElement.textContent = this.arenaLevel;
            console.log('Updated arena level display to:', this.arenaLevel);
        } else {
            console.log('Arena level element not found');
        }

        if (upgradeArenaButton) {
            upgradeArenaButton.textContent = `Upgrade Arena (Cost: ${this.arenaUpgradeCost} Materials)`;
            console.log('Updated upgrade button text');

            // Check if player has enough materials
            const currentMaterials = resourceManager.getResource('materials');
            console.log('Current materials:', currentMaterials, 'Required:', this.arenaUpgradeCost);

            if (currentMaterials < this.arenaUpgradeCost) {
                upgradeArenaButton.disabled = true;
                upgradeArenaButton.title = `Not enough materials! Need ${this.arenaUpgradeCost} materials.`;
                console.log('Disabled upgrade button - not enough materials');
            } else {
                upgradeArenaButton.disabled = false;
                upgradeArenaButton.title = '';
                console.log('Enabled upgrade button - enough materials');
            }

            // Ensure the click event is properly attached
            upgradeArenaButton.onclick = () => {
                console.log('Upgrade button clicked directly');
                this.upgradeArena();
            };
        } else {
            console.log('Upgrade button element not found');
        }

        // Update XP multiplier display
        const xpMultiplierElement = document.getElementById('arena-xp-multiplier');

        if (xpMultiplierElement) {
            const displayValue = `${Math.floor(this.xpMultiplier * 100)}%`;
            xpMultiplierElement.textContent = displayValue;
            console.log('Updated XP multiplier display to:', displayValue);
        } else {
            console.log('XP multiplier element not found');
        }
    }


}

// Create global training manager
const trainingManager = new TrainingManager();

// Global function to upgrade the training arena
window.upgradeTrainingArena = function() {
    console.log('Global upgradeTrainingArena function called');
    // Call the upgradeArena method on the trainingManager
    const result = trainingManager.upgradeArena();
    console.log('Upgrade result:', result);
};

// Temporary function to add materials for testing
window.addTestMaterials = function() {
    resourceManager.addResource('materials', 3000);
    console.log('Added 3000 materials for testing');
    console.log('Current materials:', resourceManager.getResource('materials'));
    trainingManager.updateArenaDisplay();
    gameManager.addMessage('Added 3000 materials for testing!');
};

// Temporary function to add food for testing
window.addTestFood = function() {
    resourceManager.addResource('food', 7000);
    console.log('Added 7000 food for testing');
    console.log('Current food:', resourceManager.getResource('food'));
    gameManager.addMessage('Added 7000 food for testing!');
};
