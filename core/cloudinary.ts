import cloudinary from 'cloudinary';

//@ts-ignore
cloudinary.config({
  cloud_name: 'pet-projects',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
