import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

let uri = process.env.MONGO_URI || "";
console.log('uri', uri)
let dbName = process.env.MONGO_DB;

let cachedClient : MongoClient | null = null;
let cachedDb : Db | null = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    const db = await client.db(dbName);
    console.log(dbName)

    cachedClient = client;
    cachedDb = db;

    return { client, db };

  } catch(error) {
    console.error("Failed to connect to the database", error);
    throw new Error("Failed to connect to the database");
  }

  
}