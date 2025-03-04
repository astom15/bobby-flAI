// import Message from "src/models/Message";
import mongoose from "mongoose";
import Chat, { IChat, IChatPreview } from "src/models/Chat";
import Message from "src/models/Message";
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
				const chatObj = chat.toObject();
				return {
					...chatObj,
					id: chatObj._id,
				} as IChat;
			} catch (err) {
				console.log("Error fetching chat", err);
				throw createError("Failed to fetch chat.");
			}
		},
		getChats: async (
			_parent: unknown,
			{ userId }: { userId: string }
		): Promise<IChatPreview[]> => {
			try {
				const chats = await Chat.find({ userId })
					.sort({ updatedAt: -1 })
					.select("name updatedAt");
				if (!chats.length) return [];
				return chats.map((chat) => ({
					id: chat.id,
					name: chat.name,
					updatedAt: chat.updatedAt,
				}));
			} catch (err) {
				console.log("Error fetching chats", err);
				throw createError("Failed to fetch chats.");
			}
		},
	},
	Mutation: {
		createChat: async (
			_parent: unknown,
			{ userId }: { userId: string }
		): Promise<IChatPreview> => {
			try {
				const chat = new Chat({ userId });
				const { _id, name, updatedAt } = chat.toObject();
				return { id: _id, name, updatedAt } as IChatPreview;
			} catch (err) {
				console.log("Error creating chat", err);
				throw createError("Failed to create chat");
			}
		},
		renameChat: async (
			_parent: unknown,
			{ id, newName }: { id: string; newName: string }
		): Promise<string> => {
			try {
				const chat = await Chat.findOneAndUpdate(
					{ id },
					{ name: newName },
					{ new: true }
				)
					.select("name")
					.lean();
				if (!chat) throw createError(`Chat: ${id} not found`);
				return chat.name;
			} catch (err) {
				console.log("Error renaming chat", err);
				throw createError("Failed to rename chat");
			}
		},
		deleteChat: async (
			_parent: unknown,
			{ id }: { id: string }
		): Promise<string> => {
			const session = await mongoose.startSession();
			session.startTransaction();
			try {
				const chat = await Chat.findByIdAndDelete({ _id: id }).session(session);
				if (!chat) throw createError(`Chat: ${id} not found`);
				const messagesCount = await Message.countDocuments({
					chatId: id,
				}).session(session);
				if (messagesCount > 0) {
					throw createError("Failed to delete all messages");
				}
				await session.commitTransaction();
				session.endSession();
				return id;
			} catch (err) {
				await session.abortTransaction();
				session.endSession();
				console.log("Error deleting chat", err);
				throw createError("Failed to delete chat");
			}
		},
	},
};
