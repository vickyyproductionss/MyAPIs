require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const paymentRouter = require("./routes/Payment");
const bodyparse = require('body-parser');
const { logReqRes } = require("./middlewares");

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(bodyparse.json());
app.use(logReqRes("log.txt"));

var admin = require("firebase-admin");

// Check if running in Vercel environment
let serviceAccount;

if (process.env.FIREBASE_PROJECT_ID) {
    // Using environment variables
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handling newline characters
    };
} else {
    // Running locally, use the local JSON file
    serviceAccount = require("./guessthepassword-firebase-adminsdk-b8i7u-1d0f5961cb.json");
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guessthepassword-default-rtdb.firebaseio.com"
});


// Routes
app.use('/api/payments/verification', paymentRouter);

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
