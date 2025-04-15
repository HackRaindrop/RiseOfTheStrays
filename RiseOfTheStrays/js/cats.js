// Cat management system
class CatManager {
    constructor() {
        this.cats = [];
        this.catNames = [
            'Whiskers', 'Shadow', 'Luna', 'Oreo', 'Mittens', 'Tiger', 'Smokey', 'Felix',
            'Simba', 'Cleo', 'Milo', 'Bella', 'Charlie', 'Lucy', 'Max', 'Daisy', 'Oliver',
            'Lily', 'Leo', 'Lola', 'Rocky', 'Misty', 'Oscar', 'Molly', 'Jasper', 'Nala'
        ];
        
        this.catTypes = ['Scavenger', 'Hunter', 'Guardian', 'Medic'];
        
        // Add starter cat
        this.addCat('Mittens', 'Scavenger', 1);
        
        this.updateDisplay();
    }
    
    // Generate a random cat
    generateRandomCat() {
        const randomName = this.catNames[Math.floor(Math.random() * this.catNames.length)];
        const randomType = this.catTypes[Math.floor(Math.random() * this.catTypes.length)];
        const level = 1;
        
        return { name: randomName, type: randomType, level: level };
    }
    
    // Add a new cat to the colony
    addCat(name, type, level) {
        const cat = {
            id: Date.now(), // Use timestamp as unique ID
            name: name,
            type: type,
            level: level,
            happiness: 100,
            health: 100
        };
        
        this.cats.push(cat);
        this.updateDisplay();
        return cat;
    }
    
    // Find a new stray cat
    findCat() {
        // Check if we have enough food to search for cats
        if (resourceManager.useResource('food', 5)) {
            // 70% chance to find a cat
            if (Math.random() < 0.7) {
                const newCat = this.generateRandomCat();
                const cat = this.addCat(newCat.name, newCat.type, newCat.level);
                gameManager.addMessage(`You found a new cat named ${cat.name}! They are a level ${cat.level} ${cat.type}.`);
                return cat;
            } else {
                gameManager.addMessage("You searched but couldn't find any cats this time.");
                return null;
            }
        } else {
            gameManager.addMessage("Not enough food to search for cats!");
            return null;
        }
    }
    
    // Get total number of cats
    getCatCount() {
        return this.cats.length;
    }
    
    // Update the UI with current cats
    updateDisplay() {
        const catsContainer = document.getElementById('cats-container');
        const catsCountElement = document.getElementById('cats-value');
        
        // Update cat count
        catsCountElement.textContent = this.getCatCount();
        
        // Clear current display
        catsContainer.innerHTML = '';
        
        // Add each cat to the display
        this.cats.forEach(cat => {
            const catElement = document.createElement('div');
            catElement.className = 'cat-card';
            catElement.innerHTML = `
                <div class="cat-name">${cat.name}</div>
                <div class="cat-type">${cat.type} (Lvl ${cat.level})</div>
                <div class="cat-stats">
                    <div>Health: ${cat.health}</div>
                    <div>Happiness: ${cat.happiness}</div>
                </div>
            `;
            catsContainer.appendChild(catElement);
        });
    }
}

// Create global cat manager
const catManager = new CatManager();
