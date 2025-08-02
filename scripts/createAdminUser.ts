// scripts/createAdminUser.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/user';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb_clone';

async function createAdminUser() {
  await mongoose.connect(MONGO_URI);
  const email = 'admin@example.com';
  const name = 'Admin User';
  const plainPassword = 'adminpassword';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    await mongoose.disconnect();
    return;
  }

  const admin = new User({
    email,
    name,
    password: hashedPassword,
    role: 'admin',
    status: 'approved',
  });
  await admin.save();
  console.log('Admin user created:', email);
  await mongoose.disconnect();
}

createAdminUser().catch(err => {
  console.error('Error creating admin user:', err);
  mongoose.disconnect();
});
