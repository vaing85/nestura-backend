

import { Router } from 'express';
import { listBookings, createBooking } from '../controllers/bookingController';
import { getUserBookings, cancelBooking } from '../controllers/bookingManageController';
import { authenticate } from '../middleware/auth';

const bookingRouter = Router();

// List all bookings
bookingRouter.get('/', listBookings);


// Create a new booking (requires authentication)
bookingRouter.post('/', authenticate, createBooking);

// Get current user's bookings
bookingRouter.get('/my', authenticate, getUserBookings);

// Cancel a booking
bookingRouter.delete('/:id', authenticate, cancelBooking);

export default bookingRouter;
