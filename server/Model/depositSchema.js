const mongoose = require('mongoose');


const depositSchema = new mongoose.Schema({
    amount: {
        type: Number,
    },

    coinSelect:{
        type:String
    },
    walletAddress:{
        type: String
    },
    image:{
        type:String
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

const Deposit = mongoose.model('deposit', depositSchema);

module.exports = Deposit;
