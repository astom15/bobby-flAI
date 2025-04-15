import { IRecipeTrace } from "src/models/RecipeTrace";
import Errors from "../errors/errorFactory";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { prisma } from "db";
import { s3Upload } from "./s3.service";
import { Prisma } from "@prisma/client/default";
import axios from "axios";
import { logError } from "./errorLogger.service";
dotenv.config();

const WANDB_SERVICE_URL =
	process.env.WANDB_SERVICE_URL || "http://localhost:8000";

export async function logRecipeTrace(trace: Partial<IRecipeTrace>) {
	if (typeof trace.sessionId != "string" || trace.sessionId.trim() === "") {
		throw Errors.Trace.invalidSessionId(trace.sessionId);
	}

	if (typeof trace.prompt != "string" || trace.prompt.trim() == "") {
		throw Errors.Trace.invalidPrompt(trace.prompt);
	}

	if (typeof trace.model != "string" || trace.model.trim() == "") {
		throw Errors.Trace.invalidModel(trace.model);
	}

	if (
		typeof trace.temperature != "number" ||
		trace.temperature < 0 ||
		trace.temperature > 2
	) {
		throw Errors.Trace.invalidTemperature(trace.temperature);
	}

	if (typeof trace.response != "string" || trace.response.trim() == "") {
		throw Errors.Trace.invalidResponse(trace.response);
	}

	const traceId = uuidv4();
	const fullPrompt = trace.prompt;
	const fullResponse = trace.response;
	await s3Upload(traceId, trace.prompt);
	await s3Upload(trace.response, traceId);
	trace.promptUrl = `${process.env.PROMPT_FOLDER}${traceId}.txt`;
	trace.responseUrl = `${process.env.RESPONSE_FOLDER}${traceId}.txt`;
	trace.prompt = trace.prompt.slice(0, 200);
	trace.response = trace.response.slice(0, 200);

	const rating =
		typeof trace.rating === "number" && trace.rating >= 0 && trace.rating <= 5
			? trace.rating
			: null;

	const retryCount =
		typeof trace.retryCount === "number" && trace.retryCount >= 0
			? trace.retryCount
			: 0;

	const promptTokens =
		typeof trace.promptTokens === "number" && trace.promptTokens >= 0
			? trace.promptTokens
			: null;

	const completionTokens =
		typeof trace.completionTokens === "number" && trace.completionTokens >= 0
			? trace.completionTokens
			: null;

	const totalTokens =
		typeof trace.totalTokens === "number" && trace.totalTokens >= 0
			? trace.totalTokens
			: null;

	const postprocessed =
		typeof trace.postprocessed === "string" && trace.postprocessed.trim() !== ""
			? trace.postprocessed
			: null;

	const errorTags =
		Array.isArray(trace.errorTags) &&
		trace.errorTags.every((tag) => typeof tag === "string")
			? trace.errorTags
			: [];

	const autoEval =
		typeof trace.autoEval === "object" && trace.autoEval !== null
			? trace.autoEval
			: {};

	const metadata =
		typeof trace.metadata === "object" && trace.metadata !== null
			? (trace.metadata as Prisma.InputJsonValue)
			: Prisma.JsonNull;

	if (typeof trace.responseTimeMs !== "number" || trace.responseTimeMs < 0) {
		throw new Error("Invalid responseTimeMs");
	}
	try {
		await prisma.recipeTrace.create({
			data: {
				sessionId: trace.sessionId,
				traceId,
				prompt: trace.prompt,
				promptUrl: trace.promptUrl ?? null,
				model: trace.model,
				response: trace.response,
				responseUrl: trace.responseUrl,
				postprocessed: postprocessed ?? null,
				temperature: trace.temperature,
				promptTokens,
				completionTokens,
				totalTokens,
				responseTimeMs: trace.responseTimeMs,
				retryCount: retryCount,
				autoEval,
				metadata,
				rating,
				userFeedback: trace.userFeedback ?? null,
				errorTags,
			},
		});
	} catch (err) {
		logError(Errors.TraceLogging.insertFailed(err));
	}

	console.log(trace, fullPrompt, fullResponse);
	const wandbTrace = {
		...trace,
		prompt: fullPrompt,
		response: fullResponse,
	};
	try {
		await axios.post(`${WANDB_SERVICE_URL}/log-trace`, wandbTrace);
	} catch (err: unknown) {
		const errorMessage =
			err instanceof Error ? err.message : "Error generating response";
		await prisma.recipeTrace.update({
			where: { traceId },
			data: {
				errorTags: [...(trace.errorTags || []), "wandb_logging_failed"],
				metadata: {
					...(trace.metadata || {}),
					wandb_error: errorMessage,
				},
			},
		});
		logError(Errors.TraceLogging.insertFailed(errorMessage));
	}
}
