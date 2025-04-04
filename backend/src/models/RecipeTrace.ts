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
	sessionId: string;
	prompt: string;
	promptUrl?: string;
	model: string;
	response: string;
	responseUrl: string;
	temperature: number;
	postprocessed?: string;
	promptTokens?: number;
	completionTokens?: number;
	totalTokens?: number;
	responseTimeMs: number;
	retryCount?: number;
	autoEval?: AutoEvaluation;
	metadata?: Record<string, unknown>; //probably revisit this later and make an actual interface
	rating?: number;
	userFeedback?: string;
	errorTags?: string[];
	responseType?: string[];
}
