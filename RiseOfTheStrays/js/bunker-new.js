// Bunker Management System - Fallout Shelter Style
class BunkerManager {
    constructor() {
        // Grid configuration
        this.gridWidth = 10;
        this.gridHeight = 10;
        this.cellSize = 60; // pixels
        
        // Layers
        this.totalLayers = 3;
        this.unlockedLayers = 1; // Start with 1 layer unlocked
        this.rowsPerLayer = 3;
        
        // Room data
        this.rooms = [];
        this.nextRoomId = 1;
        this.selectedRoomType = null;
        
        // Room types with their properties
        this.roomTypes = {
            'Living Quarters': {
                width: 2,
                height: 1,
                color: '#9b59b6',
                icon: '🛏️',
                cost: { materials: 10, food: 5 },
                effect: { population: 2 }
            },
            'Power Generator': {
                width: 1,
                height: 1,
                color: '#f1c40f',
                icon: '⚡',
                cost: { materials: 15 },
                production: { power: 2 }
            },
            'Food': {
                width: 1,
                height: 1,
                color: '#e67e22',
                icon: '🍗',
                cost: { materials: 15, power: 1 },
                production: { food: 2 }
            },
            'Water Treatment': {
                width: 2,
                height: 1,
                color: '#3498db',
                icon: '💧',
                cost: { materials: 20, power: 2 },
                production: { water: 2 }
            },
            'Medical Bay': {
                width: 2,
                height: 1,
                color: '#2ecc71',
                icon: '💊',
                cost: { materials: 25, power: 2 },
                effect: { health: 2 }
            },
            'Workshop': {
                width: 2,
                height: 1,
                color: '#95a5a6',
                icon: '🔨',
                cost: { materials: 30, power: 3 },
                production: { materials: 1 }
            },
            'Training Room': {
                width: 2,
                height: 2,
                color: '#2ecc71',
                icon: '🏋️',
                cost: { materials: 40, power: 4 },
                effect: { strength: 1 }
            }
        };
        
        // Initialize the grid
        this.initializeGrid();
    }
    
