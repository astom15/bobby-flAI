import natural from "natural";
import { possibleRecipeIntent, systemPrompts } from "src/config";
import OpenAI from "openai";
import dotenv from "dotenv";
import moment from "moment";
import { UserSettings } from "src/models/User";
import Errors from "../errors/errorFactory";
import { v4 as uuidv4 } from "uuid";
import { logError } from "./errorLogger.service";
import { logRecipeTrace } from "./recipeTrace.service";
import { IRecipeTrace } from "src/models/RecipeTrace";
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
	const startTime = Date.now();
	const sessionId = uuidv4();
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
			temperature: 0.7, // Some creativity but still focused
			top_p: 0.9, // Allow some diversity in word choice
			frequency_penalty: 0.3, // Mild penalty for repeating terms
			presence_penalty: 0.1, // Slight encouragement for new concepts
		});
		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw Errors.Message.noResponseGenerated();
		}
		const sanitizedContent = content
			.replace(/'/g, '"') // Replace all single quotes with double quotes
			.replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Ensure property names are quoted
			.replace(/:\s*(\d+)([,}])/g, ':"$1"$2'); // Quote numeric values

		try {
			const parsedContent = JSON.parse(sanitizedContent);
			if (!Array.isArray(parsedContent)) {
				logError(Errors.Message.illFormedResponse("Response is not an array"));
				throw Errors.Message.illFormedResponse();
			}
			for (const recipe of parsedContent) {
				if (
					!recipe.name ||
					!recipe.prepTime ||
					!recipe.cookTime ||
					!recipe.totalTime ||
					!recipe.ingredients ||
					!recipe.steps
				) {
					logError(Errors.Message.illFormedResponse("Recipe is ill-formed"));
					throw Errors.Message.illFormedResponse();
				}
				const postprocessed = JSON.stringify({
					name: recipe.name,
					prepTime: recipe.prepTime,
					cookTime: recipe.cookTime,
					totalTime: recipe.totalTime,
					ingredients: recipe.ingredients,
					steps: recipe.steps,
				});
				const traceData: IRecipeTrace = {
					sessionId,
					prompt,
					model: "gpt-4o-mini",
					response: content,
					temperature: 0.7,
					promptTokens: response.usage?.prompt_tokens,
					completionTokens: response.usage?.completion_tokens,
					totalTokens: response.usage?.total_tokens,
					responseTimeMs: Date.now() - startTime,
					postprocessed,
					retryCount: 0,
					errorTags: [],
					responseType: ["recipe"],
					metadata: {
						intent: isRecipeRelated,
						userSettings: TEMPORARY_SETTINGS,
						parseSuccess: !!content,
					},
					top_p: 0.9,
					frequency_penalty: 0.3,
					presence_penalty: 0.1,
					autoEval: {
						grammar: undefined,
						hallucination: undefined,
						coherence: undefined,
					},
					rating: null,
					userFeedback: null,
				};
				await logRecipeTrace(traceData);
			}
			return parsedContent;
		} catch (parseErr) {
			const traceData: IRecipeTrace = {
				sessionId,
				prompt,
				model: "gpt-4o-mini",
				response: content, // Original response
				temperature: 0.7,
				promptTokens: response.usage?.prompt_tokens,
				completionTokens: response.usage?.completion_tokens,
				totalTokens: response.usage?.total_tokens,
				responseTimeMs: Date.now() - startTime,
				postprocessed: null,
				retryCount: 0,
				errorTags: ["parse_failed"],
				responseType: ["error"],
				metadata: {
					intent: isRecipeRelated,
					userSettings: TEMPORARY_SETTINGS,
					parseSuccess: false,
					error: parseErr instanceof Error ? parseErr.message : "Parse failed",
				},
				top_p: 0.9,
				frequency_penalty: 0.3,
				presence_penalty: 0.1,
				autoEval: {
					grammar: undefined,
					hallucination: undefined,
					coherence: undefined,
				},
				rating: null,
				userFeedback: null,
			};
			await logRecipeTrace(traceData);
			logError(Errors.Message.parseFailed(parseErr));
			throw Errors.Message.parseFailed(parseErr);
		}
	} catch (err) {
		logError(Errors.Message.noResponseGenerated(err));
		throw Errors.Message.noResponseGenerated(err);
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
