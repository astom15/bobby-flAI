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

type ChatErrors = {
	renameFailed: (err?: unknown) => CustomError;
	createFailed: (err?: unknown) => CustomError;
	notFound: (id: string, err?: unknown) => CustomError;
	fetchFailed: (err?: unknown) => CustomError;
	deleteFailed: (err?: unknown) => CustomError;
};
type UserErrors = {
	createFailed: (err?: unknown) => CustomError;
	notFound: (id: string, err?: unknown) => CustomError;
	fetchFailed: (err?: unknown) => CustomError;
	deleteFailed: (err?: unknown) => CustomError;
	updateFailed: (err?: unknown) => CustomError;
	emailInUse: (email: string, err?: unknown) => CustomError;
};

const Errors: {
	User: UserErrors;
	Chat: ChatErrors;
	S3: S3Errors;
	Trace: TraceErrors;
	TraceLogging: TraceLoggingErrors;
} = {
	Chat: {
		createFailed: (err?: unknown) =>
			createError("Failed to create chat", {
				code: "CHAT_CREATE_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		notFound: (id: string, err?: unknown) =>
			createError("Chat not found", {
				code: "CHAT_NOT_FOUND",
				statusCode: 404,
				metadata: { id, error: err },
			}),
		fetchFailed: (err?: unknown) =>
			createError("Failed to fetch chat", {
				code: "CHAT_FETCH_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		renameFailed: (err?: unknown) =>
			createError("Failed to rename chat", {
				code: "CHAT_RENAME_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		deleteFailed: (err?: unknown) =>
			createError("Failed to delete chat", {
				code: "CHAT_DELETE_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
	},
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
	User: {
		createFailed: (err?: unknown) =>
			createError("Failed to create user", {
				code: "USER_CREATE_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		notFound: (id: string, err?: unknown) =>
			createError("User not found", {
				code: "USER_NOT_FOUND",
				statusCode: 404,
				metadata: { id, error: err },
			}),
		fetchFailed: (err?: unknown) =>
			createError("Failed to fetch user", {
				code: "USER_FETCH_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		deleteFailed: (err?: unknown) =>
			createError("Failed to delete user", {
				code: "USER_DELETE_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		updateFailed: (err?: unknown) =>
			createError("Failed to update user", {
				code: "USER_UPDATE_FAILED",
				statusCode: 500,
				metadata: { error: err },
			}),
		emailInUse: (email: string, err?: unknown) =>
			createError("Email already in use", {
				code: "USER_EMAIL_IN_USE",
				statusCode: 400,
				metadata: { email, error: err },
			}),
	},
};
export default Errors;
