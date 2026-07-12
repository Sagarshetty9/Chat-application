import express from 'express';
import { register, login} from '../controllers/authController.js';
import {getUsers} from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js';


const userRouter = express.Router();

// Public Routes
userRouter.post('/register', register);
userRouter.post('/login', login);

userRouter.get('/getContacts',getUsers)


export default userRouter;