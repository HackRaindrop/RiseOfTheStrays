// Base management system
class BaseManager {
    constructor() {
        this.baseLevel = 1;
        this.maxCats = 5; // Starting max cats
        this.upgradeCost = 10; // Starting upgrade cost (materials)
        this.bunkerWidth = 5; // Starting bunker width
        this.bunkerHeight = 5; // Starting bunker height

        this.updateDisplay();
    }

    // Get current base level
    getBaseLevel() {
        return this.baseLevel;
    }

    // Get max number of cats the base can support
    getMaxCats() {
        return this.maxCats;
    }

    // Increase max cats (used by bunker rooms)
    increaseMaxCats(amount) {
        this.maxCats += amount;
        this.updateDisplay();
        gameManager.addMessage(`Base capacity increased! You can now have up to ${this.maxCats} cats.`);
    }

    // Get cost to upgrade the base
    getUpgradeCost() {
        return this.upgradeCost;
    }

    // Get bunker dimensions
    getBunkerDimensions() {
        return {
            width: this.bunkerWidth,
            height: this.bunkerHeight
        };
    }

    // Upgrade the base if enough resources are available
    upgradeBase() {
        if (resourceManager.useResource('materials', this.upgradeCost)) {
            this.baseLevel++;
            this.maxCats += 3; // Each level adds space for 3 more cats
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5); // Increase cost for next upgrade

            // Expand bunker size every other level
            if (this.baseLevel % 2 === 0) {
                this.bunkerWidth += 1;
                this.bunkerHeight += 1;

                // Update the bunker grid if bunkerManager exists
                if (typeof bunkerManager !== 'undefined') {
                    bunkerManager.expandGrid(this.bunkerWidth, this.bunkerHeight);
                }

                gameManager.addMessage(`Your bunker has expanded to ${this.bunkerWidth}x${this.bunkerHeight}!`);
            }

            // Update the UI
            this.updateDisplay();

            gameManager.addMessage(`Base upgraded to level ${this.baseLevel}! You can now have up to ${this.maxCats} cats.`);
            return true;
        } else {
            gameManager.addMessage(`Not enough materials to upgrade base! Need ${this.upgradeCost} materials.`);
            return false;
        }
    }

    // Update the UI with current base info
    updateDisplay() {
        document.getElementById('base-level-value').textContent = this.baseLevel;
        document.getElementById('upgrade-base').textContent = `Upgrade Base (Cost: ${this.upgradeCost} Materials)`;
    }
}

// Create global base manager
const baseManager = new BaseManager();
