// Cat management system
class CatManager {
    constructor() {
        this.cats = [];
        this.catNames = [
            'Whiskers', 'Shadow', 'Luna', 'Oreo', 'Mittens', 'Tiger', 'Smokey', 'Felix',
            'Simba', 'Cleo', 'Milo', 'Bella', 'Charlie', 'Lucy', 'Max', 'Daisy', 'Oliver',
            'Lily', 'Leo', 'Lola', 'Rocky', 'Misty', 'Oscar', 'Molly', 'Jasper', 'Nala'
        ];

        // Cat types with their traits
        this.catTypes = ['Scavenger', 'Hunter', 'Guardian', 'Medic'];

        // Cat appearance options
        this.catFeatures = {
            bodyColors: [
                '#F8D8B0', // Light orange/cream
                '#A57B55', // Brown
                '#3D3D3D', // Dark gray
                '#1A1A1A', // Black
                '#FFFFFF', // White
                '#B0B0B0', // Gray
                '#D2B48C', // Tan
                '#E5AA70'  // Fawn
            ],
            patternColors: [
                '#FFFFFF', // White
                '#3D3D3D', // Dark gray
                '#1A1A1A', // Black
                '#A57B55', // Brown
                '#F8D8B0'  // Light orange/cream
            ],
            patterns: [
                'none',
                'spots',
                'stripes',
                'patch'
            ],
            eyeColors: [
                '#4B9CD3', // Blue
                '#3D9140', // Green
                '#FFB900', // Yellow/amber
                '#8B4513', // Brown
                '#228B22'  // Forest green
            ],
            accessories: [
                'none',
                'bow',
                'collar',
                'bandana',
                'glasses',
                'hat'
            ],
            accessoryColors: [
                '#FF5252', // Red
                '#4CAF50', // Green
                '#2196F3', // Blue
                '#FFC107', // Amber
                '#9C27B0', // Purple
                '#FF9800'  // Orange
            ]
        };

        // Define cat rarities and their probabilities
        this.rarities = [
            { name: 'Common', chance: 0.50, color: '#AAAAAA', icon: '⭐' },
            { name: 'Uncommon', chance: 0.25, color: '#55AA55', icon: '⭐⭐' },
            { name: 'Rare', chance: 0.15, color: '#5555FF', icon: '⭐⭐⭐' },
            { name: 'Epic', chance: 0.07, color: '#AA55AA', icon: '🌟🌟' },
            { name: 'Legendary', chance: 0.03, color: '#FFAA00', icon: '👑' }
        ];

        // Search timers and state
        this.searchInProgress = false;
        this.searchTimer = null;
        this.currentFoundCat = null;
        this.currentSearchType = null;

        // Animation timers
        this.blinkIntervals = {};
        this.mouthIntervals = {};

        // Add starter cat (Common rarity)
        this.addCat('Mittens', 'Scavenger', 1, 'Common');

        this.updateDisplay();
    }

