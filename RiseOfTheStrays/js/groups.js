// Simple Cat Grouping System
class GroupManager {
    constructor() {
        this.groups = [];
        this.maxCatsPerGroup = 5; // Maximum cats per group
        this.groupTypes = ['Battle', 'Exploration', 'Training', 'Scavenging', 'Custom'];

        // Load groups from localStorage if available
        this.loadGroups();
    }

    // Load groups from localStorage
    loadGroups() {
        const savedGroups = localStorage.getItem('catGroups');
        if (savedGroups) {
            try {
                this.groups = JSON.parse(savedGroups);
                console.log('Loaded groups:', this.groups);
            } catch (e) {
                console.error('Error loading groups:', e);
                this.groups = [];
            }
        }
    }

    // Save groups to localStorage
    saveGroups() {
        localStorage.setItem('catGroups', JSON.stringify(this.groups));
    }

    // Create a new group
    createGroup(name, type, description = '') {
        // Check if a group with this name already exists
        if (this.groups.some(group => group.name === name)) {
            gameManager.addMessage(`A group named "${name}" already exists.`);
            return false;
        }

        const newGroup = {
            id: Date.now(), // Use timestamp as unique ID
            name: name,
            type: type,
            description: description,
            catIds: []
        };

        this.groups.push(newGroup);
        this.saveGroups();
        gameManager.addMessage(`Created new ${type} group: ${name}`);
        this.updateGroupsDisplay();
        return true;
    }

    // Delete a group
    deleteGroup(groupId) {
        const groupIndex = this.groups.findIndex(group => group.id === groupId);
        if (groupIndex === -1) return false;

        const groupName = this.groups[groupIndex].name;
        this.groups.splice(groupIndex, 1);
        this.saveGroups();
        gameManager.addMessage(`Deleted group: ${groupName}`);
        this.updateGroupsDisplay();
        return true;
    }

    // Add a cat to a group
    addCatToGroup(groupId, catId) {
        const group = this.groups.find(group => group.id === groupId);
        if (!group) return false;

        // Check if cat is already in the group
        if (group.catIds.includes(catId)) {
            gameManager.addMessage(`This cat is already in the group "${group.name}".`);
            return false;
        }

        // Check if group is full
        if (group.catIds.length >= this.maxCatsPerGroup) {
            gameManager.addMessage(`Group "${group.name}" is full (max ${this.maxCatsPerGroup} cats).`);
            return false;
        }

        // Add cat to group
        group.catIds.push(catId);
        this.saveGroups();

        // Get cat name for message
        const cat = catManager.cats.find(c => c.id === catId);
        const catName = cat ? cat.name : 'Unknown cat';

        gameManager.addMessage(`Added ${catName} to group "${group.name}".`);
        this.updateGroupsDisplay();
        return true;
    }

    // Remove a cat from a group
    removeCatFromGroup(groupId, catId) {
        const group = this.groups.find(group => group.id === groupId);
        if (!group) return false;

        const catIndex = group.catIds.indexOf(catId);
        if (catIndex === -1) return false;

        // Remove cat from group
        group.catIds.splice(catIndex, 1);
        this.saveGroups();

        // Get cat name for message
        const cat = catManager.cats.find(c => c.id === catId);
        const catName = cat ? cat.name : 'Unknown cat';

        gameManager.addMessage(`Removed ${catName} from group "${group.name}".`);
        this.updateGroupsDisplay();
        return true;
    }

    // Update group details
    updateGroup(groupId, newDetails) {
        const group = this.groups.find(group => group.id === groupId);
        if (!group) return false;

        // Update group properties
        if (newDetails.name) group.name = newDetails.name;
        if (newDetails.type) group.type = newDetails.type;
        if (newDetails.description !== undefined) group.description = newDetails.description;

        this.saveGroups();
        gameManager.addMessage(`Updated group: ${group.name}`);
        this.updateGroupsDisplay();
        return true;
    }

    // Get all groups
    getAllGroups() {
        return this.groups;
    }

    // Get a specific group by ID
    getGroup(groupId) {
        return this.groups.find(group => group.id === groupId);
    }

    // Get all cats in a group
    getGroupCats(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return [];

        return group.catIds.map(catId => catManager.cats.find(cat => cat.id === catId)).filter(cat => cat);
    }

