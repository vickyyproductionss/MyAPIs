const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true,
    },
    serverStatus:{
        type: String,
        required: true,
    }
    },
    {timestamps:true}
);


const Support = mongoose.model("SupportModel",supportSchema);

module.exports = Support;