const mongoose = require('mongoose');
const User = require('./server/Model/User'); // Adjust the path to your User model

async function updateUsersToMatchSchema() {
    try {
        // Fetch all users from the database
        const users = await User.find({});

        // Define default values based on the schema
        const defaultValues = {
            username: undefined, // Required, no default
            fullname: undefined, // Required, no default
            tel: undefined, // Required, no default
            email: undefined, // Required, no default
            country: undefined, // Required, no default
            currency: undefined, // Required, no default
            password: undefined, // Required, no default
            image: '/profile/default.png',
            annText: 'announcement appears here',
            annLink: 'Here is the billing link',
            annButton: 'billing button',
            balance: 0,
            profit: 0,
            totalwithdraw: 0,
            otp: 0,
            otpExpires: null,
            signals: [],
            copytrades: [],
            livetrades: [],
            upgrades: [],
            Loan: [],
            verified: [],
            deposits: [],
            widthdraws: [],
            Tickets: [],
            role: 0,
        };

        // Iterate through all users
        for (const user of users) {
            let needsUpdate = false;
            const updateData = {};

            // Check each field in the schema
            for (const [field, defaultValue] of Object.entries(defaultValues)) {
                // If the field is missing or undefined, set the default value (if applicable)
                if (user[field] === undefined || user[field] === null) {
                    // For required fields without defaults, log a warning but skip updating them
                    if (['username', 'fullname', 'tel', 'email', 'country', 'currency', 'password'].includes(field)) {
                        console.warn(`User ${user._id} is missing required field: ${field}`);
                        continue;
                    }
                    updateData[field] = defaultValue;
                    needsUpdate = true;
                }
            }

            // If any fields need updating, perform the update
            if (needsUpdate) {
                await User.updateOne(
                    { _id: user._id },
                    { $set: updateData },
                    { runValidators: true }
                );
                console.log(`Updated user ${user._id} with missing fields`);
            }
        }

        console.log('User schema update completed');
    } catch (error) {
        console.error('Error updating users:', error.message);
    } finally {
        // Optional: Close the MongoDB connection if not needed
        // mongoose.connection.close();
    }
}

// Run the function
(async () => {
    try {
        await mongoose.connect('mongodb+srv://pius1:pius123@webdevelopment.xav1dsx.mongodb.net/worlex', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        await updateUsersToMatchSchema();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
})();