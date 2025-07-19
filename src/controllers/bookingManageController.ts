import Booking from '../models/booking';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const bookings = await Booking.find({ user: req.user.userId }).populate('property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this booking' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
