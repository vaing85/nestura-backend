import Review from '../models/review';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const { property, rating, comment } = req.body;
    if (!property || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const review = new Review({ property, user: req.user.userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ property: propertyId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
