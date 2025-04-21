// Battle Management System
class BattleManager {
    constructor() {
        this.currentBattle = null;
        this.battleInProgress = false;
        this.playerCatGroup = null;
        this.enemyGroup = null;
        this.battleLog = [];
        this.turnCounter = 0;

        // Difficulty settings for enemy generation
        this.difficultySettings = {
            easy: {
                levelModifier: -1,
                groupSizeModifier: -1,
                eliteChance: 0.1,
                bossChance: 0.01
            },
            normal: {
                levelModifier: 0,
                groupSizeModifier: 0,
                eliteChance: 0.2,
                bossChance: 0.05
            },
            hard: {
                levelModifier: 1,
                groupSizeModifier: 1,
                eliteChance: 0.3,
                bossChance: 0.1
            },
            extreme: {
                levelModifier: 2,
                groupSizeModifier: 2,
                eliteChance: 0.5,
                bossChance: 0.2
            }
        };

        // Initialize event listeners
        this.initEventListeners();
    }

    // Initialize event listeners for battle-related UI elements
    initEventListeners() {
        // Will be implemented when battle UI is created
    }

    // Generate a random enemy group based on player level and difficulty
    generateRandomEnemyGroup(playerLevel = 1, difficulty = 'normal') {
        // Get difficulty settings
        const settings = this.difficultySettings[difficulty] || this.difficultySettings.normal;

        // Adjust player level based on difficulty
        const adjustedLevel = Math.max(1, playerLevel + settings.levelModifier);

        // Determine group size (3-5 enemies based on difficulty)
        const baseGroupSize = 3;
        const groupSize = Math.min(5, baseGroupSize + settings.groupSizeModifier);

        // Determine if we should include elite or boss enemies
        const includeElite = Math.random() < settings.eliteChance;
        const includeBoss = Math.random() < settings.bossChance;

        // Generate the enemy group using the enemyManager
        return enemyManager.generateEnemyGroup(adjustedLevel, groupSize, includeElite, includeBoss);
    }

    // Start a battle with a specific cat group against a random enemy group
    startBattle(catGroupId, difficulty = 'normal') {
        // Get the cat group from the group manager
        const catGroup = groupManager.getGroupById(catGroupId);

        if (!catGroup || catGroup.type !== 'Battle' || catGroup.cats.length === 0) {
            gameManager.addMessage('Cannot start battle: Invalid battle group or no cats in group.');
            return false;
        }

        // Calculate average level of cats in the group
        const catLevels = catGroup.cats.map(catId => {
            const cat = catManager.getCatById(catId);
            return cat ? cat.level : 1;
        });

        const averageLevel = catLevels.reduce((sum, level) => sum + level, 0) / catLevels.length;

        // Generate a random enemy group based on the average cat level
        const enemyGroup = this.generateRandomEnemyGroup(Math.floor(averageLevel), difficulty);

        // Set up the battle
        this.playerCatGroup = catGroup;
        this.enemyGroup = enemyGroup;
        this.battleInProgress = true;
        this.turnCounter = 0;
        this.battleLog = [];

        // Log the battle start
        this.addToBattleLog('Battle started!', 'battle-result');

        // Create battle data object
        this.currentBattle = {
            id: Date.now(),
            playerGroup: catGroup,
            enemies: enemyGroup,
            turns: 0,
            status: 'active',
            rewards: this.calculatePotentialRewards(enemyGroup)
        };

        // Render the battle UI
        this.renderBattleUI();

        return true;
    }

    // Calculate potential rewards for defeating the enemy group
    calculatePotentialRewards(enemyGroup) {
        let foodReward = 0;
        let materialsReward = 0;
        let medicineReward = 0;
        let xpReward = 0;

        // Calculate rewards based on enemy types and rarities
        enemyGroup.forEach(enemy => {
            // Base rewards by rarity
            const rarityMultipliers = {
                'Common': 1,
                'Uncommon': 1.5,
                'Rare': 2,
                'Elite': 3,
                'Boss': 5
            };

            const multiplier = rarityMultipliers[enemy.rarity] || 1;

            // Base rewards
            foodReward += Math.floor(5 * multiplier);
            materialsReward += Math.floor(3 * multiplier);
            medicineReward += Math.floor(1 * multiplier);
            xpReward += Math.floor(10 * enemy.level * multiplier);
        });

        return {
            food: foodReward,
            materials: materialsReward,
            medicine: medicineReward,
            xp: xpReward
        };
    }

    // Add an entry to the battle log
    addToBattleLog(message, type = 'info') {
        this.battleLog.push({
            message: message,
            type: type,
            turn: this.turnCounter
        });

        // Update the battle log UI if it exists
        this.updateBattleLogUI();
    }

    // Render the battle UI
    renderBattleUI() {
        // This will be implemented when the battle UI is designed
        console.log('Battle UI would be rendered here');
        console.log('Player Group:', this.playerCatGroup);
        console.log('Enemy Group:', this.enemyGroup);
    }

