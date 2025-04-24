// Mobile Navigation System

class MobileNavigation {
    constructor() {
        this.activeTab = 'base-section'; // Default active tab
        this.initNavigation();
    }

    initNavigation = () => {
        // Set up event listeners for navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Check if we have a saved tab in localStorage
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab) {
            this.switchTab(savedTab);
        } else {
            // Otherwise show the default tab
            this.showTab(this.activeTab);
        }

        // Initial setup - hide all tabs except the active one
        this.updateTabVisibility();
    }

    switchTab = (tabId) => {
        // Don't do anything if this tab is already active
        if (tabId === this.activeTab) return;

        // Update active tab
        this.activeTab = tabId;

        // Save to localStorage for persistence
        localStorage.setItem('activeTab', tabId);

        // Update UI
        this.updateNavigation();
        this.updateTabVisibility();
    }

    updateNavigation = () => {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current tab's nav item
        const activeNavItem = document.querySelector(`.nav-item[data-tab="${this.activeTab}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    updateTabVisibility = () => {
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show active tab content
        this.showTab(this.activeTab);
    }

    showTab = (tabId) => {
        const tabElement = document.getElementById(tabId);
        if (tabElement) {
            tabElement.classList.add('active');
        }
    }
}

// Initialize mobile navigation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global mobile navigation manager
    window.mobileNavigation = new MobileNavigation();

    // Check if we're on a mobile device and adjust the UI accordingly
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }

    // Function to handle layout adjustments on resize
    const handleResize = () => {
        const isMobile = window.innerWidth < 768;

        // Update body class
        if (isMobile) {
            document.body.classList.add('mobile-device');
        } else {
            document.body.classList.remove('mobile-device');
        }

        // Update training section layout if it exists
        if (typeof trainingManager !== 'undefined') {
            trainingManager.updateDisplay();
        }

        // Update bunker layout if it exists
        if (typeof bunkerManager !== 'undefined') {
            bunkerManager.initializeUI();
        }
    };

    // Listen for resize events to update the UI
    window.addEventListener('resize', handleResize);

    // Initial call to set up layouts
    setTimeout(handleResize, 500);
});
