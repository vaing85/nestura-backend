import Booking from '../models/booking';
import { Request, Response } from 'express';

export const listBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate('property user', 'title name email');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { property, user, startDate, endDate } = req.body;
    if (!property || !user || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const booking = new Booking({ property, user, startDate, endDate });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
