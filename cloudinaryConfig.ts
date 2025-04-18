import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import dotenv from 'dotenv';

// Cargar variables de entorno primero
const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: env === 'development' ? './.env.local' : './.env.production',
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
