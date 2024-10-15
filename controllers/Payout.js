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


// New Payout function
async function createPayout(req, res) {
    const { name, email, contact, accountNumber, ifsc, upiId, amount, userid } = req.body;
    const db = admin.firestore();

    try {
        // Step 1: Check if the contact exists
        let existingContact = await findContact(contact);

        // Step 2: If the contact doesn't exist, create a new one
        if (!existingContact) {
            existingContact = await createNewContact(name, email, contact);
        }

        // Step 3: Create a payout request (UPI or Bank Account)
        let payout;
        if (upiId) {
            payout = await createUPIPayout(existingContact.id, upiId, amount);
        } else if (accountNumber && ifsc) {
            payout = await createBankPayout(existingContact.id, accountNumber, ifsc, amount);
        } else {
            throw new Error('Please provide either UPI ID or Bank Account details');
        }

        // Step 4: Save the payout details in Firestore
        const payoutRef = db.collection('Payouts').doc();  // 'Payouts' is the collection name
        await payoutRef.set({
            payoutDetails: payout,
            userId: userid,
            createdAt: new Date(),
        });

        res.json({ status: 'success', payout });

    } catch (error) {
        console.error('Error creating payout:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create payout: ' + error.message });
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
        throw new Error('Failed to fetch contacts');
    }
}

// Helper function to create a new contact
async function createNewContact(name, email, contact) {
    try {
        const newContact = await razorpayInstance.contacts.create({
            name,
            email,
            contact,
            type: 'employee', // Can be 'vendor', 'customer', etc.
        });
        return newContact;
    } catch (error) {
        throw new Error('Failed to create contact');
    }
}

// Helper function to create a Bank Account payout request
async function createBankPayout(contactId, accountNumber, ifsc, amount) {
    try {
        const payout = await razorpayInstance.payouts.create({
            account_number: 'your_account_number', // Replace with your linked Razorpay account
            fund_account: {
                account_type: 'bank_account',
                bank_account: {
                    name: 'Account Holder Name', // Replace with actual account holder's name
                    account_number: accountNumber,
                    ifsc: ifsc,
                },
                contact: {
                    id: contactId,
                },
            },
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            mode: 'IMPS', // Or 'NEFT', 'RTGS'
            purpose: 'payout',
            queue_if_low_balance: true,
        });

        return payout;
    } catch (error) {
        throw new Error('Failed to create bank account payout');
    }
}

// Helper function to create a UPI payout request
async function createUPIPayout(contactId, upiId, amount) {
    try {
        const payout = await razorpayInstance.payouts.create({
            account_number: 'your_account_number', // Replace with your linked Razorpay account
            fund_account: {
                account_type: 'vpa',
                vpa: {
                    address: upiId, // UPI ID of the user
                },
                contact: {
                    id: contactId,
                },
            },
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            mode: 'UPI',
            purpose: 'payout',
            queue_if_low_balance: true,
        });

        return payout;
    } catch (error) {
        throw new Error('Failed to create UPI payout');
    }
}

module.exports = {
    createPayout
};