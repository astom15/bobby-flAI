import logger from "src/logger";
import CustomError from "../errors/CustomError";
export interface ErrorContext {
	requestId?: string;
	userId?: string;
	operation?: string;
	[key: string]: unknown;
}
export function logError(
	error: CustomError | Error | unknown,
	context?: ErrorContext,
	severity: "error" | "fatal" | "warn" = "error"
): void {
	const logPayload: Record<string, unknown> = {
		...context,
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
	};

	if (error instanceof CustomError) {
		logPayload.code = error.code;
		logPayload.statusCode = error.statusCode;
		logPayload.metadata = error.metadata;
	}

	logger[severity](logPayload, logPayload.message as string);
}
