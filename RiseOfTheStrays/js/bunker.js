// Bunker management system - Fallout Shelter style
class BunkerManager {
    constructor() {
        this.gridWidth = 5; // Initial width of the bunker grid
        this.gridHeight = 5; // Initial height of the bunker grid
        this.grid = []; // 2D array representing the bunker grid
        this.rooms = []; // Array of placed rooms
        this.selectedRoomType = null; // Currently selected room type for placement
        this.cellSize = 60; // Size of each cell in pixels
        this.ghostElement = null; // Ghost element for room placement preview
        this.currentDropTarget = { x: -1, y: -1 }; // Current drop target coordinates

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
                this.removeGhostElement();
            });
        }

        // Create ghost element for room placement preview
        this.createGhostElement();

        // Initialize interact.js for the room selection items
        this.initializeInteract();
    }

    // Initialize interact.js for drag and drop
    initializeInteract() {
        // Make room selection items draggable
        interact('.room-selection-item:not(.disabled)').draggable({
            inertia: false,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: {
                start: event => this.onDragStart(event),
                move: event => this.onDragMove(event),
                end: event => this.onDragEnd(event)
            }
        });

        // Make the bunker grid a dropzone
        interact('.bunker-grid').dropzone({
            accept: '.room-selection-item',
            overlap: 0.5,
            ondropactivate: event => this.onDropActivate(event),
            ondragenter: event => this.onDragEnter(event),
            ondragleave: event => this.onDragLeave(event),
            ondrop: event => this.onDrop(event),
            ondropdeactivate: event => this.onDropDeactivate(event)
        });
    }

    // Create a ghost element for room placement preview
    createGhostElement() {
        // Remove any existing ghost element
        this.removeGhostElement();

        // Create new ghost element
        const ghost = document.createElement('div');
        ghost.id = 'room-ghost';
        ghost.className = 'room-ghost';
        ghost.style.display = 'none';
        ghost.style.position = 'absolute';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '1000';
        ghost.style.opacity = '0.7';
        ghost.style.borderRadius = '5px';
        ghost.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        ghost.style.transition = 'transform 0.05s ease-out';

        // Add the ghost element to the document body
        document.body.appendChild(ghost);
        this.ghostElement = ghost;
    }

    // Remove the ghost element
    removeGhostElement() {
        if (this.ghostElement) {
            this.ghostElement.remove();
            this.ghostElement = null;
        }
    }

    // Update the ghost element to match the selected room type
    updateGhostElement() {
        if (!this.ghostElement || !this.selectedRoomType) return;

        const roomType = this.roomTypes[this.selectedRoomType];
        if (!roomType) return;

        // Update ghost element appearance
        this.ghostElement.style.width = `${roomType.width * this.cellSize}px`;
        this.ghostElement.style.height = `${roomType.height * this.cellSize}px`;
        this.ghostElement.style.backgroundColor = roomType.color;

        // Add room content
        this.ghostElement.innerHTML = `
            <div class="room-icon" style="font-size: 24px; margin-bottom: 5px;">${roomType.icon}</div>
            <div class="room-name" style="font-size: 14px; font-weight: bold; color: white;">${this.selectedRoomType}</div>
        `;

        // Center content
        this.ghostElement.style.display = 'flex';
        this.ghostElement.style.flexDirection = 'column';
        this.ghostElement.style.alignItems = 'center';
        this.ghostElement.style.justifyContent = 'center';
    }

    // Render the bunker grid
    renderBunkerGrid() {
        const bunkerContainer = document.getElementById('bunker-container');
        if (!bunkerContainer) return;

        bunkerContainer.innerHTML = '';

        // Create the grid container
        const gridElement = document.createElement('div');
        gridElement.className = 'bunker-grid';

        // Set explicit dimensions for the grid
        gridElement.style.width = `${this.gridWidth * this.cellSize}px`;
        gridElement.style.height = `${this.gridHeight * this.cellSize}px`;
        gridElement.style.display = 'grid';
        gridElement.style.gridTemplateColumns = `repeat(${this.gridWidth}, ${this.cellSize}px)`;
        gridElement.style.gridTemplateRows = `repeat(${this.gridHeight}, ${this.cellSize}px)`;

        // Create cells for the grid
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'bunker-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                // Add click event for placing rooms
                cell.addEventListener('click', () => {
                    if (this.selectedRoomType && this.canPlaceRoomAt(this.selectedRoomType, x, y)) {
                        this.placeRoom(this.selectedRoomType, x, y);
                    }
                });

                gridElement.appendChild(cell);
            }
        }

        // Add the grid to the container
        bunkerContainer.appendChild(gridElement);

        // Render existing rooms
        this.renderRooms();
    }

    // Event handler for drag start
    onDragStart(event) {
        const target = event.target;
        const roomName = target.querySelector('.room-name').textContent;

        // Select the room type
        this.selectRoomType(roomName);

        // Update the ghost element
        this.updateGhostElement();

        // Position the ghost at the mouse cursor
        const rect = target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        this.ghostElement.style.left = `${event.clientX - offsetX}px`;
        this.ghostElement.style.top = `${event.clientY - offsetY}px`;
        this.ghostElement.style.display = 'flex';

        // Add a data attribute to track the drag offset
        this.ghostElement.dataset.offsetX = offsetX;
        this.ghostElement.dataset.offsetY = offsetY;

        // Add a class to the body to indicate dragging
        document.body.classList.add('room-dragging');
    }

    // Event handler for drag move
    onDragMove(event) {
        if (!this.ghostElement) return;

        // Get the offset from the data attribute
        const offsetX = parseFloat(this.ghostElement.dataset.offsetX || 0);
        const offsetY = parseFloat(this.ghostElement.dataset.offsetY || 0);

        // Move the ghost element with the cursor
        this.ghostElement.style.left = `${event.clientX - offsetX}px`;
        this.ghostElement.style.top = `${event.clientY - offsetY}px`;

        // Update the ghost element's appearance based on whether it can be placed
        this.updateGhostValidity();
    }

    // Event handler for drag end
    onDragEnd(event) {
        // Hide the ghost element
        if (this.ghostElement) {
            this.ghostElement.style.display = 'none';
        }

        // Remove the dragging class from the body
        document.body.classList.remove('room-dragging');

        // Clear any highlighted cells
        this.clearHighlightedCells();

        // Reset the current drop target
        this.currentDropTarget = { x: -1, y: -1 };
    }

    // Event handler for dropzone activation
    onDropActivate(event) {
        // Add a class to the dropzone to indicate it's active
        event.target.classList.add('drop-active');
    }

    // Event handler for drag enter dropzone
    onDragEnter(event) {
        const dropRect = event.target.getBoundingClientRect();
        const ghostRect = this.ghostElement.getBoundingClientRect();

        // Calculate the cell coordinates based on the ghost element's position
        const x = Math.floor((ghostRect.left - dropRect.left) / this.cellSize);
        const y = Math.floor((ghostRect.top - dropRect.top) / this.cellSize);

        // Ensure coordinates are within grid bounds
        const boundedX = Math.max(0, Math.min(x, this.gridWidth - 1));
        const boundedY = Math.max(0, Math.min(y, this.gridHeight - 1));

        // Update the current drop target
        this.currentDropTarget = { x: boundedX, y: boundedY };

        // Highlight the cells that would be occupied by the room
        this.highlightCells(boundedX, boundedY);

        // Update the ghost element's appearance
        this.updateGhostValidity();
    }

    // Event handler for drag leave dropzone
    onDragLeave(event) {
        // Clear any highlighted cells
        this.clearHighlightedCells();

        // Reset the current drop target
        this.currentDropTarget = { x: -1, y: -1 };

        // Update the ghost element's appearance
        this.updateGhostValidity();
    }

    // Event handler for drop
    onDrop(event) {
        const { x, y } = this.currentDropTarget;

        // Place the room if possible
        if (x >= 0 && y >= 0 && this.selectedRoomType && this.canPlaceRoomAt(this.selectedRoomType, x, y)) {
            this.placeRoom(this.selectedRoomType, x, y);
        }

        // Hide the ghost element
        if (this.ghostElement) {
            this.ghostElement.style.display = 'none';
        }

        // Clear any highlighted cells
        this.clearHighlightedCells();

        // Reset the current drop target
        this.currentDropTarget = { x: -1, y: -1 };
    }

    // Event handler for dropzone deactivation
    onDropDeactivate(event) {
        // Remove the active class from the dropzone
        event.target.classList.remove('drop-active');
    }

    // Update the ghost element's appearance based on whether it can be placed
    updateGhostValidity() {
        if (!this.ghostElement || !this.selectedRoomType) return;

        const { x, y } = this.currentDropTarget;
        const canPlace = x >= 0 && y >= 0 && this.canPlaceRoomAt(this.selectedRoomType, x, y);

        // Update the ghost element's appearance
        if (canPlace) {
            this.ghostElement.classList.remove('invalid');
            this.ghostElement.classList.add('valid');
        } else {
            this.ghostElement.classList.remove('valid');
            this.ghostElement.classList.add('invalid');
        }
    }

    // Highlight cells that would be occupied by a room
    highlightCells(x, y) {
        if (!this.selectedRoomType) return;

        // Clear any previously highlighted cells
        this.clearHighlightedCells();

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
                }
            }
        }
    }

    // Clear all highlighted cells
    clearHighlightedCells() {
        // Remove highlight classes from all cells
        const cells = document.querySelectorAll('.bunker-cell');
        cells.forEach(cell => {
            cell.classList.remove('valid-placement', 'invalid-placement');
        });
    }

    // Render the room selection UI
    renderRoomSelection() {
        const roomSelectionContainer = document.getElementById('room-selection');
        if (!roomSelectionContainer) return;

        roomSelectionContainer.innerHTML = '';

        // Create room type buttons
        for (const type in this.roomTypes) {
            const roomType = this.roomTypes[type];
            const roomButton = document.createElement('div');
            roomButton.className = 'room-selection-item';

            // Create cost text
            let costText = '';
            for (const resource in roomType.cost) {
                costText += `${resource}: ${roomType.cost[resource]} `;
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

            // Add event listener for selection
            roomButton.addEventListener('click', () => {
                this.selectRoomType(type);
            });

            // Disable the button if resources are insufficient
            const canAfford = this.canAffordRoom(type);
            if (!canAfford) {
                roomButton.classList.add('disabled');
            }

            roomSelectionContainer.appendChild(roomButton);
        }

        // Add cancel button
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-room-placement';
        cancelButton.textContent = 'Cancel';
        cancelButton.style.display = this.selectedRoomType ? 'block' : 'none';
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
        gameManager.addMessage(`Selected ${type} for placement. Click on the grid to place it.`);
    }

    // Check if player can afford to build a room
    canAffordRoom(type) {
        const roomType = this.roomTypes[type];
        if (!roomType) return false;

        for (const resource in roomType.cost) {
            if (resourceManager.getResource(resource) < roomType.cost[resource]) {
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
            baseManager.increaseMaxCats(roomType.effect.maxCats);
        }

        // Other effects can be implemented as needed
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
            roomElement.style.gridColumnStart = room.x + 1;
            roomElement.style.gridColumnEnd = room.x + roomType.width + 1;
            roomElement.style.gridRowStart = room.y + 1;
            roomElement.style.gridRowEnd = room.y + roomType.height + 1;
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

        this.rooms.forEach(room => {
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
