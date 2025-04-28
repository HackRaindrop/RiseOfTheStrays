// Whiskerhold Depths - Procedural Dungeon System
class DungeonManager {
    constructor() {
        this.currentDungeon = null;
        this.currentRoom = 0;
        this.selectedCats = [];
        this.dungeonCompleted = false;
        this.lootCollected = [];

        // Dungeon themes
        this.dungeonThemes = [
            {
                name: "Whiskerhold Depths",
                description: "An ancient, mystical underground realm where rodent factions have established their dominion. Legend says the treasures of feline ancestors lie within its deepest chambers.",
                minRooms: 4,
                maxRooms: 6,
                enemyFactions: ["Rat Rebellion", "Mole Marauders", "Vole Vanguard", "Mouse Militia", "Hamster Horde"],
                bossOptions: [
                    {
                        name: "General Squeakington, the Iron Whisker",
                        description: "A battle-hardened rat general wearing scraps of armor. His iron whiskers can pierce through the toughest defenses.",
                        phases: 3,
                        abilities: ["Whisker Pierce", "Rally the Horde", "Cheese Bomb"]
                    },
                    {
                        name: "The Rodent King",
                        description: "A massive creature formed from dozens of rats bound together. Its many eyes glow with an eerie intelligence.",
                        phases: 2,
                        abilities: ["Swarm Strike", "Divide and Conquer", "Plague Breath"]
                    },
                    {
                        name: "Duchess Nibbles, the Shadow Weaver",
                        description: "A mysterious mouse enchantress who commands dark magic and illusions.",
                        phases: 3,
                        abilities: ["Shadow Clone", "Mind Maze", "Whisper of Doom"]
                    }
                ],
                environmentModifiers: [
                    { name: "Slippery Floors", affectedStat: "AGI", description: "The smooth stone floors are slick with moisture, making balance difficult." },
                    { name: "Darkness", affectedStat: "PER", description: "Shadows cling to every corner, making it hard to spot movement." },
                    { name: "Narrow Passages", affectedStat: "DEX", description: "The tight corridors require careful movement to navigate." },
                    { name: "Echoing Chambers", affectedStat: "CHA", description: "Every sound echoes confusingly, making communication challenging." },
                    { name: "Ancient Magic", affectedStat: "WIL", description: "Remnants of old spells test the mental fortitude of all who enter." },
                    { name: "Musty Air", affectedStat: "VIT", description: "The stale air is filled with dust and spores, challenging endurance." }
                ],
                lootTable: [
                    { name: "Enchanted Collar", statBonus: "CHA", description: "A collar that glimmers with magical energy, enhancing the wearer's presence." },
                    { name: "Sharpened Claws", statBonus: "STR", description: "Metal claw enhancements that increase striking power." },
                    { name: "Lucky Fishbone", statBonus: "LCK", description: "A preserved fishbone that seems to bend probability in the owner's favor." },
                    { name: "Whisker Trimmer", statBonus: "DEX", description: "A curious device that optimizes whisker sensitivity for better coordination." },
                    { name: "Feather Talisman", statBonus: "AGI", description: "A light feather charm that improves balance and reflexes." },
                    { name: "Ancient Scroll", statBonus: "INT", description: "A scroll containing feline wisdom from ages past." },
                    { name: "Keen-Eye Patch", statBonus: "PER", description: "An eye patch that actually enhances vision rather than hindering it." },
                    { name: "Iron Fur Tonic", statBonus: "VIT", description: "A potion that temporarily hardens fur, providing protection." },
                    { name: "Will Crystal", statBonus: "WIL", description: "A small crystal that strengthens mental resolve when held in the mouth." }
                ]
            }
        ];
    }

    // Get a random item from an array
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Generate a new dungeon
    generateDungeon(themeIndex = 0) {
        const theme = this.dungeonThemes[themeIndex];
        const roomCount = Math.floor(Math.random() * (theme.maxRooms - theme.minRooms + 1)) + theme.minRooms;

        // Select a random boss
        const boss = theme.bossOptions[Math.floor(Math.random() * theme.bossOptions.length)];

        // Create rooms
        const rooms = [];
        for (let i = 0; i < roomCount; i++) {
            // Last room is always the boss room
            if (i === roomCount - 1) {
                rooms.push(this.generateBossRoom(theme, boss));
            } else {
                rooms.push(this.generateRoom(theme, i));
            }
        }

        this.currentDungeon = {
            name: theme.name,
            description: theme.description,
            rooms: rooms,
            currentRoom: 0,
            completed: false
        };

        this.currentRoom = 0;
        this.dungeonCompleted = false;

        return this.currentDungeon;
    }

