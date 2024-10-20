const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = require('express')()
app.use(cors());
app.use(bodyParser.json());
const admin = require('firebase-admin');

const Razorpay = require('razorpay');
const axios = require('axios');

// Initialize Razorpay instance with your key_id and key_secret
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_HNi8kaKf7tE6DM',
    key_secret: 'uUvTHe0adjiUeXkMuDbB104y'
});

// Function to create a payment link
async function CreatePaymentLink(req, res) {
    const { amount, customerName, customerEmail, customerContact, description, userid } = req.query;
    const db = admin.firestore();

    try {
        // Create a payment link directly
        const paymentLinkOptions = {
            amount: parseInt(amount) * 100, // Amount in paise
            currency: "INR",
            accept_partial: false, // Accept partial payments
            description: description || "Payment for TEST purpose",
            customer: {
                name: customerName || "Default Customer",
                email: customerEmail || "customer@example.com",
                contact: customerContact || "+919000000000"
            },
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            notes: {
                user_id: userid
            }
        };

        // Create the payment link using Razorpay API
        const paymentLink = await razorpayInstance.paymentLink.create(paymentLinkOptions);

        try {
            // Save the payment link to Firestore under `users > (userid) > Payments`
            const paymentRef = db.collection('Users').doc(userid).collection('PaymentLinks').doc();
            await paymentRef.set(paymentLink); // Save payment link data to the user's payment collection
        } catch (error) {
            console.error('Error saving payment link to Firestore:', error);
        }

        // Send the payment link back to the client
        res.json({
            payment_link: paymentLink.short_url,
            message: 'Payment link created successfully'
        });
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create payment link: ' + error });
    }
}

// Function to capture a payment
async function CapturePayment(req, res) {
    const secret = 'jbQzLJantq@m4dq';  // Webhook secret key for signature validation
    const db = admin.firestore();

    // Generate SHA256 signature for validation
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    console.log(digest, req.headers['x-razorpay-signature']);

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('Request is legit', JSON.stringify(req.body, null, 4));

        try {
            // Retrieve the user ID from the notes field of the request body
            const userid = req.body.payload.payment.entity.notes.user_id;

            // Save the payment data to Firestore under `users > (userid) > Payments`
            const paymentRef = db.collection('Users').doc(userid).collection('Payments').doc();
            await paymentRef.set(req.body); // Save the captured payment data to the user's payment collection

            res.status(200).json({ status: 'ok', message: 'Payment data saved to Firestore' });

        } catch (error) {
            console.error('Error saving payment data to Firestore:', error);
            res.status(500).json({ status: 'error', message: 'Failed to save payment data' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
}

module.exports = {
    CapturePayment, CreatePaymentLink
};
