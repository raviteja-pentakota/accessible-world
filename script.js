document.addEventListener('DOMContentLoaded', () => {
    // --- Profile Dropdown ---
    const profileBtn = document.getElementById('profileBtn');
    const profileDetails = document.getElementById('profileDetails');

    if (profileBtn && profileDetails) {
        profileBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from immediately propagating to document
            const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
            profileBtn.setAttribute('aria-expanded', !isExpanded);
            profileDetails.style.display = isExpanded ? 'none' : 'block';
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (profileDetails.style.display === 'block' && !profileDetails.contains(event.target) && event.target !== profileBtn) {
                profileBtn.setAttribute('aria-expanded', 'false');
                profileDetails.style.display = 'none';
            }
        });

        // Close dropdown with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && profileDetails.style.display === 'block') {
                profileBtn.setAttribute('aria-expanded', 'false');
                profileDetails.style.display = 'none';
                profileBtn.focus(); // Return focus to the button
            }
        });
    }

    // --- "View Example Code" Toggles ---
    // Select all buttons that start with 'viewCode' ID
    const viewCodeButtons = document.querySelectorAll('button[id^="viewCode"]');

    viewCodeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const controlsId = button.getAttribute('aria-controls');
            const codeExample = document.getElementById(controlsId);
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', !isExpanded);
            if (codeExample) {
                codeExample.hidden = isExpanded;
            }
            button.textContent = isExpanded ? 'View example code' : 'Hide example code';
        });
    });


    // --- Pagination for Intro Pages ---
    const introPagesContainer = document.getElementById('intro-pages');
    if (introPagesContainer) {
        const pages = Array.from(introPagesContainer.querySelectorAll('.intro-page'));
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageIndicator = document.getElementById('pageIndicator');
        let currentPageIndex = 0;

        const totalPages = pages.length;

        function updatePagination() {
            pages.forEach((page, index) => {
                page.classList.remove('active');
                // Instead of display none/block directly, rely on CSS .active class
                // page.style.display = (index === currentPageIndex) ? 'block' : 'none';
                if (index === currentPageIndex) {
                    page.classList.add('active');
                    // Focus on the new page's first heading for accessibility
                    const firstHeading = page.querySelector('h4, h5'); // Adjust selector as needed
                    if (firstHeading) {
                        firstHeading.setAttribute('tabindex', '-1'); // Make it focusable
                        firstHeading.focus();
                    }
                }
            });

            if (pageIndicator) {
                pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;
            }

            if (prevBtn) {
                prevBtn.disabled = (currentPageIndex === 0);
            }
            if (nextBtn) {
                nextBtn.disabled = (currentPageIndex === totalPages - 1);
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPageIndex < totalPages - 1) {
                    currentPageIndex++;
                    updatePagination();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPageIndex > 0) {
                    currentPageIndex--;
                    updatePagination();
                }
            });
        }

        // Initial setup
        if (totalPages > 0) {
            // The first page should already have 'active' class from HTML if it's the default.
            // If not, uncomment the next line:
            // pages[0].classList.add('active');
            currentPageIndex = pages.findIndex(page => page.classList.contains('active'));
            if (currentPageIndex === -1) currentPageIndex = 0; // Default to first if none active
            updatePagination();
        } else {
            if (pageIndicator) pageIndicator.textContent = "No pages found";
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
        }
    }


    // --- Tabs (Basic setup as only one tab is in HTML) ---
    // If you add more tabs, you'll need a more robust tab switching logic.
    const tabButtons = document.querySelectorAll('.tab-buttons button[role="tab"]');
    const tabContents = document.querySelectorAll('.tab-content[role="tabpanel"]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => {
                content.classList.remove('active');
                // content.style.display = 'none'; // Rely on .active class
            });

            // Activate clicked tab and its content
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            const controlledContentId = button.getAttribute('aria-controls');
            const activeContent = document.getElementById(controlledContentId);
            if (activeContent) {
                activeContent.classList.add('active');
                // activeContent.style.display = 'block'; // Rely on .active class

                // Optionally, re-initialize pagination if content within tab changes significantly
                // or has its own pagination. For this structure, the intro-pages are within the first tab.
            }
            button.focus();
        });
    });


    // --- Show Body Content (Placeholder for Firebase Auth) ---
    // This function should be called after your Firebase authentication confirms access.
    function showPageContent() {
        document.body.style.display = 'block'; // Or 'flex', 'grid' depending on your body's layout
        // Potentially focus on the first interactive element or main content
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            // skipLink.focus(); // Or focus on main content after a brief delay
        }
    }

    // Simulate Firebase auth success for demonstration:
    // In a real scenario, Firebase SDK would trigger this.
    // For example: firebase.auth().onAuthStateChanged(user => { if (user) { showPageContent(); } });
    showPageContent(); // Call this directly for now to make the page visible. Remove if using actual auth.

    // --- Logout Button ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Add your Firebase logout logic here
            console.log('Logout button clicked. Implement Firebase logout.');
            // Example: firebase.auth().signOut().then(() => { window.location.href = 'login.html'; });
            alert('Logout functionality to be implemented.');
        });
    }
});