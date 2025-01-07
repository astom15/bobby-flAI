import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { Db } from "mongodb";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

const createDBContextMiddleware = (prisma: PrismaClient, mongoDb: Db) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			req.context = { prisma, mongoDb };
			next();
		} catch (err) {
			console.error("DB connection error:", err);
			res.status(500).json({ error: "DB connection error" });
		}
	};
};

export { app, createDBContextMiddleware };
