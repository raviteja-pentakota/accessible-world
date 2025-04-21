import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZUQXgfdDHrntbBVSVFf8Vvtp9V5qnERg",
  authDomain: "accessible-learn-and-win-ad21f.firebaseapp.com",
  projectId: "accessible-learn-and-win-ad21f",
  storageBucket: "accessible-learn-and-win-ad21f.appspot.com",
  messagingSenderId: "299849578412",
  appId: "1:299849578412:web:1e66a3292e35578f102c09",
  measurementId: "G-G832YW57EK"
};

// Wrap everything in DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore();

  const logoutBtn = document.getElementById("logout");
  const userNameSpan = document.getElementById("user-name");
  const userEmailSpan = document.getElementById("user-email");
  const userPaymentStatusSpan = document.getElementById("user-payment-status");
  const referralLinkSpan = document.getElementById("referral-link");
  const copyBtn = document.getElementById("copyLink");
  const toggleReferralBtn = document.getElementById("toggleReferral");
  const referralSection = document.getElementById("referralSection");
  const referralCountSpan = document.getElementById("referral-count");
  const totalEarningsSpan = document.getElementById("total-earnings");
  const referralDetailsList = document.getElementById("referral-details");

  let currentUser;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      userEmailSpan.textContent = user.email;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        userNameSpan.textContent = userData.fullName || "";
        userPaymentStatusSpan.textContent = userData.paymentStatus || "Pending";
        const referralLink = `${window.location.origin}/register.html?ref=${user.uid}`;
        referralLinkSpan.textContent = referralLink;

        if (userData.referrals) {
          const referrals = userData.referrals;
          referralCountSpan.textContent = referrals.length;

          let totalEarnings = 0;
          referralDetailsList.innerHTML = "";

          referrals.forEach((ref, index) => {
            const li = document.createElement("li");
            li.textContent = `Level ${ref.level}: ${ref.name} - Payment: ${ref.paymentStatus}`;
            referralDetailsList.appendChild(li);

            if (ref.paymentStatus === "Confirmed") {
              if (ref.level === 1) totalEarnings += 300;
              else if (ref.level === 2) totalEarnings += 250;
              else if (ref.level === 3) totalEarnings += 200;
              else if (ref.level === 4) totalEarnings += 150;
              else if (ref.level === 5) totalEarnings += 100;
            }
          });

          totalEarningsSpan.textContent = `₹${totalEarnings}`;
        }
      }
    } else {
      window.location.href = "index.html";
    }
  });

  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(referralLinkSpan.textContent).then(() => {
      alert("Referral link copied to clipboard!");
    });
  });

  toggleReferralBtn.addEventListener("click", () => {
    referralSection.style.display =
      referralSection.style.display === "none" ? "block" : "none";
  });
});