    // Generate a standard room
    generateRoom(theme, roomIndex) {
        // Select a random enemy faction
        const faction = theme.enemyFactions[Math.floor(Math.random() * theme.enemyFactions.length)];

        // Select a random environment modifier
        const modifier = theme.environmentModifiers[Math.floor(Math.random() * theme.environmentModifiers.length)];

        // Generate room name and description
        const roomTypes = ["Chamber", "Hall", "Cavern", "Tunnel", "Crypt", "Vault"];
        const roomAdjectives = ["Ancient", "Forgotten", "Echoing", "Damp", "Crumbling", "Mysterious", "Glowing"];
        const roomName = `${roomAdjectives[Math.floor(Math.random() * roomAdjectives.length)]} ${roomTypes[Math.floor(Math.random() * roomTypes.length)]}`;

        // Generate flavor descriptions based on room index
        let description;
        switch (roomIndex) {
            case 0:
                description = `The entrance to ${theme.name} opens before you. ${modifier.description} The scent of ${faction} hangs in the air.`;
                break;
            default:
                description = `As you venture deeper, you find yourself in a ${roomName.toLowerCase()}. ${modifier.description} You sense the presence of the ${faction} nearby.`;
                break;
        }

        // Generate enemies based on faction
        const enemies = this.generateEnemies(faction, 2 + Math.floor(Math.random() * 3)); // 2-4 enemies

        // Generate loot
        const loot = this.generateLoot(theme, 1);

        return {
            name: roomName,
            description: description,
            enemies: enemies,
            environmentModifier: modifier,
            loot: loot,
            completed: false,
            isBossRoom: false
        };
    }

    // Generate the boss room
    generateBossRoom(theme, boss) {
        const description = `You've reached the heart of ${theme.name}. A massive chamber opens before you, and at its center stands ${boss.name}. ${boss.description}`;

        // Get average level of cats in the dungeon
        const avgCatLevel = this.selectedCats.length > 0 ?
            Math.ceil(this.selectedCats.reduce((sum, cat) => sum + cat.level, 0) / this.selectedCats.length) : 1;

        // Generate boss using the enemy manager with forced Boss rarity
        const bossType = this.getRandomItem(['Shadow Fox', 'Spectral Hound', 'Rabid Wolf']);
        const bossEnemy = enemyManager.generateRandomEnemy(avgCatLevel + 3, bossType, 'Boss');

        // Override some properties to match our boss definition
        bossEnemy.name = boss.name;
        bossEnemy.abilities = boss.abilities;
        bossEnemy.phases = boss.phases;
        bossEnemy.currentPhase = 1;

        return {
            name: `Throne of ${boss.name.split(',')[0]}`,
            description: description,
            enemies: [bossEnemy],
            environmentModifier: null, // Boss rooms don't have environmental modifiers
            loot: this.generateLoot(theme, 3), // More loot in boss room
            completed: false,
            isBossRoom: true
        };
    }

    // Generate enemies based on faction
    generateEnemies(faction, count) {
        const enemies = [];
        const enemyTypes = {
            "Rat Rebellion": ["Mutant Rat"],
            "Mole Marauders": ["Wild Boar"],
            "Vole Vanguard": ["Rogue Cat"],
            "Mouse Militia": ["Toxic Toad"],
            "Hamster Horde": ["Scavenger Bird"]
        };

        const types = enemyTypes[faction] || ["Feral Dog"];

        // Get average level of cats in the dungeon
        const avgCatLevel = this.selectedCats.length > 0 ?
            Math.ceil(this.selectedCats.reduce((sum, cat) => sum + cat.level, 0) / this.selectedCats.length) : 1;

        for (let i = 0; i < count; i++) {
            const enemyType = types[Math.floor(Math.random() * types.length)];
            // Use the existing enemy generator from enemyManager
            const enemy = enemyManager.generateRandomEnemy(avgCatLevel, enemyType);
            enemy.faction = faction;
            enemies.push(enemy);
        }

        return enemies;
    }

