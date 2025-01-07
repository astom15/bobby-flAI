import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";
dotenv.config();

//Mongo connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongoDBName = "cookbook";
const mongoClient = new MongoClient(uri);
// PG
const prisma: PrismaClient = new PrismaClient();

const initializeMongoDB = async () => {
	await mongoClient.connect();
	console.log("Connected to MongoDB");
	return mongoClient.db(mongoDBName);
};

export { mongoClient, prisma, initializeMongoDB };
