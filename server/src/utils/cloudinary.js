import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Multer memory storage (buffers files in memory for direct Cloudinary stream upload)
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Max 50MB per document
  },
  fileFilter: (req, file, cb) => {
    // Allow PDFs, scanned images and property deed documents
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype.startsWith('image/') ||
      file.originalname.match(/\.(pdf|png|jpg|jpeg|doc|docx)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload PDF, PNG, or JPG documents.'), false);
    }
  }
});

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} originalName - Original filename
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{ url: string, public_id: string, format: string, bytes: number }>}
 */
export const uploadToCloudinary = (buffer, originalName, folder = 'property_suraksha/certificates') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are still placeholder, provide a simulated safe upload response
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === 'your_cloudinary_api_key'
    ) {
      console.warn('⚠️ Cloudinary keys are not yet configured in .env. Returning local preview reference.');
      return resolve({
        url: `https://res.cloudinary.com/demo/image/upload/sample.pdf`,
        public_id: `mock_${Date.now()}_${originalName}`,
        format: 'pdf',
        original_filename: originalName
      });
    }

    const cleanFilename = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        type: 'upload',
        access_mode: 'public',
        public_id: `${cleanFilename}_${Date.now()}`
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;