    // Update the battle log UI
    updateBattleLogUI() {
        // This will be implemented when the battle UI is designed
        console.log('Battle Log:', this.battleLog[this.battleLog.length - 1]);
    }

    // End the current battle
    endBattle(playerVictory = false) {
        if (!this.battleInProgress) {
            return;
        }

        // Update battle status
        this.currentBattle.status = playerVictory ? 'victory' : 'defeat';

        // Log the battle result
        this.addToBattleLog(
            playerVictory ? 'Victory! Your cats have won the battle!' : 'Defeat! Your cats have lost the battle.',
            'battle-result'
        );

        // Award rewards if player won
        if (playerVictory) {
            const rewards = this.currentBattle.rewards;

            // Add resources
            resourceManager.addResource('food', rewards.food);
            resourceManager.addResource('materials', rewards.materials);
            resourceManager.addResource('medicine', rewards.medicine);

            // Add XP to cats
            this.playerCatGroup.cats.forEach(catId => {
                const cat = catManager.getCatById(catId);
                if (cat) {
                    catManager.addXP(cat.id, rewards.xp);
                }
            });

            // Log rewards
            gameManager.addMessage(`Battle won! Rewards: ${rewards.food} food, ${rewards.materials} materials, ${rewards.medicine} medicine, ${rewards.xp} XP for each cat.`);
        } else {
            gameManager.addMessage('Battle lost! Your cats have been defeated but will recover for the next battle.');
        }

        // Reset battle state
        this.battleInProgress = false;

        // Update UI
        // This will be implemented when the battle UI is designed
    }

    // Get a list of all available battle groups
    getAvailableBattleGroups() {
        return groupManager.groups.filter(group => group.type === 'Battle' && group.cats.length > 0);
    }
}

// Create global battle manager
const battleManager = new BattleManager();

// Global function to generate and display a random enemy group for testing
window.generateTestEnemyGroup = function(level = 1, difficulty = 'normal') {
    // Generate a random enemy group
    const enemyGroup = battleManager.generateRandomEnemyGroup(level, difficulty);

    // Log the enemy group to the console
    console.log('Generated Enemy Group:', enemyGroup);

    // Display a message in the game
    gameManager.addMessage(`Generated a random enemy group with ${enemyGroup.length} enemies at level ${level} (${difficulty} difficulty).`);

    // Show the enemies section
    const enemiesSection = document.getElementById('enemies-section');
    if (enemiesSection) {
        enemiesSection.style.display = 'block';
    }

    // Display the enemy group in the UI
    const enemiesContainer = document.getElementById('enemies-container');
    if (enemiesContainer) {
        // Clear previous enemies
        enemiesContainer.innerHTML = '';

        // Create a group container
        const groupContainer = document.createElement('div');
        groupContainer.className = 'enemy-group';

        // Add a title for the group
        const groupTitle = document.createElement('h3');
        groupTitle.textContent = `Enemy Group (${difficulty} - Level ${level})`;
        groupContainer.appendChild(groupTitle);

        // Create a container for the enemy cards
        const enemiesDisplay = document.createElement('div');
        enemiesDisplay.className = 'enemies-display';
        groupContainer.appendChild(enemiesDisplay);

        // Render each enemy in the group
        enemyGroup.forEach(enemy => {
            enemyManager.renderEnemy(enemy, enemiesDisplay);
        });

        // Add the group to the container
        enemiesContainer.appendChild(groupContainer);
    }

    // Return the enemy group for further use
    return enemyGroup;
};

// Global function to generate a test group with a specific enemy type
window.generateEnemyTest = function(enemyType = 'Shadow Fox', level = 1) {
    // Create a container for the enemy group
    const enemiesSection = document.getElementById('enemies-section');
    if (enemiesSection) {
        enemiesSection.style.display = 'block';
    }

    // Display the enemy group in the UI
    const enemiesContainer = document.getElementById('enemies-container');
    if (enemiesContainer) {
        // Clear previous enemies
        enemiesContainer.innerHTML = '';

        // Create a group container
        const groupContainer = document.createElement('div');
        groupContainer.className = 'enemy-group';

        // Add a title for the group
        const groupTitle = document.createElement('h3');
        groupTitle.textContent = `${enemyType} Test (Level ${level})`;
        groupContainer.appendChild(groupTitle);

        // Create a container for the enemy cards
        const enemiesDisplay = document.createElement('div');
        enemiesDisplay.className = 'enemies-display';
        groupContainer.appendChild(enemiesDisplay);

        // Generate the specified enemy type
        const enemy = enemyManager.generateRandomEnemy(level, enemyType);

        // Render the enemy
        enemyManager.renderEnemy(enemy, enemiesDisplay);

        // Add the group to the container
        enemiesContainer.appendChild(groupContainer);

        // Display a message in the game
        gameManager.addMessage(`Generated a ${enemyType} enemy at level ${level}.`);

        return enemy;
    }

    return null;
};
