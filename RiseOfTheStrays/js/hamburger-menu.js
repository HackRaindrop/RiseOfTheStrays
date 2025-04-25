/**
 * Hamburger Menu JavaScript
 * This script handles the hamburger menu functionality for mobile screens
 */

class HamburgerMenu {
    constructor() {
        this.hamburgerToggle = null;
        this.hamburgerMenu = null;
        this.hamburgerMenuContent = null;
        this.hamburgerMenuItems = null;
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        // Create hamburger toggle button
        this.createHamburgerToggle();

        // Create hamburger menu
        this.createHamburgerMenu();

        // Set up event listeners
        this.setupEventListeners();

        // Check screen size on init
        this.checkScreenSize();

        // Add resize event listener to handle screen size changes
        window.addEventListener('resize', () => {
            this.checkScreenSize();
        });

        // Initial check to ensure proper state
        setTimeout(() => {
            this.checkScreenSize();
        }, 100);
    }

    createHamburgerToggle() {
        // Create the toggle button
        this.hamburgerToggle = document.createElement('div');
        this.hamburgerToggle.className = 'hamburger-toggle hamburger-menu-toggle';

        // Set initial styles based on screen width
        const isMobileSmall = window.innerWidth <= 425;
        this.hamburgerToggle.style.display = isMobileSmall ? 'flex' : 'none';
        this.hamburgerToggle.style.visibility = isMobileSmall ? 'visible' : 'hidden';
        this.hamburgerToggle.style.opacity = isMobileSmall ? '1' : '0';

        // Create the hamburger icon with proper structure for better centering
        const hamburgerIcon = document.createElement('div');
        hamburgerIcon.className = 'hamburger-icon';

        // Add the spans for the hamburger lines
        for (let i = 0; i < 4; i++) {
            const span = document.createElement('span');
            hamburgerIcon.appendChild(span);
        }

        // Add the icon to the toggle button
        this.hamburgerToggle.appendChild(hamburgerIcon);

        // Add to the document
        document.body.appendChild(this.hamburgerToggle);

        console.log(`Hamburger toggle created. Display: ${this.hamburgerToggle.style.display}, Visibility: ${this.hamburgerToggle.style.visibility}`);
    }

