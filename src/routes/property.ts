import { Router } from 'express';
import { listProperties, createProperty, getPropertyById } from '../controllers/propertyController';
import { updateProperty, deleteProperty } from '../controllers/propertyEditController';
import { authenticate } from '../middleware/auth';
import upload from '../middleware/upload';
import { uploadImage } from '../controllers/imageController';

const propertyRouter = Router();

// Debug: log every request to this router
propertyRouter.use((req, res, next) => {
  console.log(`[propertyRouter] ${req.method} ${req.path}`);
  next();
});

// Test-only route to confirm router is alive
propertyRouter.get('/test-alive', (req, res) => {
  res.status(200).json({ message: 'propertyRouter is alive' });
});

// Upload property image (requires authentication and owner role)
propertyRouter.post('/upload-image', authenticate, upload.single('image'), uploadImage);
// Get property by ID (must be after static routes, but before list route)
propertyRouter.get('/:id', (req, res) => {
  console.log('[propertyRouter] GET /:id route hit, id =', req.params.id);
  return getPropertyById(req, res);
});
// List all properties
propertyRouter.get('/', listProperties);
// Add a new property (requires authentication)
propertyRouter.post('/', authenticate, createProperty);

// Update a property (requires authentication and ownership)
propertyRouter.put('/:id', authenticate, updateProperty);

// Delete a property (requires authentication and ownership)
propertyRouter.delete('/:id', authenticate, deleteProperty);

export default propertyRouter;
