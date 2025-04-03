import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { Connection } from "mongoose";
import cors from "cors";
// @ts-expect-error express-request-id types are incorrect
import requestID from "express-request-id";
import { ErrorContext, logError } from "src/services/errorLogger.service";
import CustomError from "src/errors/CustomError";
import logger from "src/logger";
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(requestID());
// --- Global Error Handlers (Register Early!) ---

process.on("uncaughtException", (error: Error) => {
	logError(error, { context: "uncaughtException" }, "fatal");

	logger.fatal("Uncaught exception detected! Application will now exit.");
	setTimeout(() => process.exit(1), 100); // Short delay if logging might be async
});

process.on(
	"unhandledRejection",
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(reason: unknown, promise: Promise<unknown>) => {
		logError(reason, { context: "unhandledRejection" }, "error");
	}
);

const createDBContextMiddleware = (
	prisma: PrismaClient,
	mongoDb: Connection
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.context = { prisma, mongoDb };
			next();
		} catch (err) {
			console.error("DB connection error:", err);
			next(err);
		}
	};
};

const expressErrorMiddleware = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const context: ErrorContext = {
		requestId: req.id,
		userId: req.user?.id,
		route: `${req.method} ${req.originalUrl}`,
		ip: req.ip,
	};
	logError(err, context);
	let statusCode = 500;
	if (
		err instanceof CustomError &&
		err.statusCode >= 400 &&
		err.statusCode < 600
	) {
		statusCode = err.statusCode;
	}
	const isProduction = process.env.NODE_ENV === "production";
	const responseBody: { message: string; code?: string; error?: string } = {
		message: "Internal Server Error", // Generic default
	};

	if (!isProduction || statusCode < 500) {
		responseBody.message =
			err instanceof Error ? err.message : "An unexpected error occurred";
		if (err instanceof CustomError) {
			responseBody.code = err.code;
		}
		if (!isProduction && err instanceof Error) {
			responseBody.error = err.stack;
		}
	}

	if (res.headersSent) {
		return next(err); // Delegate if headers already sent
	}

	res.status(statusCode).json(responseBody);
};

export { app, createDBContextMiddleware };

app.use(expressErrorMiddleware);

// Example usage (can be triggered from a route or service)
/*
function simulateError() {
    try {
        throw Errors.S3.uploadFailed('my-image.jpg', new Error("Network timeout during upload"));
    } catch (error) {
        logError(error, { operation: 'simulateError', userId: 'user-abc' });
    }
}
// simulateError();
*/
