import Chat from "src/models/Chat";
// import Message from "src/models/Message";
import { IChat } from "src/models/Chat";
import createError from "src/services/error.service";

export const chatResolvers = {
	Query: {
		getChat: async (
			_parent: unknown,
			{ id }: { id: string }
		): Promise<IChat | null> => {
			try {
				const chat = await Chat.findById(id).populate({
					path: "messages",
					options: { sort: { createdAt: -1 } },
				});

				if (!chat) {
					throw createError(`Chat with id: ${id} not found`);
				}
				return chat.toObject() as unknown as IChat;
			} catch (err) {
				console.log("Error fetching chat", err);
				throw new Error("Failed to fetch chat.");
			}
		},
	},
};
