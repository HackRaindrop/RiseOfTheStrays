// Resources management
class ResourceManager {
    constructor() {
        this.resources = {
            food: 10,
            materials: 5,
            medicine: 2
        };
        
        this.gatherRates = {
            food: 1,
            materials: 1,
            medicine: 1
        };
        
        this.updateDisplay();
    }
    
    // Get current resource amount
    getResource(type) {
        return this.resources[type];
    }
    
    // Add resources
    addResource(type, amount) {
        this.resources[type] += amount;
        this.updateDisplay();
        return this.resources[type];
    }
    
    // Use resources if available
    useResource(type, amount) {
        if (this.resources[type] >= amount) {
            this.resources[type] -= amount;
            this.updateDisplay();
            return true;
        }
        return false;
    }
    
    // Gather resources based on current gather rate
    gatherResource(type) {
        const baseAmount = this.gatherRates[type];
        // Add some randomness to gathering
        const randomBonus = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
        const amount = baseAmount + randomBonus;
        
        this.addResource(type, amount);
        return amount;
    }
    
    // Increase gather rate for a resource
    upgradeGatherRate(type) {
        this.gatherRates[type] += 1;
    }
    
    // Update the UI with current resource values
    updateDisplay() {
        document.getElementById('food-count').textContent = this.resources.food;
        document.getElementById('materials-count').textContent = this.resources.materials;
        document.getElementById('medicine-count').textContent = this.resources.medicine;
    }
}

// Create global resource manager
const resourceManager = new ResourceManager();