    // Generate a random cat
    generateRandomCat() {
        const randomName = this.catNames[Math.floor(Math.random() * this.catNames.length)];
        const randomType = this.catTypes[Math.floor(Math.random() * this.catTypes.length)];
        const level = 1;
        const rarity = this.determineRarity();

        // Generate random appearance features
        const appearance = {
            bodyColor: this.getRandomItem(this.catFeatures.bodyColors),
            patternColor: this.getRandomItem(this.catFeatures.patternColors),
            pattern: this.getRandomItem(this.catFeatures.patterns),
            eyeColor: this.getRandomItem(this.catFeatures.eyeColors),
            accessory: this.getRandomItem(this.catFeatures.accessories),
            accessoryColor: this.getRandomItem(this.catFeatures.accessoryColors),
            // Add unique ID for animation tracking
            uniqueId: 'cat-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        };

        // Higher rarity cats have better chance of accessories
        if (rarity === 'Common' && appearance.accessory !== 'none') {
            // 70% chance to have no accessory for common cats
            if (Math.random() < 0.7) {
                appearance.accessory = 'none';
            }
        } else if (rarity === 'Legendary' && appearance.accessory === 'none') {
            // Legendary cats always have an accessory
            appearance.accessory = this.getRandomItem(this.catFeatures.accessories.filter(a => a !== 'none'));
        }

        return {
            name: randomName,
            type: randomType,
            level: level,
            rarity: rarity,
            appearance: appearance
        };
    }

    // Helper to get a random item from an array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Determine the rarity of a cat based on probability
    determineRarity() {
        const roll = Math.random();
        let cumulativeProbability = 0;

        for (const rarity of this.rarities) {
            cumulativeProbability += rarity.chance;
            if (roll < cumulativeProbability) {
                return rarity.name;
            }
        }

        // Fallback to Common if something goes wrong
        return 'Common';
    }

    // Add a new cat to the colony
    addCat(name, type, level, rarity = 'Common', appearance = null) {
        // If no appearance is provided, generate one
        if (!appearance) {
            appearance = {
                bodyColor: this.getRandomItem(this.catFeatures.bodyColors),
                patternColor: this.getRandomItem(this.catFeatures.patternColors),
                pattern: this.getRandomItem(this.catFeatures.patterns),
                eyeColor: this.getRandomItem(this.catFeatures.eyeColors),
                accessory: this.getRandomItem(this.catFeatures.accessories),
                accessoryColor: this.getRandomItem(this.catFeatures.accessoryColors),
                uniqueId: 'cat-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
            };
        }

        // Generate base stats based on rarity
        const rarityMultiplier = this.getRarityStatMultiplier(rarity);
        const baseStatValue = 5; // Base value for all stats

        const cat = {
            id: Date.now(), // Use timestamp as unique ID
            name: name,
            type: type,
            level: level,
            rarity: rarity,
            happiness: 100,
            health: 100,
            appearance: appearance,
            // Core stats
            stats: {
                STR: Math.floor(baseStatValue * rarityMultiplier), // Paw Power
                DEX: Math.floor(baseStatValue * rarityMultiplier), // Whisker Dexterity
                AGI: Math.floor(baseStatValue * rarityMultiplier), // Tail Balance
                VIT: Math.floor(baseStatValue * rarityMultiplier), // Clawstitution
                WIL: Math.floor(baseStatValue * rarityMultiplier), // Fur-titude
                INT: Math.floor(baseStatValue * rarityMultiplier), // Meowmental
                CHA: Math.floor(baseStatValue * rarityMultiplier), // Charm
                PER: Math.floor(baseStatValue * rarityMultiplier), // Purrception
                LCK: Math.floor(baseStatValue * rarityMultiplier)  // Luck
            },
            // Derived attributes (calculated from stats)
            attributes: {
                maxHealth: 100,
                healthRegenRate: 0.1,
                attackDamage: 10,
                jumpHeight: 2,
                accuracy: 75,
                dodgeChance: 0,
                attackSpeed: 1.0,
                xpGainMultiplier: 1.0,
                critChance: 0,
                stealthDetectionRange: 2,
                recruitChanceBonus: 0,
                bondingSpeed: 1,
                rareDropChance: 5,
                statusAvoidChance: 0,
                debuffResistance: 0,
                castingTimeReduction: 0,
                pushForce: 1.0

                // Create a synergy bonus using the cat's charima.
            },
            statPoints: 3, // Available points to distribute
            totalStatPoints: 3 // Total points earned (for tracking)
        };

        // Calculate derived attributes based on stats
        this.updateCatAttributes(cat);

        this.cats.push(cat);
        this.updateDisplay();

        // Add a special animation to the newly added cat
        setTimeout(() => {
            const catCards = document.querySelectorAll('.cat-card');
            if (catCards.length > 0) {
                const newCatCard = catCards[catCards.length - 1];
                newCatCard.classList.add('new-cat-animation');

                // Remove the animation class after it completes
                setTimeout(() => {
                    newCatCard.classList.remove('new-cat-animation');
                }, 1500);

                // Start the blinking and mouth animations for the new cat
                this.startCatAnimations(cat.appearance.uniqueId);
            }
        }, 100);

        return cat;
    }

    // Find a new stray cat
    findCat(searchType = 'normal') {
        // If a search is already in progress, don't start another one
        if (this.searchInProgress) {
            gameManager.addMessage("You're already searching for cats! Please wait until the current search is complete.");
            return null;
        }

        // Different search types have different costs and success rates
        let foodCost = 5;
        let successRate = 0.7;
        let rarityBoost = 0;
        let searchTime = 0; // Search time in milliseconds

        // Adjust parameters based on search type
        switch(searchType) {
            case 'thorough': // More expensive but higher chance of success
                foodCost = 10;
                successRate = 0.85;
                rarityBoost = 0.15; // Increased boost to rarity
                searchTime = 5000; // 5 seconds
                break;
            case 'premium': // Much more expensive but guaranteed success and better rarities
                foodCost = 20;
                successRate = 1.0;
                rarityBoost = 0.35; // Increased boost to rarity
                searchTime = 8000; // 8 seconds
                break;
            case 'normal':
            default:
                searchTime = 3000; // 3 seconds
                break;
        }

        // Check if we have enough food to search for cats
        if (resourceManager.useResource('food', foodCost)) {
            // Set search in progress
            this.searchInProgress = true;

            // Disable search buttons during search
            this.toggleSearchButtons(false);

            // Show searching message
            gameManager.addMessage(`Searching for cats... (${searchTime/1000} seconds)`);

            // Create a progress indicator
            this.showSearchProgress(searchTime);

            // Set a timer for the search
            this.searchTimer = setTimeout(() => {
                // Search is complete
                this.searchInProgress = false;
                this.toggleSearchButtons(true);

                // Remove progress indicator
                this.hideSearchProgress();

                // Determine if a cat was found
                if (Math.random() < successRate) {
                    // Apply rarity boost if any
                    let originalRarity;
                    let boostedRarity;

                    // Generate the cat based on rarity boost
                    let foundCat;

                    if (rarityBoost > 0) {
                        // Save the original roll for comparison
                        originalRarity = this.determineRarity();

                        // Apply boost by re-rolling with better odds
                        const boostedRoll = Math.random() * (1 - rarityBoost);
                        let cumulativeProbability = 0;

                        for (const rarity of this.rarities) {
                            cumulativeProbability += rarity.chance;
                            if (boostedRoll < cumulativeProbability) {
                                boostedRarity = rarity.name;
                                break;
                            }
                        }

                        // Use the better of the two rolls
                        const originalIndex = this.rarities.findIndex(r => r.name === originalRarity);
                        const boostedIndex = this.rarities.findIndex(r => r.name === boostedRarity);

                        const finalRarity = boostedIndex < originalIndex ? boostedRarity : originalRarity;
                        foundCat = this.generateRandomCat();
                        foundCat.rarity = finalRarity;
                    } else {
                        // Normal search without boost
                        foundCat = this.generateRandomCat();
                    }

                    // Show the cat and options to hire or release
                    this.showCatHireOptions(foundCat, searchType);
                    return "found";
                } else {
                    gameManager.addMessage("You searched but couldn't find any cats this time.");
                    return null;
                }
            }, searchTime);

            return "searching"; // Indicate that a search has started
        } else {
            gameManager.addMessage(`Not enough food to search for cats! Need ${foodCost} food.`);
            return null;
        }
    }

    // Toggle search buttons enabled/disabled state
    toggleSearchButtons(enabled) {
        document.getElementById('find-cat-normal').disabled = !enabled;
        document.getElementById('find-cat-thorough').disabled = !enabled;
        document.getElementById('find-cat-premium').disabled = !enabled;
    }

    // Show search progress indicator
    showSearchProgress(duration) {
        const searchOptions = document.getElementById('cat-search-options');

        // Create progress container if it doesn't exist
        let progressContainer = document.getElementById('search-progress-container');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'search-progress-container';
            progressContainer.style.marginTop = '10px';
            searchOptions.appendChild(progressContainer);
        }

        // Create or update progress bar
        progressContainer.innerHTML = `
            <div id="search-progress-text">Searching for cats...</div>
            <div id="search-progress-bar-container">
                <div id="search-progress-bar"></div>
            </div>
        `;

        // Style the progress bar
        const progressBarContainer = document.getElementById('search-progress-bar-container');
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.height = '10px';
        progressBarContainer.style.backgroundColor = '#34495e';
        progressBarContainer.style.borderRadius = '5px';
        progressBarContainer.style.overflow = 'hidden';

        const progressBar = document.getElementById('search-progress-bar');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#3498db';
        progressBar.style.transition = `width ${duration/1000}s linear`;

        // Start the animation after a small delay to ensure the transition works
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }

