import { IRecipeTrace } from "src/models/RecipeTrace";
import createError from "./error.service";

export async function logRecipeTrace(trace: IRecipeTrace) {
	if (typeof trace.sessionId != "string" || trace.sessionId.trim() === "") {
		return createError("Invalid sessionId", {
			code: "INVALID_SESSION_ID",
			statusCode: 400,
		});
	}
}
export async function logRecipeTrace(trace: Trace) {
    // --- Manual validation and sanitization ---
  
    if (typeof trace.sessionId !== "string" || trace.sessionId.trim() === "") {
      throw new Error("Invalid sessionId");
    }
  
    if (typeof trace.prompt !== "string" || trace.prompt.trim() === "") {
      throw new Error("Invalid prompt");
    }
  
    if (trace.prompt.length > 5000) {
      trace.prompt = trace.prompt.slice(0, 5000);
    }
  
    if (typeof trace.model !== "string" || trace.model.trim() === "") {
      throw new Error("Invalid model");
    }
  
    if (typeof trace.temperature !== "number" || trace.temperature < 0 || trace.temperature > 2) {
      throw new Error("Temperature must be between 0 and 2");
    }
  
    if (typeof trace.gptResponse !== "string" || trace.gptResponse.trim() === "") {
      throw new Error("Invalid GPT response");
    }
  
    if (trace.gptResponse.length > 10000) {
      trace.gptResponse = trace.gptResponse.slice(0, 10000);
    }
  
    // Optional string fields
    const postprocessed = trace.postprocessed?.trim() || null;
    const userFeedback = trace.userFeedback?.trim() || null;
  
    // Clamp numeric values
    const rating =
      typeof trace.rating === "number" && trace.rating >= 0 && trace.rating <= 5
        ? trace.rating
        : null;
  
    const retryCount =
      typeof trace.retryCount === "number" && trace.retryCount >= 0
        ? trace.retryCount
        : 0;
  
    // Validate tokens if defined
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
  
    const errorTags =
      Array.isArray(trace.errorTags) && trace.errorTags.every((tag) => typeof tag === "string")
        ? trace.errorTags
        : null;
  
    const autoEval = typeof trace.autoEval === "object" && trace.autoEval !== null
      ? trace.autoEval
      : {};
  
    const metadata = typeof trace.metadata === "object" && trace.metadata !== null
      ? trace.metadata
      : {};
  
    if (typeof trace.responseTimeMs !== "number" || trace.responseTimeMs < 0) {
      throw new Error("Invalid responseTimeMs");
    }
  
    const traceId = uuidv4();
  
    // --- Write to Postgres ---
    await pool.query(
      
      INSERT INTO recipe_traces (
        session_id, trace_id, prompt, model, response, postprocessed_response,
        temperature, prompt_tokens, completion_tokens, total_tokens,
        response_time_ms, retry_count, auto_eval, metadata,
        rating, user_feedback, error_tags
      )
      VALUES ($1, $2, $3, $4, $5, $6,
              $7, $8, $9, $10,
              $11, $12, $13, $14,
              $15, $16, $17)
    ,
      [
        trace.sessionId,
        traceId,
        trace.prompt,
        trace.model,
        trace.gptResponse,
        postprocessed,
        trace.temperature,
        promptTokens,
        completionTokens,
        totalTokens,
        trace.responseTimeMs,
        retryCount,
        autoEval,
        metadata,
        rating,
        userFeedback,
        errorTags,
      ]
    );
  } i