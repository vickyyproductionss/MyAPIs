require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const paymentRouter = require("./routes/Payment");
const payoutRouter = require("./routes/Payout");
const bodyParser = require('body-parser');
const admin = require("firebase-admin");

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Firebase Initialization
let serviceAccount;

if (process.env.FIREBASE_PROJECT_ID) {
    // Using environment variables
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDdJDVG9Lqx3yZ8\nq1ViVbecZrcqnf0zmBC+MYoI8mBJsiTlP6uRs2y+AqlOY/R09aeTYt5kWg+qGbQW\nQmm3PCo2TNLNWphm2pNjhlYZtRU43tKbQb7kswMHkPA/sUvMopCdrqpVWgYJLKO7\nNdHsq7z8Hs6u1Mfpat+/MrD+Y5JR22nT/yfO8KFU4oADhK/OzfsDenyL1V5Z3N4L\nGNgYLK3EPfmsF8FUCfqdT2CeX39WHX3NC01pS2swXqFXNE7daP5Dhk9oM6REHEvB\nUYYtwlP0HfNqhHUcRDr+e5KHGGlJ8VYp0pab7PSdS6K6oG5merKOdqZ4vcOobX2I\nGG1WUZA9AgMBAAECggEAOEepw3gvN2uKWPolzdPw2b4OaasxsHrH8A+diK9esALF\nfw6YNImMaEM3IXsw0L9gOZNU9Aczq1/FRFD8pKSMPauJjre6x5pjHlYm/X3ne8TB\npr+xvHSOldNeQWd22gqZcXftY7F4jcctmEyXM3t1qliQ00/V3OLVNMzK3MMsjuYm\nOpMIoeSLroJUmDzQiRLyvxXXAw/peOiW2gG8+Fvx6WGawoBPTPq1FkEGyKk9s9jW\nCZQlH5Mb8CKi3dApfeMy3Vbzqmn/AkPgShxODOYgYq2+W94xG+QTvbqWT+KRqykG\nXfCooEzwzDA0xn/5TR/avqJQJsKO/VSVd+MHWM9ipQKBgQD1jic8c2GUyLP0Quum\ns71jPRgSuKQEV8UN4ToaVeLlGJDvacO7Lr3tcQidnacKdElWP2oWbQSqUI1ngvPT\nktLTOYlpy7M1xsNrVoglNfw0mPtafkYIgPBKfUyifv8KhS+42H3ts2n/+6Yh/4Bt\npb/cO2Qdo40e1xtNgP3MAqOarwKBgQDmjDaChw3Zxf/97BL/1jvswoXeBASaIzbl\n14/F2J8t93Wo9mHPZIScNSF+oSD5qXHk7wt2cOg6hhxrOr/qrPnkXZhBe5GVu2s5\nn6dRUxCe1FdlZ0Ultck9S/7JzmfHJLxvFo9zpip/9uSOPgWnAgFV5Rk25o3Ek2Fm\ntS5B7BSO0wKBgEYowJMoEFh3Y9tFh5kQv+rr2MX4lXxcK4REttoxceutMjQFjxQb\nTc7avfByy/hTs2R+J+ySZ4PWEiDiLJJl3/DT/qwItIKH8OvpRGsFWrMYhrCbZZ0m\nYgGWfV/sUyiJV1JEIO7alU27dANAwkwR0Ji3K2rAgSCvqzBgy6MPmfknAoGAMmD3\nVGSQuULUIregmzlEVQNY31//ZXNGfskxCKnCdvf5RRe53ej4NW5CyHoLS6MkWUOH\nPLWFeaxur1viLjToUmfFaqHG+XJABxKFLHc7TYnXIziC2q+zrupZXd31vYWgi6Hh\nbQMljFr2LMMO1yTQB+YNMXsGBauzAA+dcRhWkbMCgYAFSPKw2DVX2Cwg7ueXGF9/\nIAqqfyp8URjnczTw9tg8DA8XhC98rfaxpTk+L7xG0a/SKzhmxHVIZ7ICm4ZAxmwa\nsEV0Y8pv+M4Tv1q334HalRYmvBSMxQd8S5MBxP4tsI+2km50HX/I71yEMFnQFgp7\nHRUBposkUwPA6xWSsV2ZiA==\n-----END PRIVATE KEY-----\n", // Handling newline characters
    };
} else {
    // Running locally, use the local JSON file
    serviceAccount = require("./ServiceAccount.json");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://safez-11f54.firebaseio.com"  // Replace <your-project-id> with your actual Firebase project ID
});

// Function to generate random data
function generateRandomData() {
    const randomData = {
        number: Math.floor(Math.random() * 1000), // Random number between 0-999
        string: Math.random().toString(36).substring(2, 15), // Random string of characters
        timestamp: new Date().toISOString() // Current timestamp
    };
    return randomData;
}

// Function to generate a random number (to append to the 'User_' prefix)
function generateRandomNumber() {
    return Math.floor(Math.random() * 1000000); // Generates a random number between 0 and 999999
}

// Function to write random data to Firebase with a unique node name (e.g., User_123123)
function writeRandomData() {
    const randomData = generateRandomData();
    const randomNumber = generateRandomNumber();  // Generate random number for unique user key
    const userKey = `HelloKUNDUUUU`;  // Generate the unique user key

    const ref = admin.database().ref('randomData'); // Reference to 'randomData' in Firebase
    
    // Create the node with the custom key (e.g., User_123123)
    const newNodeRef = ref.child(userKey);  // Use the custom user key as the node
    
    // Write random data to the newly created node
    newNodeRef.set(randomData, (error) => {
        if (error) {
            console.error('Error writing data to Firebase:', error);
        } else {
            console.log('Random data written to Firebase at node:', userKey);
            console.log('Data:', randomData);
        }
    });
}

// Function to read random data from Firebase (based on specific user node, e.g., User_123123)
function readRandomData(userKey) {
    const ref = admin.database().ref('randomData'); // Reference to 'randomData' in Firebase
    
    // Read the data from the specific node (using userKey like 'User_123123')
    ref.child(userKey).once('value', (snapshot) => {
        if (snapshot.exists()) {
            console.log(`Random data from Firebase at ${userKey}:`, snapshot.val());
        } else {
            console.log(`No data found for ${userKey}`);
        }
    });
}

// Routes
app.use('/api/payments/verification', paymentRouter);
app.use('/api/payouts/verification', payoutRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});

// Run 10 times every second (100 milliseconds interval)
setInterval(() => {
    for (let i = 0; i < 2; i++) {
        // Perform write and read 10 times within 1 second
        writeRandomData();
    }
}, 200); // Run every 100 milliseconds (10 times per second)