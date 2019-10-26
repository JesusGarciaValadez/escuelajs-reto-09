const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;
console.log(MONGO_URI);

class MongoConnect {
  constructor() {
    this.client = new MongoClient(
      MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoConnect.connection) {
      MongoConnect.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }

          console.log('Connected succesfully to mongo'); // eslint-disable-line no-console
          resolve(this.client.db(this.dbName));
        });
      });
    }
    return MongoConnect.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .toArray();
    });
  }
}

module.exports = MongoConnect;
