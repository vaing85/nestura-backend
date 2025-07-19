import { Router } from 'express';
import { addReview, getReviews } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const reviewRouter = Router();

// Add a review (requires authentication)
reviewRouter.post('/', authenticate, addReview);

// Get reviews for a property
reviewRouter.get('/:propertyId', getReviews);

export default reviewRouter;
