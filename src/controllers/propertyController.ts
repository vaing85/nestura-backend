export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('getPropertyById: received id:', id, 'type:', typeof id);
    // Log all property IDs in the DB for comparison
    const allProps = await Property.find({});
    console.log('getPropertyById: all property IDs in DB:', allProps.map(p => (p._id ? p._id.toString() : null)));
    const property = await Property.findById(id);
    console.log('getPropertyById: property found:', property);
    if (!property) {
      console.log('getPropertyById: property not found for id', id);
      return res.status(404).json({ message: 'Property not found.' });
    }
    res.json(property);
  } catch (err) {
    console.log('getPropertyById: error', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

import Property from '../models/property';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const listProperties = async (req: Request, res: Response) => {
  try {
    const { location, minPrice, maxPrice, owner } = req.query;
    const filter: any = {};
    if (location) filter.address = { $regex: location, $options: 'i' };
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (owner) filter.owner = owner;
    const properties = await Property.find(filter).populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, address, price } = req.body;
    if (!title || !description || !address || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Only allow users with role 'owner' to create properties
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only property owners can create properties.' });
    }
    // Assign the authenticated user as the owner
    const property = new Property({ title, description, address, price, owner: req.user.userId });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