    // Initialize the grid data structure
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = null; // null means empty cell
            }
        }
    }
    
    // Initialize the UI
    initializeUI() {
        const bunkerContainer = document.getElementById('bunker-container');
        if (!bunkerContainer) return;
        
        // Clear existing content
        bunkerContainer.innerHTML = '';
        
        // Create layer controls
        this.renderLayerControls(bunkerContainer);
        
        // Create the grid
        this.renderGrid(bunkerContainer);
        
        // Create room selection
        this.renderRoomSelection();
        
        // Render existing rooms
        this.renderRooms();
    }
    
    // Render layer controls
    renderLayerControls(container) {
        const layerControls = document.createElement('div');
        layerControls.className = 'layer-controls';
        
        // Show current unlocked layers
        const layerInfo = document.createElement('div');
        layerInfo.className = 'layer-info';
        layerInfo.textContent = `Unlocked Layers: ${this.unlockedLayers}/${this.totalLayers}`;
        layerControls.appendChild(layerInfo);
        
        // Add unlock button if not all layers are unlocked
        if (this.unlockedLayers < this.totalLayers) {
            const unlockButton = document.createElement('button');
            unlockButton.className = 'unlock-layer-btn';
            const cost = this.getLayerUnlockCost();
            unlockButton.textContent = `Unlock Layer ${this.unlockedLayers + 1} (${cost} Materials)`;
            
            // Check if player can afford
            const canAfford = resourceManager.getResource('materials') >= cost;
            if (!canAfford) {
                unlockButton.disabled = true;
                unlockButton.classList.add('disabled');
            }
            
            unlockButton.addEventListener('click', () => this.unlockLayer());
            layerControls.appendChild(unlockButton);
        }
        
        container.appendChild(layerControls);
    }
    
    // Get cost to unlock next layer
    getLayerUnlockCost() {
        return this.unlockedLayers === 1 ? 50 : 150;
    }
    
    // Unlock a new layer
    unlockLayer() {
        const cost = this.getLayerUnlockCost();
        
        // Check if player can afford
        if (resourceManager.getResource('materials') < cost) {
            gameManager.addMessage(`Not enough materials to unlock Layer ${this.unlockedLayers + 1}.`);
            return false;
        }
        
        // Deduct resources
        resourceManager.useResource('materials', cost);
        
        // Unlock the layer
        this.unlockedLayers++;
        
        // Update UI
        gameManager.addMessage(`Unlocked Layer ${this.unlockedLayers}!`);
        this.initializeUI();
        
        return true;
    }
    
    // Render the grid
    renderGrid(container) {
        const gridElement = document.createElement('div');
        gridElement.className = 'bunker-grid';
        
        // Create cells for each row and column
        for (let y = 0; y < this.gridHeight; y++) {
            // Determine which layer this row belongs to
            const layerNumber = Math.floor(y / this.rowsPerLayer) + 1;
            const isLayerLocked = layerNumber > this.unlockedLayers;
            
            // Create a row for visual organization
            const rowElement = document.createElement('div');
            rowElement.className = 'grid-row';
            
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // Add locked class if in a locked layer
                if (isLayerLocked) {
                    cell.classList.add('locked');
                    cell.innerHTML = '<span class="lock-icon">🔒</span>';
                } else {
                    // Add click handler for placement
                    cell.addEventListener('click', () => this.handleCellClick(x, y));
                    
                    // Add hover handler for preview
                    cell.addEventListener('mouseenter', () => this.showPlacementPreview(x, y));
                    cell.addEventListener('mouseleave', () => this.clearPreview());
                }
                
                rowElement.appendChild(cell);
            }
            
            gridElement.appendChild(rowElement);
            
            // Add layer divider if this is the last row of a layer (except the last layer)
            if ((y + 1) % this.rowsPerLayer === 0 && y < this.gridHeight - 1) {
                const divider = document.createElement('div');
                divider.className = 'layer-divider';
                if (Math.floor((y + 1) / this.rowsPerLayer) >= this.unlockedLayers) {
                    divider.classList.add('locked-divider');
                }
                gridElement.appendChild(divider);
            }
        }
        
        container.appendChild(gridElement);
    }
    
    // Handle cell click for room placement
    handleCellClick(x, y) {
        if (!this.selectedRoomType) {
            return; // No room type selected
        }
        
        // Try to place the room
        if (this.canPlaceRoomAt(this.selectedRoomType, x, y)) {
            this.placeRoom(this.selectedRoomType, x, y);
        } else {
            gameManager.addMessage(`Cannot place ${this.selectedRoomType} here.`);
        }
    }
    
    // Check if a room can be placed at the given coordinates
    canPlaceRoomAt(roomType, x, y) {
        const room = this.roomTypes[roomType];
        if (!room) return false;
        
        // Check if coordinates are within grid bounds
        if (x < 0 || y < 0 || x + room.width > this.gridWidth || y + room.height > this.gridHeight) {
            return false;
        }
        
        // Check if placement is within unlocked layers
        const layerForPlacement = Math.floor(y / this.rowsPerLayer) + 1;
        if (layerForPlacement > this.unlockedLayers) {
            return false;
        }
        
        // Check if the room would extend into a locked layer
        const endRow = y + room.height - 1;
        const layerForEndRow = Math.floor(endRow / this.rowsPerLayer) + 1;
        if (layerForEndRow > this.unlockedLayers) {
            return false;
        }
        
        // Check if all required cells are empty
        for (let dy = 0; dy < room.height; dy++) {
            for (let dx = 0; dx < room.width; dx++) {
                if (this.grid[y + dy][x + dx] !== null) {
                    return false; // Cell is already occupied
                }
            }
        }
        
        // Check if player can afford the room
        return this.canAffordRoom(roomType);
    }
    
    // Check if player can afford to build a room
    canAffordRoom(roomType) {
        const room = this.roomTypes[roomType];
        if (!room || !room.cost) return false;
        
        for (const resource in room.cost) {
            if (resourceManager.getResource(resource) < room.cost[resource]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Place a room at the given coordinates
    placeRoom(roomType, x, y) {
        const room = this.roomTypes[roomType];
        if (!room) return false;
        
        // Check if placement is valid
        if (!this.canPlaceRoomAt(roomType, x, y)) {
            return false;
        }
        
        // Deduct resources
        for (const resource in room.cost) {
            resourceManager.useResource(resource, room.cost[resource]);
        }
        
        // Create the room object
        const newRoom = {
            id: this.nextRoomId++,
            type: roomType,
            x: x,
            y: y,
            width: room.width,
            height: room.height
        };
        
        // Add to rooms array
        this.rooms.push(newRoom);
        
        // Mark cells as occupied
        for (let dy = 0; dy < room.height; dy++) {
            for (let dx = 0; dx < room.width; dx++) {
                this.grid[y + dy][x + dx] = newRoom.id;
            }
        }
        
        // Update UI
        this.renderRooms();
        this.updateRoomSelectionUI();
        
        // Add production from the room
        if (room.production) {
            for (const resource in room.production) {
                resourceManager.addProduction(resource, room.production[resource]);
            }
        }
        
        // Apply room effects
        if (room.effect) {
            for (const stat in room.effect) {
                // Handle effects (can be implemented later)
                console.log(`${roomType} provides +${room.effect[stat]} ${stat}`);
            }
        }
        
        gameManager.addMessage(`Built ${roomType} at (${x}, ${y}).`);
        return true;
    }
    
    // Render all placed rooms
    renderRooms() {
        // Clear existing rooms
        const existingRooms = document.querySelectorAll('.bunker-room');
        existingRooms.forEach(room => room.remove());
        
        // Get the grid element
        const gridElement = document.querySelector('.bunker-grid');
        if (!gridElement) return;
        
        // Render each room
        this.rooms.forEach(room => {
            const roomType = this.roomTypes[room.type];
            
            // Create room element
            const roomElement = document.createElement('div');
            roomElement.className = 'bunker-room';
            roomElement.dataset.roomId = room.id;
            
            // Position the room
            const left = room.x * this.cellSize;
            const top = room.y * this.cellSize;
            const width = room.width * this.cellSize;
            const height = room.height * this.cellSize;
            
            roomElement.style.left = left + 'px';
            roomElement.style.top = top + 'px';
            roomElement.style.width = width + 'px';
            roomElement.style.height = height + 'px';
            roomElement.style.backgroundColor = roomType.color;
            
            // Add room content
            roomElement.innerHTML = `
                <div class="room-icon">${roomType.icon}</div>
                <div class="room-name">${room.type}</div>
            `;
            
            // Add click handler for room details
            roomElement.addEventListener('click', () => this.showRoomDetails(room));
            
            // Add to the grid
            gridElement.appendChild(roomElement);
        });
    }
    
    // Show room details
    showRoomDetails(room) {
        const roomType = this.roomTypes[room.type];
        let details = `<strong>${room.type}</strong><br>`;
        
        if (roomType.production) {
            for (const resource in roomType.production) {
                details += `Produces ${roomType.production[resource]} ${resource}/tick<br>`;
            }
        }
        
        if (roomType.effect) {
            for (const stat in roomType.effect) {
                details += `+${roomType.effect[stat]} ${stat}<br>`;
            }
        }
        
        gameManager.addMessage(details);
    }
    
    // Show placement preview
    showPlacementPreview(x, y) {
        // Clear any existing preview
        this.clearPreview();
        
        if (!this.selectedRoomType) return;
        
        const roomType = this.roomTypes[this.selectedRoomType];
        if (!roomType) return;
        
        // Check if placement is valid
        const canPlace = this.canPlaceRoomAt(this.selectedRoomType, x, y);
        
        // Highlight affected cells
        for (let dy = 0; dy < roomType.height; dy++) {
            for (let dx = 0; dx < roomType.width; dx++) {
                // Skip if out of bounds
                if (x + dx >= this.gridWidth || y + dy >= this.gridHeight) continue;
                
                const cell = document.querySelector(`.grid-cell[data-x="${x + dx}"][data-y="${y + dy}"]`);
                if (cell) {
                    cell.classList.add(canPlace ? 'valid-placement' : 'invalid-placement');
                }
            }
        }
        
        // Create preview element if placement is valid
        if (canPlace) {
            const gridElement = document.querySelector('.bunker-grid');
            if (!gridElement) return;
            
            const previewElement = document.createElement('div');
            previewElement.className = 'bunker-room room-preview';
            previewElement.id = 'room-preview';
            
            // Position the preview
            const left = x * this.cellSize;
            const top = y * this.cellSize;
            const width = roomType.width * this.cellSize;
            const height = roomType.height * this.cellSize;
            
            previewElement.style.left = left + 'px';
            previewElement.style.top = top + 'px';
            previewElement.style.width = width + 'px';
            previewElement.style.height = height + 'px';
            previewElement.style.backgroundColor = roomType.color;
            
            // Add room content
            previewElement.innerHTML = `
                <div class="room-icon">${roomType.icon}</div>
                <div class="room-name">${this.selectedRoomType}</div>
            `;
            
            gridElement.appendChild(previewElement);
        }
    }
    
    // Clear placement preview
    clearPreview() {
        // Remove cell highlights
        document.querySelectorAll('.valid-placement, .invalid-placement').forEach(cell => {
            cell.classList.remove('valid-placement', 'invalid-placement');
        });
        
        // Remove preview element
        const previewElement = document.getElementById('room-preview');
        if (previewElement) {
            previewElement.remove();
        }
    }
    
    // Render room selection UI
    renderRoomSelection() {
        const container = document.getElementById('room-selection');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create room selection items
        for (const type in this.roomTypes) {
            const roomType = this.roomTypes[type];
            
            // Create room selection item
            const item = document.createElement('div');
            item.className = 'room-selection-item';
            
            // Check if player can afford this room
            const canAfford = this.canAffordRoom(type);
            if (!canAfford) {
                item.classList.add('disabled');
            }
            
            // Create cost display
            let costText = '';
            for (const resource in roomType.cost) {
                const playerHas = resourceManager.getResource(resource);
                const roomCost = roomType.cost[resource];
                const hasEnough = playerHas >= roomCost;
                costText += `<span class="${hasEnough ? 'cost-enough' : 'cost-not-enough'}">${resource}: ${roomCost}</span> `;
            }
            
            // Create production/effect display
            let effectText = '';
            if (roomType.production) {
                for (const resource in roomType.production) {
                    effectText += `+${roomType.production[resource]} ${resource}/tick `;
                }
            }
            if (roomType.effect) {
                for (const stat in roomType.effect) {
                    effectText += `+${roomType.effect[stat]} ${stat} `;
                }
            }
            
            // Set item content
            item.innerHTML = `
                <div class="room-icon" style="background-color: ${roomType.color}">${roomType.icon}</div>
                <div class="room-info">
                    <div class="room-name">${type}</div>
                    <div class="room-size">${roomType.width}x${roomType.height}</div>
                    <div class="room-cost">${costText}</div>
                    <div class="room-effect">${effectText}</div>
                </div>
            `;
            
            // Add click handler
            item.addEventListener('click', () => {
                if (canAfford) {
                    this.selectRoomType(type);
                    
                    // Update selection UI
                    document.querySelectorAll('.room-selection-item').forEach(el => {
                        el.classList.remove('selected');
                    });
                    item.classList.add('selected');
                } else {
                    gameManager.addMessage(`Not enough resources to build ${type}.`);
                }
            });
            
            container.appendChild(item);
        }
        
        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-room-placement';
        cancelButton.textContent = 'Cancel';
        cancelButton.style.display = this.selectedRoomType ? 'block' : 'none';
        cancelButton.addEventListener('click', () => {
            this.selectedRoomType = null;
            this.updateRoomSelectionUI();
            this.clearPreview();
        });
        
        container.appendChild(cancelButton);
    }
    
    // Select a room type for placement
    selectRoomType(type) {
        this.selectedRoomType = type;
        this.updateRoomSelectionUI();
    }
    
    // Update room selection UI based on selected room
    updateRoomSelectionUI() {
        const cancelButton = document.getElementById('cancel-room-placement');
        if (cancelButton) {
            cancelButton.style.display = this.selectedRoomType ? 'block' : 'none';
        }
        
        // Update selection status
        document.querySelectorAll('.room-selection-item').forEach(item => {
            item.classList.remove('selected');
            
            // Find the item for the selected room type
            const roomName = item.querySelector('.room-name');
            if (roomName && roomName.textContent === this.selectedRoomType) {
                item.classList.add('selected');
            }
        });
    }
}

// Create the bunker manager instance
const bunkerManager = new BunkerManager();

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    bunkerManager.initializeUI();
});
