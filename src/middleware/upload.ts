
import multer from 'multer';
import path from 'path';
import multerPkg from 'multer';
const MulterError = multerPkg.MulterError;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Use MulterError for consistent error handling
    const err = new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    err.message = 'Only image files are allowed!';
    cb(err, false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
