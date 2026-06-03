import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.post("/", authMiddleware, )



export default transactionRouter