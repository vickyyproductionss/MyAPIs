require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const paymentRouter = require("./routes/Payment");
const bodyParser = require('body-parser');

// Middleware
app.set('view engine', 'ejs');
// Use body-parser middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


var admin = require("firebase-admin");

// Check if running in Vercel environment
let serviceAccount;

if (process.env.FIREBASE_PROJECT_ID) {
    // Using environment variables
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCppw5xp46mfpjF\nwv10fXpd+EH/0gpp3ZzOZ82cVLar0DmvF2bRYMf5Z+jAxulBB25ghNthL1kh/93L\nE+FKWtTC2Y7m5ApmZlDwy+/kdinpmT07/6FqpWrkUJSrdpWoIZ3NEUyw2nTBrpQg\nbbFC5yfrzg3Q5XFULSv3hzDvf3vjGrfYPNjAHlS+4+0n53uB05rt+VyBi2SIAHEy\njAKSwcCD/sxgKBdlPSVdACple0w8YnQcImhLuZpB5p2vgovzGVOCtAN1dEizAdDe\n7yv6jU60lCVJUm5ZuV74oYIhd13SU6kmBL4wWgjOn2NSNcxp1LWBOnSvuij4kho6\nCWdDP4lJAgMBAAECggEAMBwwy2hB2tNBzas7JwLCZc2WIc7VpynyYtIrC682Ukjt\nYsrXHH8+lmqyJaEC2q8ZzQNAFzJPK4Ycxo8vr19MwKjjjnSSwnE3eOHMeNRNlHIh\nXFdk1hJs2qxDTNCHJjPKRTIntmts+tPgK8YPo7JbrtIzNs8qMT3SHxLWfMSBRGiD\nlLGJUMWaoQpdcxKnA90OHUgoN6J7Jj2jhc5m9Ehynq0+7UD8aHKN8DvqsrTXObH5\nEqieCNKqLcTK6dr42Bt24VpnOv/GzKSxyK7ciN7IMk6DmFIBnwEq052h9+0x9NpR\nu9KSyor6yCljc6vTiFCAo4ApPb/7ZlDy8pG5h+L89QKBgQC+U6jrkDXewNueuiMG\nYiUxIKIAcuhphJYCSYrAWT+Vq0kTEkQpQngjccW2aFWubJtW+ydbr3bH12dU6oUR\nhUzKjb6QazXdO1m5M9YQbAns62eVPbw7EW2Z6ZnTHbeBPrKCH/KQelGwfXtZkliC\n6apGM8RCQT+OUdtg+Sz7iOaJLwKBgQDkMShVWJXc+co7QylMvlJixb9rYJlwDzy7\niCg3ZvV9PoFw7QdngtyAZlHX3AoN9OXAZ1TgmDquYDVAHDLKNcKFZEtohkUP2NtX\nd4RsEpfPB9MgOcrDyoJ8DnyJ9BJfbyoazcGk4wmGbqS9MJBeAk6mEfVaebO9JwFP\nJ5bYHIaHBwKBgC1ySpadI8/h209GgRCIJPtbIHPc/FQd3bgEGYaeiQlTEirkpLP5\ndDh6dUx+E1+H/XvCkv5YopNLgxgKu+WYH+MJ/6P6ha0i++S2VPos4h3ZhC1lxWmR\nWstytVFs+iF5eCSMPl5zZsgu3mJgCJSR+R+0QrvTWrrAHxNDzJLveKTvAoGAYmT7\n8kkfXchrtkAQd+H9HlAMaR2fK922H1rnlHQV2KpyICJktfKMZ+U21zAvObNmuh8U\nTz/01anwbDN8hwrFVMVZarmy39FvSvjjJcKiqQfDtrqUvvX8a8fHVajjnzkM27/r\nBtFLEyd0a4ucRJ0UErHdrOSbZy2BeAMnHQq3y1MCgYBSZDh35pQN6RssjQKgvUDX\nTSUsfW1ZzkbEnaSgUcjgVSysYOCNzTvzd9wI0BgTg4nW4hg5QW8LqfDmPfGa8k81\nPeUXVIX4WHUHTdeSz3lKVpnjWGUe6k/NvTJXJJSz/4z/AcwHboo1ScTIuJnR9F3g\nWYuAfYY3emIabgDmCKBh7Q==\n-----END PRIVATE KEY-----\n", // Handling newline characters
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
