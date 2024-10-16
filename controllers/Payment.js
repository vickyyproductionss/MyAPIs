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

        // Create the payment link
        const paymentLink = await razorpayInstance.paymentLink.create(paymentLinkOptions);

        try {
            // Save the payment to Firestore
            const paymentRef = db.collection('PaymentLinks').doc();  // 'payments' is the collection name
            await paymentRef.set(paymentLink);

        } catch (error) {
            console.error('Error saving payment to MongoDB:', error);
        }

        // Send the payment link back to the client
        res.json({
            payment_link: paymentLink.short_url,
            message: 'Payment link created successfully'
        });
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create payment link'  + error});
    }
}


async function CapturePayment(req, res) {
    const secret = 'jbQzLJantq@m4dq';
    const db = admin.firestore();

    // Generate SHA256 signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    console.log(digest, req.headers['x-razorpay-signature']);

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit', JSON.stringify(req.body, null, 4));

        try {
            // Save the payment to Firestore
            const paymentRef = db.collection('Payments').doc();  // 'payments' is the collection name
            await paymentRef.set(req.body);
            res.status(200).json({ status: 'ok', message: 'Payment data saved to Firestore' });

        } catch (error) {
            console.error('Error saving payment to MongoDB:', error);
            res.status(500).json({ status: 'error', message: 'Failed to save payment data' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
}

module.exports = {
    CapturePayment, CreatePaymentLink
};
