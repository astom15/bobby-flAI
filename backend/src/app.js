import express from 'express';
import pg from 'pg';
import dotenv from "dotenv";
import { MongoClient } from 'mongodb';

const app = express();
dotenv.config();

//Mongo connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongoDBName = 'cookbook';
const mongoClient = new MongoClient(uri);
let mongoDb;
// PG
const pgPool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

app.use(express.json());

const dbContextMiddleware = async (req, res, next) => {
	try {
		if (!mongoDb) mongoDb = mongoClient.db(mongoDBName);
		req.context = { pgPool, mongoDb };
		next();
	} catch (err) {
		console.error("DB connection error:", err);
		res.status(500).json({ error: "DB connection error" });
	}
}
app.use(dbContextMiddleware);


app.listen(process.env.MONGO_PORT, async () => {
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    console.log("Server running at http://localhost:" + process.env.MONGO_PORT);
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
});


process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pgPool.end(); 
  await mongoClient.close(); 
  console.log('Connections closed. Goodbye!');
  process.exit(0);
});