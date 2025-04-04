// import Message from "src/models/Message";
import mongoose from "mongoose";
import Chat, { IChat, IChatPreview } from "src/models/Chat";
import Message from "src/models/Message";
import Errors from "src/errors/errorFactory";
import { logError } from "src/services/errorLogger.service";

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
					throw Errors.Chat.notFound(id);
				}
				const chatObj = chat.toObject();
				return {
					...chatObj,
					id: chatObj._id,
				} as IChat;
			} catch (err) {
				logError(Errors.Chat.fetchFailed(err), { id });
				throw Errors.Chat.fetchFailed(err);
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
				logError(Errors.Chat.fetchFailed(err), { userId });
				throw Errors.Chat.fetchFailed(err);
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
				logError(Errors.Chat.createFailed(err), { userId });
				throw Errors.Chat.createFailed(err);
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
				if (!chat) throw Errors.Chat.notFound(id);
				return chat.name;
			} catch (err) {
				logError(Errors.Chat.renameFailed(err), { id });
				throw Errors.Chat.renameFailed(err);
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
				if (!chat) throw Errors.Chat.notFound(id);
				const messagesCount = await Message.countDocuments({
					chatId: id,
				}).session(session);
				if (messagesCount > 0) {
					throw Errors.Chat.deleteFailed("Failed to delete all messages");
				}
				await session.commitTransaction();
				session.endSession();
				return id;
			} catch (err) {
				await session.abortTransaction();
				session.endSession();
				logError(Errors.Chat.deleteFailed(err), { id });
				throw Errors.Chat.deleteFailed(err);
			}
		},
	},
};
