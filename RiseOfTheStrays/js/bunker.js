// Bunker management system - Fallout Shelter style
class BunkerManager {
    constructor() {
        this.gridWidth = 10; // Fixed width of the bunker grid (10x10)
        this.gridHeight = 10; // Fixed height of the bunker grid (10x10)
        this.grid = []; // 2D array representing the bunker grid
        this.rooms = []; // Array of placed rooms
        this.selectedRoomType = null; // Currently selected room type for placement
        this.previewElement = null; // Element for room placement preview
        this.highlightedCells = []; // Cells currently highlighted during preview
        this.unlockedLayers = 1; // Number of layers unlocked (start with 1)

        // Room types with their properties
        this.roomTypes = {
            'Living Quarters': {
                width: 2,
                height: 1,
                description: 'Housing for your cats. Increases max cat capacity.',
                cost: { materials: 20 },
                effect: { maxCats: 5 },
                icon: '🛏️',
                color: '#8e44ad'
            },
            'Food Storage': {
                width: 1,
                height: 1,
                description: 'Stores and produces food.',
                cost: { materials: 15 },
                production: { food: 0.2 },
                icon: '🍗',
                color: '#e67e22'
            },
            'Workshop': {
                width: 2,
                height: 1,
                description: 'Produces materials for construction.',
                cost: { materials: 25, food: 10 },
                production: { materials: 0.2 },
                icon: '🔨',
                color: '#7f8c8d'
            },
            'Medical Bay': {
                width: 2,
                height: 1,
                description: 'Produces medicine and heals cats.',
                cost: { materials: 30, food: 15 },
                production: { medicine: 0.2 },
                effect: { healing: 1 },
                icon: '💊',
                color: '#3498db'
            },
            'Power Generator': {
                width: 1,
                height: 2,
                description: 'Provides power to your bunker.',
                cost: { materials: 35 },
                production: { power: 0.3 },
                icon: '⚡',
                color: '#f1c40f'
            },
            'Training Room': {
                width: 2,
                height: 2,
                description: 'Train your cats to improve their skills.',
                cost: { materials: 40, food: 20 },
                effect: { training: 1 },
                icon: '🏋️',
                color: '#2ecc71'
            }
        };

        // Initialize the grid
        this.initializeGrid();

        // Initialize the UI
        this.initializeUI();
    }

