// Loot Box Management System
class LootBoxManager {
    constructor() {
        // Define loot box types with their costs and reward ranges
        this.lootBoxTypes = {
            'basic': {
                cost: { materials: 5 },
                rewards: {
                    food: { min: 2, max: 8, chance: 0.9 },
                    medicine: { min: 0, max: 2, chance: 0.5 }
                },
                description: 'A basic loot box with a chance for food and medicine.'
            },
            'premium': {
                cost: { materials: 15 },
                rewards: {
                    food: { min: 5, max: 15, chance: 1.0 },
                    medicine: { min: 1, max: 4, chance: 0.8 }
                },
                description: 'A premium loot box with guaranteed food and high chance of medicine.'
            },
            'deluxe': {
                cost: { materials: 30 },
                rewards: {
                    food: { min: 10, max: 25, chance: 1.0 },
                    medicine: { min: 3, max: 8, chance: 1.0 }
                },
                description: 'A deluxe loot box with guaranteed food and medicine in larger quantities.'
            }
        };

        // Initialize event listeners
        this.initEventListeners();
    }

    // Initialize event listeners for loot box buttons
    initEventListeners() {
        // We'll add these after the HTML elements are created
    }

    // Check if player can afford a loot box
    canAffordLootBox(type) {
        const lootBox = this.lootBoxTypes[type];
        if (!lootBox) return false;

        // Check if player has enough resources
        for (const resource in lootBox.cost) {
            if (resourceManager.getResource(resource) < lootBox.cost[resource]) {
                return false;
            }
        }

        return true;
    }

    // Open a loot box and get rewards
    openLootBox(type) {
        const lootBox = this.lootBoxTypes[type];
        if (!lootBox) {
            gameManager.addMessage(`Invalid loot box type: ${type}`);
            return null;
        }

        // Check if player can afford the loot box
        if (!this.canAffordLootBox(type)) {
            gameManager.addMessage(`Cannot afford ${type} loot box. Check your resources.`);
            return null;
        }

        // Use resources
        for (const resource in lootBox.cost) {
            resourceManager.useResource(resource, lootBox.cost[resource]);
        }

        // Calculate rewards
        const rewards = {};
        let rewardMessage = `Opened a ${type} loot box and received: `;
        let receivedAny = false;

        for (const resourceType in lootBox.rewards) {
            const rewardInfo = lootBox.rewards[resourceType];

            // Check if this reward is received based on chance
            if (Math.random() <= rewardInfo.chance) {
                // Calculate random amount within range
                const amount = Math.floor(Math.random() * (rewardInfo.max - rewardInfo.min + 1)) + rewardInfo.min;

                if (amount > 0) {
                    rewards[resourceType] = amount;
                    resourceManager.addResource(resourceType, amount);

                    // Add to message
                    if (receivedAny) {
                        rewardMessage += `, `;
                    }
                    rewardMessage += `${amount} ${resourceType}`;
                    receivedAny = true;
                }
            }
        }

        // Add message about the rewards
        if (receivedAny) {
            gameManager.addMessage(rewardMessage);
        } else {
            gameManager.addMessage(`Opened a ${type} loot box but received nothing. Bad luck!`);
        }

        return rewards;
    }

