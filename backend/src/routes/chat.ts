import express from "express";
// import { ObjectId } from "mongodb";
const chatRouter = express.Router();
const CHAT_COLLECTION = "Chats";

chatRouter.get("/", async (req, res) => {
	const { mongoDb } = req.context;
	try {
		if (mongoDb) {
			const db = await mongoDb.collection(CHAT_COLLECTION);
			const results = await db.find({}).toArray();
			res.json({ results });
		}
	} catch (err) {
		console.error("Error fetching data:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
export default chatRouter;
//milk, eggs, fish, Crustacean shellfish, tree nuts, peanuts, wheat, and soybeans.
//google geolocation API
