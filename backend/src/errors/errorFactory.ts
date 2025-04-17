import CustomError from "./CustomError";

const createError = (message: string, options?: Partial<CustomError>) => {
	return new CustomError({ message, ...options });
};

export enum ErrorCode {
	UNKNOWN_ERROR = "UNKNOWN_ERROR",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	// Chat Errors
	CHAT_CREATE_FAILED = "CHAT_CREATE_FAILED",
	CHAT_NOT_FOUND = "CHAT_NOT_FOUND",
	CHAT_FETCH_FAILED = "CHAT_FETCH_FAILED",
	CHAT_RENAME_FAILED = "CHAT_RENAME_FAILED",
	CHAT_DELETE_FAILED = "CHAT_DELETE_FAILED",

	// Message Errors
	MESSAGE_NO_RESPONSE_GENERATED = "MESSAGE_NO_RESPONSE_GENERATED",
	MESSAGE_UPDATE_FAILED = "MESSAGE_UPDATE_FAILED",
	MESSAGE_EDIT_FAILED = "MESSAGE_EDIT_FAILED",
	MESSAGE_NOT_FOUND = "MESSAGE_NOT_FOUND",
	MESSAGE_PARSE_FAILED = "MESSAGE_PARSE_FAILED",
	MESSAGE_ILL_FORMED_RESPONSE = "MESSAGE_ILL_FORMED_RESPONSE",

	// S3 Errors
	S3_UPLOAD_FAILED = "S3_UPLOAD_FAILED",

	// Trace Errors
	TRACE_INVALID_SESSION_ID = "TRACE_INVALID_SESSION_ID",
	TRACE_INVALID_PROMPT = "TRACE_INVALID_PROMPT",
	TRACE_INVALID_MODEL = "TRACE_INVALID_MODEL",
	TRACE_INVALID_TEMPERATURE = "TRACE_INVALID_TEMPERATURE",
	TRACE_INVALID_RESPONSE = "TRACE_INVALID_RESPONSE",
	TRACE_INVALID_RESPONSE_TIME = "TRACE_INVALID_RESPONSE_TIME",
	TRACE_LOGGING_FAILED = "TRACE_LOGGING_FAILED",

	// User Errors
	USER_CREATE_FAILED = "USER_CREATE_FAILED",
	USER_NOT_FOUND = "USER_NOT_FOUND",
	USER_FETCH_FAILED = "USER_FETCH_FAILED",
	USER_DELETE_FAILED = "USER_DELETE_FAILED",
	USER_UPDATE_FAILED = "USER_UPDATE_FAILED",
	USER_EMAIL_IN_USE = "USER_EMAIL_IN_USE",
}

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
	insertFailed: (err?: unknown, gptResponse?: string) => CustomError;
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

type MessageErrors = {
	noResponseGenerated: (err?: unknown) => CustomError;
	updatedFailed: (err?: unknown) => CustomError;
	editFailed: (err?: unknown) => CustomError;
	notFound: (id: string, err?: unknown) => CustomError;
	parseFailed: (err?: unknown) => CustomError;
	illFormedResponse: (err?: unknown) => CustomError;
};

