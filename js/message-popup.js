// Message Popup System for Rise of the Strays
// Replaces the standard message log with interactive popups for important information

class MessagePopup {
    constructor() {
        this.container = null;
        this.popup = null;
        this.title = null;
        this.content = null;
        this.footer = null;
        this.closeButton = null;
        this.actionButton = null;
        this.isActive = false;
        this.messageQueue = [];
        this.isProcessingQueue = false;
        
        // Create the popup elements
        this.createPopupElements();
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    // Create all the necessary DOM elements for the popup
    createPopupElements() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'message-popup-container';
        
        // Create popup
        this.popup = document.createElement('div');
        this.popup.className = 'message-popup';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'message-popup-header';
        
        this.title = document.createElement('h3');
        this.title.className = 'message-popup-title';
        
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'message-popup-close';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.setAttribute('aria-label', 'Close');
        
        header.appendChild(this.title);
        header.appendChild(this.closeButton);
        
        // Create content
        this.content = document.createElement('div');
        this.content.className = 'message-popup-content';
        
        // Create footer
        this.footer = document.createElement('div');
        this.footer.className = 'message-popup-footer';
        
        this.actionButton = document.createElement('button');
        this.actionButton.className = 'message-popup-button primary';
        this.actionButton.textContent = 'OK';
        
        this.footer.appendChild(this.actionButton);
        
        // Assemble popup
        this.popup.appendChild(header);
        this.popup.appendChild(this.content);
        this.popup.appendChild(this.footer);
        
        // Add popup to container
        this.container.appendChild(this.popup);
        
        // Add container to body
        document.body.appendChild(this.container);
    }
    
    // Initialize event listeners
    initEventListeners() {
        // Close button click
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });
        
        // Action button click
        this.actionButton.addEventListener('click', () => {
            this.hide();
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.hide();
            }
        });
        
        // Close on click outside
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });
    }
    
    // Show the popup with the given message
    show(options = {}) {
        // If a popup is already active, queue this message
        if (this.isActive) {
            this.messageQueue.push(options);
            return;
        }
        
        const defaults = {
            title: 'Message',
            message: '',
            type: 'info', // info, success, warning, danger
            buttonText: 'OK',
            buttonClass: 'primary',
            callback: null,
            sound: true
        };
        
        const settings = { ...defaults, ...options };
        
        // Set popup content
        this.title.textContent = settings.title;
        this.content.innerHTML = settings.message;
        this.actionButton.textContent = settings.buttonText;
        
        // Remove any existing type classes
        this.popup.classList.remove('info', 'success', 'warning', 'danger');
        
        // Add the appropriate type class
        this.popup.classList.add(settings.type);
        
        // Set button class
        this.actionButton.className = `message-popup-button ${settings.buttonClass}`;
        
        // Set callback if provided
        if (settings.callback) {
            const oldCallback = this.actionButton.onclick;
            this.actionButton.onclick = (e) => {
                if (oldCallback) oldCallback(e);
                settings.callback();
                this.hide();
            };
        } else {
            this.actionButton.onclick = () => {
                this.hide();
            };
        }
        
        // Play sound if enabled
        if (settings.sound) {
            this.playSound(settings.type);
        }
        
        // Show the popup
        this.container.classList.add('active');
        this.isActive = true;
        
        // Add post-apocalyptic effect - slight screen shake for warnings and dangers
        if (settings.type === 'warning' || settings.type === 'danger') {
            this.shakeScreen(settings.type === 'danger' ? 'hard' : 'soft');
        }
        
        // Add a subtle radiation effect for important messages
        if (settings.type === 'warning' || settings.type === 'danger') {
            document.body.classList.add('radiation-effect');
            setTimeout(() => {
                document.body.classList.remove('radiation-effect');
            }, 2000);
        }
    }
    
    // Hide the popup
    hide() {
        this.container.classList.remove('active');
        this.isActive = false;
        
        // Process the next message in the queue if any
        setTimeout(() => {
            this.processQueue();
        }, 300);
    }
    
    // Process the message queue
    processQueue() {
        if (this.messageQueue.length > 0 && !this.isActive && !this.isProcessingQueue) {
            this.isProcessingQueue = true;
            const nextMessage = this.messageQueue.shift();
            setTimeout(() => {
                this.show(nextMessage);
                this.isProcessingQueue = false;
            }, 300);
        }
    }
    
    // Play a sound based on the message type
    playSound(type) {
        let sound;
        
        switch (type) {
            case 'success':
                sound = new Audio('sounds/success.mp3');
                break;
            case 'warning':
                sound = new Audio('sounds/warning.mp3');
                break;
            case 'danger':
                sound = new Audio('sounds/danger.mp3');
                break;
            case 'info':
            default:
                sound = new Audio('sounds/info.mp3');
                break;
        }
        
        // Only play if the sound file exists
        sound.onerror = () => {
            console.log('Sound file not found');
        };
        
        sound.play().catch(e => {
            console.log('Sound could not be played', e);
        });
    }
    
    // Add a screen shake effect
    shakeScreen(intensity = 'soft') {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        const shakeClass = intensity === 'hard' ? 'shake-hard' : 'shake-soft';
        gameContainer.classList.add(shakeClass);
        
        setTimeout(() => {
            gameContainer.classList.remove(shakeClass);
        }, 500);
    }
}

// Create a global instance of the MessagePopup
const messagePopup = new MessagePopup();

// Function to show a message popup
function showMessage(options) {
    messagePopup.show(options);
}

// Replace the standard addMessage function with one that uses popups for important messages
const originalAddMessage = window.addMessage || function() {};

window.addMessage = function(message, isImportant = false) {
    // If it's an important message, show it as a popup
    if (isImportant) {
        showMessage({
            title: 'Important Message',
            message: message,
            type: 'warning'
        });
    } else {
        // Otherwise, use the original message system
        originalAddMessage(message);
    }
};

// Add CSS for screen shake animations
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake-soft {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
        }
        
        @keyframes shake-hard {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .shake-soft {
            animation: shake-soft 0.5s ease;
        }
        
        .shake-hard {
            animation: shake-hard 0.5s ease;
        }
        
        .radiation-effect {
            position: relative;
        }
        
        .radiation-effect::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1), transparent 70%);
            pointer-events: none;
            z-index: 9998;
            animation: radiation-pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
})();

// Example usage:
// showMessage({
//     title: 'Resource Depleted',
//     message: 'Your food supplies are running low! Send cats to scavenge for more food.',
//     type: 'danger',
//     buttonText: 'Send Cats',
//     callback: function() {
//         // Code to open the cat assignment screen
//         console.log('Opening cat assignment screen');
//     }
// });
