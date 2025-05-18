

const mongoose = require('mongoose');


const copySchema = new mongoose.Schema({
    
    amount: {
        type: Number,
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

const Copy = mongoose.model('copytrade', copySchema);

module.exports = Copy;