    createHamburgerMenu() {
        // Create the menu container
        this.hamburgerMenu = document.createElement('div');
        this.hamburgerMenu.className = 'hamburger-menu';

        // Set initial styles based on screen width
        const isMobileSmall = window.innerWidth <= 425;
        this.hamburgerMenu.style.display = isMobileSmall ? 'block' : 'none';

        // Create the menu content
        this.hamburgerMenuContent = document.createElement('div');
        this.hamburgerMenuContent.className = 'hamburger-menu-content';

        // Create the menu items
        this.hamburgerMenuItems = document.createElement('ul');
        this.hamburgerMenuItems.className = 'hamburger-menu-items';

        // Get the navigation items from the mobile nav
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const tabId = item.getAttribute('data-tab');
            const icon = item.querySelector('i').className;
            const text = item.textContent.trim();

            // Create a new menu item
            const menuItem = document.createElement('li');
            menuItem.className = 'hamburger-menu-item';
            menuItem.setAttribute('data-tab', tabId);
            menuItem.innerHTML = `
                <i class="${icon}"></i>
                <span>${text}</span>
            `;

            // Add to the menu items
            this.hamburgerMenuItems.appendChild(menuItem);
        });

        // Add close button
        const closeButton = document.createElement('div');
        closeButton.className = 'hamburger-menu-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';

        // Assemble the menu
        this.hamburgerMenuContent.appendChild(closeButton);
        this.hamburgerMenuContent.appendChild(this.hamburgerMenuItems);
        this.hamburgerMenu.appendChild(this.hamburgerMenuContent);

        // Add to the document
        document.body.appendChild(this.hamburgerMenu);

        console.log(`Hamburger menu created. Display: ${this.hamburgerMenu.style.display}`);

        // Also update the mobile nav display based on screen width
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            mobileNav.style.display = isMobileSmall ? 'none' : 'flex';
            console.log(`Mobile nav display set to: ${mobileNav.style.display}`);
        }
    }

    setupEventListeners() {
        // Toggle button click
        this.hamburgerToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close button click
        const closeButton = this.hamburgerMenuContent.querySelector('.hamburger-menu-close');
        closeButton.addEventListener('click', () => {
            this.closeMenu();
        });

        // Menu item click
        const menuItems = this.hamburgerMenuItems.querySelectorAll('.hamburger-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');

                // Switch to the selected tab
                if (window.mobileNavigation) {
                    window.mobileNavigation.switchTab(tabId);
                }

                // Update active menu item
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Close the menu
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        this.hamburgerMenu.addEventListener('click', (e) => {
            if (e.target === this.hamburgerMenu) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.hamburgerToggle.classList.add('active');
        this.hamburgerMenu.classList.add('active');
        this.isMenuOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    closeMenu() {
        this.hamburgerToggle.classList.remove('active');
        this.hamburgerMenu.classList.remove('active');
        this.isMenuOpen = false;
        document.body.style.overflow = ''; // Restore scrolling
    }

    checkScreenSize() {
        // Check if we're less than or equal to 425px
        const isMobileSmall = window.innerWidth <= 425;

        // Show/hide hamburger menu based on screen size
        if (isMobileSmall) {
            // Show hamburger toggle on small screens
            if (this.hamburgerToggle) {
                this.hamburgerToggle.style.display = 'flex';
                this.hamburgerToggle.style.visibility = 'visible';
                this.hamburgerToggle.style.opacity = '1';
            }

            // Hide regular mobile nav on small screens
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) {
                mobileNav.style.display = 'none';
            }

            // Make sure the hamburger menu is visible (but still hidden until clicked)
            if (this.hamburgerMenu) {
                this.hamburgerMenu.style.display = 'block';
            }
        } else {
            // Hide hamburger toggle on larger screens
            if (this.hamburgerToggle) {
                this.hamburgerToggle.style.display = 'none';
                this.hamburgerToggle.style.visibility = 'hidden';
                this.hamburgerToggle.style.opacity = '0';
            }

            // Show regular mobile nav on larger screens
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) {
                mobileNav.style.display = 'flex';
            }

            // Ensure menu is closed on larger screens
            this.closeMenu();

            // Ensure body scrolling is enabled on larger screens
            document.body.style.overflow = '';
        }

        // Log the current state for debugging
        console.log(`Screen width: ${window.innerWidth}px, Mobile small: ${isMobileSmall}`);
        console.log(`Hamburger toggle display: ${this.hamburgerToggle ? this.hamburgerToggle.style.display : 'N/A'}`);
        console.log(`Mobile nav display: ${document.getElementById('mobile-nav') ? document.getElementById('mobile-nav').style.display : 'N/A'}`);

        // Update the active menu item
        if (window.mobileNavigation) {
            const activeTab = window.mobileNavigation.activeTab;
            const menuItems = this.hamburgerMenuItems.querySelectorAll('.hamburger-menu-item');

            menuItems.forEach(item => {
                const tabId = item.getAttribute('data-tab');
                if (tabId === activeTab) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }
}

// Initialize hamburger menu when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global hamburger menu manager
    window.hamburgerMenu = new HamburgerMenu();

    // Force check screen size after a short delay to ensure proper initialization
    setTimeout(() => {
        if (window.hamburgerMenu) {
            window.hamburgerMenu.checkScreenSize();
            console.log('Forced screen size check on page load');
        }
    }, 300);

    // Add a resize event listener to the window
    window.addEventListener('resize', () => {
        if (window.hamburgerMenu) {
            window.hamburgerMenu.checkScreenSize();
        }
    });
});
