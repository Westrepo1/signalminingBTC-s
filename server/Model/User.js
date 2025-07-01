const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    fullname: {
        type: String,
        required: [true, 'Please enter your full name'],
        trim: true
    },
    tel: {
        type: String,
        required: [true, 'Please enter a phone number'],
        validate: {
            validator: function (v) {
                return /\+\d{1,3}\d{6,14}/.test(v); // Basic phone number validation
            },
            message: 'Please enter a valid phone number'
        }
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    country: {
        type: String,
        required: [true, 'Please select a country']
    },
    currency: {
        type: String,
        required: [true, 'Please select a currency']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function (v) {
                // Basic password validation: at least one letter and one number
                return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v);
            },
            message: 'Password must contain at least one letter and one number'
        }
    },
    image: {
        type: String,
        default: '/profile/default.png'
    },
    annText: {
        type: String,
        default: 'announcement appears here'
    },
    annLink: {
        type: String,
        default: 'Here is the billing link'
    },
    annButton: {
        type: String,
        default: 'billing button'
    },
    balance: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
        default: 0
    },
    totalwithdraw: {
        type: Number,
        default: 0
    },
    otp: {
        type: Number,
        default: 0
    },
    otpExpires: {
        type: Date,
        default: null
    },
    signals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'signal'
    },
    copytrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'copytrade'
    },
    livetrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'livetrade'
    },
    upgrades: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'upgrade'
    },
    Loan: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'loan'
    },
    verified: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'verify'
    },
    deposits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'deposit'
    },
    widthdraws: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'widthdraw'
    },
    Tickets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ticket'
    },
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email');
    }
    if (password !== user.password) {
        throw new Error('Incorrect password');
    }
    return user; // Return the user on successful login
};

const User = mongoose.model('user', userSchema);

module.exports = User;