    // Hide search progress indicator
    hideSearchProgress() {
        const progressContainer = document.getElementById('search-progress-container');
        if (progressContainer) {
            progressContainer.remove();
        }
    }

    // Store temporary stat changes
    tempStatChanges = {};

    // Add a stat point to a cat (temporarily)
    addStatPoint(catId, statType) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat || cat.statPoints <= 0) return;

        // Initialize temp changes for this cat if not exists
        if (!this.tempStatChanges[catId]) {
            this.tempStatChanges[catId] = {
                stats: {},
                pointsUsed: 0
            };
        }

        // Initialize this stat if not exists
        if (!this.tempStatChanges[catId].stats[statType]) {
            this.tempStatChanges[catId].stats[statType] = 0;
        }

        // Increment the temp stat
        this.tempStatChanges[catId].stats[statType]++;
        this.tempStatChanges[catId].pointsUsed++;

        // Update the display with temporary changes
        this.updateDisplay();

        // Show the confirm button for this cat
        this.showStatConfirmation(catId);
    }

    // Get the effective stat value (base + temporary)
    getEffectiveStat(cat, statType) {
        const baseValue = cat.stats[statType] || 0;
        const tempValue = this.tempStatChanges[cat.id]?.stats[statType] || 0;
        return baseValue + tempValue;
    }

    // Get remaining stat points (considering temporary allocations)
    getRemainingStatPoints(cat) {
        const usedPoints = this.tempStatChanges[cat.id]?.pointsUsed || 0;
        return cat.statPoints - usedPoints;
    }

    // Show confirmation UI for stat changes
    showStatConfirmation(catId) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat) return;

        // Find the cat card
        const catCard = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);
        if (!catCard) return;

        // Find or create the confirmation panel
        let confirmPanel = catCard.querySelector('.stat-confirm-panel');
        if (!confirmPanel) {
            confirmPanel = document.createElement('div');
            confirmPanel.className = 'stat-confirm-panel';
            catCard.querySelector('.cat-core-stats').appendChild(confirmPanel);
        }

        // Update the confirmation panel content
        confirmPanel.innerHTML = `
            <div class="confirm-message">Apply these stat changes?</div>
            <div class="confirm-buttons">
                <button class="confirm-stat-btn" data-cat-id="${catId}">Apply</button>
                <button class="cancel-stat-btn" data-cat-id="${catId}">Cancel</button>
            </div>
        `;
    }

    // Apply temporary stat changes permanently
    applyStatChanges(catId) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat || !this.tempStatChanges[catId]) return;

        // Make sure this cat's card stays expanded
        this.expandedCatCards.add(catId.toString());

        // Apply each stat change
        for (const [statType, value] of Object.entries(this.tempStatChanges[catId].stats)) {
            cat.stats[statType] += value;
        }

        // Deduct the stat points
        cat.statPoints -= this.tempStatChanges[catId].pointsUsed;

        // Clear temporary changes
        delete this.tempStatChanges[catId];

        // Update derived attributes based on new stats
        this.updateCatAttributes(cat);

        // Update the display
        this.updateDisplay();

        // Show a message
        gameManager.addMessage(`${cat.name}'s stats have been updated!`);
    }

    // Cancel temporary stat changes
    cancelStatChanges(catId) {
        // Make sure this cat's card stays expanded
        this.expandedCatCards.add(catId.toString());

        // Clear temporary changes
        delete this.tempStatChanges[catId];

        // Update the display
        this.updateDisplay();
    }

    // Calculate recruitment success chance based on cat's CHA and target cat's rarity
    calculateRecruitmentChance(recruiterCat, targetCat) {
        // Get the rarity index (higher index = rarer cat = harder to recruit)
        const rarityIndex = this.rarities.findIndex(r => r.name === targetCat.rarity);

        // Base difficulty increases with rarity
        const baseDifficulty = 30 + (rarityIndex * 15); // 30% for Common, 45% for Uncommon, etc.

        // Calculate success chance based on CHA
        // Each point of CHA adds 0.75% to success chance
        const chaBonus = recruiterCat.attributes.recruitChanceBonus;

        // Calculate final success chance (capped between 5% and 95%)
        let successChance = Math.min(95, Math.max(5, 100 - baseDifficulty + chaBonus));

        return successChance;
    }

    // Show options to hire or release a found cat
    showCatHireOptions(cat, searchType) {
        // Create a modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'cat-hire-modal';
        modalContainer.className = 'modal';

        // Get the rarity color
        const rarityColor = this.getRarityColor(cat.rarity);

        // Calculate a food reward for releasing the cat (based on rarity)
        const rarityIndex = this.rarities.findIndex(r => r.name === cat.rarity);
        const foodReward = 5 + (rarityIndex * 3); // 5 for Common, 8 for Uncommon, etc.

        // Prepare recruiter selection if we have cats
        let recruitmentChance = 100; // Default to 100% if no cats (first cat is always recruited)
        let selectedRecruiter = null;
        let recruiters = [];

        if (this.cats.length > 0) {
            // Create an array of all potential recruiters with their recruitment chances
            recruiters = this.cats.map(recruiterCat => {
                const chance = this.calculateRecruitmentChance(recruiterCat, cat);
                return {
                    cat: recruiterCat,
                    chance: chance
                };
            });

            // Sort recruiters by chance (highest first)
            recruiters.sort((a, b) => b.chance - a.chance);

            // Set the best recruiter as the default selected recruiter
            selectedRecruiter = recruiters[0].cat;
            recruitmentChance = recruiters[0].chance;
        }

        // Get the rarity icon
        const rarityIcon = this.getRarityIcon(cat.rarity);

        // Get cat appearance
        const appearance = cat.appearance;

        // Create the modal content
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>You found a cat!</h3>
                <div class="found-cat-card">
                    <div class="found-cat-avatar-container">
                        <div class="found-cat-avatar" data-type="${cat.type}">
                            <!-- Cat body container -->
                            <div class="cat-body-container">
                                <!-- Cat body -->
                                <div class="cat-body" style="background-color: ${appearance.bodyColor}; border-radius: 50%;">
                                    <!-- Cat pattern -->
                                    ${this.getCatPatternHTML(appearance.pattern, appearance.patternColor)}

                                    <!-- Cat ears -->
                                    <div class="cat-ear left" style="background-color: ${appearance.bodyColor}">
                                        <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                                    </div>
                                    <div class="cat-ear right" style="background-color: ${appearance.bodyColor}">
                                        <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                                    </div>

                                    <!-- Cat face -->
                                    <div class="cat-face">
                                        <!-- Eyes -->
                                        <div class="cat-eyes left" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.eyeColor}"></div>
                                        <div class="cat-eyes right" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.eyeColor}"></div>

                                        <!-- Nose -->
                                        <div class="cat-nose"></div>

                                        <!-- Mouth -->
                                        <div class="cat-mouth" data-cat-id="${appearance.uniqueId}"></div>

                                        <!-- Whiskers -->
                                        <div class="cat-whiskers left">
                                            <div class="whisker top"></div>
                                            <div class="whisker middle"></div>
                                            <div class="whisker bottom"></div>
                                        </div>
                                        <div class="cat-whiskers right">
                                            <div class="whisker top"></div>
                                            <div class="whisker middle"></div>
                                            <div class="whisker bottom"></div>
                                        </div>
                                    </div>

                                    <!-- Cat accessory -->
                                    ${this.getCatAccessoryHTML(appearance.accessory, appearance.accessoryColor)}
                                </div>

                                <!-- Cat tail -->
                                <div class="cat-tail" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.bodyColor}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="found-cat-info">
                        <div class="cat-header">
                            <div class="cat-name-container">
                                <div class="cat-name">${cat.name}</div>
                                <div class="cat-rarity" style="color: ${rarityColor}">${cat.rarity} ${rarityIcon}</div>
                            </div>
                            <div class="cat-type-badge" data-type="${cat.type}">${cat.type}</div>
                        </div>

                        <div class="cat-details">
                            <div class="cat-level">Level ${cat.level}</div>

                            <div class="cat-appearance-details">
                                <div class="appearance-item" title="Coat Color">
                                    <span class="color-dot" style="background-color: ${appearance.bodyColor}"></span>
                                    <span>Coat</span>
                                </div>
                                ${appearance.pattern !== 'none' ? `
                                <div class="appearance-item" title="Pattern">
                                    <span class="pattern-icon ${appearance.pattern}"></span>
                                    <span>${appearance.pattern.charAt(0).toUpperCase() + appearance.pattern.slice(1)}</span>
                                </div>` : ''}
                                ${appearance.accessory !== 'none' ? `
                                <div class="appearance-item" title="Accessory">
                                    <span class="accessory-icon ${appearance.accessory}"></span>
                                    <span>${appearance.accessory.charAt(0).toUpperCase() + appearance.accessory.slice(1)}</span>
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cat-options">
                    <p>What would you like to do?</p>
                    ${recruiters.length > 0 ? `
                    <div class="recruitment-info">
                        <div class="recruiter-selection">
                            <label for="recruiter-select">Choose a Recruiter:</label>
                            <select id="recruiter-select">
                                ${recruiters.map((recruiter, index) => `
                                    <option value="${index}" ${index === 0 ? 'selected' : ''}>
                                        ${recruiter.cat.name} (CHA: ${recruiter.cat.stats.CHA}) - ${Math.floor(recruiter.chance)}% chance
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="recruiter-info">
                            <span>Recruiter: <span id="selected-recruiter-name">${selectedRecruiter.name}</span></span>
                            <span class="cha-stat">CHA: <span id="selected-recruiter-cha">${selectedRecruiter.stats.CHA}</span></span>
                        </div>
                        <div class="recruitment-chance">
                            <div class="chance-label">Recruitment Chance:</div>
                            <div class="chance-bar-container">
                                <div id="chance-bar" class="chance-bar" style="width: ${recruitmentChance}%"></div>
                                <span id="chance-value" class="chance-value">${Math.floor(recruitmentChance)}%</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    <button type="button" id="hire-cat-btn">Attempt to Recruit</button>
                    <button type="button" id="release-cat-btn">Release Cat (+${foodReward} Food)</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners to the buttons
        document.getElementById('hire-cat-btn').addEventListener('click', () => {
            // Get the selected recruiter if any
            let selectedRecruiterIndex = 0;
            const recruiterSelect = document.getElementById('recruiter-select');
            if (recruiterSelect) {
                selectedRecruiterIndex = parseInt(recruiterSelect.value);
            }

            // Pass the selected recruiter to the hireCat method
            this.hireCat(cat, recruiters.length > 0 ? recruiters[selectedRecruiterIndex] : null);
            this.closeModal(modalContainer);
        });

        document.getElementById('release-cat-btn').addEventListener('click', () => {
            this.releaseCat(cat, foodReward);
            this.closeModal(modalContainer);
        });

        // Add event listener for recruiter selection change
        const recruiterSelect = document.getElementById('recruiter-select');
        if (recruiterSelect) {
            recruiterSelect.addEventListener('change', () => {
                const selectedIndex = parseInt(recruiterSelect.value);
                const selectedRecruiter = recruiters[selectedIndex].cat;
                const newChance = recruiters[selectedIndex].chance;

                // Update the displayed recruiter info
                document.getElementById('selected-recruiter-name').textContent = selectedRecruiter.name;
                document.getElementById('selected-recruiter-cha').textContent = selectedRecruiter.stats.CHA;

                // Update the chance bar
                document.getElementById('chance-bar').style.width = `${newChance}%`;
                document.getElementById('chance-value').textContent = `${Math.floor(newChance)}%`;
            });
        }

        // Add event listener to the close button
        modalContainer.querySelector('.close-modal').addEventListener('click', () => {
            // If the user closes the modal without choosing, release the cat
            this.releaseCat(cat, 0); // No food reward if they just close the modal
            this.closeModal(modalContainer);
        });

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);

        // Store the cat and search type for reference
        this.currentFoundCat = cat;
        this.currentSearchType = searchType;

        // Start animations for the found cat
        this.startCatAnimations(cat.appearance.uniqueId);

        // Add message
        gameManager.addMessage(`You found a ${cat.rarity} cat named ${cat.name}! Decide whether to hire or release them.`);
    }

    // Hire the found cat
    hireCat(cat, recruiterInfo) {
        // Check if we have room for more cats
        if (this.getCatCount() >= baseManager.getMaxCats()) {
            gameManager.addMessage(`Your base is at maximum capacity (${baseManager.getMaxCats()} cats). The cat ran away!`);
            // Reset search state
            this.searchInProgress = false;
            this.toggleSearchButtons(true);
            return;
        }

        // Calculate recruitment chance
        let recruitmentChance = 100; // Default to 100% if no cats (first cat is always recruited)
        let recruiterCat = null;

        // Use the selected recruiter if provided
        if (recruiterInfo) {
            recruiterCat = recruiterInfo.cat;
            recruitmentChance = recruiterInfo.chance;
        }

        // Determine if recruitment is successful
        const roll = Math.random() * 100;
        const isSuccessful = roll <= recruitmentChance;

        if (isSuccessful) {
            // Add the cat to the colony with its appearance
            const newCat = this.addCat(cat.name, cat.type, cat.level, cat.rarity, cat.appearance);

            if (recruiterCat) {
                gameManager.addMessage(`${recruiterCat.name} successfully convinced ${newCat.name} to join your colony! (${Math.floor(recruitmentChance)}% chance)`);
            } else {
                gameManager.addMessage(`You hired ${newCat.name}! They are now part of your colony.`);
            }
        } else {
            // Recruitment failed
            if (recruiterCat) {
                gameManager.addMessage(`${recruiterCat.name} tried to recruit ${cat.name}, but they ran away! (Failed with ${Math.floor(recruitmentChance)}% chance)`);
            } else {
                gameManager.addMessage(`You tried to recruit ${cat.name}, but they ran away!`);
            }
        }

        // Reset search state
        this.searchInProgress = false;
        this.toggleSearchButtons(true);
    }

    // Release the found cat and get food as a reward
    releaseCat(cat, foodReward) {
        // Add food as a reward if there is any
        if (foodReward > 0) {
            resourceManager.addResource('food', foodReward);
            gameManager.addMessage(`You released ${cat.name} and received ${foodReward} food as a reward.`);
        } else {
            gameManager.addMessage(`${cat.name} ran away.`);
        }

        // Reset search state
        this.searchInProgress = false;
        this.toggleSearchButtons(true);
    }

    // Close the modal with animation
    closeModal(modalContainer) {
        // Add the hide animation class
        const modalContent = modalContainer.querySelector('.modal-content');
        modalContent.classList.remove('show');
        modalContent.classList.add('hide');

        // Stop animations for the cat in the modal
        if (this.currentFoundCat && this.currentFoundCat.appearance) {
            this.stopCatAnimations(this.currentFoundCat.appearance.uniqueId);
        }

        // Remove the modal after animation completes
        setTimeout(() => {
            modalContainer.remove();
        }, 300); // Match this with the CSS animation duration
    }

    // Get total number of cats
    getCatCount() {
        return this.cats.length;
    }

    // Store expanded state of cat cards
    expandedCatCards = new Set();

    // Update the UI with current cats
    updateDisplay() {
        // Save the expanded state of cat cards before updating
        document.querySelectorAll('.cat-card.expanded').forEach(card => {
            const catId = card.getAttribute('data-cat-id');
            if (catId) this.expandedCatCards.add(catId);
        });

        // Stop all existing animations
        this.stopAllAnimations();

        const catsContainer = document.getElementById('cats-container');
        const catsCountElement = document.getElementById('cats-value');

        // Update cat count
        catsCountElement.textContent = this.getCatCount();

        // Clear current display
        catsContainer.innerHTML = '';

        // Add each cat to the display
        this.cats.forEach(cat => {
            const catElement = document.createElement('div');
            catElement.className = 'cat-card';
            catElement.setAttribute('data-cat-id', cat.id);
            // Get the color for this rarity
            const rarityColor = this.getRarityColor(cat.rarity);
            const rarityIcon = this.getRarityIcon(cat.rarity);

            // Get cat appearance
            const appearance = cat.appearance || {
                bodyColor: '#F8D8B0',
                patternColor: '#FFFFFF',
                pattern: 'none',
                eyeColor: '#FFB900',
                accessory: 'none',
                accessoryColor: '#FF5252',
                uniqueId: 'cat-default-' + cat.id
            };

            // Create the cat HTML
            catElement.innerHTML = `
                <div class="cat-avatar-container">
                    <div class="cat-avatar" data-type="${cat.type}">
                        <!-- Cat body container -->
                        <div class="cat-body-container">
                            <!-- Cat body -->
                            <div class="cat-body" style="background-color: ${appearance.bodyColor}; border-radius: 50%;">
                                <!-- Cat pattern -->
                                ${this.getCatPatternHTML(appearance.pattern, appearance.patternColor)}

                                <!-- Cat ears -->
                                <div class="cat-ear left" style="background-color: ${appearance.bodyColor}">
                                    <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                                </div>
                                <div class="cat-ear right" style="background-color: ${appearance.bodyColor}">
                                    <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                                </div>

                                <!-- Cat face -->
                                <div class="cat-face">
                                    <!-- Eyes -->
                                    <div class="cat-eyes left" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.eyeColor}"></div>
                                    <div class="cat-eyes right" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.eyeColor}"></div>

                                    <!-- Nose -->
                                    <div class="cat-nose"></div>

                                    <!-- Mouth -->
                                    <div class="cat-mouth" data-cat-id="${appearance.uniqueId}"></div>

                                    <!-- Whiskers -->
                                    <div class="cat-whiskers left">
                                        <div class="whisker top"></div>
                                        <div class="whisker middle"></div>
                                        <div class="whisker bottom"></div>
                                    </div>
                                    <div class="cat-whiskers right">
                                        <div class="whisker top"></div>
                                        <div class="whisker middle"></div>
                                        <div class="whisker bottom"></div>
                                    </div>
                                </div>

                                <!-- Cat accessory -->
                                ${this.getCatAccessoryHTML(appearance.accessory, appearance.accessoryColor)}
                            </div>

                            <!-- Cat tail -->
                            <div class="cat-tail" data-cat-id="${appearance.uniqueId}" style="background-color: ${appearance.bodyColor}"></div>
                        </div>
                    </div>
                </div>
                <div class="cat-info">
                    <div class="cat-header">
                        <div class="cat-name-container">
                            <div class="cat-name">${cat.name}</div>
                            <div class="cat-rarity" style="color: ${rarityColor}">${cat.rarity} ${rarityIcon}</div>
                        </div>
                        <div class="cat-type-badge" data-type="${cat.type}">${cat.type}</div>
                    </div>

                    <div class="cat-details">
                        <div class="cat-level">Level ${cat.level}</div>

                        <div class="cat-appearance-details">
                            <div class="appearance-item" title="Coat Color">
                                <span class="color-dot" style="background-color: ${appearance.bodyColor}"></span>
                                <span>Coat</span>
                            </div>
                            ${appearance.pattern !== 'none' ? `
                            <div class="appearance-item" title="Pattern">
                                <span class="pattern-icon ${appearance.pattern}"></span>
                                <span>${appearance.pattern.charAt(0).toUpperCase() + appearance.pattern.slice(1)}</span>
                            </div>` : ''}
                            ${appearance.accessory !== 'none' ? `
                            <div class="appearance-item" title="Accessory">
                                <span class="accessory-icon ${appearance.accessory}"></span>
                                <span>${appearance.accessory.charAt(0).toUpperCase() + appearance.accessory.slice(1)}</span>
                            </div>` : ''}
                        </div>
                    </div>

                    <div class="cat-stats">
                        <div class="stat-header">
                            <h3>Status</h3>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Health:</span>
                            <div class="stat-bar-container">
                                <div class="stat-bar health-bar" style="width: ${(cat.health / cat.attributes.maxHealth) * 100}%"></div>
                            </div>
                            <span class="stat-value">${cat.health}/${cat.attributes.maxHealth}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Happiness:</span>
                            <div class="stat-bar-container">
                                <div class="stat-bar happiness-bar" style="width: ${cat.happiness}%"></div>
                            </div>
                            <span class="stat-value">${cat.happiness}</span>
                        </div>
                    </div>

                    <div class="cat-core-stats">
                        <div class="stat-header">
                            <h3>Core Stats</h3>
                            ${cat.statPoints > 0 ? `<span class="stat-points-available">Points: ${this.getRemainingStatPoints(cat)}/${cat.statPoints}</span>` : ''}
                        </div>

                        <div class="core-stats-grid">
                            <div class="core-stat-item" title="Paw Power - Physical strength, bite force, claw damage">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">STR</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.STR ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'STR')}
                                        ${this.tempStatChanges[cat.id]?.stats?.STR ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.STR})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(10 + this.getEffectiveStat(cat, 'STR') * 1)} Attack Damage</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="STR">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Whisker Dexterity - Hit accuracy and precision">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">DEX</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.DEX ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'DEX')}
                                        ${this.tempStatChanges[cat.id]?.stats?.DEX ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.DEX})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(75 + this.getEffectiveStat(cat, 'DEX') * 1)}% Hit Accuracy</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="DEX">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Tail Balance - Dodge chance and attack speed">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">AGI</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.AGI ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'AGI')}
                                        ${this.tempStatChanges[cat.id]?.stats?.AGI ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.AGI})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(this.getEffectiveStat(cat, 'AGI') * 0.75).toFixed(1)}% Dodge Chance, ${(1.0 + this.getEffectiveStat(cat, 'AGI') * 0.025).toFixed(3)}x Attack Speed</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="AGI">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Clawstitution - Endurance, toughness, fluffiness">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">VIT</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.VIT ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'VIT')}
                                        ${this.tempStatChanges[cat.id]?.stats?.VIT ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.VIT})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${100 + this.getEffectiveStat(cat, 'VIT')*3} Max Health</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="VIT">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Fur-titude - Willpower, bravery, focus">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">WIL</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.WIL ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'WIL')}
                                        ${this.tempStatChanges[cat.id]?.stats?.WIL ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.WIL})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${this.getEffectiveStat(cat, 'WIL')*1}% Debuff Resistance</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="WIL">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Meowmental - Magical aptitude, intuition, wisdom">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">INT</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.INT ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'INT')}
                                        ${this.tempStatChanges[cat.id]?.stats?.INT ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.INT})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(1.0 + this.getEffectiveStat(cat, 'INT')*0.025).toFixed(3)}x XP Gain</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="INT">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Charm - Increases chance to recruit new cats when finding them, improves bonding with other cats">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">CHA</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.CHA ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'CHA')}
                                        ${this.tempStatChanges[cat.id]?.stats?.CHA ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.CHA})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${this.getEffectiveStat(cat, 'CHA')*0.75}% Cat Recruitment Chance</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="CHA">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Purrception - Senses: hearing, smell, sixth sense">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">PER</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.PER ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'PER')}
                                        ${this.tempStatChanges[cat.id]?.stats?.PER ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.PER})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(this.getEffectiveStat(cat, 'PER')/5).toFixed(1)}% Critical Chance</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="PER">+</button>` : ''}
                            </div>

                            <div class="core-stat-item" title="Luck - Cosmic chaos, fate, mischief energy">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">LCK</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.LCK ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'LCK')}
                                        ${this.tempStatChanges[cat.id]?.stats?.LCK ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.LCK})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(5 + this.getEffectiveStat(cat, 'LCK')*0.25).toFixed(1)}% Rare Drop Chance</div>
                                ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="LCK">+</button>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expand-toggle">
                    <button class="expand-btn" data-cat-id="${cat.id}">
                        <span class="expand-icon">▼</span>
                        <span class="expand-text">Show Stats</span>
                    </button>
                </div>
            `;
            catsContainer.appendChild(catElement);

            // Restore expanded state if this cat was expanded before
            if (this.expandedCatCards.has(cat.id.toString())) {
                catElement.classList.add('expanded');
                // Update the button text
                const expandBtn = catElement.querySelector('.expand-btn');
                if (expandBtn) {
                    const expandText = expandBtn.querySelector('.expand-text');
                    if (expandText) expandText.textContent = 'Hide Stats';
                }
            }

            // Start animations for this cat
            this.startCatAnimations(appearance.uniqueId);
        });
    }

    // Generate HTML for cat pattern
    getCatPatternHTML(pattern, color) {
        if (pattern === 'none') return '';

        let patternHTML = '';

        switch(pattern) {
            case 'spots':
                patternHTML = `
                    <div class="cat-pattern cat-spots" style="background-color: ${color}"></div>
                `;
                break;
            case 'stripes':
                patternHTML = `
                    <div class="cat-pattern cat-stripes" style="background-color: ${color}"></div>
                `;
                break;
            case 'patch':
                patternHTML = `
                    <div class="cat-pattern cat-patch" style="background-color: ${color}"></div>
                `;
                break;
        }

        return patternHTML;
    }

    // Generate HTML for cat accessory
    getCatAccessoryHTML(accessory, color) {
        if (accessory === 'none') return '';

        let accessoryHTML = '';

        switch(accessory) {
            case 'bow':
                accessoryHTML = `
                    <div class="cat-accessory cat-bow" style="background-color: ${color}"></div>
                `;
                break;
            case 'collar':
                accessoryHTML = `
                    <div class="cat-accessory cat-collar" style="background-color: ${color}"></div>
                `;
                break;
            case 'bandana':
                accessoryHTML = `
                    <div class="cat-accessory cat-bandana" style="background-color: ${color}"></div>
                `;
                break;
            case 'glasses':
                accessoryHTML = `
                    <div class="cat-accessory cat-glasses" style="border-color: ${color}"></div>
                `;
                break;
            case 'hat':
                accessoryHTML = `
                    <div class="cat-accessory cat-hat" style="background-color: ${color}"></div>
                `;
                break;
        }

        return accessoryHTML;
    }

    // Get the color for a specific rarity
    getRarityColor(rarityName) {
        const rarity = this.rarities.find(r => r.name === rarityName);
        return rarity ? rarity.color : '#AAAAAA'; // Default to gray if not found
    }

    // Get the icon for a specific rarity
    getRarityIcon(rarityName) {
        const rarity = this.rarities.find(r => r.name === rarityName);
        return rarity ? rarity.icon : '⭐'; // Default to one star if not found
    }

    // Get stat multiplier based on rarity
    getRarityStatMultiplier(rarityName) {
        switch(rarityName) {
            case 'Common': return 1.0;
            case 'Uncommon': return 1.2;
            case 'Rare': return 1.4;
            case 'Epic': return 1.6;
            case 'Legendary': return 1.8;
            case 'Mythic': return 2.0;
            default: return 1.0;
        }
    }

    // Update a cat's derived attributes based on their stats
    updateCatAttributes(cat) {
        // STR - Paw Power
        cat.attributes.attackDamage = 10 + cat.stats.STR * 1;        // Reduced from 2 to 1 per point
        cat.attributes.pushForce = 1.0 + cat.stats.STR * 0.05;      // Reduced from 0.1 to 0.05 per point

        // DEX - Whisker Dexterity
        cat.attributes.accuracy = 75 + cat.stats.DEX * 1;           // Reduced from 2% to 1% per point

        // AGI - Tail Balance
        cat.attributes.dodgeChance = cat.stats.AGI * 0.75;          // Reduced from 1.5% to 0.75% per point
        cat.attributes.attackSpeed = 1.0 + cat.stats.AGI * 0.025;   // Reduced from 0.05 to 0.025 per point
        cat.attributes.jumpHeight = 2 + cat.stats.AGI * 0.05;       // Reduced from 0.1 to 0.05 per point

        // VIT - Clawstitution
        cat.attributes.maxHealth = 100 + cat.stats.VIT * 3;         // Reduced from 5 to 3 per point
        cat.attributes.healthRegenRate = 0.1 + cat.stats.VIT * 0.025; // Reduced from 0.05 to 0.025 per point
        cat.health = Math.min(cat.health, cat.attributes.maxHealth); // Cap health at max

        // WIL - Fur-titude
        cat.attributes.debuffResistance = cat.stats.WIL * 1;        // Reduced from 2% to 1% per point
        cat.attributes.castingTimeReduction = cat.stats.WIL * 0.25; // Reduced from 0.5% to 0.25% per point

        // INT - Meowmental
        cat.attributes.xpGainMultiplier = 1.0 + cat.stats.INT * 0.025; // Reduced from 0.05 to 0.025 per point

        // CHA - Charm
        // This affects the chance to successfully recruit new cats when finding them
        // Will be used when the cat finding/recruiting feature is implemented
        cat.attributes.recruitChanceBonus = cat.stats.CHA * 0.75;   // Reduced from 1.5% to 0.75% per point
        cat.attributes.bondingSpeed = 1 + cat.stats.CHA * 0.05;     // Reduced from 0.1 to 0.05 per point

        // PER - Purrception
        cat.attributes.critChance = cat.stats.PER / 5;              // Reduced from 1% per 3 points to 1% per 5 points
        cat.attributes.stealthDetectionRange = 2 + cat.stats.PER * 0.1; // Reduced from 0.2 to 0.1 per point

        // LCK - Luck
        cat.attributes.rareDropChance = 5 + cat.stats.LCK * 0.25;   // Reduced from 0.5% to 0.25% per point
        cat.attributes.statusAvoidChance = cat.stats.LCK * 0.15;    // Reduced from 0.25% to 0.15% per point

        return cat;
    }

    // Start animations for a cat
    startCatAnimations(catId) {
        // Clear any existing intervals for this cat
        this.stopCatAnimations(catId);

        // Set up blinking animation
        this.blinkIntervals[catId] = setInterval(() => {
            const catEyes = document.querySelectorAll(`.cat-eyes[data-cat-id="${catId}"]`);
            catEyes.forEach(eye => {
                // Blink
                eye.classList.add('cat-blink');

                // Remove blink class after animation completes
                setTimeout(() => {
                    eye.classList.remove('cat-blink');
                }, 200);
            });
        }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds

        // Set up mouth movement animation
        this.mouthIntervals[catId] = setInterval(() => {
            const catMouth = document.querySelector(`.cat-mouth[data-cat-id="${catId}"]`);
            if (catMouth) {
                // Open mouth
                catMouth.classList.add('cat-mouth-open');

                // Close mouth after animation completes
                setTimeout(() => {
                    catMouth.classList.remove('cat-mouth-open');
                }, 300);
            }
        }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds

        // Set up tail movement animation
        const catTail = document.querySelector(`.cat-tail[data-cat-id="${catId}"]`);
        if (catTail) {
            // Add tail-wag class to start the animation
            catTail.classList.add('tail-wag');

            // Randomize the animation duration slightly for each cat
            const wagSpeed = (Math.random() * 0.5 + 1.5).toFixed(1); // Between 1.5 and 2.0 seconds
            catTail.style.animationDuration = `${wagSpeed}s`;
        }

        // Add whisker animations
        document.querySelectorAll(`[data-cat-id="${catId}"]`).forEach(el => {
            const catCard = el.closest('.cat-card') || el.closest('.found-cat-card');
            if (catCard) {
                // Find all whiskers in this cat card
                const whiskers = catCard.querySelectorAll('.whisker');
                whiskers.forEach(whisker => {
                    // Add a random animation delay to each whisker
                    const delay = Math.random() * 2;
                    whisker.style.animationDelay = `${delay}s`;
                    whisker.classList.add('whisker-twitch');
                });
            }
        });
    }

    // Stop animations for a cat
    stopCatAnimations(catId) {
        // Clear blinking interval
        if (this.blinkIntervals[catId]) {
            clearInterval(this.blinkIntervals[catId]);
            delete this.blinkIntervals[catId];
        }

        // Clear mouth movement interval
        if (this.mouthIntervals[catId]) {
            clearInterval(this.mouthIntervals[catId]);
            delete this.mouthIntervals[catId];
        }
    }

    // Stop all cat animations
    stopAllAnimations() {
        // Clear all blinking intervals
        Object.keys(this.blinkIntervals).forEach(catId => {
            clearInterval(this.blinkIntervals[catId]);
        });
        this.blinkIntervals = {};

        // Clear all mouth movement intervals
        Object.keys(this.mouthIntervals).forEach(catId => {
            clearInterval(this.mouthIntervals[catId]);
        });
        this.mouthIntervals = {};
    }
}

// Create global cat manager
const catManager = new CatManager();
