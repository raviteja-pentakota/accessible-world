import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
    getFirestore, doc, getDoc, collection,
    query, where, getDocs, updateDoc,
    addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWtr_ZwK8hfA1We-yq9uUOjw5C6wXhx0k",
    authDomain: "accessibleworld-7f599.firebaseapp.com",
    projectId: "accessibleworld-7f599",
    storageBucket: "accessibleworld-7f599.appspot.com",
    messagingSenderId: "264437218598",
    appId: "1:264437218598:web:cae58c1e578c7b08b815e7",
    measurementId: "G-1QRWXYRZ76"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const functionsBaseURL = "https://your-project-id.cloudfunctions.net"; // Replace with your Firebase project ID

const nameField = document.getElementById("user-name");
const mobileField = document.getElementById("user-mobile");
const emailField = document.getElementById("user-email");
const paymentField = document.getElementById("user-payment-status");
const payBtn = document.getElementById("payBtn");
const logoutBtn = document.getElementById("logout");
const referralLinkField = document.getElementById("referral-link");
const copyLinkBtn = document.getElementById("copyLink");
const toggleReferralBtn = document.getElementById("toggleReferral");
const referralSection = document.getElementById("referralSection");
const referralCountField = document.getElementById("referral-count");
const earningsField = document.getElementById("total-earnings");
const referralDetails = document.getElementById("referral-details");
const withdrawBtn = document.getElementById("withdrawBtn");
const statusMessage = document.getElementById("withdraw-status");
const adminSection = document.getElementById("admin-section");
const withdrawalList = document.getElementById("withdrawal-list");
const paymentSection = document.getElementById("payment-section");
const courseAccessSection = document.getElementById("course-access");
const coursesBtn = document.getElementById("coursesBtn");
const recentWithdrawalStatus = document.getElementById("recent-withdrawal-status");
// New elements for withdrawal summary
const totalWithdrawnDisplay = document.getElementById("total-withdrawn-display");
const availableBalanceDisplay = document.getElementById("available-balance-display");

// Modal elements
const withdrawModal = document.getElementById("withdrawModal");
const closeButton = withdrawModal.querySelector(".close-button");
const totalAmountModal = document.getElementById("totalAmount");
const paymentMethodDropdown = document.getElementById("paymentMethod");
const paymentDetailsDiv = document.getElementById("paymentDetails");
const paymentIdInput = document.getElementById("paymentId");
const availableAmountInput = document.getElementById("availableAmount");
const withdrawAmountInput = document.getElementById("withdrawAmount");
const submitWithdrawalButton = document.getElementById("submitWithdrawal");
const cancelWithdrawalButton = document.getElementById("cancelWithdrawal");

let currentUserId, currentUserName, currentUserMobile, currentUserEmail, currentEarnings = 0;

async function fetchReferralLevels(uid, level = 1, max = 5) {
    if (level > max) return [];
    const q = query(collection(db, "users"), where("referredBy", "==", uid));
    const snap = await getDocs(q);
    let out = [];
    for (const ds of snap.docs) {
        const d = ds.data();
        out.push({ level, fullName: d.fullName, mobile: d.mobile, email: d.email, paymentStatus: d.paymentStatus, uid: ds.id });
        out = out.concat(await fetchReferralLevels(ds.id, level + 1, max));
    }
    return out;
}

async function fetchWithdrawalsForAdmin() {
    withdrawalList.innerHTML = "";
    const q = query(collection(db, "withdrawals"), where("status", "==", "Pending"));
    const snap = await getDocs(q);
    snap.forEach(docSnap => {
        const data = docSnap.data();
        const card = document.createElement("div");
        card.className = "withdrawal-card";
        card.innerHTML = `
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Amount:</strong> ₹${data.amount}</p>
            <p><strong>Date:</strong> ${data.requestedAt?.toDate().toLocaleString() || "N/A"}</p>
            <p><strong>Status:</strong> ${data.status}</p>
        `;
        withdrawalList.appendChild(card);
    });
}

