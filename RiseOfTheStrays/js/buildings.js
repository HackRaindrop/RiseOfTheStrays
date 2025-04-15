// Buildings management system
class BuildingManager {
    constructor() {
        this.buildings = [];
        this.buildingTypes = {
            // Food production buildings
            'Garden': {
                description: 'A small garden that produces food.',
                cost: { materials: 15 },
                production: { food: 0.1 },
                maxCount: 3,
                icon: '🌱'
            },
            'Farm': {
                description: 'A larger farm that produces more food.',
                cost: { materials: 30, medicine: 5 },
                production: { food: 0.3 },
                maxCount: 2,
                icon: '🌾'
            },
            
            // Materials production buildings
            'Workshop': {
                description: 'A small workshop that produces materials.',
                cost: { materials: 20, food: 10 },
                production: { materials: 0.1 },
                maxCount: 3,
                icon: '🔨'
            },
            'Scrapyard': {
                description: 'A scrapyard that produces more materials.',
                cost: { materials: 40, food: 15 },
                production: { materials: 0.3 },
                maxCount: 2,
                icon: '⚙️'
            },
            
            // Medicine production buildings
            'Herb Garden': {
                description: 'A garden of medicinal herbs that produces medicine.',
                cost: { materials: 25, food: 15 },
                production: { medicine: 0.1 },
                maxCount: 2,
                icon: '🌿'
            },
            'Clinic': {
                description: 'A small clinic that produces more medicine.',
                cost: { materials: 50, food: 20, medicine: 10 },
                production: { medicine: 0.2 },
                maxCount: 1,
                icon: '💊'
            }
        };
        
        this.updateDisplay();
    }
    
    // Get all building types
    getBuildingTypes() {
        return this.buildingTypes;
    }
    
    // Get a specific building type
    getBuildingType(type) {
        return this.buildingTypes[type];
    }
    
    // Get all constructed buildings
    getBuildings() {
        return this.buildings;
    }
    
    // Count buildings of a specific type
    getBuildingCount(type) {
        return this.buildings.filter(building => building.type === type).length;
    }
    
    // Check if a building can be constructed (resources and max count)
    canBuild(type) {
        const buildingType = this.buildingTypes[type];
        if (!buildingType) return false;
        
        // Check if we've reached the maximum number of this building type
        if (this.getBuildingCount(type) >= buildingType.maxCount) {
            return false;
        }
        
        // Check if we have enough resources
        for (const resource in buildingType.cost) {
            if (resourceManager.getResource(resource) < buildingType.cost[resource]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Construct a new building
    buildBuilding(type) {
        if (!this.canBuild(type)) {
            gameManager.addMessage(`Cannot build ${type}. Check resources or building limit.`);
            return false;
        }
        
        const buildingType = this.buildingTypes[type];
        
        // Use resources
        for (const resource in buildingType.cost) {
            resourceManager.useResource(resource, buildingType.cost[resource]);
        }
        
        // Add the building
        const building = {
            id: Date.now(),
            type: type,
            constructedOn: gameManager.day
        };
        
        this.buildings.push(building);
        this.updateDisplay();
        
        gameManager.addMessage(`Constructed a new ${type}!`);
        return true;
    }
    
    // Produce resources from all buildings
    produceResources() {
        let productionSummary = {};
        
        // Calculate production from all buildings
        this.buildings.forEach(building => {
            const buildingType = this.buildingTypes[building.type];
            
            for (const resource in buildingType.production) {
                const amount = buildingType.production[resource];
                
                if (!productionSummary[resource]) {
                    productionSummary[resource] = 0;
                }
                
                productionSummary[resource] += amount;
            }
        });
        
        // Add the resources
        for (const resource in productionSummary) {
            const roundedAmount = Math.round(productionSummary[resource] * 10) / 10; // Round to 1 decimal place
            if (roundedAmount > 0) {
                resourceManager.addResource(resource, roundedAmount);
            }
        }
        
        return productionSummary;
    }
    
    // Update the UI with current buildings
    updateDisplay() {
        const buildingsContainer = document.getElementById('buildings-container');
        const buildButtonsContainer = document.getElementById('building-buttons');
        
        if (!buildingsContainer || !buildButtonsContainer) return;
        
        // Clear current buildings display
        buildingsContainer.innerHTML = '';
        
        // Add each building to the display
        this.buildings.forEach(building => {
            const buildingType = this.buildingTypes[building.type];
            const buildingElement = document.createElement('div');
            buildingElement.className = 'building-card';
            
            let productionText = '';
            for (const resource in buildingType.production) {
                productionText += `${resource}: +${buildingType.production[resource]} per tick<br>`;
            }
            
            buildingElement.innerHTML = `
                <div class="building-icon">${buildingType.icon}</div>
                <div class="building-name">${building.type}</div>
                <div class="building-production">${productionText}</div>
            `;
            
            buildingsContainer.appendChild(buildingElement);
        });
        
        // Clear current building buttons
        buildButtonsContainer.innerHTML = '';
        
        // Add buttons for each building type
        for (const type in this.buildingTypes) {
            const buildingType = this.buildingTypes[type];
            const button = document.createElement('button');
            button.id = `build-${type.toLowerCase().replace(' ', '-')}`;
            
            let costText = '';
            for (const resource in buildingType.cost) {
                costText += `${resource}: ${buildingType.cost[resource]} `;
            }
            
            button.textContent = `Build ${type} (${costText})`;
            button.disabled = !this.canBuild(type);
            
            button.addEventListener('click', () => {
                this.buildBuilding(type);
                // Update button states after building
                this.updateBuildButtonStates();
            });
            
            buildButtonsContainer.appendChild(button);
        }
    }
    
    // Update just the states of the build buttons (enabled/disabled)
    updateBuildButtonStates() {
        for (const type in this.buildingTypes) {
            const buttonId = `build-${type.toLowerCase().replace(' ', '-')}`;
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = !this.canBuild(type);
            }
        }
    }
}

// Create global building manager
const buildingManager = new BuildingManager();