    // Check if a cat is in any group
    isCatInAnyGroup(catId) {
        return this.groups.some(group => group.catIds.includes(catId));
    }

    // Get all groups a cat is in
    getGroupsForCat(catId) {
        return this.groups.filter(group => group.catIds.includes(catId));
    }

    // Calculate group stats (sum of all cats' stats)
    calculateGroupStats(groupId) {
        const cats = this.getGroupCats(groupId);
        if (cats.length === 0) return null;

        const stats = {
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            wis: 0,
            cha: 0,
            totalLevel: 0,
            averageLevel: 0
        };

        cats.forEach(cat => {
            // Make sure cat.stats exists and has valid values
            if (cat && cat.stats) {
                // Map the cat stats to our group stats
                stats.str += cat.stats.STR || 0;
                stats.dex += cat.stats.DEX || 0;
                stats.con += cat.stats.VIT || 0; // VIT is Constitution
                stats.int += cat.stats.INT || 0;
                stats.wis += cat.stats.WIL || 0; // WIL is Wisdom
                stats.cha += cat.stats.CHA || 0;
            }
            stats.totalLevel += cat.level || 0;
        });

        stats.averageLevel = cats.length > 0 ? Math.round(stats.totalLevel / cats.length * 10) / 10 : 0;

        return stats;
    }

