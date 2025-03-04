import mongoose from "mongoose";
import Message, {
	IEditMessageInput,
	IMessage,
	IMessageInput,
} from "src/models/Message";
import createError from "src/services/error.service";
import { callGPT } from "src/services/message.service";

// need to set up a redis cache to contextualize previous recipes
export const messageResolvers = {
	Mutation: {
		handleMessage: async (
			_parent: unknown,
			{ input }: { input: IMessageInput }
		): Promise<string> => {
			console.log(input);
			try {
				const gptResponse = await callGPT(input.content);
				const parsedResponse = JSON.parse(gptResponse);
				const { name, prepTime, cookTime, totalTime, ingredients, steps } =
					parsedResponse[0];
				return "";
			} catch (err) {
				console.log("Error generating response:", err);
				throw createError("Failed to generate recipe response");
			}
		},
		editMessage: async (
			_parent: unknown,
			{ id, input }: { id: string; input: IEditMessageInput }
		): Promise<IMessage> => {
			try {
				const message = await Message.findById(id);
				if (!message) {
					throw createError(`Message with id: ${id} not found`);
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
					throw createError("Failed to update message");
				}

				const messageObj = updatedMessage.toObject();
				return {
					...messageObj,
					id: messageObj._id,
				} as IMessage;
			} catch (err) {
				console.log("Error editing message:", err);
				throw createError("Failed to edit message");
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
