import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRouter from './routes/user';
import propertyRouter from './routes/property';
import bookingRouter from './routes/booking';
import reviewRouter from './routes/review';
import connectDB from './config/db';

// Do not connect to MongoDB at the top level; let the server or tests control connection timing
const app = express();

// Security middleware
app.use(helmet());

// Enable CORS (allow all origins by default, customize as needed)
app.use(cors());

// Debug: log every incoming request (uncomment for debugging only)
// app.use((req, res, next) => {
//   console.log(`[app] ${req.method} ${req.originalUrl} | path: ${req.path}`);
//   console.log(`[app] headers:`, req.headers);
//   next();
// });
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Nestura Backend!');
});

// Mount routers
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/bookings', bookingRouter);


app.use('/api/reviews', reviewRouter);

// Centralized error handler (handles Multer and all other errors)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Multer file upload errors
  if (
    err && (
      err.name === 'MulterError' ||
      err.isImageFilter ||
      (err.message && /only image files are allowed/i.test(err.message)) ||
      err.code === 'LIMIT_UNEXPECTED_FILE'
    )
  ) {
    return res.status(400).json({ message: err.message || 'Only image files are allowed!' });
  }
  // Other errors
  return res.status(500).json({ message: err.message || 'Server error.' });
});



if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
}

export default app;
