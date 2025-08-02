import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/airbnb_test';

mongoose.connect(uri)
  .then(() => {
    console.log('Mongoose connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Mongoose connection error:', err);
    process.exit(1);
  });
