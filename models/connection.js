const { MongoClient } = require('mongodb');

// const MONGO_DB_URL = 'mongodb://mongodb:27017/StoreManager';
const MONGO_DB_URL = 'mongodb://localhost:/27017';
const DB_NAME = 'StoreManager';

let schema = null;

async function connection() {
  if (schema) return Promise.resolve(schema);
  return MongoClient.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((conn) => conn.db(DB_NAME))
    .then((dbSchema) => {
      schema = dbSchema;
      return schema;
    });
}

module.exports = connection;