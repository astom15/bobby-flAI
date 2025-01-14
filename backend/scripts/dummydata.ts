import mongoose from "mongoose";
import Chat from "src/models/Chat";
import Message, { IMessage, Sender } from "src/models/Message";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

export async function createDummyData() {
	try {
		await mongoose.connect(process.env.MONGODB_URI || "");

		console.log("Connected to MongoDB");

		// Clear existing data
		await Chat.deleteMany({});
		await Message.deleteMany({});

		// Create dummy chats
		const chats = await Chat.insertMany([
			{ userId: "user1", name: "Chat 1", status: "ACTIVE" },
			{ userId: "user2", name: "Chat 2", status: "TEMPORARY" },
		]);

		console.log("Inserted Chats:", chats);

		// Create dummy messages
		const messages: IMessage[] = [];
		chats.forEach((chat, index) => {
			for (let i = 0; i < 5; i++) {
				messages.push({
					id: uuidv4(),
					chatId: chat._id,
					sender: Sender.USER,
					content: `Message ${i + 1} for ${chat.name}`,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		});

		const insertedMessages = await Message.insertMany(messages);
		console.log("Inserted Messages:", insertedMessages);

		// Close the connection
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	} catch (error) {
		console.error("Error creating dummy data:", error);
		process.exit(1);
	}
}
