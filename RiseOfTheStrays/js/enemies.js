// Enemy management system
class EnemyManager {
    constructor() {
        // Enemy types with their primary and secondary stats
        this.enemyTypes = [
            'Feral Dog',      // STR, AGI primary; VIT, WIL secondary
            'Mutant Rat',     // AGI, DEX primary; STR, PER secondary
            'Rogue Cat',      // AGI, DEX primary; PER, LCK secondary
            'Scavenger Bird', // PER, AGI primary; DEX, LCK secondary
            'Wild Boar',      // STR, VIT primary; WIL, AGI secondary
            'Shadow Fox',     // DEX, PER primary; AGI, LCK secondary
            'Rabid Wolf',     // STR, AGI primary; VIT, PER secondary
            'Toxic Toad',     // VIT, WIL primary; INT, LCK secondary
            'Spectral Hound', // INT, WIL primary; PER, LCK secondary
            'Mechanical Drone' // INT, DEX primary; STR, PER secondary
        ];

        // Define stat focus for each enemy type
        this.enemyTypeStats = {
            'Feral Dog': {
                primary: ['STR', 'AGI'],
                secondary: ['VIT', 'WIL'],
                description: 'Fast and strong attacker with high physical damage.',
                abilities: ['Bite', 'Howl', 'Pack Tactics']
            },
            'Mutant Rat': {
                primary: ['AGI', 'DEX'],
                secondary: ['STR', 'PER'],
                description: 'Quick and nimble, hard to hit with high dodge chance.',
                abilities: ['Gnaw', 'Scurry', 'Disease Carrier']
            },
            'Rogue Cat': {
                primary: ['AGI', 'DEX'],
                secondary: ['PER', 'LCK'],
                description: 'Former colony cat gone wild, balanced stats with high critical chance.',
                abilities: ['Claw Swipe', 'Pounce', 'Feline Agility']
            },
            'Scavenger Bird': {
                primary: ['PER', 'AGI'],
                secondary: ['DEX', 'LCK'],
                description: 'Aerial enemy with high accuracy and evasion.',
                abilities: ['Dive Attack', 'Wing Buffet', 'Keen Eye']
            },
            'Wild Boar': {
                primary: ['STR', 'VIT'],
                secondary: ['WIL', 'AGI'],
                description: 'Tanky with high health and physical attack.',
                abilities: ['Charge', 'Gore', 'Thick Hide']
            },
            'Shadow Fox': {
                primary: ['DEX', 'PER'],
                secondary: ['AGI', 'LCK'],
                description: 'Stealthy with high critical chance and evasion.',
                abilities: ['Ambush', 'Shadow Step', 'Cunning Strike']
            },
            'Rabid Wolf': {
                primary: ['STR', 'AGI'],
                secondary: ['VIT', 'PER'],
                description: 'Aggressive attacker with chance to inflict status effects.',
                abilities: ['Maul', 'Rabid Bite', 'Frenzy']
            },
            'Toxic Toad': {
                primary: ['VIT', 'WIL'],
                secondary: ['INT', 'LCK'],
                description: 'Poison specialist with high defense and status effects.',
                abilities: ['Toxic Spit', 'Poison Cloud', 'Mucous Shield']
            },
            'Spectral Hound': {
                primary: ['INT', 'WIL'],
                secondary: ['PER', 'LCK'],
                description: 'Ghostly enemy with magic attacks and fear effects.',
                abilities: ['Spectral Howl', 'Phase Shift', 'Soul Drain']
            },
            'Mechanical Drone': {
                primary: ['INT', 'DEX'],
                secondary: ['STR', 'PER'],
                description: 'Technological enemy with precision attacks and shields.',
                abilities: ['Laser Beam', 'Energy Shield', 'Target Lock']
            }
        };

        // Enemy appearance features
        this.enemyFeatures = {
            bodyColors: [
                '#CD853F', // Peru (brighter brown)
                '#D2B48C', // Tan
                '#A0522D', // Sienna
                '#F4A460', // Sandy Brown
                '#B22222', // Firebrick (brighter red)
                '#6A5ACD', // Slate Blue (brighter blue)
                '#20B2AA', // Light Sea Green
                '#9370DB', // Medium Purple
                '#FF6347', // Tomato (bright orange-red)
                '#3CB371'  // Medium Sea Green
            ],
            patternColors: [
                '#FFD700', // Gold
                '#E0FFFF', // Light Cyan
                '#FF69B4', // Hot Pink
                '#00BFFF', // Deep Sky Blue
                '#7FFF00', // Chartreuse (bright green)
                '#FF8C00', // Dark Orange
                '#FF1493'  // Deep Pink
            ],
            patterns: [
                'none',
                'spots',
                'stripes',
                'scars',
                'markings'
            ],
            eyeColors: [
                '#FF0000', // Red
                '#FFFF00', // Yellow
                '#00FF00', // Green
                '#9932CC', // Dark Orchid (brighter purple)
                '#FFA500', // Orange
                '#00FFFF', // Cyan
                '#FF00FF', // Magenta
                '#1E90FF'  // Dodger Blue
            ]
        };

        // Define enemy rarities and their probabilities
        this.rarities = [
            { name: 'Common', chance: 0.50, color: '#AAAAAA', icon: '⭐' },
            { name: 'Uncommon', chance: 0.25, color: '#55AA55', icon: '⭐⭐' },
            { name: 'Rare', chance: 0.15, color: '#5555FF', icon: '⭐⭐⭐' },
            { name: 'Elite', chance: 0.07, color: '#AA55AA', icon: '🌟🌟' },
            { name: 'Boss', chance: 0.03, color: '#FFAA00', icon: '👑' }
        ];

        // Enemy names for each type
        this.enemyNames = {
            'Feral Dog': [
                'Scrapper', 'Fang', 'Ripper', 'Snarl', 'Growler', 'Biter', 'Savage', 'Howler'
            ],
            'Mutant Rat': [
                'Skitter', 'Gnaw', 'Plague', 'Filth', 'Scurry', 'Nibbler', 'Vermin', 'Blight'
            ],
            'Rogue Cat': [
                'Outcast', 'Betrayer', 'Stray', 'Deserter', 'Loner', 'Renegade', 'Exile', 'Vagabond'
            ],
            'Scavenger Bird': [
                'Screech', 'Talon', 'Carrion', 'Pecker', 'Wing', 'Scavenge', 'Beaker', 'Squawk'
            ],
            'Wild Boar': [
                'Tusker', 'Charger', 'Gorer', 'Stomper', 'Bristle', 'Crusher', 'Rampage', 'Muddy'
            ],
            'Shadow Fox': [
                'Slink', 'Shade', 'Dusk', 'Phantom', 'Whisper', 'Stealth', 'Midnight', 'Trickster'
            ],
            'Rabid Wolf': [
                'Foamer', 'Madclaw', 'Frenzy', 'Lunatic', 'Savage', 'Bloodfang', 'Fury', 'Rager'
            ],
            'Toxic Toad': [
                'Croaker', 'Slime', 'Venom', 'Wart', 'Toxin', 'Spitter', 'Ooze', 'Poison'
            ],
            'Spectral Hound': [
                'Wraith', 'Phantom', 'Specter', 'Haunt', 'Gloom', 'Ethereal', 'Banshee', 'Apparition'
            ],
            'Mechanical Drone': [
                'Unit', 'Servo', 'Mech', 'Bot', 'Circuit', 'Gear', 'Automaton', 'Techno'
            ]
        };
    }

