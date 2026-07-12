import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';


const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);


export default userRouter;