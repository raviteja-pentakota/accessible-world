const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require('crypto');

admin.initializeApp();
const db = admin.firestore();

// Use Razorpay key from environment config
const razorpay = new Razorpay({
  key_id: "rzp_test_65YRKaINc6MqXg", // Replace with your live key in production
  key_secret: functions.config().razorpay.key_secret,
});

// Create Razorpay order
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const { amount } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to create an order.');
  }

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${context.auth.uid}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return { success: true, orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    throw new functions.https.HttpsError('internal', 'Failed to create Razorpay order.', error);
  }
});

// Verify Razorpay payment
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  const { orderId, paymentId, signature } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to verify payment.');
  }

  if (!orderId || !paymentId || !signature) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing order ID, payment ID, or signature.');
  }

  try {
    const keySecret = functions.config().razorpay.key_secret;
    const expectedSignature = crypto.createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature === signature) {
      await db.collection('users').doc(context.auth.uid).update({ paymentStatus: 'Paid' });
      return { success: true, message: 'Payment verified successfully.' };
    } else {
      console.error('Signature mismatch:', { expectedSignature, received: signature });
      throw new functions.https.HttpsError('unauthenticated', 'Payment verification failed - invalid signature.');
    }
  } catch (error) {
    console.error("Error verifying payment", error);
    throw new functions.https.HttpsError('internal', 'Failed to verify payment.', error);
  }
});

// Referral income processing on payment update
exports.processReferralIncome = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const previousData = change.before.data();
    const currentData = change.after.data();
    const userId = context.params.userId;

    if (previousData.paymentStatus !== 'Paid' && currentData.paymentStatus === 'Paid') {
      const userDoc = await db.collection('users').doc(userId).get();
      const referredByUid = userDoc.data().referredBy;

      if (referredByUid) {
        try {
          const referrerDocRef = db.collection('users').doc(referredByUid);
          const referralEarning = 100;

          await db.runTransaction(async (transaction) => {
            const referrerDoc = await transaction.get(referrerDocRef);
            if (referrerDoc.exists) {
              const currentBalance = referrerDoc.data().referralBalance || 0;
              const currentTotalEarnings = referrerDoc.data().totalEarnings || 0;
              transaction.update(referrerDocRef, {
                referralBalance: currentBalance + referralEarning,
                totalEarnings: currentTotalEarnings + referralEarning,
              });
              console.log(`Credited ₹${referralEarning} to ${referredByUid} for referral ${userId}`);
            }
          });
        } catch (error) {
          console.error('Error processing referral income:', error);
        }
      }
    }
  });

// Handle withdrawal requests
exports.requestWithdrawal = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to request a withdrawal.');
  }

  const { amount, paymentMethod, paymentId, userName, userMobile, userEmail } = data;
  const uid = context.auth.uid;

  if (!amount || amount <= 0 || !paymentMethod || !paymentId) {
    throw new functions.https.HttpsError('invalid-argument', 'Provide valid withdrawal amount, method, and ID.');
  }

  const userDoc = await db.collection('users').doc(uid).get();
  const userData = userDoc.data();

  if (!userData || (userData.referralBalance || 0) < amount) {
    throw new functions.https.HttpsError('failed-precondition', 'Insufficient withdrawal balance.');
  }

  try {
    await db.collection('withdrawals').add({
      uid,
      userName,
      userMobile,
      userEmail,
      amount,
      paymentMethod,
      paymentId,
      status: 'pending',
      requestedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await db.collection('users').doc(uid).update({
      totalWithdrawn: admin.firestore.FieldValue.increment(amount)
    });

    return { success: true, message: 'Withdrawal request submitted successfully.' };
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
    throw new functions.https.HttpsError('internal', 'Failed to submit withdrawal request.', error);
  }
});

// Register with referral
exports.registerWithReferral = functions.https.onCall(async (data, context) => {
  const { fullName, mobile, email, uid, referralCode } = data;
  const generatedReferralCode = uid.substring(0, 8);

  await db.collection("users").doc(uid).set({
    fullName,
    mobile,
    email,
    uid,
    referralCode: generatedReferralCode,
    referredBy: referralCode || null,
    paymentStatus: "pending",
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: []
  });

  if (referralCode) {
    let referrerUID = null;

    const referralDoc = await db.collection("referralCodes").doc(referralCode).get();
    if (referralDoc.exists) {
      referrerUID = referralDoc.data().uid;
    } else {
      const userDoc = await db.collection("users").doc(referralCode).get();
      if (userDoc.exists) {
        referrerUID = userDoc.id;
      }
    }

    if (referrerUID) {
      await db.collection("users").doc(referrerUID).update({
        level1: admin.firestore.FieldValue.arrayUnion(uid)
      });
    }
  }

  return { success: true };
});
