/**
 * Cat Pupils JavaScript
 * This script adds pupils to cat eyes to make them look less freaky
 */

document.addEventListener('DOMContentLoaded', function() {
    // Function to add pupils to cat eyes
    function addPupilsToCatEyes() {
        // Get all cat eyes
        const catEyes = document.querySelectorAll('.cat-eyes');
        
        // Loop through each eye
        catEyes.forEach(eye => {
            // Skip if this eye already has a pupil
            if (eye.querySelector('.cat-pupil')) return;
            
            // Create a pupil element
            const pupil = document.createElement('div');
            pupil.className = 'cat-pupil';
            
            // Get the cat ID if available
            const catId = eye.getAttribute('data-cat-id');
            if (catId) {
                pupil.setAttribute('data-cat-id', catId);
            }
            
            // Try to get iris color from cat appearance
            let irisColor = '#000000'; // Default black
            
            // Add the pupil to the eye
            eye.appendChild(pupil);
            
            // Set the pupil color
            pupil.style.backgroundColor = irisColor;
        });
    }
    
    // Run the function when the page loads
    addPupilsToCatEyes();
    
    // Also run after a short delay to catch any dynamically added cats
    setTimeout(addPupilsToCatEyes, 1000);
    
    // Set up a mutation observer to watch for new cats being added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Check if any of the added nodes contain cat eyes
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.classList.contains('cat-eyes') || node.querySelector('.cat-eyes'))) {
                        // Run the function after a short delay to ensure everything is rendered
                        setTimeout(addPupilsToCatEyes, 100);
                    }
                });
            }
        });
    });
    
    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
});