    // Generate loot
    generateLoot(theme, count) {
        const loot = [];
        for (let i = 0; i < count; i++) {
            const item = theme.lootTable[Math.floor(Math.random() * theme.lootTable.length)];
            loot.push({...item});
        }
        return loot;
    }

    // Select cats for the dungeon
    selectCatsForDungeon(cats) {
        this.selectedCats = cats;
    }

    // Enter the dungeon with selected cats
    enterDungeon() {
        if (!this.currentDungeon) {
            this.generateDungeon();
        }

        if (this.selectedCats.length === 0) {
            return { success: false, message: "You need to select at least one cat for the dungeon!" };
        }

        return {
            success: true,
            dungeon: this.currentDungeon,
            currentRoom: this.currentDungeon.rooms[this.currentRoom],
            cats: this.selectedCats
        };
    }

    // Move to the next room
    nextRoom() {
        if (!this.currentDungeon || this.dungeonCompleted) {
            return { success: false, message: "No active dungeon or dungeon already completed." };
        }

        this.currentRoom++;

        if (this.currentRoom >= this.currentDungeon.rooms.length) {
            this.dungeonCompleted = true;
            return {
                success: true,
                completed: true,
                message: `You have completed ${this.currentDungeon.name}!`,
                loot: this.lootCollected
            };
        }

        return {
            success: true,
            dungeon: this.currentDungeon,
            currentRoom: this.currentDungeon.rooms[this.currentRoom],
            cats: this.selectedCats
        };
    }

    // Process a battle in the current room
    processBattle() {
        if (!this.currentDungeon || this.dungeonCompleted) {
            return { success: false, message: "No active dungeon or dungeon already completed." };
        }

        const room = this.currentDungeon.rooms[this.currentRoom];

        // Get the battle group for our selected cats
        const battleGroup = {
            id: 'dungeon-battle-group',
            name: 'Dungeon Expedition',
            type: 'Battle',
            catIds: this.selectedCats.map(cat => cat.id)
        };

        // Calculate group stats using the group manager's method
        const groupStats = groupManager.calculateGroupStats(battleGroup);

        // Calculate enemy group strength
        const enemyStrength = room.enemies.reduce((total, enemy) => {
            return total + (enemy.level * 5) +
                   (enemy.stats.STR || 0) +
                   (enemy.stats.VIT || 0) +
                   (enemy.attributes?.physicalAttack || 0);
        }, 0);

        // Calculate player group strength
        const playerStrength = (groupStats?.str || 0) +
                              (groupStats?.con || 0) +
                              (groupStats?.physAttack || 0) +
                              (this.selectedCats.length * 10); // Bonus for each cat

        // Add some randomness to the battle outcome
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2 multiplier
        const adjustedPlayerStrength = playerStrength * randomFactor;

        // Determine victory based on strength comparison
        const victory = adjustedPlayerStrength >= enemyStrength;

        // Prepare result
        const result = {
            success: true,
            victory: victory,
            casualties: [],
            loot: [],
            playerStrength: playerStrength,
            enemyStrength: enemyStrength,
            randomFactor: randomFactor
        };

        if (result.victory) {
            // Mark room as completed
            room.completed = true;

            // Add loot
            result.loot = room.loot;
            this.lootCollected = this.lootCollected.concat(room.loot);

            // Add XP to cats
            this.selectedCats.forEach(cat => {
                const xpGained = 10 + (room.isBossRoom ? 50 : 20) + Math.floor(Math.random() * 10);
                catManager.addXP(cat.id, xpGained);
            });

            // Check if this was the boss room
            if (room.isBossRoom) {
                this.dungeonCompleted = true;
                result.dungeonCompleted = true;
            }
        } else {
            // Apply damage to cats on defeat
            this.selectedCats.forEach(cat => {
                // Reduce health by 20-40%
                const damageFactor = 0.2 + (Math.random() * 0.2);
                const damage = Math.floor(cat.attributes.maxHealth * damageFactor);
                cat.health = Math.max(1, cat.health - damage); // Never go below 1 health

                // Add to casualties list if health is critical
                if (cat.health < cat.attributes.maxHealth * 0.3) {
                    result.casualties.push({
                        id: cat.id,
                        name: cat.name,
                        health: cat.health,
                        maxHealth: cat.attributes.maxHealth
                    });
                }
            });
        }

        return result;
    }

