// Import necessary Firebase functions
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from "./firebase-config.js";

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Get the profile-related DOM elements
const profileBtn = document.getElementById('profileBtn');
const profileDetails = document.getElementById('profileDetails');
const profileNameSpan = document.getElementById('profile-name');
const profileMobileSpan = document.getElementById('profile-mobile');
const profileEmailSpan = document.getElementById('profile-email');
const referralLinkSpan = document.getElementById('referral-link-span');
const logoutButton = document.getElementById('logout-btn');
const bodyElement = document.body; // Assuming you have a body element to show/hide

// Main authentication state observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        try {
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.paymentStatus === "Paid") {
                    profileNameSpan.textContent = userData.fullName || 'N/A';
                    profileMobileSpan.textContent = userData.mobile || 'N/A';
                    profileEmailSpan.textContent = user.email;
                    referralLinkSpan.textContent = `${location.origin}/register.html?ref=${uid}`;
                    bodyElement.style.display = 'block';
                } else {
                    alert("Please join our membership to access the courses.");
                    window.location.href = "/index.html";
                }
            } else {
                alert("Error: Could not verify your membership. Please log in again.");
                window.location.href = "/login.html";
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("An error occurred while verifying your membership. Please try again.");
            window.location.href = "/login.html";
        }
    } else {
        alert("Please log in to access the courses.");
        window.location.href = "/login.html";
    }
});

// Event listener for the profile button
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        const isExpanded = profileBtn.getAttribute("aria-expanded") === "true";
        profileBtn.setAttribute("aria-expanded", !isExpanded);
        profileDetails.style.display = isExpanded ? "none" : "block";
    });

    // Event listener to collapse the profile dropdown on 'Escape' key press
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" && profileBtn.getAttribute("aria-expanded") === "true") {
            profileBtn.setAttribute("aria-expanded", "false");
            profileDetails.style.display = "none";
        }
    });
}

// Event listener for the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = "/index.html";
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Error signing out. Please try again.');
        }
    });
}