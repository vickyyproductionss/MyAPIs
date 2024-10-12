const Payment = require('../models/Payment');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = require('express')()
app.use(cors());
app.use(bodyParser.json());

const Razorpay = require('razorpay');
const axios = require('axios');

// Initialize Razorpay instance with your key_id and key_secret
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_HNi8kaKf7tE6DM',
    key_secret: 'uUvTHe0adjiUeXkMuDbB104y'
});

async function CreateOrderAndPaymentLink(req, res) {
    const { amount, currency } = req.query; // Get amount and currency from query params

    try {
        // Step 1: Create an Order
        const options = {
            amount: parseInt(amount) * 100, // Razorpay deals with paise
            currency: currency || 'INR',
            receipt: `receipt_order_${Math.random() * 1000}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // Step 2: Create a Payment Link using the order_id
        const paymentLinkOptions = {
            amount: order.amount, // Amount in paise
            currency: order.currency,
            accept_partial: false,
            reference_id: order.id, // Reference to the order ID
            description: "Payment for order #" + order.id,
            customer: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9876543210"
            },
            notify: {
                email: true,
                sms: true
            },
            callback_url: "https://my-ap-is-theta.vercel.app/api/payments/verification", // Where the payment confirmation will be sent
            callback_method: "post"
        };

        const paymentLinkResponse = await axios.post('https://api.razorpay.com/v1/payment_links', paymentLinkOptions, {
            auth: {
                username: 'rzp_test_HNi8kaKf7tE6DM',
                password: 'uUvTHe0adjiUeXkMuDbB104y'
            }
        });

        // Step 3: Send the Payment Link back to the client
        res.json({
            order_id: order.id,
            payment_link: paymentLinkResponse.data.short_url, // This is the link you can open in the browser
            message: 'Payment link created successfully'
        });
    } catch (error) {
        console.error('Error creating Razorpay order or payment link:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create order or payment link' });
    }
}


async function CapturePayment(req, res) {
    const secret = 'jbQzLJantq@m4dq';
    console.log(req.body);

    // Generate SHA256 signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    console.log(digest, req.headers['x-razorpay-signature']);

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit', JSON.stringify(req.body, null, 4));

        // Create a new Payment instance and save it to MongoDB
        const newPayment = new Payment({
            paymentData: req.body, // Assuming your Payment schema has a 'paymentData' field to store the data
            createdAt: new Date()
        });

        try {
            await newPayment.save();  // Save the payment to MongoDB
            res.json({ status: 'ok', message: 'Payment data saved to MongoDB' });
        } catch (error) {
            console.error('Error saving payment to MongoDB:', error);
            res.status(500).json({ status: 'error', message: 'Failed to save payment data' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
}

module.exports = {
    CapturePayment,CreateOrderAndPaymentLink
};
