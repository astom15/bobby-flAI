import express, { Application, Request, Response, NextFunction } from "express";
import { Pool } from 'pg';
import { Db } from 'mongodb';
const app: Application = express();
import chats from './routes/chat.js';

app.use(express.json());
app.use('/chats', chats);

const createDBContextMiddleware = (pgPool: Pool, mongoDb: Db) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.context = { pgPool, mongoDb };
      next();
    } catch (err) {
      console.error("DB connection error:", err);
      res.status(500).json({ error: "DB connection error" });
    };
  };
};


export {app, createDBContextMiddleware}