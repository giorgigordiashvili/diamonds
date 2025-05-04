import { Db, MongoClient, ServerApiVersion } from 'mongodb';

// Use environment variable for the password in production
const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://info:<db_password>@diamonds.tj40ic6.mongodb.net/?retryWrites=true&w=majority&appName=diamonds';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Connect to the MongoDB server
  await client.connect();

  // Get reference to the database
  const db = client.db('diamonds');

  // Cache the database connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