    // Show loot box modal with options
    showLootBoxModal() {
        // Remove any existing loot box modal
        const existingModal = document.getElementById('lootbox-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'lootbox-modal';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Add header
        const header = document.createElement('h2');
        header.textContent = 'Loot Boxes';
        header.style.color = '#f39c12';
        header.style.marginBottom = '15px';
        modalContent.appendChild(header);

        // Add description
        const description = document.createElement('p');
        description.textContent = 'Spend materials for a chance at random food and medicine rewards.';
        description.style.marginBottom = '20px';
        modalContent.appendChild(description);

        // Add loot box options
        const lootBoxOptions = document.createElement('div');
        lootBoxOptions.className = 'lootbox-options';
        lootBoxOptions.style.display = 'flex';
        lootBoxOptions.style.flexWrap = 'wrap';
        lootBoxOptions.style.gap = '15px';
        lootBoxOptions.style.justifyContent = 'center';
        lootBoxOptions.style.margin = '20px 0';

        for (const type in this.lootBoxTypes) {
            const lootBox = this.lootBoxTypes[type];

            const lootBoxOption = document.createElement('div');
            lootBoxOption.className = 'lootbox-option';
            lootBoxOption.style.backgroundColor = '#2c3e50';
            lootBoxOption.style.borderRadius = '8px';
            lootBoxOption.style.padding = '15px';
            lootBoxOption.style.width = 'calc(33.33% - 10px)';
            lootBoxOption.style.minWidth = '180px';
            lootBoxOption.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.2)';
            lootBoxOption.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
            lootBoxOption.style.display = 'flex';
            lootBoxOption.style.flexDirection = 'column';
            lootBoxOption.style.alignItems = 'center';
            lootBoxOption.style.textAlign = 'center';

            // Create cost text
            let costText = '';
            for (const resource in lootBox.cost) {
                costText += `${lootBox.cost[resource]} ${resource}`;
            }

            // Create potential rewards text
            let rewardsText = '';
            for (const resourceType in lootBox.rewards) {
                const rewardInfo = lootBox.rewards[resourceType];
                rewardsText += `${resourceType}: ${rewardInfo.min}-${rewardInfo.max} (${Math.round(rewardInfo.chance * 100)}% chance)<br>`;
            }

            // Create loot box name
            const lootBoxName = document.createElement('div');
            lootBoxName.className = 'lootbox-name';
            lootBoxName.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Loot Box`;
            lootBoxName.style.fontWeight = 'bold';
            lootBoxName.style.fontSize = '1.2em';
            lootBoxName.style.marginBottom = '10px';
            lootBoxName.style.color = '#f39c12';
            lootBoxOption.appendChild(lootBoxName);

            // Create loot box cost
            const lootBoxCost = document.createElement('div');
            lootBoxCost.className = 'lootbox-cost';
            lootBoxCost.textContent = `Cost: ${costText}`;
            lootBoxCost.style.fontSize = '0.9em';
            lootBoxCost.style.marginBottom = '10px';
            lootBoxCost.style.color = '#e74c3c';
            lootBoxCost.style.fontWeight = 'bold';
            lootBoxOption.appendChild(lootBoxCost);

            // Create loot box description
            const lootBoxDesc = document.createElement('div');
            lootBoxDesc.className = 'lootbox-description';
            lootBoxDesc.textContent = lootBox.description;
            lootBoxDesc.style.fontSize = '0.85em';
            lootBoxDesc.style.marginBottom = '10px';
            lootBoxDesc.style.color = '#bdc3c7';
            lootBoxOption.appendChild(lootBoxDesc);

            // Create loot box rewards
            const lootBoxRewards = document.createElement('div');
            lootBoxRewards.className = 'lootbox-rewards';
            lootBoxRewards.innerHTML = `Potential Rewards:<br>${rewardsText}`;
            lootBoxRewards.style.fontSize = '0.8em';
            lootBoxRewards.style.marginBottom = '15px';
            lootBoxRewards.style.color = '#3498db';
            lootBoxRewards.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
            lootBoxRewards.style.padding = '8px';
            lootBoxRewards.style.borderRadius = '5px';
            lootBoxRewards.style.width = '100%';
            lootBoxOption.appendChild(lootBoxRewards);

            // Create open button
            const openButton = document.createElement('button');
            openButton.className = 'open-lootbox-btn';
            openButton.textContent = 'Open';
            openButton.setAttribute('data-type', type);
            openButton.style.backgroundColor = '#27ae60';
            openButton.style.color = 'white';
            openButton.style.border = 'none';
            openButton.style.padding = '8px 15px';
            openButton.style.borderRadius = '5px';
            openButton.style.cursor = 'pointer';
            openButton.style.transition = 'all 0.2s ease';
            openButton.style.fontWeight = 'bold';

            // Disable button if can't afford
            if (!this.canAffordLootBox(type)) {
                openButton.disabled = true;
                openButton.style.backgroundColor = '#95a5a6';
                openButton.style.cursor = 'not-allowed';
            }

            lootBoxOption.appendChild(openButton);
            lootBoxOptions.appendChild(lootBoxOption);
        }

        modalContent.appendChild(lootBoxOptions);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-modal-btn';
        closeButton.style.backgroundColor = '#e74c3c';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '8px 15px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'all 0.2s ease';
        closeButton.style.marginTop = '15px';
        modalContent.appendChild(closeButton);

        // Add modal content to container
        modalContainer.appendChild(modalContent);

        // Set modal container styles
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '1000';

        // Set modal content styles
        modalContent.style.backgroundColor = '#34495e';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        modalContent.style.maxWidth = '90%';
        modalContent.style.width = '600px';
        modalContent.style.position = 'relative';

        // Add to document
        document.body.appendChild(modalContainer);

        // Add event listeners for buttons
        document.querySelectorAll('.open-lootbox-btn').forEach(button => {
            button.addEventListener('click', () => {
                const type = button.getAttribute('data-type');
                this.openLootBox(type);

                // Update button states after opening
                this.updateLootBoxButtonStates();
            });
        });

        // Add event listener for close button
        closeButton.addEventListener('click', () => {
            this.closeModal(modalContainer);
        });

        // Add event listener for clicking outside the modal to close it
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                this.closeModal(modalContainer);
            }
        });
    }

    // Close the modal
    closeModal(modalContainer) {
        if (modalContainer) {
            // Add a fade-out effect
            modalContainer.style.opacity = '0';
            modalContainer.style.transition = 'opacity 0.3s ease';

            // Remove after animation completes
            setTimeout(() => {
                if (modalContainer.parentNode) {
                    modalContainer.parentNode.removeChild(modalContainer);
                }
            }, 300);
        }
    }

    // Update button states based on affordability
    updateLootBoxButtonStates() {
        const modal = document.getElementById('lootbox-modal');
        if (!modal) return;

        modal.querySelectorAll('.open-lootbox-btn').forEach(button => {
            const type = button.getAttribute('data-type');
            const canAfford = this.canAffordLootBox(type);
            button.disabled = !canAfford;

            if (canAfford) {
                button.style.backgroundColor = '#27ae60';
                button.style.cursor = 'pointer';
            } else {
                button.style.backgroundColor = '#95a5a6';
                button.style.cursor = 'not-allowed';
            }
        });
    }
}

// Create global loot box manager
const lootBoxManager = new LootBoxManager();
