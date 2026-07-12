import express from "express";
import Message from "../models/Message.js";
import {fetchHistory} from "../controllers/messageController.js"

const MessageRouter = express.Router();


MessageRouter.get("/:roomID", fetchHistory)

export default MessageRouter;