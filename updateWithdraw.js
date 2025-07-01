const mongoose = require('mongoose');
const Widthdraw = require('./server/Model/widthdrawSchema'); // Adjust the path to your Widthdraw model

async function updateWithdrawalsToMatchSchema() {
    try {
        // Fetch all withdrawals from the database
        const withdrawals = await Widthdraw.find({});

        // Define default values based on the schema
        const defaultValues = {
            amount: undefined, // No default, as it's not specified in the schema
            type: undefined, // No default, as it's not specified in the schema
            narration: undefined, // No default, as it's not specified in the schema
            status: 'pending', // Schema default
            owner: undefined, // No default, as it's a reference field
        };

        // Iterate through all withdrawals
        for (const withdrawal of withdrawals) {
            let needsUpdate = false;
            const updateData = {};

            // Check each field in the schema
            for (const [field, defaultValue] of Object.entries(defaultValues)) {
                // If the field is missing or undefined, set the default value (if applicable)
                if (withdrawal[field] === undefined || withdrawal[field] === null) {
                    // For fields without defaults, log a warning but skip updating them
                    if (['amount', 'type', 'narration', 'owner'].includes(field)) {
                        console.warn(`Withdrawal ${withdrawal._id} is missing field: ${field}`);
                        continue;
                    }
                    updateData[field] = defaultValue;
                    needsUpdate = true;
                }
            }

            // If any fields need updating, perform the update
            if (needsUpdate) {
                await Widthdraw.updateOne(
                    { _id: withdrawal._id },
                    { $set: updateData },
                    { runValidators: true }
                );
                console.log(`Updated withdrawal ${withdrawal._id} with missing fields`);
            }
        }

        console.log('Withdrawal schema update completed');
    } catch (error) {
        console.error('Error updating withdrawals:', error.message);
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
        await updateWithdrawalsToMatchSchema();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
})();