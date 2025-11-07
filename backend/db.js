import mongoose from "mongoose";
import seedProducts from "./seed.js";
import getMockUser from "./mockUser.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI missing");

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    await seedProducts();
    await getMockUser();
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
