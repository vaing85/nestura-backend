import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/user';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();
  const resetUrl = `http://localhost:3001/reset-password/${token}`;
  // For testing, log the reset link to the console
  console.log(`Password reset link for ${email}: ${resetUrl}`);
  return res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required.' });
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return res.json({ message: 'Password reset successful.' });
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.status = status;
    await user.save();
    return res.json({ message: `User status updated to ${status}.` });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
