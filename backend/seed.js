import mongoose from "mongoose";
import axios from "axios";
import Product from "./models/Product.js";

const seedProducts = async () => {
  try {
    // Check if products already exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log("Products already seeded.");
      return;
    }

    // Fetch products from Fake Store API
    const { data } = await axios.get("https://fakestoreapi.com/products");

    // Map API data to our product schema
    const products = data.map((p) => ({
      name: p.title,
      price: p.price,
      image: p.image,
    }));

    // Insert products into the database
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
  }
};

export default seedProducts;
