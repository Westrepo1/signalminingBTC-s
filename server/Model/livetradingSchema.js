
const mongoose = require('mongoose');


const livetradeSchema = new mongoose.Schema({
    asset:{
        type: String,
    },
    amount: {
        type: Number,
    },
    currency:{
        type: String,
    },
    leverage:{
        type: String,
    },
    expire:{
        type: String,
    },
    order:{
       type: String
    },
    status: {
        type: String,
        default: 'pending'
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true
    }
}, {timestamps: true});

const Livetrading = mongoose.model("livetrade", livetradeSchema)
module.exports = Livetrading;