const loadReferralData = async (userId) => {
    async function fetchRecentWithdrawal(userId) {
        const withdrawalsQuery = query(
            collection(db, "withdrawals"),
            where("userId", "==", userId),
            orderBy("requestedAt", "desc"),
            limit(1)
        );
        const withdrawalSnapshot = await getDocs(withdrawalsQuery);
        if (!withdrawalSnapshot.empty) {
            const recentWithdrawal = withdrawalSnapshot.docs[0].data();
            recentWithdrawalStatus.textContent = `Your recent withdrawal of ₹${recentWithdrawal.amount} is ${recentWithdrawal.status.toLowerCase()}.`;
        } else {
            recentWithdrawalStatus.textContent = "No recent withdrawal.";
        }
    }
    const refs = await fetchReferralLevels(userId);
    referralCountField.textContent = refs.length;
    referralDetails.innerHTML = "";
    let calculatedReferralEarnings = 0;
    refs.forEach(r => {
        let earning = 0;
        if (r.paymentStatus === "Paid") {
            if (r.level === 1) earning = 240;
            else if (r.level === 2) earning = 150;
            else if (r.level === 3) earning = 110;
            else if (r.level === 4) earning = 60;
            else if (r.level === 5) earning = 40;
        }
        calculatedReferralEarnings += earning;
        const tr = document.createElement("tr");

        tr.innerHTML = `<td>${r.level}</td><td>${r.fullName}</td><td>${r.mobile}</td><td>${r.email}</td><td>${r.paymentStatus}</td><td>₹${earning}</td>`;
        referralDetails.append(tr);
    });
    const userRef = doc(db, "users", currentUserId);
    await updateDoc(userRef, { totalReferralEarnings: calculatedReferralEarnings });
    const userDocSnap = await getDoc(userRef);
    const userData = userDocSnap.data();
    const totalWithdrawn = userData?.totalWithdrawnAmount || 0;
    const availableEarnings = calculatedReferralEarnings - totalWithdrawn;
    earningsField.textContent = `₹${availableEarnings}`;
    totalWithdrawnDisplay.textContent = `₹${totalWithdrawn}`;
    availableBalanceDisplay.textContent = `₹${availableEarnings}`;
    currentEarnings = availableEarnings; // Assign available earnings to currentEarnings
    // Fetch and display recent withdrawal status
    await fetchRecentWithdrawal(userId);
};

onAuthStateChanged(auth, async user => {
    if (!user) return location.href = "index.html";
    currentUserId = user.uid;
    currentUserEmail = user.email;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return alert("No user data!");
    const userData = userDoc.data();
    currentUserName = userData.fullName || "";
    currentUserMobile = userData.mobile || "";
    nameField.textContent = currentUserName;
    mobileField.textContent = currentUserMobile;
    emailField.textContent = currentUserEmail;
    paymentField.textContent = userData.paymentStatus || "Pending";
    referralLinkField.textContent = `${location.origin}/register.html?ref=${user.uid}`;

    await loadReferralData(user.uid);

    if (userData.paymentStatus === "Paid") {
        paymentSection.style.display = "none";
        courseAccessSection.style.display = "block";
    } else {
        paymentSection.style.display = "block";
        courseAccessSection.style.display = "none";
    }

    if (userData.role === "admin") {
        adminSection.style.display = "block";
        await fetchWithdrawalsForAdmin();
    }
});

toggleReferralBtn.addEventListener('click', () => {
    const isVisible = referralSection.style.display === "block";
    referralSection.style.display = !isVisible ? "block" : "none";
    toggleReferralBtn.textContent = !isVisible ? "Hide Referral Details" : "Show Referral Details";
    toggleReferralBtn.setAttribute("aria-expanded", String(!isVisible));
});

// Initial state: Hidden
referralSection.style.display = "none";
toggleReferralBtn.setAttribute("aria-expanded", "false");

logoutBtn.onclick = () => signOut(auth).then(() => location.href = "index.html");
copyLinkBtn.onclick = () => { navigator.clipboard.writeText(referralLinkField.textContent); alert("Copied!"); }
payBtn.onclick = async () => {
    try {
        const response = await fetch(`${functionsBaseURL}/createRazorpayOrder`);
        const orderData = await response.json();

        if (orderData && orderData.id) {
            const options = {
                key: "rzp_test_65YRKaINc6MqXg", // Replace with your actual test key during testing
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.id,
                name: "Accessible Learn and Win",
                description: "Membership Fee",
                prefill: {
                    name: currentUserName,
                    email: currentUserEmail,
                    contact: currentUserMobile
                },
                theme: {
                    color: "#007bff"
                },
                handler: async (response) => {
                    alert("Paid: " + response.razorpay_payment_id);
                    await updateDoc(doc(db, "users", currentUserId), { paymentStatus: "Paid" });
                    paymentField.textContent = "Paid";
                    paymentSection.style.display = "none";
                    courseAccessSection.style.display = "block";
                }
            };
            const rzp = new Razorpay(options);
            rzp.open();
        } else {
            alert("Failed to create Razorpay order.");
            console.error("Error creating Razorpay order:", orderData);
        }
    } catch (error) {
        console.error("Error calling createRazorpayOrder function:", error);
        alert("An error occurred while processing payment.");
    }
};

