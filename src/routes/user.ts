
import { Router } from 'express';
import { register, login } from '../controllers/userController';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController';
import { authenticate } from '../middleware/auth';


const userRouter = Router();
// Get user profile
userRouter.get('/profile', authenticate, getProfile);

// Update user profile
userRouter.put('/profile', authenticate, updateProfile);

// Change password
userRouter.put('/change-password', authenticate, changePassword);

// Register
userRouter.post('/register', register);

// Login
userRouter.post('/login', login);

export default userRouter;
