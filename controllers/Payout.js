const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating idempotency keys
const app = require('express')();
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

// New Payout function with Idempotency Key
async function createPayout(req, res) {
    const { name, email, contact, amount, userid, referenceId, narration, notes, account_number, description } = req.body;
    const db = admin.firestore();

    try {
        // Step 1: Check if the contact exists
        let existingContact = await findContact(contact);

        // Step 2: If the contact doesn't exist, create a new one
        if (!existingContact) {
            existingContact = await createNewContact(name, email, contact);
        }

        // Step 3: Create a payout link
        const idempotencyKey = uuidv4(); // Generate a unique idempotency key

        const payoutLink = await createPayoutLink(existingContact.id, amount, idempotencyKey, referenceId, narration, notes, account_number, description);

        // Step 4: Save the payout link details in Firestore
        const payoutRef = db.collection('Payouts').doc();  // 'Payouts' is the collection name
        await payoutRef.set({
            payoutDetails: payoutLink,
            userId: userid,
            createdAt: new Date(),
            idempotencyKey: idempotencyKey  // Save the idempotency key in Firestore
        });

        res.json({ status: 'success', payoutLink });

    } catch (error) {
        console.error('Error creating payout link:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create payout link: ' + error.message });
    }
}

// Helper function to find contact by phone number
async function findContact(contact) {
    try {
        const response = await axios.get(`https://api.razorpay.com/v1/contacts?contact=${contact}`, {
            auth: {
                username: 'rzp_test_HNi8kaKf7tE6DM',
                password: 'uUvTHe0adjiUeXkMuDbB104y',
            },
        });

        const contacts = response.data.items;
        return contacts.length > 0 ? contacts[0] : null;
    } catch (error) {
        console.error('Error searching contacts:', error);
        throw new Error('Failed to fetch contacts');
    }
}

// Helper function to create a new contact
async function createNewContact(name, email, contact) {
    try {
        const response = await axios.post('https://api.razorpay.com/v1/contacts', {
            name,
            email,
            contact,
            type: 'employee', // Can be 'vendor', 'customer', etc.
        }, {
            auth: {
                username: 'rzp_test_HNi8kaKf7tE6DM',  // Your Razorpay key_id
                password: 'uUvTHe0adjiUeXkMuDbB104y', // Your Razorpay key_secret
            },
        });

        return response.data;  // Return the created contact details
    } catch (error) {
        console.error('Failed to create contact:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create contact: ' + (error.response ? error.response.data.error.description : error.message));
    }
}

// Helper function to create a payout link using POST method
async function createPayoutLink(contactId, amount, idempotencyKey, referenceId, narration, notes,account_number, description) {
    try {
        // Prepare the payout link data according to Razorpay's API requirements
        const payoutLinkData = {
            account_number: account_number, // Replace with your linked Razorpay account
            contact: {
                id: contactId,  // Use the correct contact ID
            },
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            purpose: 'payout',
            reference_id: referenceId,  // Reference ID for tracking
            narration: narration,       // Purpose or description for the payout
            notes: notes,               // Additional notes if necessary
            description: description
        };

        // Send a POST request to create the payout link
        const response = await axios.post('https://api.razorpay.com/v1/payout-links', payoutLinkData, {
            auth: {
                username: 'rzp_test_uziNN7SQMjyToN',  // Your Razorpay key_id
                password: '1GJA4TgEk0ZTsm5BwAkGd3VI', // Your Razorpay key_secret
            },
            headers: {
                'Content-Type': 'application/json',
                'X-Payout-Idempotency': idempotencyKey // Add idempotency key header
            },
        });

        return response.data; // Return the created payout link details
    } catch (error) {
        console.error('Failed to create payout link:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create payout link: ' + (error.response ? error.response.data.error.description : error.message));
    }
}

module.exports = {
    createPayout
};
