// Post-Apocalyptic Visual Effects

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add data-room-type attributes to bunker rooms for CSS targeting
    function addRoomTypeAttributes() {
        // Get all bunker rooms
        const bunkerRooms = document.querySelectorAll('.bunker-room');
        
        // Loop through each room and add the data attribute based on the room name
        bunkerRooms.forEach(room => {
            const roomName = room.querySelector('.room-name')?.textContent || 
                            room.getAttribute('data-original-type') || 
                            'Unknown';
            
            room.setAttribute('data-room-type', roomName);
        });
    }
    
    // Add a subtle dust particle effect to the game container
    function addDustParticles() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        // Create a container for the dust particles
        const dustContainer = document.createElement('div');
        dustContainer.className = 'dust-container';
        dustContainer.style.position = 'absolute';
        dustContainer.style.top = '0';
        dustContainer.style.left = '0';
        dustContainer.style.width = '100%';
        dustContainer.style.height = '100%';
        dustContainer.style.pointerEvents = 'none';
        dustContainer.style.overflow = 'hidden';
        dustContainer.style.zIndex = '2';
        
        // Add the dust container to the game container
        gameContainer.appendChild(dustContainer);
        
        // Create dust particles
        for (let i = 0; i < 15; i++) {
            createDustParticle(dustContainer);
        }
    }
    
    // Create a single dust particle
    function createDustParticle(container) {
        const particle = document.createElement('div');
        
        // Set random size (small)
        const size = Math.random() * 3 + 1;
        
        // Set random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Set random opacity
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Set random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Style the particle
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = 'rgba(255, 255, 255, ' + opacity + ')';
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `float ${duration}s infinite linear`;
        
        // Add the particle to the container
        container.appendChild(particle);
        
        // Add the float animation if it doesn't exist
        if (!document.getElementById('dust-animation')) {
            const style = document.createElement('style');
            style.id = 'dust-animation';
            style.textContent = `
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: ${opacity};
                    }
                    25% {
                        transform: translateY(-${Math.random() * 30 + 10}px) translateX(${Math.random() * 20 - 10}px);
                        opacity: ${opacity * 0.8};
                    }
                    50% {
                        transform: translateY(-${Math.random() * 50 + 20}px) translateX(${Math.random() * 30 - 15}px);
                        opacity: ${opacity * 0.6};
                    }
                    75% {
                        transform: translateY(-${Math.random() * 70 + 30}px) translateX(${Math.random() * 40 - 20}px);
                        opacity: ${opacity * 0.4};
                    }
                    100% {
                        transform: translateY(-${Math.random() * 100 + 50}px) translateX(${Math.random() * 50 - 25}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove and recreate the particle after its animation ends
        setTimeout(() => {
            particle.remove();
            createDustParticle(container);
        }, duration * 1000);
    }
    
    // Run the functions
    addRoomTypeAttributes();
    addDustParticles();
    
    // Re-run the room type attributes function whenever the DOM changes
    // This helps ensure rooms created dynamically get the proper attributes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                addRoomTypeAttributes();
            }
        });
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });
});
