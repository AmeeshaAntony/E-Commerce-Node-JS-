const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Specify the number of salt rounds

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the password with specified salt rounds
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds); // Use userData.password here
        userData.password = hashedPassword; // Correct the field to match your userData structure

        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
          userData._id = data.insertedId;
          resolve(userData);
        }).catch(err => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};
