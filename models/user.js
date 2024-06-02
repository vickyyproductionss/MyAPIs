const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    sender_id:{
        type: String,
        required: true,
    },
    sender_name:{
        type: String,
        required: true,
    },
    sender_crushname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
    },
    sender_from_id: {
        type: String,
    },
    },
    {timestamps:true}
);


const User = mongoose.model("user",userSchema);

module.exports = User;