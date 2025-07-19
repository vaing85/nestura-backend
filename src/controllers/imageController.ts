import { Request, Response } from 'express';
import Property from '../models/property';

export const uploadImage = async (req: Request, res: Response) => {
  const { propertyId } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  if (!propertyId) {
    return res.status(400).json({ message: 'Property ID is required.' });
  }
  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }
    property.images.push(`/uploads/${req.file.filename}`);
    await property.save();
    res.status(201).json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