    // Get a random item from an array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Calculate color similarity (0-255, higher means more different)
    colorSimilarity(color1, color2) {
        // Convert hex to RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        if (!rgb1 || !rgb2) return 255; // If conversion fails, assume they're different

        // Calculate Euclidean distance between colors
        const rDiff = Math.abs(rgb1.r - rgb2.r);
        const gDiff = Math.abs(rgb1.g - rgb2.g);
        const bDiff = Math.abs(rgb1.b - rgb2.b);

        // Return a simple measure of difference (0-255*sqrt(3))
        return Math.sqrt(rDiff*rDiff + gDiff*gDiff + bDiff*bDiff);
    }

    // Convert hex color to RGB
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');

        // Parse hex values
        let bigint = parseInt(hex, 16);
        if (isNaN(bigint)) return null;

        // Extract RGB components
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return { r, g, b };
    }

    // Get a weighted random element from an array
    getWeightedRandomElement(array, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const randomValue = Math.random() * totalWeight;

        let weightSum = 0;
        for (let i = 0; i < array.length; i++) {
            weightSum += weights[i];
            if (randomValue <= weightSum) {
                return array[i];
            }
        }

        return array[array.length - 1]; // Fallback
    }

    // Determine the rarity of an enemy based on probability
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

    // Get stat multiplier based on rarity
    getRarityStatMultiplier(rarityName) {
        switch(rarityName) {
            case 'Common': return 1.0;
            case 'Uncommon': return 1.3;
            case 'Rare': return 1.6;
            case 'Elite': return 2.0;
            case 'Boss': return 2.5;
            default: return 1.0;
        }
    }

    // Apply stat bonuses based on enemy type
    applyTypeStatBonuses(enemy) {
        // Skip if type is not defined or not in our list
        if (!enemy.type || !this.enemyTypeStats[enemy.type]) {
            return enemy;
        }

        const typeInfo = this.enemyTypeStats[enemy.type];

        // Apply primary stat bonuses (larger bonus)
        typeInfo.primary.forEach(stat => {
            enemy.stats[stat] += 3; // Significant bonus to primary stats
        });

        // Apply secondary stat bonuses (smaller bonus)
        typeInfo.secondary.forEach(stat => {
            enemy.stats[stat] += 1; // Smaller bonus to secondary stats
        });

        return enemy;
    }

    // Generate a random enemy
    generateRandomEnemy(playerLevel = 1, forcedType = null, forcedRarity = null) {
        // Determine enemy type
        const enemyType = forcedType || this.getRandomItem(this.enemyTypes);

        // Get a random name based on the enemy type
        const typeNames = this.enemyNames[enemyType] || ['Unknown'];
        const randomName = this.getRandomItem(typeNames);

        // Determine rarity - can be forced for boss encounters
        const rarity = forcedRarity || this.determineRarity();

        // Calculate level based on player level and rarity
        let level = playerLevel;
        if (rarity === 'Uncommon') level += 1;
        if (rarity === 'Rare') level += 2;
        if (rarity === 'Elite') level += 3;
        if (rarity === 'Boss') level += 5;

        // Generate random appearance features with good contrast
        const bodyColor = this.getRandomItem(this.enemyFeatures.bodyColors);

        // Make sure tail color is different from body color
        let tailColor;
        do {
            tailColor = this.getRandomItem(this.enemyFeatures.bodyColors);
        } while (tailColor === bodyColor);

        // Make sure nose color has good contrast with body color
        let noseColor;
        do {
            noseColor = this.getRandomItem(this.enemyFeatures.bodyColors);
        } while (noseColor === bodyColor || noseColor === tailColor);

        // Make sure pattern color contrasts with body color
        let patternColor;
        do {
            patternColor = this.getRandomItem(this.enemyFeatures.patternColors);
        } while (this.colorSimilarity(patternColor, bodyColor) < 50); // Ensure minimum contrast

        const appearance = {
            bodyColor: bodyColor,
            patternColor: patternColor,
            pattern: this.getRandomItem(this.enemyFeatures.patterns),
            eyeColor: this.getRandomItem(this.enemyFeatures.eyeColors),
            noseColor: noseColor,
            tailColor: tailColor,
            uniqueId: 'enemy-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        };

        // Generate base stats based on rarity and level
        const rarityMultiplier = this.getRarityStatMultiplier(rarity);
        const baseStatValue = 5 + (level - 1) * 2; // Base value increases with level

        const enemy = {
            id: Date.now(), // Use timestamp as unique ID
            name: `${randomName} the ${enemyType}`,
            type: enemyType,
            level: level,
            rarity: rarity,
            appearance: appearance,

            // Core stats
            stats: {
                STR: Math.floor(baseStatValue * rarityMultiplier), // Strength
                DEX: Math.floor(baseStatValue * rarityMultiplier), // Dexterity
                AGI: Math.floor(baseStatValue * rarityMultiplier), // Agility
                VIT: Math.floor(baseStatValue * rarityMultiplier), // Vitality
                WIL: Math.floor(baseStatValue * rarityMultiplier), // Will
                INT: Math.floor(baseStatValue * rarityMultiplier), // Intelligence
                CHA: Math.floor(baseStatValue * rarityMultiplier), // Charisma
                PER: Math.floor(baseStatValue * rarityMultiplier), // Perception
                LCK: Math.floor(baseStatValue * rarityMultiplier)  // Luck
            },

            // Derived attributes (calculated from stats)
            attributes: {
                // Basic attributes
                maxHealth: 100,
                currentHealth: 100,
                healthRegenRate: 0,
                attackDamage: 10,
                accuracy: 75,
                dodgeChance: 0,
                attackSpeed: 1.0,
                critChance: 0,

                // Combat attributes
                physicalAttack: 0,
                physicalDefense: 0,
                magicAttack: 0,
                magicResistance: 0,
                speed: 0
            },

            // Get abilities based on enemy type
            abilities: this.enemyTypeStats[enemyType]?.abilities || []
        };

        // Apply stat bonuses based on enemy type
        this.applyTypeStatBonuses(enemy);

        // Calculate derived attributes based on stats
        this.updateEnemyAttributes(enemy);

        return enemy;
    }

    // Update an enemy's derived attributes based on their stats
    updateEnemyAttributes(enemy) {
        // STR - Strength
        enemy.attributes.attackDamage = 10 + enemy.stats.STR * 1;
        enemy.attributes.physicalAttack = Math.floor(enemy.stats.STR * 1.5);
        enemy.attributes.physicalDefense = Math.floor(enemy.stats.STR * 0.5);

        // DEX - Dexterity
        enemy.attributes.accuracy = 75 + enemy.stats.DEX * 1;
        enemy.attributes.speed = Math.floor(enemy.stats.DEX * 0.5);

        // AGI - Agility
        enemy.attributes.dodgeChance = enemy.stats.AGI * 0.75;
        enemy.attributes.attackSpeed = 1.0 + enemy.stats.AGI * 0.025;

        // VIT - Vitality
        enemy.attributes.maxHealth = 100 + enemy.stats.VIT * 5;
        enemy.attributes.healthRegenRate = Math.floor(enemy.stats.VIT * 0.2);
        enemy.attributes.currentHealth = enemy.attributes.maxHealth; // Start at full health

        // WIL - Will
        enemy.attributes.debuffResistance = Math.floor(enemy.stats.WIL * 0.5);
        enemy.attributes.magicResistance = Math.floor(enemy.stats.WIL * 0.75);

        // INT - Intelligence
        enemy.attributes.magicAttack = Math.floor(enemy.stats.INT * 1.5);

        // PER - Perception
        enemy.attributes.critChance = enemy.stats.PER / 5;

        // Apply rarity bonuses to health and damage
        const rarityHealthBonus = {
            'Common': 1.0,
            'Uncommon': 1.2,
            'Rare': 1.5,
            'Elite': 2.0,
            'Boss': 3.0
        };

        const rarityDamageBonus = {
            'Common': 1.0,
            'Uncommon': 1.1,
            'Rare': 1.3,
            'Elite': 1.5,
            'Boss': 2.0
        };

        // Apply the bonuses
        enemy.attributes.maxHealth = Math.floor(enemy.attributes.maxHealth * (rarityHealthBonus[enemy.rarity] || 1.0));
        enemy.attributes.currentHealth = enemy.attributes.maxHealth;
        enemy.attributes.physicalAttack = Math.floor(enemy.attributes.physicalAttack * (rarityDamageBonus[enemy.rarity] || 1.0));
        enemy.attributes.magicAttack = Math.floor(enemy.attributes.magicAttack * (rarityDamageBonus[enemy.rarity] || 1.0));

        return enemy;
    }

    // Generate a group of enemies for a battle
    generateEnemyGroup(playerLevel, groupSize = 3, includeElite = false, includeBoss = false) {
        const enemies = [];

        // If we should include a boss, add it
        if (includeBoss) {
            enemies.push(this.generateRandomEnemy(playerLevel, null, 'Boss'));
            groupSize--; // Reduce remaining group size
        }

        // If we should include an elite enemy, add it
        if (includeElite && groupSize > 0) {
            enemies.push(this.generateRandomEnemy(playerLevel, null, 'Elite'));
            groupSize--; // Reduce remaining group size
        }

        // Fill the rest of the group with random enemies
        for (let i = 0; i < groupSize; i++) {
            enemies.push(this.generateRandomEnemy(playerLevel));
        }

        return enemies;
    }

    // Calculate XP reward for defeating an enemy
    calculateXPReward(enemy) {
        const baseXP = 10;
        const levelMultiplier = enemy.level * 1.5;

        const rarityMultiplier = {
            'Common': 1.0,
            'Uncommon': 1.5,
            'Rare': 2.5,
            'Elite': 4.0,
            'Boss': 10.0
        };

        return Math.floor(baseXP * levelMultiplier * (rarityMultiplier[enemy.rarity] || 1.0));
    }

    // Calculate resource rewards for defeating an enemy
    calculateResourceRewards(enemy) {
        const baseFood = Math.floor(Math.random() * 3) + 1; // 1-3 food
        const baseMaterials = Math.floor(Math.random() * 2) + 1; // 1-2 materials
        const baseMedicine = Math.random() < 0.3 ? 1 : 0; // 30% chance for 1 medicine

        const rarityMultiplier = {
            'Common': 1.0,
            'Uncommon': 1.5,
            'Rare': 2.0,
            'Elite': 3.0,
            'Boss': 5.0
        };

        const multiplier = rarityMultiplier[enemy.rarity] || 1.0;

        return {
            food: Math.floor(baseFood * multiplier),
            materials: Math.floor(baseMaterials * multiplier),
            medicine: Math.floor(baseMedicine * multiplier)
        };
    }

    // Render an enemy for display in battle
    renderEnemy(enemy, container) {
        const enemyElement = document.createElement('div');
        enemyElement.className = 'enemy-card';
        enemyElement.setAttribute('data-enemy-id', enemy.id);

        // Add rarity-based styling
        enemyElement.classList.add(`rarity-${enemy.rarity.toLowerCase()}`);

        // Create the HTML content for the header and stats
        let enemyHTML = `
            <div class="enemy-header">
                <div class="enemy-name">${enemy.name}</div>
                <div class="enemy-level">Level ${enemy.level} ${enemy.rarity}</div>
            </div>
        `;

        // Add the appropriate appearance based on enemy type
        if (enemy.type === 'Shadow Fox') {
            // Use the animated shadow fox with random colors
            enemyHTML += `
            <div class="animated-enemy fox-container shadow-fox">
                <div class="fox-body" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-head" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-ear left" style="border-bottom-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-ear right" style="border-bottom-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-ear-inner left" style="border-bottom-color: ${enemy.appearance.patternColor};"></div>
                <div class="fox-ear-inner right" style="border-bottom-color: ${enemy.appearance.patternColor};"></div>
                <div class="fox-eye left" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="fox-eye right" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="fox-nose" style="background-color: ${enemy.appearance.noseColor};"></div>
                <div class="fox-tail" style="background-color: ${enemy.appearance.tailColor};">
                    <div class="fox-tail-tip" style="background-color: ${enemy.appearance.patternColor};"></div>
                </div>
                <div class="fox-leg front-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-leg front-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-leg back-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="fox-leg back-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
            </div>
            `;
        } else if (enemy.type === 'Feral Dog') {
            // Use the animated dog with random colors
            enemyHTML += `
            <div class="animated-enemy dog-container">
                <div class="dog-body" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-head" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-ear left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-ear right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-eye left" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="dog-eye right" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="dog-nose" style="background-color: ${enemy.appearance.noseColor};"></div>
                <div class="dog-mouth" style="background-color: #FF6666;"></div>
                <div class="dog-tail" style="background-color: ${enemy.appearance.tailColor};"></div>
                <div class="dog-leg front-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg front-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg back-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg back-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
            </div>
            `;
        } else if (enemy.type === 'Rabid Wolf') {
            // Use the animated rabid wolf with random colors
            enemyHTML += `
            <div class="animated-enemy dog-container rabid-wolf">
                <div class="dog-body" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-head" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-ear left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-ear right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-eye left" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="dog-eye right" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="dog-nose" style="background-color: ${enemy.appearance.noseColor};"></div>
                <div class="dog-mouth" style="background-color: #FF3333;"></div>
                <div class="rabid-wolf-teeth left"></div>
                <div class="rabid-wolf-teeth right"></div>
                <div class="dog-tail" style="background-color: ${enemy.appearance.tailColor};"></div>
                <div class="dog-leg front-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg front-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg back-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="dog-leg back-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
            </div>
            `;
        } else if (enemy.type === 'Sewer Rat' || enemy.type === 'Plague Rat') {
            // Use the animated rat with random colors
            const ratClass = enemy.type === 'Plague Rat' ? 'plague-rat' : '';
            enemyHTML += `
            <div class="animated-enemy rat-container ${ratClass}">
                <div class="rat-body" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-head" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-ear left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-ear right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-eye left" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="rat-eye right" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="rat-nose" style="background-color: ${enemy.appearance.noseColor};"></div>
                <div class="rat-whisker top-left" style="background-color: #DDDDDD;"></div>
                <div class="rat-whisker bottom-left" style="background-color: #DDDDDD;"></div>
                <div class="rat-whisker top-right" style="background-color: #DDDDDD;"></div>
                <div class="rat-whisker bottom-right" style="background-color: #DDDDDD;"></div>
                <div class="rat-tail" style="background-color: ${enemy.appearance.tailColor};"></div>
                <div class="rat-leg front-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-leg front-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-leg back-left" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="rat-leg back-right" style="background-color: ${enemy.appearance.bodyColor};"></div>
            </div>
            `;
        } else if (enemy.type === 'Giant Spider' || enemy.type === 'Venomous Spider') {
            // Use the animated spider with random colors
            const spiderClass = enemy.type === 'Venomous Spider' ? 'venomous-spider' : '';
            enemyHTML += `
            <div class="animated-enemy spider-container ${spiderClass}">
                <div class="spider-body" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-head" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-eye left" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="spider-eye right" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="spider-eye left2" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="spider-eye right2" style="background-color: ${enemy.appearance.eyeColor};"></div>
                <div class="spider-fang left" style="background-color: #FFFFFF;"></div>
                <div class="spider-fang right" style="background-color: #FFFFFF;"></div>
                <div class="spider-leg left1" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg left2" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg left3" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg left4" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg right1" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg right2" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg right3" style="background-color: ${enemy.appearance.bodyColor};"></div>
                <div class="spider-leg right4" style="background-color: ${enemy.appearance.bodyColor};"></div>
            </div>
            `;
        } else {
            // Use the default appearance for other enemy types
            enemyHTML += `
            <div class="enemy-appearance" style="background-color: ${enemy.appearance.bodyColor};">
                <div class="enemy-eyes" style="background-color: ${enemy.appearance.eyeColor};"></div>
                ${enemy.appearance.pattern !== 'none' ?
                    `<div class="enemy-pattern ${enemy.appearance.pattern}" style="background-color: ${enemy.appearance.patternColor};"></div>` : ''}
            </div>
            `;
        }

        // Add stats and abilities
        enemyHTML += `
            <div class="enemy-stats">
                <div class="enemy-health-bar">
                    <div class="health-label">HP: ${enemy.attributes.currentHealth}/${enemy.attributes.maxHealth}</div>
                    <div class="health-bar-container">
                        <div class="health-bar" style="width: ${(enemy.attributes.currentHealth / enemy.attributes.maxHealth) * 100}%;"></div>
                    </div>
                </div>
                <div class="enemy-attack">ATK: ${enemy.attributes.physicalAttack}</div>
                <div class="enemy-defense">DEF: ${enemy.attributes.physicalDefense}</div>
                <div class="enemy-magic">MAG: ${enemy.attributes.magicAttack}</div>
                <div class="enemy-resist">RES: ${enemy.attributes.magicResistance}%</div>
            </div>
            <div class="enemy-abilities">
                ${enemy.abilities.map(ability => `<div class="enemy-ability">${ability}</div>`).join('')}
            </div>
        `;

        // Set the HTML content
        enemyElement.innerHTML = enemyHTML;

        // Add the enemy to the container
        container.appendChild(enemyElement);

        return enemyElement;
    }
}

// Create global enemy manager
const enemyManager = new EnemyManager();
