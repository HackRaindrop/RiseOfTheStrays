// Main game manager
class GameManager {
    constructor() {
        this.day = 1;
        this.messageLog = [];
        this.maxMessages = 10;

        // Initialize event listeners
        this.initEventListeners();

        // Add welcome message
        this.addMessage("Welcome to Rise of the Strays! Build your cat colony and survive the apocalypse.");
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

        // Find cat buttons for different search types
        const checkCapacityAndFindCat = (searchType) => {
            // Check if we have room for more cats
            if (catManager.getCatCount() >= baseManager.getMaxCats()) {
                this.addMessage(`Your base is at maximum capacity (${baseManager.getMaxCats()} cats). Upgrade your base to make room for more cats.`);
                return;
            }

            // Start the search process
            const result = catManager.findCat(searchType);

            // If result is "searching" or "found", the cat manager is handling the process
            if (result === "searching" || result === "found") {
                // We don't need to do anything here as the cat manager will handle the timer
                // and update the UI when the search is complete or when a cat is found
            }
        };

        // Normal search
        document.getElementById('find-cat-normal').addEventListener('click', () => {
            checkCapacityAndFindCat('normal');
        });

        // Thorough search
        document.getElementById('find-cat-thorough').addEventListener('click', () => {
            checkCapacityAndFindCat('thorough');
        });

        // Premium search
        document.getElementById('find-cat-premium').addEventListener('click', () => {
            checkCapacityAndFindCat('premium');
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
}

// Create global game manager
const gameManager = new GameManager();

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Game initialized!');

    // Add event listener for stat buttons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-stat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            const statType = event.target.getAttribute('data-stat');
            catManager.addStatPoint(catId, statType);
            // Prevent the click from toggling the card
            event.stopPropagation();
        } else if (event.target.classList.contains('confirm-stat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            catManager.applyStatChanges(catId);
            // Prevent the click from toggling the card
            event.stopPropagation();
        } else if (event.target.classList.contains('cancel-stat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            catManager.cancelStatChanges(catId);
            // Prevent the click from toggling the card
            event.stopPropagation();
        } else if (event.target.closest('.expand-btn')) {
            // Handle expand/collapse button click
            const expandBtn = event.target.closest('.expand-btn');
            const catId = expandBtn.getAttribute('data-cat-id');
            const catCard = document.querySelector(`.cat-card[data-cat-id="${catId}"]`);

            // Toggle the expanded class
            catCard.classList.toggle('expanded');

            // Update button text and track expanded state
            const expandText = expandBtn.querySelector('.expand-text');
            if (catCard.classList.contains('expanded')) {
                expandText.textContent = 'Hide Stats';
                catManager.expandedCatCards.add(catId);
            } else {
                expandText.textContent = 'Show Stats';
                catManager.expandedCatCards.delete(catId);
            }

            // Prevent the click from bubbling
            event.stopPropagation();
        }
    });
});

