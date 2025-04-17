import mongoose from "mongoose";
import Message, {
	IEditMessageInput,
	IMessage,
	IMessageInput,
} from "src/models/Message";
import { callGPT } from "src/services/message.service";
import Errors from "src/errors/errorFactory";
import { logError } from "src/services/errorLogger.service";

// need to set up a redis cache to contextualize previous recipes
export const messageResolvers = {
	Mutation: {
		handleMessage: async (
			_parent: unknown,
			{ input }: { input: IMessageInput }
		): Promise<string> => {
			try {
				const gptResponse = await callGPT(input.content);
				// const { name, prepTime, cookTime, totalTime, ingredients, steps } =
				// 	gptResponse[0];
				// console.log(gptResponse);
				return JSON.stringify(gptResponse);
			} catch (err) {
				if (err instanceof Errors.Message.noResponseGenerated) {
					logError(err);
					throw err;
				} else if (err instanceof Errors.TraceLogging.insertFailed) {
					logError(err);
					return JSON.stringify(
						(err as unknown as { gptResponse: string }).gptResponse
					);
				} else {
					logError(Errors.Message.illFormedResponse(err));
					throw Errors.Message.illFormedResponse(err);
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