    // Initialize the bunker grid
    initializeGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            const row = [];
            for (let x = 0; x < this.gridWidth; x++) {
                row.push(null); // null means empty cell
            }
            this.grid.push(row);
        }
    }

    // Initialize the UI elements
    initializeUI() {
        const bunkerContainer = document.getElementById('bunker-container');
        const roomSelectionContainer = document.getElementById('room-selection');

        if (!bunkerContainer || !roomSelectionContainer) return;

        // Clear existing content
        bunkerContainer.innerHTML = '';
        roomSelectionContainer.innerHTML = '';

        // Add layer controls
        this.renderLayerControls(bunkerContainer);

        // Create the bunker grid
        this.renderBunkerGrid();

        // Create room selection buttons
        this.renderRoomSelection();

        // Add event listener for the cancel button
        const cancelButton = document.getElementById('cancel-room-placement');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.selectedRoomType = null;
                this.updateRoomSelectionUI();
                this.clearPreview();
            });
        }
    }

    // Render layer controls for unlocking new layers
    renderLayerControls(container) {
        const layerControlsDiv = document.createElement('div');
        layerControlsDiv.className = 'layer-controls';
        layerControlsDiv.innerHTML = `
            <div class="layer-info">
                <span>Unlocked Layers: <span class="layer-count">${this.unlockedLayers}</span>/3</span>
            </div>
        `;

        // Only show unlock button if not all layers are unlocked
        if (this.unlockedLayers < 3) {
            const unlockButton = document.createElement('button');
            unlockButton.className = 'unlock-layer-btn';
            unlockButton.textContent = `Unlock Layer ${this.unlockedLayers + 1} (Cost: ${this.getLayerUnlockCost()} Materials)`;

            // Check if player can afford to unlock
            const canAfford = resourceManager.getResource('materials') >= this.getLayerUnlockCost();
            if (!canAfford) {
                unlockButton.disabled = true;
                unlockButton.classList.add('disabled');
            }

            unlockButton.addEventListener('click', () => {
                this.unlockNewLayer();
            });

            layerControlsDiv.appendChild(unlockButton);
        }

        container.appendChild(layerControlsDiv);
    }

    // Get the cost to unlock the next layer
    getLayerUnlockCost() {
        // Exponential cost increase
        return this.unlockedLayers === 1 ? 50 : 150;
    }

    // Unlock a new layer
    unlockNewLayer() {
        const cost = this.getLayerUnlockCost();
        if (resourceManager.getResource('materials') < cost) {
            gameManager.addMessage(`Not enough materials to unlock Layer ${this.unlockedLayers + 1}. Need ${cost} materials.`);
            return false;
        }

        // Use resources
        resourceManager.useResource('materials', cost);

        // Increment unlocked layers
        this.unlockedLayers++;

        // Update UI
        gameManager.addMessage(`Unlocked Layer ${this.unlockedLayers}!`);
        this.initializeUI();

        return true;
    }

    // Render the bunker grid with layers
    renderBunkerGrid() {
        const bunkerContainer = document.getElementById('bunker-container');
        if (!bunkerContainer) return;

        bunkerContainer.innerHTML = '';

        // Add layer controls
        this.renderLayerControls(bunkerContainer);

        // Add instructions for users
        const instructionsElement = document.createElement('div');
        instructionsElement.className = 'bunker-instructions';
        instructionsElement.innerHTML = '<p>Select a room from the selection below and then click where you want to place it.</p>';
        bunkerContainer.appendChild(instructionsElement);

        // Create the grid container
        const gridElement = document.createElement('div');
        gridElement.className = 'bunker-grid';
        gridElement.id = 'bunker-grid';

        // Create cells for the grid with layer visualization
        for (let y = 0; y < this.gridHeight; y++) {
            // Determine which layer this row belongs to (1-based)
            const layerNumber = Math.floor(y / 3) + 1;
            const isLayerLocked = layerNumber > this.unlockedLayers;

            for (let x = 0; x < this.gridWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'bunker-cell';
                if (isLayerLocked) {
                    cell.classList.add('locked-layer');
                }
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.layer = layerNumber;
                cell.id = `cell-${x}-${y}`;

                // Check if we're on a mobile device
                const isMobile = window.innerWidth < 768;

                if (!isMobile && !isLayerLocked) {
                    // Desktop hover events (only for unlocked layers)
                    cell.addEventListener('mouseover', () => {
                        if (this.selectedRoomType) {
                            this.showPlacementPreview(x, y);
                        }
                    });

                    cell.addEventListener('mouseout', () => {
                        if (this.selectedRoomType) {
                            this.clearPreview();
                        }
                    });
                }

                // Click/tap event for both mobile and desktop
                cell.addEventListener('click', () => {
                    if (isLayerLocked) {
                        gameManager.addMessage(`Layer ${layerNumber} is locked. Unlock it first.`);
                        return;
                    }

                    if (this.selectedRoomType) {
                        if (this.canPlaceRoomAt(this.selectedRoomType, x, y)) {
                            this.placeRoom(this.selectedRoomType, x, y);
                        } else {
                            // Show a message when placement is invalid
                            gameManager.addMessage(`Cannot place ${this.selectedRoomType} here. Try another location.`);
                        }
                    }
                });

                // For mobile, add a touch event to show preview (only for unlocked layers)
                if (isMobile && !isLayerLocked) {
                    cell.addEventListener('touchstart', (e) => {
                        if (this.selectedRoomType) {
                            // Prevent scrolling when touching cells
                            e.preventDefault();
                            this.showPlacementPreview(x, y);
                        }
                    }, { passive: false });
                }

                gridElement.appendChild(cell);
            }

            // Add a layer divider if this is the last row of a layer (except for the last layer)
            if ((y + 1) % 3 === 0 && y < this.gridHeight - 1) {
                const layerLabel = document.createElement('div');
                layerLabel.className = 'layer-label';
                layerLabel.textContent = `Layer ${layerNumber}`;
                if (layerNumber >= this.unlockedLayers) {
                    layerLabel.classList.add('locked-layer-label');
                }
                bunkerContainer.appendChild(layerLabel);
            }
        }

        // Add the grid to the container
        bunkerContainer.appendChild(gridElement);

        // Render existing rooms
        this.renderRooms();
    }

    // Render the room selection UI with clickable room items
    renderRoomSelection() {
        const roomSelectionContainer = document.getElementById('room-selection');
        if (!roomSelectionContainer) return;

        roomSelectionContainer.innerHTML = '';

        // Create room type buttons
        for (const type in this.roomTypes) {
            const roomType = this.roomTypes[type];
            const roomButton = document.createElement('div');
            roomButton.className = 'room-selection-item';
            roomButton.setAttribute('data-room-type', type);

            // Create cost text
            let costText = '';
            for (const resource in roomType.cost) {
                const playerHas = resourceManager.getResource(resource);
                const roomCost = roomType.cost[resource];
                const hasEnough = playerHas >= roomCost;
                costText += `<span class="${hasEnough ? 'cost-enough' : 'cost-not-enough'}">${resource}: ${roomCost}</span> `;
            }

            // Create production/effect text
            let effectText = '';
            if (roomType.production) {
                for (const resource in roomType.production) {
                    effectText += `+${roomType.production[resource]} ${resource}/tick `;
                }
            }
            if (roomType.effect) {
                for (const effect in roomType.effect) {
                    effectText += `+${roomType.effect[effect]} ${effect} `;
                }
            }

            roomButton.innerHTML = `
                <div class="room-icon" style="background-color: ${roomType.color}">${roomType.icon}</div>
                <div class="room-info">
                    <div class="room-name">${type}</div>
                    <div class="room-size">${roomType.width}x${roomType.height}</div>
                    <div class="room-cost">${costText}</div>
                    <div class="room-effect">${effectText}</div>
                </div>
            `;

            // Add appropriate classes based on affordability
            if (this.canAffordRoom(type)) {
                roomButton.classList.add('clickable');
            } else {
                roomButton.classList.add('disabled');
            }

            // Add click event for room selection
            roomButton.addEventListener('click', () => {
                if (!roomButton.classList.contains('disabled')) {
                    this.selectRoomType(type);
                    // Update UI to show this room is selected
                    document.querySelectorAll('.room-selection-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    roomButton.classList.add('selected');
                } else {
                    gameManager.addMessage(`Not enough resources to build ${type}.`);
                }
            });

            roomSelectionContainer.appendChild(roomButton);
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
        roomSelectionContainer.appendChild(cancelButton);
    }

    // Update the room selection UI based on selected room
    updateRoomSelectionUI() {
        const roomSelectionItems = document.querySelectorAll('.room-selection-item');
        const cancelButton = document.getElementById('cancel-room-placement');

        roomSelectionItems.forEach(item => {
            if (this.selectedRoomType && item.querySelector('.room-name').textContent === this.selectedRoomType) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        if (cancelButton) {
            cancelButton.style.display = this.selectedRoomType ? 'block' : 'none';
        }
    }

    // Select a room type for placement
    selectRoomType(type) {
        if (!this.canAffordRoom(type)) {
            gameManager.addMessage(`Not enough resources to build ${type}.`);
            return;
        }

        this.selectedRoomType = type;
        this.updateRoomSelectionUI();
        gameManager.addMessage(`Selected ${type} for placement. Hover over the grid to see a preview.`);
    }

    // Check if player can afford to build a room
    canAffordRoom(type) {
        const roomType = this.roomTypes[type];
        if (!roomType) return false;

        // Debug message to check costs
        console.log(`Checking if can afford ${type}:`, roomType.cost);

        for (const resource in roomType.cost) {
            const playerHas = resourceManager.getResource(resource);
            const roomCost = roomType.cost[resource];
            console.log(`Resource ${resource}: Player has ${playerHas}, need ${roomCost}`);

            if (playerHas < roomCost) {
                return false;
            }
        }

        return true;
    }

    // Check if a room can be placed at the given coordinates
    canPlaceRoomAt(type, x, y) {
        if (!type) return false;

        const roomType = this.roomTypes[type];
        if (!roomType) return false;

        // Check if the room fits within the grid
        if (x < 0 || y < 0 || x + roomType.width > this.gridWidth || y + roomType.height > this.gridHeight) {
            return false;
        }

        // Check if the placement is within unlocked layers
        // Each layer is 3 rows (0-2 for layer 1, 3-5 for layer 2, 6-9 for layer 3)
        const layerForPlacement = Math.floor(y / 3) + 1;
        if (layerForPlacement > this.unlockedLayers) {
            return false;
        }

        // Check if the room would extend into a locked layer
        const endRow = y + roomType.height - 1;
        const layerForEndRow = Math.floor(endRow / 3) + 1;
        if (layerForEndRow > this.unlockedLayers) {
            return false;
        }

        // Check if all cells are empty
        for (let dy = 0; dy < roomType.height; dy++) {
            for (let dx = 0; dx < roomType.width; dx++) {
                if (this.grid[y + dy][x + dx] !== null) {
                    return false;
                }
            }
        }

        return true;
    }

    // Show a preview of room placement
    showPlacementPreview(x, y) {
        // Clear any existing preview
        this.clearPreview();

        if (!this.selectedRoomType) return;

        const roomType = this.roomTypes[this.selectedRoomType];
        if (!roomType) return;

        const canPlace = this.canPlaceRoomAt(this.selectedRoomType, x, y);
        const highlightClass = canPlace ? 'valid-placement' : 'invalid-placement';

        // Highlight all cells that would be occupied by the room
        for (let dy = 0; dy < roomType.height; dy++) {
            for (let dx = 0; dx < roomType.width; dx++) {
                // Skip if out of bounds
                if (x + dx >= this.gridWidth || y + dy >= this.gridHeight) continue;

                const cell = document.querySelector(`.bunker-cell[data-x="${x + dx}"][data-y="${y + dy}"]`);
                if (cell) {
                    cell.classList.add(highlightClass);
                    this.highlightedCells.push(cell);
                }
            }
        }

        // Create a preview element if placement is valid
        if (canPlace) {
            const bunkerGrid = document.querySelector('.bunker-grid');
            if (!bunkerGrid) return;

            const previewElement = document.createElement('div');
            previewElement.className = 'bunker-room room-preview';

            // Calculate position and size
            const position = this.calculateRoomPosition(x, y, roomType.width, roomType.height);

            // Set positioning
            previewElement.style.left = position.left + 'px';
            previewElement.style.top = position.top + 'px';
            previewElement.style.width = position.width + 'px';
            previewElement.style.height = position.height + 'px';
            previewElement.style.backgroundColor = roomType.color;

            // Add room content
            previewElement.innerHTML = `
                <div class="room-icon">${roomType.icon}</div>
                <div class="room-name">${this.selectedRoomType}</div>
            `;

            bunkerGrid.appendChild(previewElement);
            this.previewElement = previewElement;
        }
    }

    // Clear the placement preview
    clearPreview() {
        // Remove highlight classes from cells
        this.highlightedCells.forEach(cell => {
            cell.classList.remove('valid-placement', 'invalid-placement');
        });
        this.highlightedCells = [];

        // Remove the preview element
        if (this.previewElement) {
            this.previewElement.remove();
            this.previewElement = null;
        }
    }

    // Place a room at the given coordinates
    placeRoom(type, x, y) {
        if (!this.canPlaceRoomAt(type, x, y) || !this.canAffordRoom(type)) {
            return false;
        }

        const roomType = this.roomTypes[type];

        // Use resources
        for (const resource in roomType.cost) {
            resourceManager.useResource(resource, roomType.cost[resource]);
        }

        // Create the room object
        const room = {
            id: Date.now(),
            type: type,
            x: x,
            y: y,
            width: roomType.width,
            height: roomType.height,
            constructedOn: gameManager.day
        };

        // Add the room to the list
        this.rooms.push(room);

        // Mark the grid cells as occupied
        for (let dy = 0; dy < roomType.height; dy++) {
            for (let dx = 0; dx < roomType.width; dx++) {
                this.grid[y + dy][x + dx] = room.id;
            }
        }

        // Apply room effects
        this.applyRoomEffects(room);

        // Reset selection
        this.selectedRoomType = null;

        // Clear any preview
        this.clearPreview();

        // Update the UI
        this.renderBunkerGrid();
        this.updateRoomSelectionUI();

        gameManager.addMessage(`Built a new ${type} in your bunker!`);
        return true;
    }

    // Apply the effects of a room
    applyRoomEffects(room) {
        const roomType = this.roomTypes[room.type];

        // Apply max cats effect
        if (roomType.effect && roomType.effect.maxCats) {
            gameManager.increaseMaxCats(roomType.effect.maxCats);
        }

        // Other effects can be implemented as needed
    }

    // Helper method to get cell size based on screen width
    getCellSize() {
        return window.innerWidth <= 600 ? 50 : window.innerWidth <= 1024 ? 55 : 60;
    }

    // Helper method to get grid gap
    getGridGap() {
        return 2; // Gap between cells in pixels
    }

    // Helper method to calculate room position and size
    calculateRoomPosition(x, y, width, height) {
        // Fixed cell size for consistent positioning
        const cellSize = 60;

        // Calculate position based on exact grid cell positions
        return {
            left: x * cellSize,
            top: y * cellSize,
            width: width * cellSize,
            height: height * cellSize
        };
    }

    // Make a room selection item draggable using interact.js - Fallout Shelter style
    makeDraggable(element, roomType) {
        if (!window.interact) {
            console.error('interact.js is not loaded');
            return;
        }

        // Create a clone element for dragging
        let clone = null;
        let startPosition = { x: 0, y: 0 };

        interact(element).draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: {
                start: (event) => {
                    // Select the room type when starting drag
                    this.selectRoomType(roomType);

                    // Create a clone of the element for dragging
                    clone = element.cloneNode(true);
                    clone.style.position = 'fixed';
                    clone.style.zIndex = '1000';
                    clone.style.width = element.offsetWidth + 'px';
                    clone.style.height = element.offsetHeight + 'px';
                    clone.style.opacity = '0.9';
                    clone.style.pointerEvents = 'none';
                    clone.classList.add('room-drag-clone');
                    document.body.appendChild(clone);

                    // Position the clone at the original element
                    const rect = element.getBoundingClientRect();
                    clone.style.left = rect.left + 'px';
                    clone.style.top = rect.top + 'px';

                    // Store the start position
                    startPosition.x = rect.left;
                    startPosition.y = rect.top;

                    // Add a visual effect to show it's being dragged
                    clone.style.transform = 'scale(0.95) rotate(2deg)';

                    // Add a subtle animation
                    clone.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

                    // Play a sound effect if available
                    // const sound = new Audio('sounds/pickup.mp3');
                    // sound.play();
                },
                move: (event) => {
                    if (clone) {
                        // Move the clone with the pointer
                        const x = parseFloat(clone.style.left || '0') + event.dx;
                        const y = parseFloat(clone.style.top || '0') + event.dy;
                        clone.style.left = x + 'px';
                        clone.style.top = y + 'px';

                        // Add a subtle rotation based on movement direction
                        const rotation = event.dx * 0.05;
                        clone.style.transform = `scale(0.95) rotate(${rotation}deg)`;
                    }
                },
                end: (event) => {
                    // Add a drop animation
                    if (clone) {
                        clone.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                        clone.style.transform = 'scale(0.8) rotate(0deg)';
                        clone.style.opacity = '0';

                        // Play a sound effect if available
                        // const sound = new Audio('sounds/drop.mp3');
                        // sound.play();

                        // Remove the clone after animation
                        setTimeout(() => {
                            if (clone) {
                                clone.remove();
                                clone = null;
                            }
                        }, 300);
                    }
                }
            }
        });
    }

    // Make the grid a dropzone for rooms - Fallout Shelter style
    makeGridDropzone(gridElement) {
        if (!window.interact) {
            console.error('interact.js is not loaded');
            return;
        }

        interact(gridElement).dropzone({
            accept: '.room-drag-clone',
            overlap: 0.3, // Reduced overlap requirement for easier placement
            ondropactivate: () => {
                // Add active class when a drag starts
                gridElement.classList.add('drop-active');

                // Add a subtle animation to the grid
                gridElement.style.transition = 'background-color 0.3s ease';
                gridElement.style.backgroundColor = 'rgba(26, 37, 48, 0.8)';
            },
            ondragenter: (event) => {
                // Get the cell under the pointer
                const gridRect = gridElement.getBoundingClientRect();

                // Get cell size based on screen width
                const cellSize = window.innerWidth <= 600 ? 50 : window.innerWidth <= 1024 ? 55 : 60;
                const gridGap = 2; // Gap between cells in pixels

                // Calculate the grid cell coordinates
                const x = Math.floor((event.dragEvent.clientX - gridRect.left - 10) / (cellSize + gridGap));
                const y = Math.floor((event.dragEvent.clientY - gridRect.top - 10) / (cellSize + gridGap));

                // Show placement preview with a smooth transition
                if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
                    this.showPlacementPreview(x, y);

                    // Add a subtle pulse effect to the grid
                    gridElement.style.boxShadow = 'inset 0 0 20px rgba(52, 152, 219, 0.3)';
                }
            },
            ondragleave: () => {
                // Clear preview when leaving the grid
                this.clearPreview();

                // Remove the pulse effect
                gridElement.style.boxShadow = 'none';
            },
            ondrop: (event) => {
                // Get the cell under the pointer
                const gridRect = gridElement.getBoundingClientRect();

                // Get cell size based on screen width
                const cellSize = window.innerWidth <= 600 ? 50 : window.innerWidth <= 1024 ? 55 : 60;
                const gridGap = 2; // Gap between cells in pixels

                // Calculate the grid cell coordinates
                const x = Math.floor((event.dragEvent.clientX - gridRect.left - 10) / (cellSize + gridGap));
                const y = Math.floor((event.dragEvent.clientY - gridRect.top - 10) / (cellSize + gridGap));

                // Attempt to place the room with visual feedback
                if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
                    if (this.canPlaceRoomAt(this.selectedRoomType, x, y)) {
                        // Add a flash effect before placing
                        const flashElement = document.createElement('div');
                        flashElement.className = 'placement-flash';
                        const position = this.calculateRoomPosition(x, y, this.roomTypes[this.selectedRoomType].width, this.roomTypes[this.selectedRoomType].height);
                        flashElement.style.left = `${position.left}px`;
                        flashElement.style.top = `${position.top}px`;
                        flashElement.style.width = `${position.width}px`;
                        flashElement.style.height = `${position.height}px`;
                        gridElement.appendChild(flashElement);

                        // Remove the flash after animation
                        setTimeout(() => {
                            flashElement.remove();
                            // Place the room after the flash effect
                            this.placeRoom(this.selectedRoomType, x, y);
                        }, 300);
                    } else {
                        // Show error message with shake animation on the preview
                        const previewElement = document.querySelector('.room-preview');
                        if (previewElement) {
                            previewElement.style.animation = 'shake 0.5s';
                            setTimeout(() => {
                                previewElement.style.animation = 'pulse 1.5s infinite alternate';
                            }, 500);
                        }
                        gameManager.addMessage(`Cannot place ${this.selectedRoomType} here. Try another location.`);
                    }
                }

                // Clear preview
                this.clearPreview();
            },
            ondropdeactivate: () => {
                // Remove active class when drag ends
                gridElement.classList.remove('drop-active');
                gridElement.style.backgroundColor = '';
                gridElement.style.boxShadow = 'none';
                this.clearPreview();
            }
        });
    }

    // Render all placed rooms
    renderRooms() {
        const bunkerGrid = document.querySelector('.bunker-grid');
        if (!bunkerGrid) return;

        // Clear existing room elements
        const existingRooms = bunkerGrid.querySelectorAll('.bunker-room');
        existingRooms.forEach(room => room.remove());

        // Render each room
        this.rooms.forEach(room => {
            const roomType = this.roomTypes[room.type];
            const roomElement = document.createElement('div');
            roomElement.className = 'bunker-room';
            roomElement.dataset.roomId = room.id;
            roomElement.dataset.roomType = room.type;

            // Calculate position and size
            const position = this.calculateRoomPosition(room.x, room.y, roomType.width, roomType.height);

            // Set positioning
            roomElement.style.left = position.left + 'px';
            roomElement.style.top = position.top + 'px';
            roomElement.style.width = position.width + 'px';
            roomElement.style.height = position.height + 'px';
            roomElement.style.backgroundColor = roomType.color;

            // Add room content
            roomElement.innerHTML = `
                <div class="room-icon">${roomType.icon}</div>
                <div class="room-name">${room.type}</div>
            `;

            // Add a tooltip with room details
            let tooltipContent = `<strong>${room.type}</strong><br>Size: ${roomType.width}x${roomType.height}<br>`;

            if (roomType.production) {
                tooltipContent += 'Production: ';
                for (const resource in roomType.production) {
                    tooltipContent += `${resource}: +${roomType.production[resource]}/tick `;
                }
                tooltipContent += '<br>';
            }

            if (roomType.effect) {
                tooltipContent += 'Effects: ';
                for (const effect in roomType.effect) {
                    tooltipContent += `${effect}: +${roomType.effect[effect]} `;
                }
            }

            roomElement.title = tooltipContent.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');

            bunkerGrid.appendChild(roomElement);
        });
    }

    // Produce resources from all rooms
    produceResources() {
        let productionSummary = {};

        // Calculate production from all rooms
        this.rooms.forEach(room => {
            const roomType = this.roomTypes[room.type];

            if (roomType.production) {
                for (const resource in roomType.production) {
                    const amount = roomType.production[resource];

                    if (!productionSummary[resource]) {
                        productionSummary[resource] = 0;
                    }

                    productionSummary[resource] += amount;
                }
            }
        });

        // Add the resources
        for (const resource in productionSummary) {
            if (resource === 'power') {
                // Power is handled differently - it's not a storable resource
                continue;
            }

            const roundedAmount = Math.round(productionSummary[resource] * 10) / 10; // Round to 1 decimal place
            if (roundedAmount > 0) {
                resourceManager.addResource(resource, roundedAmount);
            }
        }

        return productionSummary;
    }

    // Expand the bunker grid when base level increases
    expandGrid(newWidth, newHeight) {
        // Save the old grid
        const oldGrid = [...this.grid];
        const oldWidth = this.gridWidth;
        const oldHeight = this.gridHeight;

        // Update dimensions
        this.gridWidth = Math.max(this.gridWidth, newWidth);
        this.gridHeight = Math.max(this.gridHeight, newHeight);

        // Create a new grid
        this.initializeGrid();

        // Copy the old grid contents
        for (let y = 0; y < oldHeight; y++) {
            for (let x = 0; x < oldWidth; x++) {
                if (y < this.gridHeight && x < this.gridWidth) {
                    this.grid[y][x] = oldGrid[y][x];
                }
            }
        }

        // Update the UI
        this.renderBunkerGrid();
    }

    // Get the total power production
    getTotalPower() {
        let totalPower = 0;

        this.rooms.forEach(room => {
            const roomType = this.roomTypes[room.type];
            if (roomType.production && roomType.production.power) {
                totalPower += roomType.production.power;
            }
        });

        return totalPower;
    }

    // Get the power consumption
    getPowerConsumption() {
        // Base power consumption plus consumption from rooms
        let consumption = 0.1; // Base consumption

        this.rooms.forEach(() => {
            // Each room consumes a small amount of power
            consumption += 0.05;
        });

        return consumption;
    }

    // Check if the bunker has enough power
    hasSufficientPower() {
        return this.getTotalPower() >= this.getPowerConsumption();
    }

    // Update the UI with current bunker info
    updateDisplay() {
        this.renderBunkerGrid();
        this.renderRoomSelection();
    }
}

// Create global bunker manager
const bunkerManager = new BunkerManager();
