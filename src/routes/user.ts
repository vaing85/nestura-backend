import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, updateUserStatus, getAllUsers } from '../controllers/userController';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController';
import { authenticate, requireAdmin } from '../middleware/auth';


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

// Forgot password
userRouter.post('/forgot-password', forgotPassword);

// Reset password
userRouter.post('/reset-password/:token', resetPassword);

// Admin: Update user status (approve, reject, suspend)
userRouter.put('/:userId/status', authenticate, requireAdmin, updateUserStatus);

// Admin: Get all users
userRouter.get('/', authenticate, requireAdmin, getAllUsers);

export default userRouter;
