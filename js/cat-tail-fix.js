/**
 * Cat Tail Fix JavaScript
 * This script ensures that cat tails have the correct color
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to add data-cat-id to cat bodies if missing
    function addCatIdsToBody() {
        // Get all cat tails with data-cat-id
        const catTails = document.querySelectorAll('.cat-tail[data-cat-id]');

        // Loop through each tail
        catTails.forEach(tail => {
            const catId = tail.getAttribute('data-cat-id');
            if (!catId) return;

            // Find the parent cat body container
            const parentContainer = tail.closest('.cat-body-container');
            if (!parentContainer) return;

            // Find the cat body within the container
            const catBody = parentContainer.querySelector('.cat-body');
            if (!catBody) return;

            // Add the same data-cat-id to the cat body if it doesn't have one
            if (!catBody.hasAttribute('data-cat-id')) {
                catBody.setAttribute('data-cat-id', catId);
            }
        });
    }

    // Function to fix cat tails
    function fixCatTails() {
        // First add cat IDs to bodies
        addCatIdsToBody();

        // Get all cat tails
        const catTails = document.querySelectorAll('.cat-tail');

        // Loop through each tail
        catTails.forEach(tail => {
            // Check if the tail has a data-cat-id attribute
            const catId = tail.getAttribute('data-cat-id');
            if (!catId) return;

            // Find the corresponding cat body
            // First try to find by cat ID
            let catBody = document.querySelector(`.cat-body-container .cat-body[data-cat-id="${catId}"]`);

            // If that fails, try to find the parent cat body container and then the body
            if (!catBody) {
                const parentContainer = tail.closest('.cat-body-container');
                if (parentContainer) {
                    catBody = parentContainer.querySelector('.cat-body');
                }
            }

            // If all else fails, just use any cat body (fallback)
            if (!catBody) {
                catBody = document.querySelector('.cat-body-container .cat-body');
            }

            // If we found a cat body, get its background color and apply it to the tail
            if (catBody) {
                // Try to get the inline style first
                let bodyColor = catBody.style.backgroundColor;

                // If no inline style, get the computed style
                if (!bodyColor) {
                    const computedStyle = window.getComputedStyle(catBody);
                    bodyColor = computedStyle.backgroundColor;
                }

                // Only set the color if we got a valid color
                if (bodyColor && bodyColor !== 'transparent' && bodyColor !== 'rgba(0, 0, 0, 0)') {
                    tail.style.backgroundColor = bodyColor;
                } else {
                    // Fallback to a default color
                    tail.style.backgroundColor = '#F8D8B0';
                }
            }
        });
    }

    // Run the fix when the page loads
    fixCatTails();

    // Also run the fix after a short delay to catch any dynamically added cats
    setTimeout(fixCatTails, 1000);

    // Set up a mutation observer to watch for new cats being added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Check if any of the added nodes contain cat tails
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.classList.contains('cat-tail') || node.querySelector('.cat-tail'))) {
                        // Run the fix after a short delay to ensure everything is rendered
                        setTimeout(fixCatTails, 100);
                    }
                });
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
});