    // Apply stat check based on room's environmental modifier
    applyStatCheck(cat, modifier) {
        if (!modifier) return { success: true, message: "No modifier to check against." };

        const stat = modifier.affectedStat;
        const statValue = cat.stats[stat] || 0;
        const difficulty = 5 + this.currentRoom; // Difficulty increases with dungeon depth

        return {
            success: statValue >= difficulty,
            stat: stat,
            value: statValue,
            difficulty: difficulty,
            message: statValue >= difficulty ?
                `${cat.name} successfully navigates the ${modifier.name.toLowerCase()}.` :
                `${cat.name} struggles with the ${modifier.name.toLowerCase()}, suffering a temporary penalty.`
        };
    }

    // Render the dungeon UI
    renderDungeonUI(container) {
        if (!this.currentDungeon) {
            container.innerHTML = `
                <div class="dungeon-intro">
                    <h3>Whiskerhold Depths</h3>
                    <p>Prepare your cats for a dangerous expedition into the ancient underground realm of Whiskerhold Depths!</p>
                    <button id="prepare-dungeon" class="dungeon-button">Prepare Expedition</button>
                </div>
            `;
            return;
        }

        const room = this.currentDungeon.rooms[this.currentRoom];

        let html = `
            <div class="dungeon-room">
                <h3>${room.name}</h3>
                <p class="room-description">${room.description}</p>

                <div class="expedition-team">
                    <h4>Your Expedition Team</h4>
                    <div class="expedition-cats">
                        ${this.selectedCats.map(cat => `
                            <div class="expedition-cat" data-cat-id="${cat.id}">
                                <div class="expedition-cat-avatar">
                                    ${groupManager.renderCatAvatar(cat)}
                                </div>
                                <div class="expedition-cat-health-container">
                                    <div class="expedition-cat-health-bar-container">
                                        <div class="expedition-cat-health-bar" style="width: ${(cat.health / cat.attributes.maxHealth) * 100}%"></div>
                                    </div>
                                </div>
                                <div class="expedition-cat-tooltip">
                                    <div class="tooltip-header">
                                        <span class="tooltip-name">${cat.name}</span>
                                        <span class="tooltip-level">Level ${cat.level} ${cat.type || ''}</span>
                                    </div>
                                    <div class="tooltip-health">
                                        <span>HP: ${cat.health}/${cat.attributes.maxHealth}</span>
                                    </div>
                                    <div class="tooltip-stats">
                                        <div class="tooltip-stat"><span>STR:</span> ${cat.stats.STR}</div>
                                        <div class="tooltip-stat"><span>DEX:</span> ${cat.stats.DEX}</div>
                                        <div class="tooltip-stat"><span>AGI:</span> ${cat.stats.AGI}</div>
                                        <div class="tooltip-stat"><span>VIT:</span> ${cat.stats.VIT}</div>
                                        <div class="tooltip-stat"><span>WIL:</span> ${cat.stats.WIL}</div>
                                        <div class="tooltip-stat"><span>INT:</span> ${cat.stats.INT}</div>
                                        <div class="tooltip-stat"><span>CHA:</span> ${cat.stats.CHA}</div>
                                        <div class="tooltip-stat"><span>PER:</span> ${cat.stats.PER}</div>
                                        <div class="tooltip-stat"><span>LCK:</span> ${cat.stats.LCK}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="environment-modifier">
                    ${room.environmentModifier ?
                        `<p><strong>Environmental Challenge:</strong> ${room.environmentModifier.name} (Affects ${room.environmentModifier.affectedStat})</p>` :
                        '<p><strong>Boss Chamber:</strong> No environmental modifiers, but the boss presents its own challenges!</p>'}
                </div>

                <div class="enemy-group">
                    <h4>${room.isBossRoom ? 'Boss' : 'Enemies'}</h4>
                    <ul class="enemy-list">
                        ${room.enemies.map(enemy => `
                            <li class="enemy-item">
                                <span class="enemy-name">${enemy.name}</span>
                                ${!room.isBossRoom ? `<span class="enemy-faction">${enemy.faction}</span>` : ''}
                                <span class="enemy-level">Level ${enemy.level}</span>
                                ${room.isBossRoom ? `
                                    <div class="boss-abilities">
                                        <p>Phase ${enemy.currentPhase} of ${enemy.phases}</p>
                                        <p>Abilities: ${enemy.abilities.join(', ')}</p>
                                    </div>
                                ` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="dungeon-actions">
                    <button id="battle-button" class="dungeon-button">Engage in Battle</button>
                    ${room.completed ? `<button id="next-room-button" class="dungeon-button">Continue Deeper</button>` : ''}
                    <button id="retreat-button" class="dungeon-button retreat">Retreat</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Render the cat selection UI for dungeon
    renderCatSelectionUI(container, availableCats) {
        // Get battle groups from the group manager
        const battleGroups = groupManager.groups.filter(group => group.type === 'Battle');

        let html = `
            <div class="dungeon-cat-selection">
                <h3>Select Cats for the Expedition</h3>
                <p>Choose 1-6 cats to venture into Whiskerhold Depths. Each cat's stats will be crucial for different challenges.</p>

                ${battleGroups.length > 0 ? `
                    <div class="dungeon-battle-groups">
                        <h4>Battle Groups</h4>
                        <p>Select a battle group to quickly add those cats to your expedition.</p>
                        <div class="battle-groups-list">
                            ${battleGroups.map(group => {
                                const groupCats = groupManager.getGroupCats(group.id);
                                return `
                                    <div class="battle-group-item" data-group-id="${group.id}">
                                        <div class="battle-group-name">${group.name}</div>
                                        <div class="battle-group-cats">${groupCats.length} cats</div>
                                        <button class="select-group-button">Select Group</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="cat-selection-list">
                    ${availableCats.map(cat => `
                        <div class="cat-selection-item" data-cat-id="${cat.id}">
                            <div class="cat-selection-name">${cat.name}</div>
                            <div class="cat-selection-level">Level ${cat.level} ${cat.type || ''}</div>
                            <div class="cat-selection-stats">
                                <span title="Paw Power">STR: ${cat.stats.STR}</span>
                                <span title="Whisker Dexterity">DEX: ${cat.stats.DEX}</span>
                                <span title="Tail Balance">AGI: ${cat.stats.AGI}</span>
                                <span title="Clawstitution">VIT: ${cat.stats.VIT}</span>
                                <span title="Fur-titude">WIL: ${cat.stats.WIL}</span>
                                <span title="Meowmental">INT: ${cat.stats.INT}</span>
                                <span title="Charm">CHA: ${cat.stats.CHA}</span>
                                <span title="Purrception">PER: ${cat.stats.PER}</span>
                                <span title="Luck">LCK: ${cat.stats.LCK}</span>
                            </div>
                            <button class="select-cat-button">Select</button>
                        </div>
                    `).join('')}
                </div>

                <div class="selected-cats-container">
                    <h4>Selected Cats: <span id="selected-count">0</span>/6</h4>
                    <div id="selected-cats-list" class="selected-cats-list"></div>
                </div>

                <div class="dungeon-actions">
                    <button id="start-dungeon" class="dungeon-button" disabled>Enter Whiskerhold Depths</button>
                    <button id="cancel-dungeon" class="dungeon-button retreat">Cancel</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Render battle results
    renderBattleResults(container, result) {
        let html = `
            <div class="battle-results">
                <h3>${result.victory ? 'Victory!' : 'Defeat!'}</h3>

                <div class="battle-summary">
                    <div class="battle-strength">
                        <div class="player-strength">
                            <h4>Your Team</h4>
                            <div class="strength-value">${result.playerStrength || 0}</div>
                            <div class="strength-factor">Luck Factor: ${Math.round((result.randomFactor || 1) * 100)}%</div>
                        </div>
                        <div class="vs-indicator">VS</div>
                        <div class="enemy-strength">
                            <h4>Enemy Team</h4>
                            <div class="strength-value">${result.enemyStrength || 0}</div>
                        </div>
                    </div>
                </div>

                ${result.victory ? `
                    <p>Your cats have defeated the enemies and can proceed deeper into the dungeon.</p>

                    ${this.selectedCats.length > 0 ? `
                        <div class="xp-gained">
                            <h4>Experience Gained</h4>
                            <ul class="cat-xp-list">
                                ${this.selectedCats.map(cat => `
                                    <li class="cat-xp-item">
                                        <span class="cat-name">${cat.name}</span>
                                        <span class="xp-amount">+${10 + (this.currentDungeon.rooms[this.currentRoom].isBossRoom ? 50 : 20) + Math.floor(Math.random() * 10)} XP</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${result.loot.length > 0 ? `
                        <div class="loot-container">
                            <h4>Loot Acquired:</h4>
                            <ul class="loot-list">
                                ${result.loot.map(item => `
                                    <li class="loot-item">
                                        <span class="loot-name">${item.name}</span>
                                        <span class="loot-bonus">+1 ${item.statBonus}</span>
                                        <p class="loot-description">${item.description}</p>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    ${result.dungeonCompleted ? `
                        <div class="dungeon-completed">
                            <h4>Dungeon Completed!</h4>
                            <p>Congratulations! You have conquered Whiskerhold Depths and defeated the final boss!</p>
                        </div>
                    ` : ''}
                ` : `
                    <p>Your cats have been defeated and must retreat from the dungeon to recover.</p>

                    ${result.casualties.length > 0 ? `
                        <div class="casualties-container">
                            <h4>Injured Cats:</h4>
                            <ul class="casualties-list">
                                ${result.casualties.map(cat => `
                                    <li class="casualty-item">
                                        <span class="cat-name">${cat.name}</span>
                                        <div class="cat-health-container">
                                            <div class="cat-health-bar-container">
                                                <div class="cat-health-bar" style="width: ${(cat.health / cat.maxHealth) * 100}%"></div>
                                            </div>
                                            <span class="cat-health-value">${cat.health}/${cat.maxHealth} HP</span>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                `}

                <div class="battle-actions">
                    ${result.victory ?
                        (result.dungeonCompleted ?
                            `<button id="complete-dungeon" class="dungeon-button">Return to Colony</button>` :
                            `<button id="next-room-button" class="dungeon-button">Continue Deeper</button>`) :
                        `<button id="retreat-dungeon" class="dungeon-button retreat">Retreat</button>`
                    }
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

// Create global dungeon manager
const dungeonManager = new DungeonManager();

// Initialize dungeon system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Use the existing dungeons section
    const dungeonContainer = document.getElementById('dungeon-container');
    if (dungeonContainer) {
        dungeonManager.renderDungeonUI(dungeonContainer);
    }

    // Add event listeners for dungeon buttons
    document.addEventListener('click', (event) => {
        // Prepare dungeon button
        if (event.target.id === 'prepare-dungeon') {
            const dungeonContainer = document.getElementById('dungeon-container');
            if (dungeonContainer && catManager && catManager.cats) {
                dungeonManager.renderCatSelectionUI(dungeonContainer, catManager.cats);
            }
        }

        // Select cat button
        if (event.target.classList.contains('select-cat-button')) {
            const catItem = event.target.closest('.cat-selection-item');
            if (catItem) {
                const catId = parseInt(catItem.getAttribute('data-cat-id'));
                const selectedCatsList = document.getElementById('selected-cats-list');
                const selectedCount = document.getElementById('selected-count');

                if (catItem.classList.contains('selected')) {
                    // Deselect cat
                    catItem.classList.remove('selected');
                    const selectedCatItem = document.querySelector(`.selected-cat-item[data-cat-id="${catId}"]`);
                    if (selectedCatItem) {
                        selectedCatItem.remove();
                    }
                } else {
                    // Check if we already have 6 cats
                    const currentSelected = document.querySelectorAll('.cat-selection-item.selected').length;
                    if (currentSelected >= 6) {
                        alert('You can only select up to 6 cats for the dungeon!');
                        return;
                    }

                    // Select cat
                    catItem.classList.add('selected');

                    // Find the cat data
                    const cat = catManager.cats.find(c => c.id === catId);
                    if (cat && selectedCatsList) {
                        const catElement = document.createElement('div');
                        catElement.className = 'selected-cat-item';
                        catElement.setAttribute('data-cat-id', catId);
                        catElement.innerHTML = `
                            <div class="selected-cat-avatar">
                                ${groupManager.renderCatAvatar(cat)}
                            </div>
                            <div class="selected-cat-info">
                                <span class="selected-cat-name">${cat.name}</span>
                                <span class="selected-cat-level">Level ${cat.level}</span>
                            </div>
                            <div class="selected-cat-health-container">
                                <div class="selected-cat-health-bar-container">
                                    <div class="selected-cat-health-bar" style="width: ${(cat.health / cat.attributes.maxHealth) * 100}%"></div>
                                </div>
                            </div>
                            <button class="remove-cat-button">✕</button>
                        `;
                        selectedCatsList.appendChild(catElement);
                    }
                }

                // Update selected count
                if (selectedCount) {
                    const currentSelected = document.querySelectorAll('.cat-selection-item.selected').length;
                    selectedCount.textContent = currentSelected;

                    // Enable/disable start button
                    const startButton = document.getElementById('start-dungeon');
                    if (startButton) {
                        startButton.disabled = currentSelected === 0;
                    }
                }
            }
        }

        // Select battle group button
        if (event.target.classList.contains('select-group-button')) {
            const groupItem = event.target.closest('.battle-group-item');
            if (groupItem) {
                const groupId = parseInt(groupItem.getAttribute('data-group-id'));
                const selectedCatsList = document.getElementById('selected-cats-list');
                const selectedCount = document.getElementById('selected-count');

                // Get cats from this group
                const groupCats = groupManager.getGroupCats(groupId);

                // Check if adding these cats would exceed the limit
                const currentSelected = document.querySelectorAll('.cat-selection-item.selected').length;
                const totalAfterAdding = currentSelected + groupCats.filter(cat =>
                    !document.querySelector(`.cat-selection-item.selected[data-cat-id="${cat.id}"]`)
                ).length;

                if (totalAfterAdding > 6) {
                    alert(`Adding this group would exceed the maximum of 6 cats. Please select cats individually or use a smaller group.`);
                    return;
                }

                // Select all cats from this group
                groupCats.forEach(cat => {
                    const catItem = document.querySelector(`.cat-selection-item[data-cat-id="${cat.id}"]`);
                    if (catItem && !catItem.classList.contains('selected')) {
                        // Select cat
                        catItem.classList.add('selected');

                        // Add to selected list
                        if (selectedCatsList) {
                            const catElement = document.createElement('div');
                            catElement.className = 'selected-cat-item';
                            catElement.setAttribute('data-cat-id', cat.id);
                            catElement.innerHTML = `
                                <div class="selected-cat-avatar">
                                    ${groupManager.renderCatAvatar(cat)}
                                </div>
                                <div class="selected-cat-info">
                                    <span class="selected-cat-name">${cat.name}</span>
                                    <span class="selected-cat-level">Level ${cat.level}</span>
                                </div>
                                <div class="selected-cat-health-container">
                                    <div class="selected-cat-health-bar-container">
                                        <div class="selected-cat-health-bar" style="width: ${(cat.health / cat.attributes.maxHealth) * 100}%"></div>
                                    </div>
                                </div>
                                <button class="remove-cat-button">✕</button>
                            `;
                            selectedCatsList.appendChild(catElement);
                        }
                    }
                });

                // Update selected count
                if (selectedCount) {
                    const updatedSelected = document.querySelectorAll('.cat-selection-item.selected').length;
                    selectedCount.textContent = updatedSelected;

                    // Enable/disable start button
                    const startButton = document.getElementById('start-dungeon');
                    if (startButton) {
                        startButton.disabled = updatedSelected === 0;
                    }
                }

                // Show confirmation message
                gameManager.addMessage(`Selected cats from the ${groupManager.getGroup(groupId).name} battle group.`);
            }
        }

        // Remove selected cat
        if (event.target.classList.contains('remove-cat-button')) {
            const selectedCatItem = event.target.closest('.selected-cat-item');
            if (selectedCatItem) {
                const catId = parseInt(selectedCatItem.getAttribute('data-cat-id'));
                const catSelectionItem = document.querySelector(`.cat-selection-item[data-cat-id="${catId}"]`);

                if (catSelectionItem) {
                    catSelectionItem.classList.remove('selected');
                }

                selectedCatItem.remove();

                // Update selected count
                const selectedCount = document.getElementById('selected-count');
                if (selectedCount) {
                    const currentSelected = document.querySelectorAll('.cat-selection-item.selected').length;
                    selectedCount.textContent = currentSelected;

                    // Enable/disable start button
                    const startButton = document.getElementById('start-dungeon');
                    if (startButton) {
                        startButton.disabled = currentSelected === 0;
                    }
                }
            }
        }

        // Start dungeon button
        if (event.target.id === 'start-dungeon') {
            const selectedCats = [];
            const selectedCatItems = document.querySelectorAll('.cat-selection-item.selected');

            selectedCatItems.forEach(item => {
                const catId = parseInt(item.getAttribute('data-cat-id'));
                const cat = catManager.cats.find(c => c.id === catId);
                if (cat) {
                    selectedCats.push(cat);
                }
            });

            if (selectedCats.length > 0) {
                dungeonManager.selectCatsForDungeon(selectedCats);
                const result = dungeonManager.enterDungeon();

                if (result.success) {
                    const dungeonContainer = document.getElementById('dungeon-container');
                    if (dungeonContainer) {
                        dungeonManager.renderDungeonUI(dungeonContainer);
                    }
                } else {
                    alert(result.message);
                }
            }
        }

        // Cancel dungeon button
        if (event.target.id === 'cancel-dungeon') {
            const dungeonContainer = document.getElementById('dungeon-container');
            if (dungeonContainer) {
                dungeonManager.renderDungeonUI(dungeonContainer);
            }
        }

        // Battle button
        if (event.target.id === 'battle-button') {
            const result = dungeonManager.processBattle();

            if (result.success) {
                const dungeonContainer = document.getElementById('dungeon-container');
                if (dungeonContainer) {
                    dungeonManager.renderBattleResults(dungeonContainer, result);
                }
            }
        }

        // Next room button
        if (event.target.id === 'next-room-button') {
            const result = dungeonManager.nextRoom();

            if (result.success) {
                const dungeonContainer = document.getElementById('dungeon-container');
                if (dungeonContainer) {
                    if (result.completed) {
                        // Dungeon completed
                        dungeonManager.renderBattleResults(dungeonContainer, {
                            victory: true,
                            dungeonCompleted: true,
                            loot: dungeonManager.lootCollected
                        });
                    } else {
                        dungeonManager.renderDungeonUI(dungeonContainer);
                    }
                }
            } else {
                alert(result.message);
            }
        }

        // Complete dungeon button
        if (event.target.id === 'complete-dungeon') {
            const dungeonContainer = document.getElementById('dungeon-container');
            if (dungeonContainer) {
                // Reset dungeon state
                dungeonManager.currentDungeon = null;
                dungeonManager.currentRoom = 0;
                dungeonManager.selectedCats = [];
                dungeonManager.dungeonCompleted = false;
                dungeonManager.lootCollected = [];

                // Show initial dungeon UI
                dungeonManager.renderDungeonUI(dungeonContainer);

                // Add XP to cats that participated
                if (catManager) {
                    dungeonManager.selectedCats.forEach(cat => {
                        const xpGained = 50 + Math.floor(Math.random() * 50); // 50-100 XP
                        catManager.addXP(cat.id, xpGained);
                    });
                }

                // Show message
                gameManager.addMessage("Your cats have returned from Whiskerhold Depths with treasures and experience!");
            }
        }

        // Retreat button
        if (event.target.id === 'retreat-button' || event.target.id === 'retreat-dungeon') {
            const dungeonContainer = document.getElementById('dungeon-container');
            if (dungeonContainer) {
                // Reset dungeon state
                dungeonManager.currentDungeon = null;
                dungeonManager.currentRoom = 0;
                dungeonManager.selectedCats = [];
                dungeonManager.dungeonCompleted = false;
                dungeonManager.lootCollected = [];

                // Show initial dungeon UI
                dungeonManager.renderDungeonUI(dungeonContainer);

                // Show message
                gameManager.addMessage("Your cats have retreated from Whiskerhold Depths to fight another day.");
            }
        }
    });
});
