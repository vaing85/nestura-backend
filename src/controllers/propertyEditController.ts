import Property from '../models/property';
import { AuthRequest } from '../middleware/auth';
import { Response } from 'express';

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, address, price } = req.body;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    if (!req.user || property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this property.' });
    }
    property.title = title || property.title;
    property.description = description || property.description;
    property.address = address || property.address;
    property.price = price || property.price;
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    if (!req.user || property.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You do not own this property.' });
    }
    await property.deleteOne();
    res.json({ message: 'Property deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