    // Update the groups display in the UI
    updateGroupsDisplay() {
        const groupsContainer = document.getElementById('groups-container');
        if (!groupsContainer) {
            console.error('Groups container not found');
            return;
        }

        // Clear the container
        groupsContainer.innerHTML = '';

        // If no groups, show a message
        if (this.groups.length === 0) {
            groupsContainer.innerHTML = `
                <div class="no-groups-message">
                    <p>You haven't created any cat groups yet.</p>
                    <p>Create a group to organize your cats for different activities!</p>
                </div>
            `;
            return;
        }

        // Create elements for each group
        this.groups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group-card';
            groupElement.setAttribute('data-group-id', group.id);

            // Get cats in this group
            const groupCats = this.getGroupCats(group.id);

            // Calculate group stats
            const groupStats = this.calculateGroupStats(group.id);

            // Set background color based on group type
            groupElement.classList.add(`group-type-${group.type.toLowerCase()}`);

            // Create group header
            groupElement.innerHTML = `
                <div class="group-header">
                    <div class="group-title">
                        <h3>${group.name}</h3>
                        <span class="group-type">${group.type}</span>
                    </div>
                    <div class="group-actions">
                        <button class="delete-group-btn" data-group-id="${group.id}">Delete Group</button>
                    </div>
                </div>

                <div class="group-content">
                    ${group.description ? `<div class="group-description">${group.description}</div>` : ''}

                    <div class="group-cats">
                        ${groupCats.length === 0 ?
                            `<div class="no-cats-message">
                                <p>No cats in this group yet.</p>
                                <p>Add cats to this group using the buttons below.</p>
                            </div>` :
                            `<div class="group-cats-list">
                                ${groupCats.map(cat => `
                                    <div class="group-cat-item" data-cat-id="${cat.id}">
                                        <div class="group-cat-info">
                                            <div class="group-cat-name">${cat.name}</div>
                                            <div class="group-cat-level">Level ${cat.level} ${cat.type}</div>
                                        </div>
                                        <button class="remove-cat-btn" data-group-id="${group.id}" data-cat-id="${cat.id}">Remove</button>
                                    </div>
                                `).join('')}
                            </div>`
                        }
                    </div>

                    <div class="group-add-cat">
                        <h4>Add Cats to Group</h4>
                        <div class="available-cats">
                            ${this.renderAvailableCats(group.id)}
                        </div>
                    </div>

                    ${groupCats.length > 0 ? `
                        <div class="group-stats">
                            <h4>Group Stats</h4>
                            <div class="group-stats-grid">
                                <div class="group-stat">
                                    <span class="stat-label">STR</span>
                                    <span class="stat-value">${groupStats ? groupStats.str : 0}</span>
                                </div>
                                <div class="group-stat">
                                    <span class="stat-label">DEX</span>
                                    <span class="stat-value">${groupStats ? groupStats.dex : 0}</span>
                                </div>
                                <div class="group-stat">
                                    <span class="stat-label">CON</span>
                                    <span class="stat-value">${groupStats ? groupStats.con : 0}</span>
                                </div>
                                <div class="group-stat">
                                    <span class="stat-label">INT</span>
                                    <span class="stat-value">${groupStats ? groupStats.int : 0}</span>
                                </div>
                                <div class="group-stat">
                                    <span class="stat-label">WIS</span>
                                    <span class="stat-value">${groupStats ? groupStats.wis : 0}</span>
                                </div>
                                <div class="group-stat">
                                    <span class="stat-label">CHA</span>
                                    <span class="stat-value">${groupStats ? groupStats.cha : 0}</span>
                                </div>
                            </div>
                            <div class="group-level">
                                <span>Average Level: ${groupStats ? groupStats.averageLevel : 0}</span>
                            </div>
                        </div>
                    ` : `
                        <div class="group-stats-empty">
                            <p>Add cats to this group to see group stats.</p>
                        </div>
                    `}
                </div>
            `;

            // Add the group element to the container
            groupsContainer.appendChild(groupElement);
        });

        // Add event listeners
        this.addEventListeners();
    }

    // Render available cats that can be added to a group
    renderAvailableCats(groupId) {
        const group = this.groups.find(group => group.id === groupId);
        if (!group) return '';

        // Get cats that are not already in this group
        const availableCats = catManager.cats.filter(cat => !group.catIds.includes(cat.id));

        if (availableCats.length === 0) {
            return '<p>No more cats available to add to this group.</p>';
        }

        return `
            <div class="available-cats-list">
                ${availableCats.map(cat => `
                    <div class="available-cat-item">
                        <div class="available-cat-info">
                            <div class="available-cat-name">${cat.name}</div>
                            <div class="available-cat-level">Level ${cat.level} ${cat.type}</div>
                        </div>
                        <button class="add-cat-btn" data-group-id="${groupId}" data-cat-id="${cat.id}">Add</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Add event listeners to group elements
    addEventListeners() {
        // Delete group buttons
        document.querySelectorAll('.delete-group-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                if (confirm('Are you sure you want to delete this group?')) {
                    this.deleteGroup(groupId);
                }
                e.stopPropagation();
            });
        });

        // Add cat buttons
        document.querySelectorAll('.add-cat-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                const catId = parseInt(e.target.getAttribute('data-cat-id'));
                this.addCatToGroup(groupId, catId);
                e.stopPropagation();
            });
        });

        // Remove cat buttons
        document.querySelectorAll('.remove-cat-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                const catId = parseInt(e.target.getAttribute('data-cat-id'));
                this.removeCatFromGroup(groupId, catId);
                e.stopPropagation();
            });
        });
    }

    // Show create group form
    showCreateGroupForm() {
        const createGroupForm = document.getElementById('create-group-form');
        if (!createGroupForm) {
            console.error('Create group form not found');
            return;
        }

        // Show the form
        createGroupForm.style.display = 'block';

        // Focus on the name input
        document.getElementById('group-name-input').focus();
    }

    // Handle create group form submission
    handleCreateGroupSubmit(event) {
        event.preventDefault();

        const nameInput = document.getElementById('group-name-input');
        const typeSelect = document.getElementById('group-type-select');
        const descriptionInput = document.getElementById('group-description-input');

        if (!nameInput || !typeSelect) {
            console.error('Form inputs not found');
            return;
        }

        const name = nameInput.value.trim();
        const type = typeSelect.value;
        const description = descriptionInput ? descriptionInput.value.trim() : '';

        if (!name) {
            gameManager.addMessage('Please enter a group name.');
            return;
        }

        const success = this.createGroup(name, type, description);

        if (success) {
            // Reset the form
            nameInput.value = '';
            typeSelect.selectedIndex = 0;
            if (descriptionInput) {
                descriptionInput.value = '';
            }

            // Hide the form
            document.getElementById('create-group-form').style.display = 'none';
        }
    }

    // Show modal to edit an existing group
    showEditGroupModal(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return;

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'edit-group-modal';
        modalContainer.className = 'modal';

        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Edit Group: ${group.name}</h3>

                <div class="form-group">
                    <label for="edit-group-name">Group Name:</label>
                    <input type="text" id="edit-group-name" value="${group.name}">
                </div>

                <div class="form-group">
                    <label for="edit-group-type">Group Type:</label>
                    <select id="edit-group-type">
                        ${this.groupTypes.map(type =>
                            `<option value="${type}" ${type === group.type ? 'selected' : ''}>${type}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="edit-group-description">Description (optional):</label>
                    <textarea id="edit-group-description">${group.description || ''}</textarea>
                </div>

                <div class="modal-actions">
                    <button id="save-group-btn" data-group-id="${groupId}">Save Changes</button>
                    <button id="cancel-modal-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners
        const closeButton = modalContainer.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('Edit modal close button clicked');
                this.closeModal(modalContainer);
            });
        }

        const cancelButton = modalContainer.querySelector('#cancel-modal-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                console.log('Edit modal cancel button clicked');
                this.closeModal(modalContainer);
            });
        }

        const saveButton = modalContainer.querySelector('#save-group-btn');
        if (saveButton) {
            saveButton.addEventListener('click', (e) => {
                console.log('Save group button clicked');
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                const name = document.getElementById('edit-group-name').value.trim();
                const type = document.getElementById('edit-group-type').value;
                const description = document.getElementById('edit-group-description').value.trim();

                console.log('Group edit details:', { groupId, name, type, description });

                if (!name) {
                    gameManager.addMessage('Please enter a group name.');
                    return;
                }

                const success = this.updateGroup(groupId, { name, type, description });
                console.log('Group update result:', success);
                if (success) {
                    this.closeModal(modalContainer);
                }
            });
        }

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Show confirmation dialog for deleting a group
    showDeleteGroupConfirmation(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return;

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'delete-group-modal';
        modalContainer.className = 'modal';

        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Delete Group</h3>

                <p>Are you sure you want to delete the group "${group.name}"?</p>
                <p>This action cannot be undone.</p>

                <div class="modal-actions">
                    <button id="confirm-delete-btn" data-group-id="${groupId}">Delete Group</button>
                    <button id="cancel-modal-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners
        const closeButton = modalContainer.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('Delete modal close button clicked');
                this.closeModal(modalContainer);
            });
        }

        const cancelButton = modalContainer.querySelector('#cancel-modal-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                console.log('Delete modal cancel button clicked');
                this.closeModal(modalContainer);
            });
        }

        const deleteButton = modalContainer.querySelector('#confirm-delete-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                console.log('Confirm delete button clicked');
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                console.log('Deleting group with ID:', groupId);
                const success = this.deleteGroup(groupId);
                console.log('Group deletion result:', success);
                if (success) {
                    this.closeModal(modalContainer);
                }
            });
        }

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Show modal to add a cat to a group
    showAddCatModal(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return;

        // Get cats that are not already in this group
        const availableCats = catManager.cats.filter(cat => !group.catIds.includes(cat.id));

        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.id = 'add-cat-modal';
        modalContainer.className = 'modal';

        // Create modal content
        modalContainer.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Add Cat to Group: ${group.name}</h3>

                ${availableCats.length === 0 ?
                    '<p>No cats available to add to this group.</p>' :
                    `<div class="cat-selection">
                        <p>Select a cat to add to this group:</p>
                        <div class="cat-options-container">
                            ${availableCats.map(cat => `
                                <div class="cat-option" data-cat-id="${cat.id}">
                                    <div class="cat-option-name">${cat.name}</div>
                                    <div class="cat-option-level">Level ${cat.level} ${cat.type}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>`
                }

                <div class="modal-actions">
                    <button id="add-cat-btn" data-group-id="${groupId}" ${availableCats.length === 0 ? 'disabled' : ''}>Add Selected Cat</button>
                    <button id="cancel-modal-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add the modal to the page
        document.body.appendChild(modalContainer);

        // Add event listeners
        const closeButton = modalContainer.querySelector('.close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log('Add cat modal close button clicked');
                this.closeModal(modalContainer);
            });
        }

        const cancelButton = modalContainer.querySelector('#cancel-modal-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                console.log('Add cat modal cancel button clicked');
                this.closeModal(modalContainer);
            });
        }

        // Cat selection
        let selectedCatId = null;

        document.querySelectorAll('.cat-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.cat-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Add selected class to clicked option
                option.classList.add('selected');

                // Store selected cat ID
                selectedCatId = parseInt(option.getAttribute('data-cat-id'));

                // Enable add button
                document.getElementById('add-cat-btn').disabled = false;
            });
        });

        const addCatButton = modalContainer.querySelector('#add-cat-btn');
        if (addCatButton) {
            addCatButton.addEventListener('click', (e) => {
                console.log('Add cat button clicked');
                const groupId = parseInt(e.target.getAttribute('data-group-id'));
                console.log('Adding cat to group ID:', groupId, 'Selected cat ID:', selectedCatId);

                if (selectedCatId) {
                    const success = this.addCatToGroup(groupId, selectedCatId);
                    console.log('Add cat to group result:', success);
                    if (success) {
                        this.closeModal(modalContainer);
                    }
                } else {
                    gameManager.addMessage('Please select a cat to add to the group.');
                }
            });
        }

        // Add animation class after a small delay to trigger the animation
        setTimeout(() => {
            modalContainer.querySelector('.modal-content').classList.add('show');
        }, 10);
    }

    // Close modal
    closeModal(modalContainer) {
        console.log('closeModal called with:', modalContainer);

        if (!modalContainer) {
            console.error('modalContainer is null or undefined');
            return;
        }

        // Add the hide animation class
        const modalContent = modalContainer.querySelector('.modal-content');
        if (!modalContent) {
            console.error('modalContent not found in modalContainer');
            // Just remove the container if we can't find the content
            modalContainer.remove();
            return;
        }

        console.log('Removing show class and adding hide class');
        modalContent.classList.remove('show');
        modalContent.classList.add('hide');

        // Remove the modal after animation completes
        console.log('Setting timeout to remove modal');
        setTimeout(() => {
            console.log('Removing modal from DOM');
            modalContainer.remove();
        }, 300); // Match this with the CSS animation duration
    }
}

