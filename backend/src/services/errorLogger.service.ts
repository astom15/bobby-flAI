import logger from "src/logger";
import CustomError from "../errors/CustomError";

export interface ErrorContext {
	requestId?: string;
	userId?: string;
	operation?: string;
	[key: string]: unknown;
}
interface LogErrorDetails {
	name: string;
	message: string;
	stack?: string;
	originalStack?: string;
	code?: string;
	statusCode?: number;
	metadata?: Record<string, unknown>;
}

export function logError(
	error: CustomError | Error | unknown,
	context?: ErrorContext,
	severity: "error" | "fatal" | "warn" = "error"
): void {
	let processedError: Error;
	const logPayload: Record<string, unknown> = { ...context };
	if (error instanceof CustomError) {
		processedError = error;
		logPayload.code = error.code;
		logPayload.statusCode = error.statusCode;
		if (error.metadata) logPayload.metadata = error.metadata;
	} else if (error instanceof Error) {
		processedError = error;
	} else {
		processedError = new Error("An unknown or non-error value was thrown");
		try {
			logPayload.originalValue = JSON.stringify(error);
		} catch {
			logPayload.originalValue = String(error);
		}
	}
	const errorDetails: LogErrorDetails = {
		name: processedError.name,
		message: processedError.message,
		stack: processedError.stack,
		code:
			processedError instanceof CustomError ? processedError.code : undefined,
		statusCode:
			processedError instanceof CustomError
				? processedError.statusCode
				: undefined,
		metadata:
			processedError instanceof CustomError
				? processedError.metadata
				: undefined,
	};

	if (processedError instanceof CustomError && processedError.originalStack) {
		errorDetails.originalStack = processedError.originalStack;
	}
	logPayload.err = errorDetails;

	logger[severity](logPayload, processedError.message);
}
