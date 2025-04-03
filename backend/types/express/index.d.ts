import { PrismaClient } from "@prisma/client";
import { Connection } from "mongoose";

declare global {
	namespace Express {
		interface Request {
			id?: string;
			user?: {
				id: string;
				[key: string]: unknown;
			};
			context: {
				token?: string | string[] | undefined;
				prisma: PrismaClient;
				mongoDb: Connection;
			};
		}
	}
}

export {};
