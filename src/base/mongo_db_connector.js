const { MongoClient } = require('mongodb');
const mongodbConnector = async()=>{
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    const dbName = 'db_mongodb';
      await client.connect();
      console.log('Connected successfully to server');
      const db = client.db(dbName);
      return db;
}
module.exports={
    mongodbConnector
}