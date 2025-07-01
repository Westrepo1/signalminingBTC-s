const mongoose = require('mongoose');
const Deposit = require('./server/Model/depositSchema'); // Adjust the path to your Deposit model

async function updateDepositsToMatchSchema() {
    try {
        // Fetch all deposits from the database
        const deposits = await Deposit.find({});

        // Define default values based on the schema
        const defaultValues = {
            amount: undefined, // No default, as it's not specified in the schema
            coinSelect: undefined, // No default, as it's not specified in the schema
            walletAddress: undefined, // No default, as it's not specified in the schema
            image: undefined, // No default, as it's not specified in the schema
            status: 'pending', // Schema default
            owner: undefined, // No default, as it's a reference field
        };

        // Iterate through all deposits
        for (const deposit of deposits) {
            let needsUpdate = false;
            const updateData = {};

            // Check each field in the schema
            for (const [field, defaultValue] of Object.entries(defaultValues)) {
                // If the field is missing or undefined, set the default value (if applicable)
                if (deposit[field] === undefined || deposit[field] === null) {
                    // For fields without defaults, log a warning but skip updating them
                    if (['amount', 'coinSelect', 'walletAddress', 'image', 'owner'].includes(field)) {
                        console.warn(`Deposit ${deposit._id} is missing field: ${field}`);
                        continue;
                    }
                    updateData[field] = defaultValue;
                    needsUpdate = true;
                }
            }

            // If any fields need updating, perform the update
            if (needsUpdate) {
                await Deposit.updateOne(
                    { _id: deposit._id },
                    { $set: updateData },
                    { runValidators: true }
                );
                console.log(`Updated deposit ${deposit._id} with missing fields`);
            }
        }

        console.log('Deposit schema update completed');
    } catch (error) {
        console.error('Error updating deposits:', error.message);
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
        await updateDepositsToMatchSchema();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
})();