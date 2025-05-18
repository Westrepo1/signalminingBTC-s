

const mongoose = require('mongoose');


const upgradeSchema = new mongoose.Schema({
    type:{
        type:String,
    },
    amount:{
        type:Number,
    },
    duration:{
        type:String,
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

const Upgrade = mongoose.model('upgrade', upgradeSchema);

module.exports = Upgrade; 