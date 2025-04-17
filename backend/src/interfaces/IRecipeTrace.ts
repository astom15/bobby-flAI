interface AutoEvaluation {
	grammar?: {
		score: number; // Score between 0-1
		issues?: string[]; // List of grammar issues found
	};
	hallucination?: {
		score: number; // Score between 0-1
		detectedIssues?: string[]; // List of potential hallucinations
	};
	coherence?: {
		score: number; // Score between 0-1
		issues?: string[]; // List of coherence issues
	};
	[key: string]:
		| {
				score: number;
				issues?: string[];
		  }
		| undefined;
}
export interface IRecipeTrace {
	traceId?: string;
	sessionId: string;
	prompt: string;
	promptUrl?: string | null;
	model: string;
	response: string;
	responseUrl?: string | null;
	temperature: number;
	postprocessed?: string | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	totalTokens?: number | null;
	responseTimeMs: number;
	retryCount?: number | null;
	autoEval?: AutoEvaluation;
	metadata?: Record<string, unknown>; //probably revisit this later and make an actual interface
	rating?: number | null;
	userFeedback?: string | null;
	errorTags?: string[];
	responseType?: string[];
	top_p?: number | null;
	frequency_penalty?: number | null;
	presence_penalty?: number | null;
}
