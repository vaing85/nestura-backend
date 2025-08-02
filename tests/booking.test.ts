import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import Booking from '../src/models/booking';
import Property from '../src/models/property';
import User from '../src/models/user';
import jwt from 'jsonwebtoken';

jest.setTimeout(30000); // Increase timeout to 30 seconds

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

let bookerToken: string;
let ownerToken: string;
let propertyId: string;
let bookingId: string;

beforeAll(async () => {
  console.log('beforeAll: starting');
  // Clean up test DB
  await Booking.deleteMany({});
  console.log('Deleted all bookings');
  await Property.deleteMany({});
  console.log('Deleted all properties');
  await User.deleteMany({});
  console.log('Deleted all users');

  // Create owner user
  const owner = new User({
    name: 'Owner Test',
    email: 'owner@example.com',
    password: 'password',
    role: 'owner',
    isVerified: true
  });
  await owner.save();
  ownerToken = jwt.sign({ userId: owner._id, role: 'owner' }, JWT_SECRET);

  // Create booker user
  const booker = new User({
    name: 'Booker Test',
    email: 'booker@example.com',
    password: 'password',
    role: 'booker',
    isVerified: true
  });
  await booker.save();
  bookerToken = jwt.sign({ userId: booker._id, role: 'booker' }, JWT_SECRET);

  // Create property owned by owner
  const property = new Property({
    title: 'Test Property',
    description: 'A property for booking tests',
    address: '123 Test St',
    price: 100,
    owner: owner._id,
    images: []
  });
  await property.save();
  propertyId = String(property._id);
  console.log('beforeAll: finished');
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe('Booking API', () => {
  it('should create a booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${bookerToken}`)
      .send({
        property: propertyId,
        startDate: '2025-08-01',
        endDate: '2025-08-05',
        guests: 2
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    bookingId = res.body._id;
  });

  it('should get my bookings', async () => {
    const res = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${bookerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get owner bookings', async () => {
    const res = await request(app)
      .get('/api/bookings/owner')
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should cancel a booking', async () => {
    const res = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${bookerToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Booking cancelled.');
  });
});
