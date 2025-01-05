import { Pool } from "pg";
import { Db } from "mongodb";

declare global {
	namespace Express {
		interface Request {
			context: {
				pgPool: Pool;
				mongoDb: Db;
			};
		}
	}
}

export {}; 
