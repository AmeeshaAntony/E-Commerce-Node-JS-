const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                userData.password = await bcrypt.hash(userData.password, 10); // Ensure password field is used
                const data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData);
                userData._id = data.insertedId;
                resolve(userData);
            } catch (err) {
                reject(err);
            }
        });
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
                if (user) {
                    console.log('User found:', user);
                    console.log('Comparing passwords:', userData.password, user.password); // Ensure password field is used
                    const match = await bcrypt.compare(userData.password, user.password);
                    if (match) {
                        console.log('Password match');
                        resolve({ status: true, user });
                    } else {
                        console.log('Password does not match');
                        resolve({ status: false });
                    }
                } else {
                    console.log('User not found');
                    resolve({ status: false });
                }
            } catch (err) {
                console.error('Error comparing passwords:', err);
                reject(new Error('Internal error'));
            }
        });
    }
};