withdrawBtn.onclick = () => {
    if (currentEarnings < 100) return statusMessage.textContent = "Min ₹100 to withdraw";
    // Open the modal
    withdrawModal.style.display = "block";
    totalAmountModal.value = `₹${currentEarnings}`;
    availableAmountInput.value = `₹${currentEarnings}`;
};

closeButton.onclick = function () {
    withdrawModal.style.display = "none";
    paymentDetailsDiv.style.display = "none";
    paymentMethodDropdown.value = "";
    paymentIdInput.value = "";
    withdrawAmountInput.value = "";
    submitWithdrawalButton.disabled = true;
}

cancelWithdrawalButton.onclick = function () {
    withdrawModal.style.display = "none";
    paymentDetailsDiv.style.display = "none";
    paymentMethodDropdown.value = "";
    paymentIdInput.value = "";
    withdrawAmountInput.value = "";
    submitWithdrawalButton.disabled = true;
}

paymentMethodDropdown.addEventListener('change', function () {
    if (this.value) {
        paymentDetailsDiv.style.display = "block";
    } else {
        paymentDetailsDiv.style.display = "none";
        paymentIdInput.value = "";
        withdrawAmountInput.value = "";
        submitWithdrawalButton.disabled = true;
    }
    validateWithdrawalForm();
});

paymentIdInput.addEventListener('input', validateWithdrawalForm);
withdrawAmountInput.addEventListener('input', validateWithdrawalForm);

function validateWithdrawalForm() {
    if (paymentMethodDropdown.value && paymentIdInput.value && withdrawAmountInput.value && parseFloat(withdrawAmountInput.value) > 0 && parseFloat(withdrawAmountInput.value) <= currentEarnings) {
        submitWithdrawalButton.disabled = false;
    } else {
        submitWithdrawalButton.disabled = true;
    }
}

submitWithdrawalButton.onclick = async () => {
    const selectedMethod = paymentMethodDropdown.value;
    const paymentId = paymentIdInput.value;
    const requestedAmount = parseFloat(withdrawAmountInput.value);

    if (!selectedMethod) {
        alert("Please select a payment method.");
        return;
    }

    if (!paymentId) {
        alert("Please enter your UPI ID or number.");
        return;
    }

    if (isNaN(requestedAmount) || requestedAmount <= 0 || requestedAmount > currentEarnings) {
        alert(`Please enter a valid withdrawal amount (up to ₹${currentEarnings}).`);
        return;
    }

    try {
        await addDoc(collection(db, "withdrawals"), {
            userId: currentUserId,
            fullName: currentUserName,
            email: currentUserEmail,
            phone: currentUserMobile,
            amount: requestedAmount,
            paymentMethod: selectedMethod,
            paymentId: paymentId,
            requestedAt: serverTimestamp(),
            status: "Pending"
        });
        statusMessage.textContent = "Withdrawal request submitted!";

        // Update the total withdrawn amount in the database
        const userRef = doc(db, "users", currentUserId);
        const userData = (await getDoc(userRef)).data();
        const currentWithdrawn = userData?.totalWithdrawnAmount || 0;
        const newTotalWithdrawn = currentWithdrawn + requestedAmount;
        await updateDoc(userRef, {
            totalWithdrawnAmount: newTotalWithdrawn
        });

        // Update the local currentEarnings variable and the displayed value
        currentEarnings -= requestedAmount; // Update local available earnings
        earningsField.textContent = `₹${currentEarnings}`; // Display available earnings
        totalAmountModal.value = `₹${currentEarnings}`; // Update modal total
        availableAmountInput.value = `₹${currentEarnings}`; // Update modal available

        statusMessage.textContent = "Payment successfull: You will receive the amount in 24 hours on the provided payment method.";
        alert("Payment successfull: You will receive the amount in 24 hours on the provided payment method.");
        withdrawModal.style.display = "none";
        paymentDetailsDiv.style.display = "none";
        paymentMethodDropdown.value = "";
        paymentIdInput.value = "";
        withdrawAmountInput.value = "";
        submitWithdrawalButton.disabled = true;
    } catch (e) {
        console.error(e);
        statusMessage.textContent = "Could not submit withdrawal request.";
    }
};
coursesBtn.onclick = () => window.location.href = 'courses.html';