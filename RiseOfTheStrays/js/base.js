// Base management system
class BaseManager {
    constructor() {
        this.baseLevel = 1;
        this.maxCats = 5; // Starting max cats
        this.upgradeCost = 10; // Starting upgrade cost (materials)

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

    // Get cost to upgrade the base
    getUpgradeCost() {
        return this.upgradeCost;
    }

    // Upgrade the base if enough resources are available
    upgradeBase() {
        if (resourceManager.useResource('materials', this.upgradeCost)) {
            this.baseLevel++;
            this.maxCats += 3; // Each level adds space for 3 more cats
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5); // Increase cost for next upgrade

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
