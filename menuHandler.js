// menuHandler.js
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { app } from './firebaseConfig.js'; // Import the Firebase app instance

const auth = getAuth(app);
const db = getFirestore(app);

// Get references to profile elements
const profileBtn = document.getElementById('profileBtn');
const profileDetails = document.getElementById('profileDetails');
const profileNameSpan = document.getElementById('profile-name');
const profileMobileSpan = document.getElementById('profile-mobile');
const profileEmailSpan = document.getElementById('profile-email');
const referralLinkSpan = document.getElementById('referral-link-span');
const logoutButton = document.getElementById('logout-btn');
const bodyElement = document.body; // To control body display based on authentication

// Get references to courses elements
const coursesBtn = document.getElementById('coursesBtn');
const coursesMenu = document.getElementById('coursesMenu');

// --- Profile Menu Logic ---

// Toggle profile dropdown visibility
profileBtn.addEventListener('click', () => {
    const isExpanded = profileBtn.getAttribute("aria-expanded") === "true";
    profileBtn.setAttribute("aria-expanded", !isExpanded);
    profileDetails.style.display = isExpanded ? "none" : "block";

    // Close courses menu if open
    if (coursesMenu.style.display === "block") {
        coursesMenu.style.display = "none";
        coursesBtn.setAttribute("aria-expanded", "false");
    }
});

// Handle logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html"; // Redirect to home or login page
    } catch (error) {
        alert('Error signing out. Please try again.');
    }
});

// Listen for authentication state changes and update profile info
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.paymentStatus === "Paid") {
                profileNameSpan.textContent = userData.fullName || 'N/A';
                profileMobileSpan.textContent = userData.mobile || 'N/A';
                profileEmailSpan.textContent = user.email;
                referralLinkSpan.textContent = `${location.origin}/register.html?ref=${uid}`;
                bodyElement.style.display = 'block'; // Show content if user is paid
            } else {
                alert("Please join our membership to access the courses.");
                window.location.href = "login.html"; // Redirect if not paid
            }
        } else {
            alert("Could not verify your membership. Please log in again.");
            window.location.href = "login.html"; // Redirect if user document not found
        }
    } else {
        // User is not logged in
        alert("Please log in to access the courses.");
        window.location.href = "login.html"; // Redirect to login page
    }
});

// --- Courses Menu Logic ---

// Toggle courses dropdown visibility
coursesBtn.addEventListener('click', () => {
    const isExpanded = coursesBtn.getAttribute("aria-expanded") === "true";
    coursesBtn.setAttribute("aria-expanded", !isExpanded);
    coursesMenu.style.display = isExpanded ? "none" : "block";

    // Close profile menu if open
    if (profileDetails.style.display === "block") {
        profileDetails.style.display = "none";
        profileBtn.setAttribute("aria-expanded", "false");
    }
});