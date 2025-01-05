import pg from "pg";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

//Mongo connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongoDBName = "cookbook";
const mongoClient = new MongoClient(uri);
// PG
const pgPool = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});

const initializeMongoDB = async () => {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    return mongoClient.db(mongoDBName);
}

export { mongoClient, pgPool, initializeMongoDB };