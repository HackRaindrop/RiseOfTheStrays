// Utility functions for Rise of the Strays
const Utils = {
    // Random generation utilities
    random: {
        // Get a random item from an array
        fromArray: (array) => array[Math.floor(Math.random() * array.length)],
        
        // Get a random color in hex format
        color: () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        
        // Get a weighted random element from an array
        weighted: (array, weights) => {
            // Make sure arrays are the same length
            if (array.length !== weights.length) {
                console.error('Array and weights must be the same length');
                return array[0];
            }

            // Calculate the sum of all weights
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

            // Get a random value between 0 and the total weight
            const randomValue = Math.random() * totalWeight;

            // Find the item that corresponds to the random value
            let weightSum = 0;
            for (let i = 0; i < array.length; i++) {
                weightSum += weights[i];
                if (randomValue <= weightSum) {
                    return array[i];
                }
            }

            // Fallback to the last item
            return array[array.length - 1];
        },
        
        // Get a random integer between min and max (inclusive)
        int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    },
    
    // DOM utilities
    dom: {
        // Set a select option by value
        setSelectOption: (selectId, value) => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === value) {
                    select.selectedIndex = i;
                    break;
                }
            }
        },
        
        // Create and show a modal
        createModal: (id, content, onClose) => {
            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = id;
            modalContainer.className = 'modal';
            modalContainer.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    ${content}
                </div>
            `;
            
            // Add the modal to the page
            document.body.appendChild(modalContainer);
            
            // Add event listener to the close button
            modalContainer.querySelector('.close-modal').addEventListener('click', () => {
                if (onClose) onClose();
                Utils.dom.closeModal(modalContainer);
            });
            
            // Add animation class after a small delay to trigger the animation
            setTimeout(() => {
                modalContainer.querySelector('.modal-content').classList.add('show');
            }, 10);
            
            return modalContainer;
        },
        
        // Close a modal with animation
        closeModal: (modalContainer) => {
            // Add the hide animation class
            const modalContent = modalContainer.querySelector('.modal-content');
            modalContent.classList.remove('show');
            modalContent.classList.add('hide');
            
            // Remove the modal after animation completes
            setTimeout(() => {
                modalContainer.remove();
            }, 300); // Match this with the CSS animation duration
        }
    },
    
    // String utilities
    string: {
        // Capitalize the first letter of a string
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1)
    },
    
    // Animation utilities
    animation: {
        // Add a pulse animation to an element
        pulse: (element) => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'pulse 0.5s';
            }, 10);
        }
    },
    
    // Generate a unique ID
    generateUniqueId: (prefix = '') => `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`
};
