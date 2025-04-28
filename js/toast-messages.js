// Toast Message System for Rise of the Strays
// Replaces the standard message log with unobtrusive toast notifications

class ToastMessages {
    constructor() {
        this.container = null;
        this.messageQueue = [];
        this.isProcessingQueue = false;
        this.defaultDuration = 5000; // Default duration in milliseconds
        this.maxToasts = 3; // Maximum number of toasts visible at once
        this.activeToasts = 0;
        
        // Create the toast container
        this.createContainer();
    }
    
    // Create the container for toast messages
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }
    
    // Show a toast message
    show(options = {}) {
        const defaults = {
            title: 'Message',
            message: '',
            type: 'info', // info, success, warning, danger
            duration: this.defaultDuration, // Duration in milliseconds
            progress: true // Show progress bar
        };
        
        const settings = { ...defaults, ...options };
        
        // Add to queue
        this.messageQueue.push(settings);
        
        // Process queue if not already processing
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }
    
    // Process the message queue
    processQueue() {
        if (this.messageQueue.length === 0 || this.activeToasts >= this.maxToasts) {
            this.isProcessingQueue = false;
            return;
        }
        
        this.isProcessingQueue = true;
        const settings = this.messageQueue.shift();
        this.createToast(settings);
        
        // Continue processing queue
        setTimeout(() => {
            this.processQueue();
        }, 300);
    }
    
    // Create a toast element
    createToast(settings) {
        // Increment active toasts count
        this.activeToasts++;
        
        // Create toast elements
        const toast = document.createElement('div');
        toast.className = `toast ${settings.type}`;
        
        // Create header
        const header = document.createElement('div');
        header.className = 'toast-header';
        
        const title = document.createElement('div');
        title.className = 'toast-title';
        title.textContent = settings.title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create content
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.innerHTML = settings.message;
        
        // Create progress bar if enabled
        let progressBar = null;
        if (settings.progress) {
            progressBar = document.createElement('div');
            progressBar.className = 'toast-progress';
        }
        
        // Assemble toast
        toast.appendChild(header);
        toast.appendChild(content);
        if (progressBar) {
            toast.appendChild(progressBar);
        }
        
        // Add to container
        this.container.appendChild(toast);
        
        // Set up event listeners
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });
        
        // Activate the toast (triggers animation)
        setTimeout(() => {
            toast.classList.add('active');
            
            // Animate progress bar if present
            if (progressBar) {
                progressBar.style.transition = `transform ${settings.duration}ms linear`;
                progressBar.style.transform = 'scaleX(1)';
            }
        }, 10);
        
        // Auto-dismiss after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, settings.duration);
    }
    
    // Remove a toast
    removeToast(toast) {
        if (toast.classList.contains('removing')) return;
        
        toast.classList.add('removing');
        toast.classList.remove('active');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
                
                // Decrement active toasts count
                this.activeToasts--;
                
                // Process next item in queue if any
                this.processQueue();
            }
        }, 300);
    }
    
    // Clear all toasts
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => {
            this.removeToast(toast);
        });
        
        // Clear the queue
        this.messageQueue = [];
    }
}

// Create a global instance of ToastMessages
const toastMessages = new ToastMessages();

// Function to show a toast message
function showToast(options) {
    toastMessages.show(options);
}

// Replace the standard addMessage function
window.addMessage = function(message, isImportant = false) {
    // Determine message type based on content or importance
    let type = 'info';
    
    if (isImportant) {
        type = 'warning';
    } else if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
        type = 'danger';
    } else if (message.toLowerCase().includes('success') || message.toLowerCase().includes('completed')) {
        type = 'success';
    }
    
    // Determine title based on message type
    let title = 'Message';
    switch (type) {
        case 'success':
            title = 'Success';
            break;
        case 'warning':
            title = 'Warning';
            break;
        case 'danger':
            title = 'Error';
            break;
    }
    
    // Show as toast
    showToast({
        title: title,
        message: message,
        type: type,
        duration: isImportant ? 8000 : 5000 // Important messages stay longer
    });
    
    // Log to console for debugging
    console.log(`[${type.toUpperCase()}] ${message}`);
};
