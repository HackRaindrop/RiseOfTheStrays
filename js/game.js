// Main game manager
class GameManager {
    constructor() {
        this.day = 1;

        // Initialize event listeners
        this.initEventListeners();

        // Add welcome message
        this.addMessage("Welcome to Rise of the Strays! Build your cat colony and survive the apocalypse.", true);
    }

    // Set up all event listeners
    initEventListeners = () => {
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

        // We no longer need the open-lootbox button event listener
        // as loot boxes are now in their own tab

        // Base upgrade button
        document.getElementById('upgrade-base').addEventListener('click', () => {
            baseManager.upgradeBase();
        });

        // Training arena upgrade button will be attached in DOMContentLoaded

        // Find cat buttons for different search types
        const checkCapacityAndFindCat = (searchType) => {
            // Check if we have room for more cats - for now, assume a fixed max of 10 cats
            const maxCats = 10;
            if (catManager.getCatCount() >= maxCats) {
                this.addMessage(`Your base is at maximum capacity (${maxCats} cats). Upgrade your base to make room for more cats.`, true);
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

        // Create custom cat
        document.getElementById('create-custom-cat').addEventListener('click', () => {
            catManager.showCustomCatModal();
        });
    }

    // Add a message using the toast system
    addMessage = (message, isImportant = false) => {
        // The toast-messages.js handles the display logic
        if (typeof window.addMessage === 'function' && window.addMessage !== this.addMessage) {
            window.addMessage(message, isImportant);
        } else {
            console.log(`[${isImportant ? 'IMPORTANT' : 'INFO'}] ${message}`);
        }
    }

    // Advance to the next day
    advanceDay = () => {
        this.day++;
        this.addMessage(`Day ${this.day} has begun.`);

        // Daily events and resource consumption would go here
    }

    // Produce resources from buildings
    produceResources = () => {
        // Get production from outpost buildings
        const buildingProduction = buildingManager.produceResources();

        let productionMessage = '';
        let resourcesProduced = false;

        for (const resource in buildingProduction) {
            if (buildingProduction[resource] > 0) {
                const roundedAmount = Math.round(buildingProduction[resource] * 10) / 10; // Round to 1 decimal place
                productionMessage += `${roundedAmount} ${resource}, `;
                resourcesProduced = true;
            }
        }

        if (resourcesProduced) {
            // Remove trailing comma and space
            productionMessage = productionMessage.slice(0, -2);
            this.addMessage(`Production cycle: ${productionMessage}`);
        }

        // Update building buttons in case resource changes affect build availability
        buildingManager.updateBuildButtonStates();
    }



    // Increase the maximum number of cats the player can have
    increaseMaxCats = (amount) => {
        // For now, just log the increase
        console.log(`Max cat capacity would increase by ${amount}`);
        this.addMessage(`Max cat capacity increased by ${amount}!`, true);

        // In the future, this would be handled by the base manager
        // if (typeof baseManager !== 'undefined' && baseManager.increaseMaxCats) {
        //     baseManager.increaseMaxCats(amount);
        // }
    }
}

// Create global game manager
const gameManager = new GameManager();

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Game initialized!');

    // Initialize save system
    if (typeof saveSystem !== 'undefined') {
        saveSystem.initialize();
    }

    // Function to attach event listener to upgrade button
    const attachUpgradeButtonListener = () => {
        const upgradeArenaButton = document.getElementById('upgrade-arena');
        if (upgradeArenaButton && !upgradeArenaButton.hasAttribute('data-listener-attached')) {
            console.log('Found upgrade arena button, attaching event listener');
            upgradeArenaButton.addEventListener('click', () => {
                console.log('Upgrade arena button clicked from event listener');
                window.upgradeTrainingArena();
            });
            upgradeArenaButton.setAttribute('data-listener-attached', 'true');
        } else if (!upgradeArenaButton) {
            console.log('Upgrade arena button not found');
        } else {
            console.log('Upgrade arena button already has listener attached');
        }
    };

    // Attach listeners initially
    attachUpgradeButtonListener();

    // Set up a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes contain our button
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Element node
                        if (node.id === 'upgrade-arena' || node.querySelector('#upgrade-arena')) {
                            console.log('Upgrade arena button added to DOM, attaching listener');
                            attachUpgradeButtonListener();
                        }
                    }
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Attach test food button event listener
    const addTestFoodButton = document.getElementById('add-test-food');
    if (addTestFoodButton) {
        addTestFoodButton.addEventListener('click', () => {
            if (typeof window.addTestFood === 'function') {
                window.addTestFood();
            } else {
                // Fallback if the function doesn't exist
                resourceManager.addResource('food', 7000);
                gameManager.addMessage('Added 7000 food for testing!', true);
            }
        });
    }

