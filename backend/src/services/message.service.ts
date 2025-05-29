import natural from "natural";
import { possibleRecipeIntent, systemPrompts } from "src/config";
import OpenAI from "openai";
import dotenv from "dotenv";
import moment from "moment";
import { UserSettings } from "src/interfaces/IUser";
import Errors from "../errors/errorFactory";
import { v4 as uuidv4 } from "uuid";
import { logError } from "./errorLogger.service";
import {
	createBaseTraceData,
	createErrorTrace,
	logRecipeTrace,
} from "./recipeTrace.service";
import {
	processRecipe,
	sanitizeGPTResponse,
	validateRecipe,
} from "./recipe.service";
import CustomError from "src/errors/CustomError";
import { ErrorCode } from "src/errors/errorFactory";
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
	const TEMPORARY_SETTINGS: UserSettings = {
		location: [],
		allergies: [],
		preferences: [],
	};
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
			temperature: 0.7,
			top_p: 0.9,
			frequency_penalty: 0.3,
			presence_penalty: 0.1,
		});

		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw Errors.Message.noResponseGenerated();
		}

		let parsedContent;
		if (!content) {
			const baseTrace = createBaseTraceData(
				sessionId,
				prompt,
				response,
				startTime,
				TEMPORARY_SETTINGS,
				isRecipeRelated
			);
			const errorTrace = createErrorTrace(
				baseTrace,
				new Error("No response generated")
			);
			void logRecipeTrace(errorTrace);
			throw Errors.Message.noResponseGenerated();
		}
		try {
			console.log("content", content);
			console.log("JSON PARSED", JSON.parse(content));
			parsedContent = JSON.parse(sanitizeGPTResponse(content));
			console.log("parsedContent", parsedContent);
		} catch (parseErr) {
			// const baseTrace = createBaseTraceData(
			// 	sessionId,
			// 	prompt,
			// 	response,
			// 	startTime,
			// 	TEMPORARY_SETTINGS,
			// 	isRecipeRelated
			// );
			// const errorTrace = createErrorTrace(baseTrace, parseErr);
			// void logRecipeTrace(errorTrace);
			throw Errors.Message.parseFailed(parseErr);
		}

		try {
			const baseTrace = createBaseTraceData(
				sessionId,
				prompt,
				response,
				startTime,
				TEMPORARY_SETTINGS,
				isRecipeRelated
			);

			if (!Array.isArray(parsedContent)) {
				throw Errors.Message.illFormedResponse("Response is not an array");
			}

			for (const recipe of parsedContent) {
				if (!validateRecipe(recipe)) {
					throw Errors.Message.illFormedResponse();
				}
				await processRecipe(recipe, baseTrace);
			}

			return parsedContent;
		} catch (traceErr) {
			throw Errors.TraceLogging.insertFailed(
				traceErr,
				JSON.stringify(parsedContent)
			);
		}
	} catch (err) {
		if (
			err instanceof CustomError &&
			err.code === ErrorCode.TRACE_LOGGING_FAILED
		) {
			throw err;
		}
		logError(err);
		throw err;
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
