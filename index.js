require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const userRouter = require("./routes/user");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");

connectMongoDb(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
})
app.set('view engine', 'ejs');
//Middleware - Plugin
app.use(express.urlencoded ({extended: false}))
app.use(logReqRes("log.txt"));

//Routes
app.use('/api/users',userRouter);

app.listen(PORT,()=>{
    console.log(`Server started on PORT ${PORT}`);
})