// Main game manager
class GameManager {
    constructor() {
        this.day = 1;
        this.messageLog = [];
        this.maxMessages = 10;
        this.productionInterval = null;

        // Initialize event listeners
        this.initEventListeners();

        // Add welcome message
        this.addMessage("Welcome to Rise of the Strays! Build your cat colony and survive the apocalypse.");

        // Start resource production cycle
        this.startProductionCycle();
    }

    // Set up all event listeners
    initEventListeners() {
        // Resource gathering buttons
        document.getElementById('gather-food').addEventListener('click', () => {
            const amount = resourceManager.gatherResource('food');
            this.addMessage(`Gathered ${amount} food.`);
        });

        document.getElementById('gather-materials').addEventListener('click', () => {
            const amount = resourceManager.gatherResource('materials');
            this.addMessage(`Gathered ${amount} materials.`);
        });

        document.getElementById('gather-medicine').addEventListener('click', () => {
            const amount = resourceManager.gatherResource('medicine');
            this.addMessage(`Gathered ${amount} medicine.`);
        });

        // Base upgrade button
        document.getElementById('upgrade-base').addEventListener('click', () => {
            baseManager.upgradeBase();
        });

        // Find cat button
        document.getElementById('find-cat').addEventListener('click', () => {
            // Check if we have room for more cats
            if (catManager.getCatCount() >= baseManager.getMaxCats()) {
                this.addMessage(`Your base is at maximum capacity (${baseManager.getMaxCats()} cats). Upgrade your base to make room for more cats.`);
                return;
            }

            catManager.findCat();
        });
    }

    // Add a message to the log
    addMessage(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.messageLog.unshift(`[${timestamp}] ${message}`);

        // Keep log at max length
        if (this.messageLog.length > this.maxMessages) {
            this.messageLog.pop();
        }

        this.updateMessageDisplay();
    }

    // Update the message display
    updateMessageDisplay() {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';

        this.messageLog.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
        });
    }

    // Advance to the next day
    advanceDay() {
        this.day++;
        this.addMessage(`Day ${this.day} has begun.`);

        // Daily events and resource consumption would go here
    }

    // Start the resource production cycle
    startProductionCycle() {
        // Clear any existing interval
        if (this.productionInterval) {
            clearInterval(this.productionInterval);
        }

        // Set up a new interval for resource production (every 10 seconds)
        this.productionInterval = setInterval(() => {
            this.produceResources();
        }, 10000);
    }

    // Produce resources from buildings
    produceResources() {
        const production = buildingManager.produceResources();

        // Log production if any resources were produced
        let productionMessage = '';
        let resourcesProduced = false;

        for (const resource in production) {
            if (production[resource] > 0) {
                const roundedAmount = Math.round(production[resource] * 10) / 10; // Round to 1 decimal place
                productionMessage += `${roundedAmount} ${resource}, `;
                resourcesProduced = true;
            }
        }

        if (resourcesProduced) {
            // Remove trailing comma and space
            productionMessage = productionMessage.slice(0, -2);
            this.addMessage(`Buildings produced: ${productionMessage}`);
        }

        // Update building buttons in case resource changes affect build availability
        buildingManager.updateBuildButtonStates();
    }
}

// Create global game manager
const gameManager = new GameManager();

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Game initialized!');
});
