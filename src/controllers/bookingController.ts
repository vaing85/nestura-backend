
import Booking from '../models/booking';
import Property from '../models/property';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

// Create a booking (booker)
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { property, startDate, endDate, guests } = req.body;
    if (!property || !startDate || !endDate || !guests) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!req.user || req.user.role !== 'booker') {
      return res.status(403).json({ message: 'Only bookers can create bookings.' });
    }
    // Check property exists
    const prop = await Property.findById(property);
    if (!prop) return res.status(404).json({ message: 'Property not found.' });
    // Optionally: check for date conflicts here
    const booking = new Booking({
      property,
      booker: req.user.userId,
      startDate,
      endDate,
      guests,
      status: 'pending',
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get bookings for the logged-in booker
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
    const bookings = await Booking.find({ booker: req.user.userId }).populate('property');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get bookings for properties owned by the logged-in owner
export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can view their property bookings.' });
    }
    // Find properties owned by this user
    const properties = await Property.find({ owner: req.user.userId });
    const propertyIds = properties.map(p => p._id);
    const bookings = await Booking.find({ property: { $in: propertyIds } }).populate('booker');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Cancel a booking (booker)
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.booker.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only cancel your own bookings.' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
