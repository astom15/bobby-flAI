import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { Connection } from "mongoose";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error("Centralized error handler:", err.message);
	res.status(500).json({ error: err.message || "Internal Server Error" });
});

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

export { app, createDBContextMiddleware };
