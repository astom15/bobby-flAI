import CustomError from "./CustomError";

const createError = (message: string, options?: Partial<CustomError>) => {
	return new CustomError({ message, ...options });
};

type S3Errors = {
	uploadFailed: (id: string, err?: unknown) => CustomError;
};
type TraceErrors = {
	invalidSessionId: (err?: unknown) => CustomError;
	invalidPrompt: (err?: unknown) => CustomError;
	invalidModel: (err?: unknown) => CustomError;
	invalidTemperature: (value?: unknown) => CustomError;
	invalidResponse: (err?: unknown) => CustomError;
	invalidResponseTime: (err?: unknown) => CustomError;
};

type TraceLoggingErrors = {
	insertFailed: (err?: unknown) => CustomError;
};
const Errors: {
	S3: S3Errors;
	Trace: TraceErrors;
	TraceLogging: TraceLoggingErrors;
} = {
	S3: {
		uploadFailed: (id?: string, err?: unknown) =>
			createError("S3 Upload failed", {
				code: "S3_UPLOAD_FAILED",
				statusCode: 500,
				metadata: { id, error: err },
			}),
	},
	Trace: {
		invalidSessionId: (err?: unknown) =>
			createError("Invalid sessionId", {
				code: "TRACE_INVALID_SESSION_ID",
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidPrompt: (err?: unknown) =>
			createError("Invalid prompt", {
				code: "TRACE_INVALID_PROMPT",
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidModel: (err?: unknown) =>
			createError("Invalid model", {
				code: "TRACE_INVALID_MODEL",
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidTemperature: (value?: unknown) =>
			createError(`Temperature must be between 0 & 2. Got ${value}`, {
				code: "TRACE_INVALID_TEMPERATURE",
				statusCode: 400,
				metadata: { error: value },
			}),
		invalidResponse: (err?: unknown) =>
			createError("Invalid GPT Response", {
				code: "TRACE_INVALID_RESPONSE",
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidResponseTime: (value?: unknown) =>
			createError("Invalid response time ms", {
				code: "TRACE_INVALID_RESPONSE_TIME",
				statusCode: 400,
				metadata: { error: value },
			}),
	},
	TraceLogging: {
		insertFailed: (err?: unknown) =>
			createError("Failed to insert trace into DB", {
				code: "TRACE_LOGGING_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
	},
};
export default Errors;