const Errors: {
	Chat: ChatErrors;
	Message: MessageErrors;
	S3: S3Errors;
	Trace: TraceErrors;
	TraceLogging: TraceLoggingErrors;
	User: UserErrors;
} = {
	Chat: {
		createFailed: (err?: unknown) =>
			createError("Failed to create chat", {
				code: ErrorCode.CHAT_CREATE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		notFound: (id: string, err?: unknown) =>
			createError("Chat not found", {
				code: ErrorCode.CHAT_NOT_FOUND,
				statusCode: 404,
				metadata: { id, error: err },
			}),
		fetchFailed: (err?: unknown) =>
			createError("Failed to fetch chat", {
				code: ErrorCode.CHAT_FETCH_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		renameFailed: (err?: unknown) =>
			createError("Failed to rename chat", {
				code: ErrorCode.CHAT_RENAME_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		deleteFailed: (err?: unknown) =>
			createError("Failed to delete chat", {
				code: ErrorCode.CHAT_DELETE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
	},
	Message: {
		noResponseGenerated: (err?: unknown) =>
			createError("No response generated from GPT", {
				code: ErrorCode.MESSAGE_NO_RESPONSE_GENERATED,
				statusCode: 500,
				metadata: { error: err },
			}),
		updatedFailed: (err?: unknown) =>
			createError("Failed to update message", {
				code: ErrorCode.MESSAGE_UPDATE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		editFailed: (err?: unknown) =>
			createError("Failed to edit message", {
				code: ErrorCode.MESSAGE_EDIT_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		notFound: (id: string, err?: unknown) =>
			createError("Message not found", {
				code: ErrorCode.MESSAGE_NOT_FOUND,
				statusCode: 404,
				metadata: { id, error: err },
			}),
		parseFailed: (err?: unknown) =>
			createError("Failed to parse GPT response", {
				code: ErrorCode.MESSAGE_PARSE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		illFormedResponse: (err?: unknown) =>
			createError("Ill-formed GPT response", {
				code: ErrorCode.MESSAGE_ILL_FORMED_RESPONSE,
				statusCode: 500,
				metadata: { error: err },
			}),
	},
	S3: {
		uploadFailed: (id?: string, err?: unknown) =>
			createError("S3 Upload failed", {
				code: ErrorCode.S3_UPLOAD_FAILED,
				statusCode: 500,
				metadata: { id, error: err },
			}),
	},
	Trace: {
		invalidSessionId: (err?: unknown) =>
			createError("Invalid sessionId", {
				code: ErrorCode.TRACE_INVALID_SESSION_ID,
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidPrompt: (err?: unknown) =>
			createError("Invalid prompt", {
				code: ErrorCode.TRACE_INVALID_PROMPT,
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidModel: (err?: unknown) =>
			createError("Invalid model", {
				code: ErrorCode.TRACE_INVALID_MODEL,
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidTemperature: (value?: unknown) =>
			createError(`Temperature must be between 0 & 2. Got ${value}`, {
				code: ErrorCode.TRACE_INVALID_TEMPERATURE,
				statusCode: 400,
				metadata: { error: value },
			}),
		invalidResponse: (err?: unknown) =>
			createError("Invalid GPT Response", {
				code: ErrorCode.TRACE_INVALID_RESPONSE,
				statusCode: 400,
				metadata: { error: err },
			}),
		invalidResponseTime: (value?: unknown) =>
			createError("Invalid response time ms", {
				code: ErrorCode.TRACE_INVALID_RESPONSE_TIME,
				statusCode: 400,
				metadata: { error: value },
			}),
	},
	TraceLogging: {
		insertFailed: (err?: unknown, gptResponse?: string) =>
			createError("Failed to insert trace into W&B", {
				code: ErrorCode.TRACE_LOGGING_FAILED,
				statusCode: 500,
				metadata: { error: err, gptResponse },
			}),
	},
	User: {
		createFailed: (err?: unknown) =>
			createError("Failed to create user", {
				code: ErrorCode.USER_CREATE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		notFound: (id: string, err?: unknown) =>
			createError("User not found", {
				code: ErrorCode.USER_NOT_FOUND,
				statusCode: 404,
				metadata: { id, error: err },
			}),
		fetchFailed: (err?: unknown) =>
			createError("Failed to fetch user", {
				code: ErrorCode.USER_FETCH_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		deleteFailed: (err?: unknown) =>
			createError("Failed to delete user", {
				code: ErrorCode.USER_DELETE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		updateFailed: (err?: unknown) =>
			createError("Failed to update user", {
				code: ErrorCode.USER_UPDATE_FAILED,
				statusCode: 500,
				metadata: { error: err },
			}),
		emailInUse: (email: string, err?: unknown) =>
			createError("Email already in use", {
				code: ErrorCode.USER_EMAIL_IN_USE,
				statusCode: 400,
				metadata: { email, error: err },
			}),
	},
};
export default Errors;
