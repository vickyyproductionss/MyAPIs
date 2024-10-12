require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const paymentRouter = require("./routes/Payment");
const bodyparse = require('body-parser')
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");

//connectMongoDb("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2").then(() => {console.log("Connected to MongoDB");})
connectMongoDb(process.env.MONGO_URI).then(() => {console.log("Connected to MongoDB");})
app.set('view engine', 'ejs');
//Middleware - Plugin
app.use(express.urlencoded ({extended: false}));
app.use(bodyparse.json());
app.use(logReqRes("log.txt"));

//Routes
app.use('/api/payments/verification',paymentRouter);

app.listen(PORT,()=>{
    console.log(`Server started on PORT ${PORT}`);
})