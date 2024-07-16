const { MongoClient } = require('mongodb');

const state = {
    db: null
};

module.exports.connect = async function (done) {
    const url = 'mongodb://localhost:27017';
    const dbname = 'shopping';

    try {
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        state.db = client.db(dbname);
        console.log('MongoDB connected successfully');

        done();
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        done(err);
    }
};

module.exports.get = function () {
    return state.db;
};
