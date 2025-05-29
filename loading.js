document.addEventListener('DOMContentLoaded', () => {
    // Check if the overlay already exists (important if script loads late or page reloads)
    let overlay = document.getElementById('loadingOverlay');

    // If the overlay doesn't exist in the HTML, create it dynamically as a fallback.
    // However, the best practice is to have it directly in the HTML as discussed.
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.setAttribute('role', 'alert');
        overlay.setAttribute('aria-live', 'assertive');
        overlay.setAttribute('tabindex', '-1'); // For programmatic focus if needed
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent black
        overlay.style.color = 'white';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.fontSize = '2rem';
        overlay.style.zIndex = '9999';
        overlay.style.transition = 'opacity 0.5s ease-out'; // For smooth fade-out

        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = 'Loading. Please wait...';
        overlay.appendChild(loadingMessage);

        document.body.appendChild(overlay);

        // Optional: Set focus to loading message, but less critical if overlay is in HTML
        // setTimeout(() => {
        //     overlay.focus();
        // }, 100);
    }

    // On full load, remove overlay and restore content
    window.addEventListener('load', () => {
        // Find the main content area using its ID
        const mainContent = document.getElementById('main-content'); // Ensure your <main> element has id="main-content"
        const body = document.body;

        // Give screen readers a brief moment to announce the "Loading" message
        setTimeout(() => {
            // Remove aria-hidden from main content to make it accessible
            if (mainContent) {
                mainContent.removeAttribute('aria-hidden');
                // Optional: Focus the main content for screen reader users
                mainContent.focus(); 
            } else {
                console.warn("Accessibility warning: Main content element (id='main-content') not found. Skipping focus.");
            }

            // Remove the 'loading' class from body to reveal content visually
            if (body.classList.contains('loading')) {
                body.classList.remove('loading');
                body.style.overflow = ''; // Restore scrolling
            }

            // Fade out the overlay and then remove it from DOM
            const currentOverlay = document.getElementById('loadingOverlay'); // Re-fetch in case it was dynamically added
            if (currentOverlay) {
                currentOverlay.style.opacity = '0'; // Start fade out
                setTimeout(() => {
                    currentOverlay.remove(); // Remove after transition
                }, 500); // Match transition duration (0.5s)
            }
        }, 300); // Short delay (e.g., 300ms) after window.load for screen reader announcement
});