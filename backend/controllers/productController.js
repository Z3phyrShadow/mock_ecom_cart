import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server error fetching products" });
  }
};
