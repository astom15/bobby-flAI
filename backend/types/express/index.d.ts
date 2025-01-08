import { PrismaClient } from "@prisma/client";
import { Connection } from "mongoose";
declare global {
	namespace Express {
		interface Request {
			context: {
				token?: string | string[] | undefined;
				prisma: PrismaClient;
				mongoDb: Connection;
			};
		}
	}
}
export {};
