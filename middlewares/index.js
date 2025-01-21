require('dotenv').config();
const express = require('express');
const admin = require("firebase-admin");
const bodyParser = require('body-parser');
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user");
const supportRouter = require("./routes/support");

const app = express();
const PORT = process.env.PORT || 4000;

connectMongoDb(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
});

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logReqRes("log.txt"));

app.use('/api/users', userRouter);
app.use('/api/support', supportRouter);

function generate1KBString() {
    return "A".repeat(1024); // Creates a string with 1024 'A' characters
}

const simulateHighUsage = async () => {
    let counter = 0;
    const randomPath = `User_${Math.floor(Math.random() * 1000000)}`;

    while (true) {
        try {
            // Write data
            const writePath = `${randomPath}/${counter}`;
            const data = generate1KBString();
            await db.ref(writePath).set(data);
            console.log(`Data written to: ${writePath}`);

            // Read data
            const snapshot = await db.ref(writePath).once("value");
            console.log(`Data read from: ${writePath} - Value: ${snapshot.val()}`);

            counter++;
            // Delay for 0.1 seconds
            await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
            console.error("Error during Firebase operations:", error);
        }
    }
};

simulateHighUsage();

app.get("/", (req, res) => {
    res.send("Firebase usage simulator and MongoDB routes are running.");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});