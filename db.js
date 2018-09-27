const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
    client: null
};

module.exports.connect = (url, dbName, done) => {
    if(state.client) {
        return done();
    }

    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if(err) {
            return done(err);
        }

        console.log('Connected correctly to server');

        state.client = client;
        state.db = client.db(dbName);
        done();
    });
};

module.exports.get = () => {
    return state.db;
};

module.exports.close = () => {
    if(state.client) {
        state.client.close();
    }
}