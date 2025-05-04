const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Access Razorpay keys from Firebase environment configuration
const razorpayKeyId = functions.config().razorpay.key_id;
const razorpayKeySecret = functions.config().razorpay.key_secret;

// Create Razorpay instance with the provided keys
const razorpayInstance = new Razorpay({
  key_id: rzp_live_jarrSjgdfymA2D,
  key_secret: Sv710AdSgdlrEmZI8WCnalhS,
});

// Cloud Function to create an order
exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const amountInPaise = 100000; // ₹1000 = 100000 paise

      const order = await instance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });

      res.status(200).json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });
});