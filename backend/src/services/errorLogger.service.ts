import logger from "src/logger";
import CustomError from "../errors/CustomError";
export interface ErrorContext {
	requestId?: string;
	userId?: string;
	operation?: string;
	[key: string]: unknown;
}

function formatStackTrace(stack: string): string {
	return stack
		.split("\n")
		.map((line) => line.trim())
		.join("\n    "); // 4 spaces for standard indentation
}

export function logError(
	error: CustomError | Error | unknown,
	context?: ErrorContext,
	severity: "error" | "fatal" | "warn" = "error"
): void {
	const logPayload: Record<string, unknown> = {
		...context,
		message: error instanceof Error ? error.message : String(error),
		stack:
			error instanceof Error ? formatStackTrace(error.stack || "") : undefined,
	};

	if (error instanceof CustomError) {
		logPayload.code = error.code;
		logPayload.statusCode = error.statusCode;
		logPayload.metadata = error.metadata;
	}

	logger[severity](logPayload, logPayload.message as string);
}
