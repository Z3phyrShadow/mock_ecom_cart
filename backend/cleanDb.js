import mongoose from 'mongoose';
import Product from './models/Product.js';
import connectDB from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log('Products cleaned successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error cleaning products:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

cleanProducts();
