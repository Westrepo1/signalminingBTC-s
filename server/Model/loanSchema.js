const mongoose = require('mongoose');


const loanSchema = new mongoose.Schema({
    
    amount: {
        type: String,
    },
    loanType:{
        type: String,
    },
    duration:{
        type: String,
    },
    income:{
        type: String,
    },
    desc:{
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

const Loan = mongoose.model("loan", loanSchema)

module.exports = Loan;