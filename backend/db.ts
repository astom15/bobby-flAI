import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoose, { Connection } from "mongoose";
import "src/models";

dotenv.config();

//Mongo connection
const mongoDBName = "cookbook";
const mongoUri =
	process.env.MONGODB_URI || `mongodb://localhost:27017/${mongoDBName}`;

// PG
const prisma: PrismaClient = new PrismaClient();

const initializeMongoDB = async () => {
	try {
		await mongoose.connect(mongoUri);
		const mongoDb: Connection = mongoose.connection;
		mongoDb.on(
			"error",
			console.error.bind(console, "MongoDB connection error:")
		);
		mongoDb.once("open", () => console.log("MongoDB connected successfully."));
		return mongoDb;
	} catch (err) {
		console.error("Failed to connect to mongo:", err);
		throw err;
	}
};

export { prisma, initializeMongoDB };