    // Attach test materials button event listener
    const addTestMaterialsButton = document.getElementById('add-test-materials');
    if (addTestMaterialsButton) {
        addTestMaterialsButton.addEventListener('click', () => {
            // Add a significant amount of resources for testing
            resourceManager.addResource('food', 100);
            resourceManager.addResource('materials', 100);
            resourceManager.addResource('medicine', 100);
            gameManager.addMessage('Added 100 of each resource for testing!', true);
        });
    }

    // Attach generate test enemies button event listener
    const generateTestEnemiesButton = document.getElementById('generate-test-enemies');
    if (generateTestEnemiesButton) {
        generateTestEnemiesButton.addEventListener('click', () => {
            if (typeof window.generateTestEnemyGroup === 'function') {
                window.generateTestEnemyGroup(1, 'normal');
            } else {
                gameManager.addMessage('Test enemy generation function not available', true);
            }
        });
    }

    // Attach fox test button event listener
    const generateFoxTestButton = document.getElementById('generate-fox-test');
    if (generateFoxTestButton) {
        generateFoxTestButton.addEventListener('click', () => {
            // Cycle through different enemy types on each click
            const enemyTypes = ['Shadow Fox', 'Feral Dog', 'Rabid Wolf', 'Sewer Rat', 'Plague Rat', 'Giant Spider', 'Venomous Spider'];
            const currentType = generateFoxTestButton.getAttribute('data-current-type') || 0;
            const nextType = (parseInt(currentType) + 1) % enemyTypes.length;

            if (typeof window.generateEnemyTest === 'function') {
                // Generate the enemy
                window.generateEnemyTest(enemyTypes[nextType], 1);
            } else {
                gameManager.addMessage(`Test ${enemyTypes[nextType]} animation function not available`, true);
            }

            // Update the button text and data attribute
            generateFoxTestButton.textContent = `Test ${enemyTypes[nextType]} Animation`;
            generateFoxTestButton.setAttribute('data-current-type', nextType);
        });
    }

    // Attach create group button event listener
    const createGroupBtn = document.getElementById('create-group-btn');
    console.log('Create group button in game.js:', createGroupBtn);
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', () => {
            console.log('Create group button clicked in game.js');
            if (typeof groupManager !== 'undefined' && groupManager.showCreateGroupModal) {
                groupManager.showCreateGroupModal();
            } else {
                console.error('groupManager is not defined or showCreateGroupModal method is missing');
            }
        });
        console.log('Event listener attached to create group button in game.js');
    }

    // Add event listener for stat buttons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-stat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            const statType = event.target.getAttribute('data-stat');
            catManager.addStatPoint(catId, statType);
            // Prevent the click from toggling the card
            event.stopPropagation();
        } else if (event.target.classList.contains('remove-stat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            const statType = event.target.getAttribute('data-stat');
            catManager.removeStatPoint(catId, statType);
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
        } else if (event.target.classList.contains('gain-xp-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            // Add a random amount of XP between 10 and 50
            const xpAmount = Math.floor(Math.random() * 41) + 10;
            const result = catManager.addXP(catId, xpAmount);
            if (result) {
                gameManager.addMessage(`${result.xpGained} XP added to cat!`);
            }
        } else if (event.target.classList.contains('pet-cat-btn')) {
            const catId = parseInt(event.target.getAttribute('data-cat-id'));
            const cat = catManager.cats.find(c => c.id === catId);
            if (cat) {
                // Update cat happiness
                catManager.updateCatStatus(catId, 0, 5);
                gameManager.addMessage(`You pet ${cat.name}! Happiness increased.`);

                // Add a visual effect to show the cat is happy
                const catCard = event.target.closest('.cat-card');
                if (catCard) {
                    catCard.classList.add('happy-animation');
                    setTimeout(() => {
                        catCard.classList.remove('happy-animation');
                    }, 1000);
                }
            }
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

