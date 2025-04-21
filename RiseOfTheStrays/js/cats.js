// Cat management system
class CatManager {
    constructor() {
        this.cats = [];
        this.catNames = [
            'Whiskers', 'Shadow', 'Luna', 'Oreo', 'Mittens', 'Tiger', 'Smokey', 'Felix',
            'Simba', 'Cleo', 'Milo', 'Bella', 'Charlie', 'Lucy', 'Max', 'Daisy', 'Oliver',
            'Lily', 'Leo', 'Lola', 'Rocky', 'Misty', 'Oscar', 'Molly', 'Jasper', 'Nala'
        ];

        // Define cat types with their primary and secondary stats
        this.catTypes = [
            'Scavenger',  // PER, LCK primary; DEX, AGI secondary
            'Hunter',     // AGI, DEX primary; STR, PER secondary
            'Guardian',   // VIT, STR primary; WIL, CHA secondary
            'Medic',      // INT, WIL primary; CHA, DEX secondary
            'Mystic',     // INT, WIL primary; LCK, PER secondary
            'Trickster',  // LCK, CHA primary; DEX, INT secondary
            'Beast',      // STR, AGI primary; VIT, WIL secondary
            'Diplomat',   // CHA, INT primary; WIL, PER secondary
            'Shadowpaw',  // AGI, PER primary; DEX, LCK secondary
            'Tinkerer',   // INT, DEX primary; PER, WIL secondary
            'Wanderer'    // Balanced stats
        ];

        // Define stat focus for each cat type
        this.catTypeStats = {
            'Scavenger': {
                primary: ['PER', 'LCK'],
                secondary: ['DEX', 'AGI'],
                description: 'Treasure hunter, item finder, stealthy and fast.'
            },
            'Hunter': {
                primary: ['AGI', 'DEX'],
                secondary: ['STR', 'PER'],
                description: 'Agile attacker with high crit and precision.'
            },
            'Guardian': {
                primary: ['VIT', 'STR'],
                secondary: ['WIL', 'CHA'],
                description: 'Tanky, protects team, high HP and defense.'
            },
            'Medic': {
                primary: ['INT', 'WIL'],
                secondary: ['CHA', 'DEX'],
                description: 'Healer/support cat, uses intellect and calm will.'
            },
            'Mystic': {
                primary: ['INT', 'WIL'],
                secondary: ['LCK', 'PER'],
                description: 'Magical or energy-based, status effects and spells.'
            },
            'Trickster': {
                primary: ['LCK', 'CHA'],
                secondary: ['DEX', 'INT'],
                description: 'Deceptive, charming, luck-based skillset.'
            },
            'Beast': {
                primary: ['STR', 'AGI'],
                secondary: ['VIT', 'WIL'],
                description: 'Pure feral force, relies on speed and brute power.'
            },
            'Diplomat': {
                primary: ['CHA', 'INT'],
                secondary: ['WIL', 'PER'],
                description: 'Negotiator or team booster, recruitment expert.'
            },
            'Shadowpaw': {
                primary: ['AGI', 'PER'],
                secondary: ['DEX', 'LCK'],
                description: 'Assassin/stealth class, good at dodging and crits.'
            },
            'Tinkerer': {
                primary: ['INT', 'DEX'],
                secondary: ['PER', 'WIL'],
                description: 'Inventive cat, uses tools and clever tricks.'
            },
            'Wanderer': {
                primary: [],
                secondary: [],
                description: 'Evolves into any type later, flexible growth.'
            }
        };

        // Cat features for appearance
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

    // Apply stat bonuses based on cat type
    applyTypeStatBonuses(cat) {
        // Skip if type is not defined or not in our list
        if (!cat.type || !this.catTypeStats[cat.type]) {
            return cat;
        }

        const typeInfo = this.catTypeStats[cat.type];

        // For Wanderer type (balanced), no specific bonuses
        if (cat.type === 'Wanderer') {
            // Add a small bonus to all stats
            Object.keys(cat.stats).forEach(stat => {
                cat.stats[stat] += 1;
            });
            return cat;
        }

        // Apply primary stat bonuses (larger bonus)
        typeInfo.primary.forEach(stat => {
            cat.stats[stat] += 3; // Significant bonus to primary stats
        });

        // Apply secondary stat bonuses (smaller bonus)
        typeInfo.secondary.forEach(stat => {
            cat.stats[stat] += 1; // Smaller bonus to secondary stats
        });

        return cat;
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
            // XP system
            xp: 0,
            xpToNext: this.getXPToLevel(level, this.getRarityXPMultiplier(rarity)),
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
                // Basic attributes
                maxHealth: 100,
                healthRegenRate: 0,
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
                pushForce: 1.0,

                // New combat attributes
                physicalAttack: 0,
                physicalDefense: 0,
                magicAttack: 0,
                magicResistance: 0,
                speed: 0,
                synergyBonus: 0,

                // Happiness attributes
                happinessBonus: 0,
                happinessLuckBonus: 0
            },
            statPoints: 3, // Available points to distribute
            totalStatPoints: 3 // Total points earned (for tracking)
        };

