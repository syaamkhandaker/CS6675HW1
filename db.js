import fs from 'fs';
import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTION_NAME } from './utils/constants.js';


 const connectDB = async (client) => {  
    try {
      console.log("Connecting to MongoDB...");
      await client.connect();
      console.log("Connected to MongoDB!");
  
      const db = client.db(DB_NAME);
      console.log('Connected to Database!')
  
      db.collection(COLLECTION_NAME).deleteMany({})
      console.log('Deleted collection entries!')

    } catch (error) {
      console.error("Error during startup:", error);
    }
}

 const insertData = async (client, data) => {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    await collection.insertOne(data);
}


export const dbMethods = {
  connectDB,
  insertData,
}