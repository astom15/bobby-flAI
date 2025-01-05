import express from "express";
const app = express();

app.use(express.json());

const createDBContextMiddleware = (pgPool, mongoDb) => {
  return async (req, res, next) => {
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