        // Apply stat bonuses based on cat type
        this.applyTypeStatBonuses(cat);

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
        document.getElementById('create-custom-cat').disabled = !enabled;
    }

    // Calculate custom cat costs based on rarity
    calculateCustomCatCosts(rarityName) {
        // Get the rarity index (0 for Common, 4 for Legendary)
        const rarityIndex = this.rarities.findIndex(r => r.name === rarityName);

        // Base costs for Common rarity
        const baseFoodCost = 25;
        const baseMaterialCost = 10;

        // Calculate exponential cost increase based on rarity
        // Common: 1x, Uncommon: 4x, Rare: 16x, Epic: 64x, Legendary: 256x
        const multiplier = Math.pow(4, rarityIndex);

        return {
            food: Math.round(baseFoodCost * multiplier),
            materials: Math.round(baseMaterialCost * multiplier)
        };
    }

    // Show custom cat creation modal
    showCustomCatModal() {
        // Check if we have room for more cats
        if (this.getCatCount() >= baseManager.getMaxCats()) {
            gameManager.addMessage(`Your base is at maximum capacity (${baseManager.getMaxCats()} cats). Upgrade your base to make room for more cats.`);
            return;
        }

        // Initial costs for Common rarity
        const initialCosts = this.calculateCustomCatCosts('Common');

        // Check if we have enough resources for at least a Common cat
        if (resourceManager.getResource('food') < initialCosts.food || resourceManager.getResource('materials') < initialCosts.materials) {
            gameManager.addMessage(`Not enough resources to create a custom cat! Need at least ${initialCosts.food} food and ${initialCosts.materials} materials for a Common cat.`);
            return;
        }

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'custom-cat-modal';
        modalContainer.className = 'modal';

        // Create the modal content
        modalContainer.innerHTML = `
            <div class="modal-content custom-cat-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Create Your Custom Cat</h3>

                <div class="custom-cat-form">
                    <div class="custom-cat-form-row">
                        <div class="custom-cat-form-column">
                            <div class="custom-cat-form-group">
                                <label for="custom-cat-name">Name:</label>
                                <input type="text" id="custom-cat-name" placeholder="Enter cat name" maxlength="20">
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-type">Type:</label>
                                <select id="custom-cat-type">
                                    ${this.catTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                                </select>
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-rarity">Rarity:</label>
                                <select id="custom-cat-rarity">
                                    ${this.rarities.map(rarity => `<option value="${rarity.name}">${rarity.name} ${rarity.icon}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="custom-cat-form-column">
                            <div class="custom-cat-preview" id="custom-cat-preview">
                                <!-- Cat preview will be rendered here -->
                            </div>
                        </div>
                    </div>

                    <div class="custom-cat-form-row">
                        <div class="custom-cat-form-column">
                            <div class="custom-cat-form-group">
                                <label for="custom-cat-body-color">Body Color:</label>
                                <div class="color-picker-container">
                                    <input type="color" id="custom-cat-body-color" value="${this.catFeatures.bodyColors[0]}">
                                    <div class="color-picker-preview" id="body-color-preview" style="background-color: ${this.catFeatures.bodyColors[0]}"></div>
                                </div>
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-pattern">Pattern:</label>
                                <select id="custom-cat-pattern">
                                    ${this.catFeatures.patterns.map(pattern => `<option value="${pattern}">${pattern.charAt(0).toUpperCase() + pattern.slice(1)}</option>`).join('')}
                                </select>
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-pattern-color">Pattern Color:</label>
                                <div class="color-picker-container">
                                    <input type="color" id="custom-cat-pattern-color" value="${this.catFeatures.patternColors[0]}">
                                    <div class="color-picker-preview" id="pattern-color-preview" style="background-color: ${this.catFeatures.patternColors[0]}"></div>
                                </div>
                            </div>
                        </div>

                        <div class="custom-cat-form-column">
                            <div class="custom-cat-form-group">
                                <label for="custom-cat-eye-color">Eye Color:</label>
                                <div class="color-picker-container">
                                    <input type="color" id="custom-cat-eye-color" value="${this.catFeatures.eyeColors[0]}">
                                    <div class="color-picker-preview" id="eye-color-preview" style="background-color: ${this.catFeatures.eyeColors[0]}"></div>
                                </div>
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-accessory">Accessory:</label>
                                <select id="custom-cat-accessory">
                                    ${this.catFeatures.accessories.map(accessory => `<option value="${accessory}">${accessory.charAt(0).toUpperCase() + accessory.slice(1)}</option>`).join('')}
                                </select>
                            </div>

                            <div class="custom-cat-form-group">
                                <label for="custom-cat-accessory-color">Accessory Color:</label>
                                <div class="color-picker-container">
                                    <input type="color" id="custom-cat-accessory-color" value="${this.catFeatures.accessoryColors[0]}">
                                    <div class="color-picker-preview" id="accessory-color-preview" style="background-color: ${this.catFeatures.accessoryColors[0]}"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="randomize-container">
                        <button type="button" id="randomize-appearance-btn">Randomize Appearance</button>
                    </div>

                    <div class="cost-info" id="custom-cat-cost-info">
                        Creating a Common cat costs <span>25 Food</span> and <span>10 Materials</span>
                    </div>

                    <div class="custom-cat-actions">
                        <button type="button" id="create-custom-cat-btn">Create Cat</button>
                        <button type="button" id="cancel-custom-cat-btn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Render initial cat preview
        this.renderCustomCatPreview();

        // Initialize cost display
        this.updateCustomCatCosts();

        // Add event listeners
        modalContainer.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        document.getElementById('cancel-custom-cat-btn').addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        document.getElementById('create-custom-cat-btn').addEventListener('click', () => {
            this.createCustomCat();
            this.closeModal(modalContainer);
        });

        // Add event listeners for preview updates
        document.getElementById('custom-cat-name').addEventListener('input', () => this.renderCustomCatPreview());
        document.getElementById('custom-cat-type').addEventListener('change', () => this.renderCustomCatPreview());
        document.getElementById('custom-cat-rarity').addEventListener('change', () => {
            this.renderCustomCatPreview();
            this.updateCustomCatCosts();
        });
        document.getElementById('custom-cat-body-color').addEventListener('input', (e) => {
            document.getElementById('body-color-preview').style.backgroundColor = e.target.value;
            this.renderCustomCatPreview();
        });
        document.getElementById('custom-cat-pattern').addEventListener('change', () => this.renderCustomCatPreview());
        document.getElementById('custom-cat-pattern-color').addEventListener('input', (e) => {
            document.getElementById('pattern-color-preview').style.backgroundColor = e.target.value;
            this.renderCustomCatPreview();
        });
        document.getElementById('custom-cat-eye-color').addEventListener('input', (e) => {
            document.getElementById('eye-color-preview').style.backgroundColor = e.target.value;
            this.renderCustomCatPreview();
        });
        document.getElementById('custom-cat-accessory').addEventListener('change', () => this.renderCustomCatPreview());
        document.getElementById('custom-cat-accessory-color').addEventListener('input', (e) => {
            document.getElementById('accessory-color-preview').style.backgroundColor = e.target.value;
            this.renderCustomCatPreview();
        });

        // Add event listener for randomize button
        document.getElementById('randomize-appearance-btn').addEventListener('click', () => {
            this.randomizeCustomCatAppearance();
        });

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Render custom cat preview
    renderCustomCatPreview() {
        const previewContainer = document.getElementById('custom-cat-preview');
        if (!previewContainer) return;

        const name = document.getElementById('custom-cat-name').value || 'Your Cat';
        const type = document.getElementById('custom-cat-type').value;
        const rarity = document.getElementById('custom-cat-rarity').value;
        const bodyColor = document.getElementById('custom-cat-body-color').value;
        const pattern = document.getElementById('custom-cat-pattern').value;
        const patternColor = document.getElementById('custom-cat-pattern-color').value;
        const eyeColor = document.getElementById('custom-cat-eye-color').value;
        const accessory = document.getElementById('custom-cat-accessory').value;
        const accessoryColor = document.getElementById('custom-cat-accessory-color').value;

        const rarityInfo = this.rarities.find(r => r.name === rarity) || this.rarities[0];
        const rarityColor = rarityInfo.color;
        const rarityIcon = rarityInfo.icon;

        const uniqueId = 'preview-cat';

        previewContainer.innerHTML = `
            <div class="cat-avatar-container">
                <div class="cat-avatar" data-type="${type}">
                    <!-- Cat body container -->
                    <div class="cat-body-container">
                        <!-- Cat body -->
                        <div class="cat-body" style="background-color: ${bodyColor}; border-radius: 50%;">
                            <!-- Cat pattern -->
                            ${this.getCatPatternHTML(pattern, patternColor)}

                            <!-- Cat ears -->
                            <div class="cat-ear left" style="background-color: ${bodyColor}">
                                <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                            </div>
                            <div class="cat-ear right" style="background-color: ${bodyColor}">
                                <div class="cat-inner-ear" style="background-color: #FF9999"></div>
                            </div>

                            <!-- Cat face -->
                            <div class="cat-face">
                                <div class="cat-eyes left" style="background-color: ${eyeColor}"></div>
                                <div class="cat-eyes right" style="background-color: ${eyeColor}"></div>
                                <div class="cat-nose"></div>
                                <div class="cat-mouth"></div>
                            </div>

                            <!-- Cat whiskers -->
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

                            <!-- Cat accessory -->
                            ${this.getCatAccessoryHTML(accessory, accessoryColor)}
                        </div>

                        <!-- Cat tail -->
                        <div class="cat-tail" data-cat-id="${uniqueId}" style="background-color: ${bodyColor}"></div>
                    </div>
                </div>
            </div>
            <div class="preview-cat-info">
                <div class="preview-cat-name">${name}</div>
                <div class="preview-cat-type">${type}</div>
                <div class="preview-cat-rarity" style="color: ${rarityColor}">${rarity} ${rarityIcon}</div>
            </div>
        `;
    }

    // Update the cost display based on selected rarity
    updateCustomCatCosts() {
        const raritySelect = document.getElementById('custom-cat-rarity');
        const costInfoElement = document.getElementById('custom-cat-cost-info');

        if (!raritySelect || !costInfoElement) return;

        const selectedRarity = raritySelect.value;
        const costs = this.calculateCustomCatCosts(selectedRarity);

        costInfoElement.innerHTML = `
            Creating a ${selectedRarity} cat costs <span>${costs.food} Food</span> and <span>${costs.materials} Materials</span>
        `;

        // Update the create button state based on whether the player has enough resources
        const createButton = document.getElementById('create-custom-cat-btn');
        if (createButton) {
            const hasEnoughResources =
                resourceManager.getResource('food') >= costs.food &&
                resourceManager.getResource('materials') >= costs.materials;

            createButton.disabled = !hasEnoughResources;

            if (!hasEnoughResources) {
                createButton.title = `Not enough resources! Need ${costs.food} Food and ${costs.materials} Materials.`;
            } else {
                createButton.title = '';
            }
        }
    }

    // Randomize custom cat appearance
    randomizeCustomCatAppearance() {
        // Generate random colors
        const randomBodyColor = this.getRandomColor();
        const randomPatternColor = this.getRandomColor();
        const randomEyeColor = this.getRandomColor();
        const randomAccessoryColor = this.getRandomColor();

        // Get random pattern and accessory
        const randomPattern = this.getRandomArrayElement(this.catFeatures.patterns);
        const randomAccessory = this.getRandomArrayElement(this.catFeatures.accessories);

        // Optionally randomize rarity (with weighted probability)
        if (Math.random() < 0.3) { // 30% chance to randomize rarity
            const rarityWeights = [0.5, 0.25, 0.15, 0.07, 0.03]; // Same as the rarity chances
            const randomRarity = this.getWeightedRandomElement(this.rarities.map(r => r.name), rarityWeights);
            this.setSelectOption('custom-cat-rarity', randomRarity);
        }

        // Set the values in the form
        document.getElementById('custom-cat-body-color').value = randomBodyColor;
        document.getElementById('body-color-preview').style.backgroundColor = randomBodyColor;

        document.getElementById('custom-cat-pattern-color').value = randomPatternColor;
        document.getElementById('pattern-color-preview').style.backgroundColor = randomPatternColor;

        document.getElementById('custom-cat-eye-color').value = randomEyeColor;
        document.getElementById('eye-color-preview').style.backgroundColor = randomEyeColor;

        document.getElementById('custom-cat-accessory-color').value = randomAccessoryColor;
        document.getElementById('accessory-color-preview').style.backgroundColor = randomAccessoryColor;

        // Set the selected options in the dropdowns
        this.setSelectOption('custom-cat-pattern', randomPattern);
        this.setSelectOption('custom-cat-accessory', randomAccessory);

        // Update the preview
        this.renderCustomCatPreview();

        // Update the costs based on the selected rarity
        this.updateCustomCatCosts();

        // Add a little animation effect to show the randomization
        const previewContainer = document.getElementById('custom-cat-preview');
        previewContainer.style.animation = 'none';
        setTimeout(() => {
            previewContainer.style.animation = 'pulse 0.5s';
        }, 10);
    }

    // Helper method to get a random color
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Helper method to get a random element from an array
    getRandomArrayElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Helper method to get a weighted random element from an array
    getWeightedRandomElement(array, weights) {
        // Make sure arrays are the same length
        if (array.length !== weights.length) {
            console.error('Array and weights must be the same length');
            return array[0];
        }

        // Calculate the sum of all weights
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

        // Get a random value between 0 and the total weight
        const randomValue = Math.random() * totalWeight;

        // Find the item that corresponds to the random value
        let weightSum = 0;
        for (let i = 0; i < array.length; i++) {
            weightSum += weights[i];
            if (randomValue <= weightSum) {
                return array[i];
            }
        }

        // Fallback to the last item
        return array[array.length - 1];
    }

    // Helper method to set a select option by value
    setSelectOption(selectId, value) {
        const select = document.getElementById(selectId);
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === value) {
                select.selectedIndex = i;
                break;
            }
        }
    }

    // Create a custom cat based on form inputs
    createCustomCat() {
        const name = document.getElementById('custom-cat-name').value || 'Custom Cat';
        const type = document.getElementById('custom-cat-type').value;
        const rarity = document.getElementById('custom-cat-rarity').value;
        const bodyColor = document.getElementById('custom-cat-body-color').value;
        const pattern = document.getElementById('custom-cat-pattern').value;
        const patternColor = document.getElementById('custom-cat-pattern-color').value;
        const eyeColor = document.getElementById('custom-cat-eye-color').value;
        const accessory = document.getElementById('custom-cat-accessory').value;
        const accessoryColor = document.getElementById('custom-cat-accessory-color').value;

        // Create appearance object
        const appearance = {
            bodyColor: bodyColor,
            patternColor: patternColor,
            pattern: pattern,
            eyeColor: eyeColor,
            accessory: accessory,
            accessoryColor: accessoryColor,
            uniqueId: 'cat-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        };

        // Calculate costs based on rarity
        const costs = this.calculateCustomCatCosts(rarity);

        // Consume resources
        if (resourceManager.useResource('food', costs.food) && resourceManager.useResource('materials', costs.materials)) {
            // Add the custom cat
            const newCat = this.addCat(name, type, 1, rarity, appearance);
            gameManager.addMessage(`You created a custom cat named ${newCat.name}!`);
            return newCat;
        } else {
            gameManager.addMessage(`Not enough resources to create a ${rarity} cat! Need ${costs.food} food and ${costs.materials} materials.`);
            return null;
        }
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

    // Remove a stat point from a cat (temporarily)
    removeStatPoint(catId, statType) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat) return;

        // Check if there are temp changes for this cat and stat
        if (!this.tempStatChanges[catId] ||
            !this.tempStatChanges[catId].stats ||
            !this.tempStatChanges[catId].stats[statType] ||
            this.tempStatChanges[catId].stats[statType] <= 0) {
            return;
        }

        // Decrement the temp stat
        this.tempStatChanges[catId].stats[statType]--;
        this.tempStatChanges[catId].pointsUsed--;

        // If the stat is now 0, remove it from the object to keep it clean
        if (this.tempStatChanges[catId].stats[statType] === 0) {
            delete this.tempStatChanges[catId].stats[statType];
        }

        // If no more points are used, remove the entire cat entry
        if (this.tempStatChanges[catId].pointsUsed === 0) {
            delete this.tempStatChanges[catId];
            // Also hide the confirmation panel since there are no changes to apply
            const catCard = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);
            if (catCard) {
                const confirmPanel = catCard.querySelector('.stat-confirm-panel');
                if (confirmPanel) {
                    confirmPanel.remove();
                }
            }
        } else {
            // Still have changes, so keep the confirmation panel
            this.showStatConfirmation(catId);
        }

        // Update the display with temporary changes
        this.updateDisplay();
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
                            <div class="cat-type-badge" data-type="${cat.type}" title="${this.getCatTypeDescription(cat.type)}">${cat.type}</div>
                        </div>

                        <div class="cat-details">
                            <div class="cat-level-container">
                                <div class="cat-level">Level ${cat.level}</div>
                                <div class="xp-bar-container" title="XP: ${cat.xp || 0}/${cat.xpToNext || this.getXPToLevel(cat.level, this.getRarityXPMultiplier(cat.rarity))}">
                                    <div class="xp-bar" style="width: ${cat.xp ? (cat.xp / cat.xpToNext) * 100 : 0}%"></div>
                                    <span class="xp-text">${cat.xp || 0}/${cat.xpToNext || this.getXPToLevel(cat.level, this.getRarityXPMultiplier(cat.rarity))} XP</span>
                                </div>
                            </div>

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
                        <div class="cat-type-badge clickable" data-type="${cat.type}" data-cat-id="${cat.id}" title="${this.getCatTypeDescription(cat.type)}">${cat.type}</div>
                    </div>

                    <div class="cat-details">
                        <div class="cat-level-container">
                            <div class="cat-level">Level ${cat.level}</div>
                            <div class="xp-bar-container" title="XP: ${cat.xp}/${cat.xpToNext}">
                                <div class="xp-bar" style="width: ${(cat.xp / cat.xpToNext) * 100}%"></div>
                                <span class="xp-text">${cat.xp}/${cat.xpToNext} XP</span>
                            </div>
                        </div>

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
                            <div class="cat-action-buttons">
                                <button class="pet-cat-btn" data-cat-id="${cat.id}" title="Pet your cat to increase happiness">Pet Cat</button>
                                <button class="gain-xp-btn" data-cat-id="${cat.id}" title="Give your cat some XP">Gain XP</button>
                            </div>
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
                            <span class="stat-value">${cat.happiness}/100</span>
                        </div>
                    </div>

                    <div class="cat-core-stats">
                        <div class="stat-header">
                            <h3>Core Stats</h3>
                            ${cat.statPoints > 0 ? `<span class="stat-points-available">Points: ${this.getRemainingStatPoints(cat)}/${cat.statPoints}</span>` : ''}
                        </div>

                        <div class="core-stats-grid">
                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'STR') ? 'primary-stat' : this.isStatSecondary(cat.type, 'STR') ? 'secondary-stat' : ''}" title="Paw Power - Physical strength, bite force, claw damage${this.getStatTypeDescription(cat.type, 'STR')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">STR</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.STR ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'STR')}
                                        ${this.tempStatChanges[cat.id]?.stats?.STR ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.STR})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(this.getEffectiveStat(cat, 'STR') * 1.5)} Physical Attack, +${Math.floor(this.getEffectiveStat(cat, 'STR') * 0.5)}% Physical Defense</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.STR > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="STR">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="STR">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'DEX') ? 'primary-stat' : this.isStatSecondary(cat.type, 'DEX') ? 'secondary-stat' : ''}" title="Whisker Dexterity - Hit accuracy and precision${this.getStatTypeDescription(cat.type, 'DEX')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">DEX</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.DEX ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'DEX')}
                                        ${this.tempStatChanges[cat.id]?.stats?.DEX ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.DEX})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(75 + this.getEffectiveStat(cat, 'DEX') * 1)}% Hit Accuracy</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.DEX > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="DEX">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="DEX">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'AGI') ? 'primary-stat' : this.isStatSecondary(cat.type, 'AGI') ? 'secondary-stat' : ''}" title="Tail Balance - Dodge chance and attack speed${this.getStatTypeDescription(cat.type, 'AGI')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">AGI</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.AGI ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'AGI')}
                                        ${this.tempStatChanges[cat.id]?.stats?.AGI ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.AGI})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(this.getEffectiveStat(cat, 'AGI') * 0.75).toFixed(1)}% Dodge Chance, ${(1.0 + this.getEffectiveStat(cat, 'AGI') * 0.025).toFixed(3)}x Attack Speed</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.AGI > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="AGI">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="AGI">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'VIT') ? 'primary-stat' : this.isStatSecondary(cat.type, 'VIT') ? 'secondary-stat' : ''}" title="Clawstitution - Endurance, toughness, fluffiness${this.getStatTypeDescription(cat.type, 'VIT')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">VIT</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.VIT ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'VIT')}
                                        ${this.tempStatChanges[cat.id]?.stats?.VIT ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.VIT})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${100 + this.getEffectiveStat(cat, 'VIT')*5} Max Health, +${Math.floor(this.getEffectiveStat(cat, 'VIT')*0.2)} HP Regen/min</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.VIT > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="VIT">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="VIT">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'WIL') ? 'primary-stat' : this.isStatSecondary(cat.type, 'WIL') ? 'secondary-stat' : ''}" title="Fur-titude - Willpower, bravery, focus${this.getStatTypeDescription(cat.type, 'WIL')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">WIL</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.WIL ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'WIL')}
                                        ${this.tempStatChanges[cat.id]?.stats?.WIL ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.WIL})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(this.getEffectiveStat(cat, 'WIL')*0.75)}% Magic Resistance, +${Math.floor(this.getEffectiveStat(cat, 'WIL')*0.5)}% Debuff Resistance</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.WIL > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="WIL">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="WIL">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'INT') ? 'primary-stat' : this.isStatSecondary(cat.type, 'INT') ? 'secondary-stat' : ''}" title="Meowmental - Magical aptitude, intuition, wisdom${this.getStatTypeDescription(cat.type, 'INT')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">INT</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.INT ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'INT')}
                                        ${this.tempStatChanges[cat.id]?.stats?.INT ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.INT})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.floor(this.getEffectiveStat(cat, 'INT') * 1.5)} Magic Attack, +${(1.0 + this.getEffectiveStat(cat, 'INT')*0.025).toFixed(2)}x XP Gain</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.INT > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="INT">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="INT">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'CHA') ? 'primary-stat' : this.isStatSecondary(cat.type, 'CHA') ? 'secondary-stat' : ''}" title="Charm - Increases chance to recruit new cats when finding them, improves bonding with other cats${this.getStatTypeDescription(cat.type, 'CHA')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">CHA</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.CHA ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'CHA')}
                                        ${this.tempStatChanges[cat.id]?.stats?.CHA ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.CHA})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${Math.min(15, this.getEffectiveStat(cat, 'CHA')*0.5).toFixed(1)}% Synergy Bonus, +${(this.getEffectiveStat(cat, 'CHA')*0.75).toFixed(1)}% Recruitment</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.CHA > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="CHA">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="CHA">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'PER') ? 'primary-stat' : this.isStatSecondary(cat.type, 'PER') ? 'secondary-stat' : ''}" title="Purrception - Senses: hearing, smell, sixth sense${this.getStatTypeDescription(cat.type, 'PER')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">PER</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.PER ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'PER')}
                                        ${this.tempStatChanges[cat.id]?.stats?.PER ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.PER})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(this.getEffectiveStat(cat, 'PER')/5).toFixed(1)}% Critical Chance</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.PER > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="PER">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="PER">+</button>` : ''}
                                </div>
                            </div>

                            <div class="core-stat-item ${this.isStatPrimary(cat.type, 'LCK') ? 'primary-stat' : this.isStatSecondary(cat.type, 'LCK') ? 'secondary-stat' : ''}" title="Luck - Cosmic chaos, fate, mischief energy${this.getStatTypeDescription(cat.type, 'LCK')}">
                                <div class="core-stat-info">
                                    <span class="core-stat-name">LCK</span>
                                    <span class="core-stat-value ${this.tempStatChanges[cat.id]?.stats?.LCK ? 'stat-changed' : ''}">
                                        ${this.getEffectiveStat(cat, 'LCK')}
                                        ${this.tempStatChanges[cat.id]?.stats?.LCK ? `<span class="stat-change">(+${this.tempStatChanges[cat.id].stats.LCK})</span>` : ''}
                                    </span>
                                </div>
                                <div class="stat-impact">+${(5 + this.getEffectiveStat(cat, 'LCK')*0.25).toFixed(1)}% Rare Drop Chance</div>
                                <div class="stat-buttons">
                                    ${this.tempStatChanges[cat.id]?.stats?.LCK > 0 ? `<button class="remove-stat-btn" data-cat-id="${cat.id}" data-stat="LCK">-</button>` : ''}
                                    ${this.getRemainingStatPoints(cat) > 0 ? `<button class="add-stat-btn" data-cat-id="${cat.id}" data-stat="LCK">+</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="expand-toggle">
                    <button class="expand-btn" data-cat-id="${cat.id}">
                        <span class="expand-icon">▼</span>
                        <span class="expand-text">${this.expandedCatCards.has(cat.id.toString()) ? 'Hide Stats' : 'Show Stats'}</span>
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

            // Add event listener for cat type badge
            const catTypeBadge = catElement.querySelector('.cat-type-badge.clickable');
            if (catTypeBadge) {
                catTypeBadge.addEventListener('click', () => {
                    const catId = parseInt(catTypeBadge.getAttribute('data-cat-id'));
                    this.showCatDetailsModal(catId);
                });
            }
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

    // Get the description for a cat type
    getCatTypeDescription(typeName) {
        if (!typeName || !this.catTypeStats[typeName]) {
            return 'Unknown type';
        }

        const typeInfo = this.catTypeStats[typeName];
        let description = typeInfo.description;

        // Add stat focus information
        if (typeName !== 'Wanderer') {
            const primaryStats = typeInfo.primary.join(', ');
            const secondaryStats = typeInfo.secondary.join(', ');
            description += ` Primary stats: ${primaryStats}. Secondary stats: ${secondaryStats}.`;
        } else {
            description += ' All stats balanced.';
        }

        return description;
    }

    // Check if a stat is a primary stat for a cat type
    isStatPrimary(typeName, statName) {
        if (!typeName || !this.catTypeStats[typeName]) {
            return false;
        }

        // Wanderer has no primary stats
        if (typeName === 'Wanderer') {
            return false;
        }

        return this.catTypeStats[typeName].primary.includes(statName);
    }

    // Check if a stat is a secondary stat for a cat type
    isStatSecondary(typeName, statName) {
        if (!typeName || !this.catTypeStats[typeName]) {
            return false;
        }

        // Wanderer has no secondary stats
        if (typeName === 'Wanderer') {
            return false;
        }

        return this.catTypeStats[typeName].secondary.includes(statName);
    }

    // Get a description of a stat's importance for a cat type
    getStatTypeDescription(typeName, statName) {
        if (!typeName || !this.catTypeStats[typeName]) {
            return '';
        }

        // Wanderer has balanced stats
        if (typeName === 'Wanderer') {
            return '';
        }

        if (this.isStatPrimary(typeName, statName)) {
            return ' (Primary stat for this cat type)';
        } else if (this.isStatSecondary(typeName, statName)) {
            return ' (Secondary stat for this cat type)';
        }

        return '';
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

    // Get the XP multiplier based on rarity
    getRarityXPMultiplier(rarityName) {
        switch(rarityName) {
            case 'Common': return 1.0;
            case 'Uncommon': return 1.2;
            case 'Rare': return 1.5;
            case 'Epic': return 1.8;
            case 'Legendary': return 2.2;
            case 'Mythic': return 2.6;
            default: return 1.0;
        }
    }

    // Get bonus stat points based on rarity
    getRarityStatPointBonus(rarityName) {
        switch(rarityName) {
            case 'Common': return 0; // No bonus
            case 'Uncommon': return 1; // +1 bonus stat point
            case 'Rare': return 2; // +2 bonus stat points
            case 'Epic': return 3; // +3 bonus stat points
            case 'Legendary': return 5; // +5 bonus stat points
            case 'Mythic': return 7; // +7 bonus stat points
            default: return 0;
        }
    }

    // Calculate XP required for a level
    getXPToLevel(level, rarityMultiplier = 1) {
        return Math.floor(50 * level * rarityMultiplier + Math.pow(level, 1.5) * 10);
    }

    // Add XP to a cat and handle level-ups
    addXP(catId, amount) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat) return;

        // Apply XP gain multiplier from cat attributes
        const adjustedAmount = Math.floor(amount * cat.attributes.xpGainMultiplier);

        // Add XP
        cat.xp += adjustedAmount;

        // Check for level up
        let leveledUp = false;
        let levelsGained = 0;

        while (cat.xp >= cat.xpToNext) {
            // Level up the cat
            cat.xp -= cat.xpToNext;
            cat.level += 1;
            levelsGained += 1;

            // Base stat points (3 per level)
            const baseStatPoints = 3;

            // Get bonus stat points based on rarity
            const bonusStatPoints = this.getRarityStatPointBonus(cat.rarity);

            // Add stat points (base + bonus)
            cat.statPoints += baseStatPoints + bonusStatPoints;
            cat.totalStatPoints += baseStatPoints + bonusStatPoints;

            // Calculate XP for next level
            cat.xpToNext = this.getXPToLevel(cat.level, this.getRarityXPMultiplier(cat.rarity));

            leveledUp = true;
        }

        // Update derived attributes if leveled up
        if (leveledUp) {
            this.updateCatAttributes(cat);

            // Show level up message with total stat points awarded
            const totalStatPoints = baseStatPoints + bonusStatPoints;
            const bonusMessage = bonusStatPoints > 0 ? ` (includes +${bonusStatPoints} ${cat.rarity} rarity bonus)` : '';
            gameManager.addMessage(`${cat.name} leveled up to level ${cat.level}! +${totalStatPoints} stat points awarded${bonusMessage}.`);

            // Add level up visual effect
            this.showLevelUpEffect(cat.id);
        }

        // Update the display
        this.updateDisplay();

        return {
            leveledUp,
            levelsGained,
            xpGained: adjustedAmount
        };
    }

    // Show level up visual effect
    showLevelUpEffect(catId) {
        const catCard = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);
        if (!catCard) return;

        // Add level up animation class
        catCard.classList.add('level-up-animation');

        // Remove the animation class after it completes
        setTimeout(() => {
            catCard.classList.remove('level-up-animation');
        }, 2000);
    }

    // Show cat details modal
    showCatDetailsModal(catId) {
        const cat = this.cats.find(c => c.id == catId);
        if (!cat) return;

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'cat-details-modal';
        modalContainer.className = 'modal';

        // Get cat type description and stats
        const typeInfo = this.catTypeStats[cat.type] || {
            description: 'A mysterious cat with unknown abilities.',
            primary: [],
            secondary: []
        };

        // Get synergy percentage for display
        const synergyPercentage = Math.round(cat.attributes.synergyBonus);

        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal-content cat-details-modal-content">
                <span class="close-modal">&times;</span>
                <div class="cat-details-header">
                    <h3>${cat.name}</h3>
                    <div class="cat-details-level">Level ${cat.level} ${cat.type}</div>
                    <div class="cat-details-rarity">${cat.rarity} ${this.rarities.find(r => r.name === cat.rarity)?.icon || ''}</div>
                    ${this.getRarityStatPointBonus(cat.rarity) > 0 ? `<div class="cat-details-rarity-bonus">+${this.getRarityStatPointBonus(cat.rarity)} stat points per level</div>` : ''}
                </div>

                <div class="cat-details-stats">
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">STR</div>
                        <div class="cat-details-stat-value">${cat.stats.STR}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">DEX</div>
                        <div class="cat-details-stat-value">${cat.stats.DEX}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">AGI</div>
                        <div class="cat-details-stat-value">${cat.stats.AGI}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">VIT</div>
                        <div class="cat-details-stat-value">${cat.stats.VIT}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">WIL</div>
                        <div class="cat-details-stat-value">${cat.stats.WIL}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">INT</div>
                        <div class="cat-details-stat-value">${cat.stats.INT}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">CHA</div>
                        <div class="cat-details-stat-value">${cat.stats.CHA}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">PER</div>
                        <div class="cat-details-stat-value">${cat.stats.PER}</div>
                    </div>
                    <div class="cat-details-stat">
                        <div class="cat-details-stat-label">LCK</div>
                        <div class="cat-details-stat-value">${cat.stats.LCK}</div>
                    </div>
                </div>

                <div class="cat-details-xp">
                    <div class="cat-details-xp-label">XP: ${cat.xp} / ${cat.xpToNext}</div>
                    <div class="cat-details-xp-bar-container">
                        <div class="cat-details-xp-bar" style="width: ${Math.min(100, (cat.xp / cat.xpToNext) * 100)}%"></div>
                    </div>
                </div>

                <div class="cat-details-combat-stats">
                    <h4>Combat Stats</h4>
                    <div class="cat-details-combat-grid">
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Physical Attack</div>
                            <div class="cat-details-combat-value">${cat.attributes.physicalAttack}</div>
                            <div class="cat-details-combat-desc">Based on STR</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Physical Defense</div>
                            <div class="cat-details-combat-value">${cat.attributes.physicalDefense}%</div>
                            <div class="cat-details-combat-desc">Based on STR</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Magic Attack</div>
                            <div class="cat-details-combat-value">${cat.attributes.magicAttack}</div>
                            <div class="cat-details-combat-desc">Based on INT</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Magic Resist</div>
                            <div class="cat-details-combat-value">${cat.attributes.magicResistance}%</div>
                            <div class="cat-details-combat-desc">Based on WIS</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">HP Regen</div>
                            <div class="cat-details-combat-value">${cat.attributes.healthRegenRate}</div>
                            <div class="cat-details-combat-desc">Per Minute</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Max Health</div>
                            <div class="cat-details-combat-value">${cat.attributes.maxHealth}</div>
                            <div class="cat-details-combat-desc">Based on VIT</div>
                        </div>
                        <div class="cat-details-combat-stat">
                            <div class="cat-details-combat-label">Synergy Bonus</div>
                            <div class="cat-details-combat-value">${synergyPercentage}%</div>
                            <div class="cat-details-combat-desc">Based on CHA (2+ cats needed)</div>
                        </div>
                    </div>
                    <div class="cat-details-combat-info">
                        <p>In groups with 2+ cats, this cat's CHA provides a ${synergyPercentage}% bonus to all stats.</p>
                    </div>
                </div>

                <div class="cat-details-type-info">
                    <h4>${cat.type} Cat</h4>
                    <p>${typeInfo.description}</p>
                    <div class="cat-details-type-stats">
                        ${typeInfo.primary.length > 0 ? `
                        <div class="cat-details-type-stat">
                            <div class="cat-details-type-stat-label">Primary Focus:</div>
                            <div class="cat-details-type-stat-value">${typeInfo.primary.join(', ')}</div>
                        </div>
                        ` : ''}
                        ${typeInfo.secondary.length > 0 ? `
                        <div class="cat-details-type-stat">
                            <div class="cat-details-type-stat-label">Secondary Focus:</div>
                            <div class="cat-details-type-stat-value">${typeInfo.secondary.join(', ')}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="modal-actions">
                    <button id="close-cat-details-btn">Close</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners
        modalContainer.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        document.getElementById('close-cat-details-btn').addEventListener('click', () => {
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

    // Update a cat's derived attributes based on their stats
    updateCatAttributes(cat) {
        // STR - Paw Power
        cat.attributes.attackDamage = 10 + cat.stats.STR * 1;        // Reduced from 2 to 1 per point
        cat.attributes.pushForce = 1.0 + cat.stats.STR * 0.05;      // Reduced from 0.1 to 0.05 per point
        cat.attributes.physicalAttack = Math.floor(cat.stats.STR * 1.5); // Physical attack damage
        cat.attributes.physicalDefense = Math.floor(cat.stats.STR * 0.5); // Physical defense percentage

        // DEX - Whisker Dexterity
        cat.attributes.accuracy = 75 + cat.stats.DEX * 1;           // Reduced from 2% to 1% per point
        cat.attributes.speed = Math.floor(cat.stats.DEX * 0.5);     // Speed bonus

        // AGI - Tail Balance
        cat.attributes.dodgeChance = cat.stats.AGI * 0.75;          // Reduced from 1.5% to 0.75% per point
        cat.attributes.attackSpeed = 1.0 + cat.stats.AGI * 0.025;   // Reduced from 0.05 to 0.025 per point
        cat.attributes.jumpHeight = 2 + cat.stats.AGI * 0.05;       // Reduced from 0.1 to 0.05 per point

        // VIT - Clawstitution
        cat.attributes.maxHealth = 100 + cat.stats.VIT * 5;         // Increased from 3 to 5 per point for better balance
        cat.attributes.healthRegenRate = Math.floor(cat.stats.VIT * 0.2); // HP regeneration per minute
        cat.health = Math.min(cat.health, cat.attributes.maxHealth); // Cap health at max

        // WIL - Fur-titude
        cat.attributes.debuffResistance = Math.floor(cat.stats.WIL * 0.5); // Reduced and rebalanced
        cat.attributes.castingTimeReduction = cat.stats.WIL * 0.25; // Reduced from 0.5% to 0.25% per point
        cat.attributes.magicResistance = Math.floor(cat.stats.WIL * 0.75); // Magic resistance percentage

        // INT - Meowmental
        cat.attributes.xpGainMultiplier = 1.0 + cat.stats.INT * 0.025; // Reduced from 0.05 to 0.025 per point
        cat.attributes.magicAttack = Math.floor(cat.stats.INT * 1.5); // Magic attack damage

        // CHA - Charm
        // This affects the chance to successfully recruit new cats when finding them
        // Will be used when the cat finding/recruiting feature is implemented
        cat.attributes.recruitChanceBonus = cat.stats.CHA * 0.75;   // Reduced from 1.5% to 0.75% per point
        cat.attributes.bondingSpeed = 1 + cat.stats.CHA * 0.05;     // Reduced from 0.1 to 0.05 per point
        cat.attributes.synergyBonus = Math.min(15, cat.stats.CHA * 0.5); // Synergy bonus capped at 15%
        cat.attributes.happinessBonus = Math.floor(cat.stats.CHA * 0.3); // Happiness bonus from CHA

        // PER - Purrception
        cat.attributes.critChance = cat.stats.PER / 5;              // Reduced from 1% per 3 points to 1% per 5 points
        cat.attributes.stealthDetectionRange = 2 + cat.stats.PER * 0.1; // Reduced from 0.2 to 0.1 per point

        // LCK - Luck
        cat.attributes.rareDropChance = 5 + cat.stats.LCK * 0.25;   // Reduced from 0.5% to 0.25% per point
        cat.attributes.statusAvoidChance = cat.stats.LCK * 0.15;    // Reduced from 0.25% to 0.15% per point
        cat.attributes.happinessLuckBonus = Math.floor(cat.stats.LCK * 0.2); // Happiness bonus from LCK

        return cat;
    }

    // Update a cat's health and happiness
    updateCatStatus(catId, healthChange = 0, happinessChange = 0) {
        const cat = this.cats.find(c => c.id === catId);
        if (!cat) return null;

        // Apply health change
        if (healthChange !== 0) {
            cat.health = Math.max(0, Math.min(cat.attributes.maxHealth, cat.health + healthChange));
        }

        // Apply happiness change with bonuses from CHA and LCK
        if (happinessChange !== 0) {
            // Apply charisma and luck bonuses to positive happiness changes
            if (happinessChange > 0) {
                const chaBonus = cat.attributes.happinessBonus || 0;
                const luckBonus = cat.attributes.happinessLuckBonus || 0;
                happinessChange = Math.floor(happinessChange * (1 + (chaBonus + luckBonus) / 100));
            }

            cat.happiness = Math.max(0, Math.min(100, cat.happiness + happinessChange));
        }

        // Apply natural regeneration based on VIT
        if (cat.health < cat.attributes.maxHealth && cat.attributes.healthRegenRate > 0) {
            // This would be called periodically in a real game loop
            // For now, we'll just simulate a small amount of healing when checking status
            cat.health = Math.min(cat.attributes.maxHealth, cat.health + 1);
        }

        // Update display
        this.updateDisplay();

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
