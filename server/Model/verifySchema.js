
const mongoose = require('mongoose');




const verifySchema = new mongoose.Schema({
    fullname:{
        type: String,
    },
    email:{ 
        type: String,
    },

    tel:{
        type: String,
    },

    dob:{
        type: String,
    },

    media:{
        type: String,
    },

    address:{
        type: String,
    },

    city:{
        type: String,
    },
    state:{
        type: String,
    },

    country:{
        type: String,
    },

    type:{
        type: String,
    },

    fimage:{
        type: String,
    },
    image:{
        type: String,
    },



    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true
    }
})


const Verify = mongoose.model('verify', verifySchema);

module.exports = Verify;