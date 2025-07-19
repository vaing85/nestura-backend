// ...existing code...
// @ts-ignore
// eslint-disable-next-line
/// <reference types="jest" />


import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import Property from '../src/models/property';
import jwt from 'jsonwebtoken';
import User from '../src/models/user';
import connectDB from '../src/config/db';

jest.setTimeout(30000);

describe('Property CRUD API', () => {

  let token: string;
  let propertyId: string;
  let userId: string;

  it('should confirm propertyRouter is alive', async () => {
    const res = await request(app).get('/api/properties/test-alive');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'propertyRouter is alive');
  });

  beforeAll(async () => {
    await connectDB();
    // Create a real user in the database
    const user = new User({
      email: 'crudtestuser@example.com',
      password: 'testpassword',
      name: 'CRUD Test User',
      role: 'owner',
    });
    await user.save();
    userId = (user._id as mongoose.Types.ObjectId).toString();
    // Generate a test JWT token for this user
    const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
    const testUser = { userId, role: 'owner' };
    token = jwt.sign(testUser, JWT_SECRET);
  });

  afterAll(async () => {
    await Property.deleteMany({ title: /Test Property/ });
    await User.deleteMany({ email: 'crudtestuser@example.com' });
    await mongoose.connection.close();
  });

  it('should create a new property', async () => {
    const res = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Property CRUD',
        description: 'A property for CRUD test',
        address: '456 Test Ave',
        price: 200
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Property CRUD');
    expect(res.body).toHaveProperty('address', '456 Test Ave');
    propertyId = res.body._id;
  });

  it('should get the created property by ID', async () => {
    // Debug: log all properties in the DB before fetching by ID
    const allProps = await Property.find({});
    console.log('All properties in DB:', allProps.map(p => ({ id: (p._id as mongoose.Types.ObjectId).toString(), title: p.title })));
    console.log('Looking for propertyId:', propertyId);
    const res = await request(app)
      .get(`/api/properties/${propertyId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Property CRUD');
  });

  it('should update the property', async () => {
    const res = await request(app)
      .put(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 250 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('price', 250);
  });

  it('should delete the property', async () => {
    const res = await request(app)
      .delete(`/api/properties/${propertyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
