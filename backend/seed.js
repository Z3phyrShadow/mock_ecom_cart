import mongoose from "mongoose";
import axios from "axios";
import Product from "./models/Product.js";

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log("Products already seeded.");
      return;
    }

    const { data } = await axios.get("https://fakestoreapi.com/products");

    const products = data.map((p) => ({
      name: p.title,
      price: p.price,
      image: p.image,
    }));

    await Product.insertMany(products);
    console.log("✅ Products seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding products:", error.message);
  }
};

export default seedProducts;
