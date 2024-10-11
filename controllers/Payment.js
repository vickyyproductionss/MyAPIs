const Payment = require('../models/Payment');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = require('express')()
app.use(cors());
app.use(bodyParser.json());

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
    CapturePayment
};
