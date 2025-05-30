import mongoose from "mongoose";
import Message, {
	IEditMessageInput,
	IMessage,
	IMessageInput,
} from "src/models/Message";
import { callGPT } from "src/services/message.service";
import Errors from "src/errors/errorFactory";
import { logError } from "src/services/errorLogger.service";
import CustomError from "src/errors/CustomError";
import { ErrorCode } from "src/errors/errorFactory";
import Chat, { ChatStatus } from "src/models/Chat";

// need to set up a redis cache to contextualize previous recipes
export const messageResolvers = {
	Mutation: {
		handleMessage: async (
			_parent: unknown,
			{ input }: { input: IMessageInput }
		): Promise<IMessage | string> => {
			try {
				const gptResponse = await callGPT(input.content);
				console.log("gptResponse", gptResponse);
				const message = new Message({
					chatId: input.chatId,
					sender: input.sender,
					content: JSON.stringify(gptResponse),
				});
				await message.save();
				// need to generate a name for the chat
				await Chat.findOneAndUpdate(
					{ _id: input.chatId },
					{ status: ChatStatus.ACTIVE },
					{ new: true }
				);

				const messageObj = message.toObject();
				return {
					...messageObj,
					id: messageObj._id,
				} as IMessage;
			} catch (err) {
				if (err instanceof CustomError) {
					switch (err.code) {
						case ErrorCode.TRACE_LOGGING_FAILED:
							console.log("Metadata:", err.metadata);
							console.log(
								"Response to return:",
								JSON.parse(err.metadata?.gptResponse as string)
							);
							if (!err.metadata?.gptResponse) {
								return JSON.stringify({ error: "Invalid response format" });
							}
							return JSON.stringify(err.metadata?.gptResponse);
						default:
							return JSON.stringify({
								error: err.message,
								code: err.code,
							});
					}
				} else {
					logError(Errors.Message.illFormedResponse(err));
					console.error("AxiosError caught in else block:", err);
					return JSON.stringify({
						error: "An unexpected error occurred",
						code: ErrorCode.UNKNOWN_ERROR,
					});
				}
			}
		},
		editMessage: async (
			_parent: unknown,
			{ id, input }: { id: string; input: IEditMessageInput }
		): Promise<IMessage> => {
			try {
				const message = await Message.findById(id);
				if (!message) {
					throw Errors.Message.notFound(id);
				}

				const updateData: { content: string; imageUrl?: string | null } = {
					content: input.content,
				};

				if ("imageUrl" in input) {
					updateData.imageUrl = input.imageUrl;
				}

				const updatedMessage = await Message.findByIdAndUpdate(id, updateData, {
					new: true,
				});

				if (!updatedMessage) {
					throw Errors.Message.updatedFailed();
				}

				const messageObj = updatedMessage.toObject();
				return {
					...messageObj,
					id: messageObj._id,
				} as IMessage;
			} catch (err) {
				logError(Errors.Message.editFailed(err));
				throw Errors.Message.editFailed(err);
			}
		},
	},
};

// client sends messa
// backend receives input
// formats data for chatgpt
// processes request (validate input, log interaction)
// chatgpt spits out formatted response
// we save response (format, add content)
// return response to frontend
