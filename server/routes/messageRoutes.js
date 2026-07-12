import express from "express";
import Message from "../models/Message.js";
import {fetchHistory} from "../controllers/messageController.js"
import { verifyToken } from "../middleware/auth.js"

const messageRouter = express.Router();


messageRouter.get("/:roomID", verifyToken, fetchHistory)

export default messageRouter;