// Create global group manager
const groupManager = new GroupManager();

// Initialize the groups section when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing cat groups system');

    // Create the create group form
    const groupsSection = document.getElementById('groups-section');
    if (groupsSection) {
        // Add create group button
        const createGroupButton = document.createElement('button');
        createGroupButton.id = 'create-group-btn';
        createGroupButton.textContent = 'Create New Group';
        createGroupButton.className = 'create-group-btn';

        // Add create group form
        const createGroupForm = document.createElement('div');
        createGroupForm.id = 'create-group-form';
        createGroupForm.className = 'create-group-form';
        createGroupForm.style.display = 'none';

        createGroupForm.innerHTML = `
            <form id="group-form">
                <h3>Create New Group</h3>

                <div class="form-group">
                    <label for="group-name-input">Group Name:</label>
                    <input type="text" id="group-name-input" placeholder="Enter group name" required>
                </div>

                <div class="form-group">
                    <label for="group-type-select">Group Type:</label>
                    <select id="group-type-select" required>
                        ${groupManager.groupTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group">
                    <label for="group-description-input">Description (optional):</label>
                    <textarea id="group-description-input" placeholder="Enter group description"></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" id="submit-group-btn">Create Group</button>
                    <button type="button" id="cancel-group-btn">Cancel</button>
                </div>
            </form>
        `;

        // Add header with button
        const groupsHeader = document.createElement('div');
        groupsHeader.className = 'groups-header';
        groupsHeader.innerHTML = `
            <p>Organize your cats into groups for different activities.</p>
        `;
        groupsHeader.appendChild(createGroupButton);

        // Add container for groups
        const groupsContainer = document.createElement('div');
        groupsContainer.id = 'groups-container';
        groupsContainer.className = 'groups-container';

        // Add elements to the section
        groupsSection.appendChild(groupsHeader);
        groupsSection.appendChild(createGroupForm);
        groupsSection.appendChild(groupsContainer);

        // Add event listeners
        createGroupButton.addEventListener('click', () => {
            groupManager.showCreateGroupForm();
        });

        document.getElementById('group-form').addEventListener('submit', (event) => {
            groupManager.handleCreateGroupSubmit(event);
        });

        document.getElementById('cancel-group-btn').addEventListener('click', () => {
            document.getElementById('create-group-form').style.display = 'none';
        });
    }

    // Update the groups display
    groupManager.updateGroupsDisplay();
});
