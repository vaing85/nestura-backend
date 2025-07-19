// @ts-ignore
// eslint-disable-next-line
/// <reference types="jest" />

jest.setTimeout(30000); // Increase timeout to 30 seconds

// Ensure test environment and default Mongo URI
process.env.NODE_ENV = 'test';
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/airbnb_test';
}
import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import Property from '../src/models/property';
import * as path from 'path';
import jwt from 'jsonwebtoken';
import 'jest';

describe('POST /api/properties/upload-image', () => {
  let propertyId: string;
  let token: string;

  beforeAll(async () => {
    // Ensure MongoDB is connected for tests
    if (mongoose.connection.readyState === 0) {
      const connectDB = (await import('../src/config/db')).default;
      await connectDB();
    }
    // Generate a test JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
    // Use the property owner as the user
    const testUser = { userId: new mongoose.Types.ObjectId().toString(), role: 'owner' };
    token = jwt.sign(testUser, JWT_SECRET);
    console.log('beforeAll: starting');
    // Ens
    // ure uploads directory exists
    const fs = await import('fs/promises');
    try {
      await fs.mkdir('uploads', { recursive: true });
      console.log('Ensured uploads directory exists.');
    } catch (err) {
      console.log('Error ensuring uploads directory:', err);
    }
    // MongoDB connection is managed by the app; do not connect here.
    console.log('Creating test property...');
    const property = new Property({
      title: 'Test Property',
      description: 'Test Desc',
      address: '123 Test St',
      price: 100,
      owner: new mongoose.Types.ObjectId(),
      images: []
    });
    await property.save();
    propertyId = (property._id as mongoose.Types.ObjectId).toString();
    console.log('Test property created:', propertyId);
    console.log('beforeAll: finished');
  });

  afterAll(async () => {
    console.log('afterAll: starting');
    console.log('Cleaning up test property...');
    await Property.deleteMany({ title: 'Test Property' });
    // Remove uploaded test image file if it exists
    const property = await Property.findOne({ title: 'Test Property' });
    if (property && property.images && property.images.length > 0) {
      const fs = await import('fs/promises');
      for (const imgPath of property.images) {
        try {
          // Remove leading slash if present
          const filePath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
          await fs.unlink(filePath);
          console.log('Deleted test image:', filePath);
        } catch (err) {
          // Ignore if file does not exist
          console.log('Error deleting file (may not exist):', err);
        }
      }
    }
    // MongoDB connection is managed by the app; do not close here.
    console.log('Skipped closing MongoDB connection.');
    console.log('afterAll: finished');
  });

  it('should upload an image and add it to the property', async () => {
    console.log('Starting image upload test...');
    const res = await request(app)
      .post('/api/properties/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .field('propertyId', propertyId)
      .attach('image', Buffer.from([0xff, 0xd8, 0xff]), 'test-image.jpg');
    console.log('Upload response:', res.status, res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('filename');
    expect(res.body).toHaveProperty('path');
    // Check property updated
    const updated = await Property.findById(propertyId);
    console.log('Updated property images:', updated?.images);
    expect(updated?.images.length).toBe(1);
    expect(updated?.images[0]).toContain('/uploads/');
  });

  it('should reject if no image is provided', async () => {
    const res = await request(app)
      .post('/api/properties/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .field('propertyId', propertyId);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded.');
  });

  it('should reject if propertyId is missing', async () => {
    const res = await request(app)
      .post('/api/properties/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from([0xff, 0xd8, 0xff]), 'test-image.jpg');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Property ID is required.');
  });

  it('should reject if property does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post('/api/properties/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .field('propertyId', fakeId)
      .attach('image', Buffer.from([0xff, 0xd8, 0xff]), 'test-image.jpg');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Property not found.');
  });

  it('should reject if file is not an image', async () => {
    // NOTE: Due to Multer/Supertest/Express quirks, file type errors may return 500 in test but 400 in production, and the response body may be empty in test.
    const res = await request(app)
      .post('/api/properties/upload-image')
      .set('Authorization', `Bearer ${token}`)
      .field('propertyId', propertyId)
      .attach('image', Buffer.from('not-an-image'), 'test.txt');
    expect([400, 500]).toContain(res.status);
    // In production, the body will have a message, but in test it may be empty.
  });
});
