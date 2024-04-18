const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    job_title: {
        type: String,
    },
    gender: {
        type: String,
    },
    },
    {timestamps:true}
);


const User = mongoose.model("user",userSchema);

module.exports = User;