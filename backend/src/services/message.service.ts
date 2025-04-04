import natural from "natural";
import { possibleRecipeIntent, systemPrompts } from "src/config";
import OpenAI from "openai";
import dotenv from "dotenv";
import createError from "../errors/errorFactory";
import moment from "moment";
import { UserSettings } from "src/models/User";
dotenv.config();

export enum EIntent {
	RECIPE_REQUEST = "RECIPE_REQUEST",
	UNKNOWN = "UNKNOWN",
}

const fuzzyMatch = (keyword: string, tokens: string[]) => {
	return tokens.some(
		(token) => natural.LevenshteinDistance(token, keyword) <= 2
	);
};

const detectIntent = (input: string): string => {
	const tokenizer = new natural.WordTokenizer();
	const tokens = tokenizer.tokenize(input.toLowerCase());
	for (const { intent, keywords } of possibleRecipeIntent) {
		if (tokens.some((token) => keywords.has(token))) return intent;
		if (Array.from(keywords).some((keyword) => fuzzyMatch(keyword, tokens))) {
			return intent;
		}
	}
	return "UNKNOWN";
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const callGPT = async (input: string) => {
	// THIS IS TEMPORARY
	const TEMPORARY_SETTINGS = { location: [], allergies: [], preferences: [] };
	const isRecipeRelated = detectIntent(input);
	const prompt =
		isRecipeRelated == EIntent.RECIPE_REQUEST
			? addUserContextToPrompt(systemPrompts.RECIPE_REQUEST, TEMPORARY_SETTINGS)
			: addUserContextToPrompt(systemPrompts.UNKNOWN, TEMPORARY_SETTINGS);
	// need to pull allergies, location, and time here
	try {
		const response = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "developer", content: prompt },
				{ role: "user", content: input },
			],
		});
		return response.choices[0]?.message?.content || "No response generated";
	} catch (err) {
		console.log("Error with GPT response", err);
		throw createError("GPT Response failed");
	}
};

const addUserContextToPrompt = (
	basePrompt: string,
	userSettings: UserSettings
): string => {
	const { location, allergies, preferences } = userSettings;

	const timeContext = () => {
		const now = moment();
		return `The current time is ${now.format("HH:mm")} on ${now.format("MMMM Do, YYYY")}`;
	};
	const preferenceContext = preferences.length
		? `The user has a preference for ${preferences.join(", ")} Please prioritize these kinds of recipes or recipes that have those ingredients`
		: `The user has no specific preferences.`;
	const allergyContext =
		allergies.length > 0
			? `The user is allergic to ${allergies.join(", ")}. Please avoid recipes containing these ingredients`
			: `The user has no allergy restrictions.`;
	return `${timeContext()} ${preferenceContext} ${allergyContext} ${basePrompt}`;
};
export { callGPT };
