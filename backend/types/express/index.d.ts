import { PrismaClient } from "@prisma/client";
import { Db } from "mongodb";

declare global {
	namespace Express {
		interface Request {
			context: {
				prisma?: PrismaClient;
				mongoDb?: Db;
			};
		}
	}
}
export {};
