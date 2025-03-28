export interface IRecipeTrace {
	sessionId: string;
	prompt: string;
	model: string;
	response: string;
	temperature: number;
	postprocessed?: string;
	promptTokens?: string;
	completionTokens?: string;
	totalTokens?: number;
	responseTimeMs: number;
	retryCount?: number;
	autoEval?: Record<string, unknown>;
	metadata?: Record<string, unknown>; //probably revisit this later and make an actual interface
	rating?: number;
	userFeedback?: string;
	errorTags?: string[];
	responseType?: string[];
}
