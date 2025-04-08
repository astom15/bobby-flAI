import pino from "pino";
import type { Logger, LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV == "production";
const defaultLogLevel = isProduction ? "info" : "debug";

const options: LoggerOptions = {
	level: process.env.LOG_LEVEL || defaultLogLevel,
	timestamp: pino.stdTimeFunctions.isoTime,
	base: {
		service: process.env.SERVICE_NAME || "bobby-flAI",
		environment: process.env.NODE_ENV || "development",
		pid: process.pid,
	},
	formatters: {
		level: (label) => {
			return { level: label };
		},
	},
	errorKey: "err",
};
if (!isProduction) {
	options.transport = {
		target: "pino-pretty",
		options: {
			colorize: true, // Makes output colorful
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l", // Readable timestamp
			ignore: "pid,hostname,service,environment", // Avoid redundant fields in pretty print
			// Show custom error properties nicely in development
			errorProps: "code,statusCode,metadata,originalStack",
			messageFormat: "{msg}", // Just show the message, level and pid are handled by pino-pretty
			levelFirst: true, // Show level first
			levelLabel: "level", // Use the level property for the label
		},
	};
} else {
	options.redact = [
		// Example: Redact common sensitive headers if logging request objects
		"req.headers.authorization",
		"req.headers.cookie",
		'req.headers["x-api-key"]', // Example custom API key header

		// Example: Redact fields within a potential user object
		"user.password",
		"user.email", // Redact email if considered sensitive PII in your context

		// Example: Redact fields potentially in your CustomError metadata
		"metadata.apiKey",
		"metadata.credentials.password",
		"metadata.internalToken",

		// Example: Redact fields potentially added via ErrorContext
		"context.userToken",
	];
}

// Create and export the logger instance
const logger: Logger = pino(options);

export default logger;
