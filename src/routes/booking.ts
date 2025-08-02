

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  cancelBooking
} from '../controllers/bookingController';

const bookingRouter = Router();

// Create a booking (booker)
bookingRouter.post('/', authenticate, createBooking);
// Get bookings for the logged-in booker
bookingRouter.get('/my', authenticate, getMyBookings);
// Get bookings for properties owned by the logged-in owner
bookingRouter.get('/owner', authenticate, getOwnerBookings);
// Cancel a booking (booker)
bookingRouter.patch('/:id/cancel', authenticate, cancelBooking);

export default bookingRouter;
