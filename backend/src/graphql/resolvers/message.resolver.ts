import mongoose from "mongoose";
import { IMessage, IMessageInput } from "src/models/Message";
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
				console.log("Error generating response", err);
				throw createError("Response generation failed - could be chatGPT.");
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
