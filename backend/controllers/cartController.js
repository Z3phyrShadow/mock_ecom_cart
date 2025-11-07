import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import getMockUser from "../mockUser.js";

// Helper to get, format, and calculate the cart for a user
const getCartForUser = async (userId) => {
  const items = await CartItem.find({ userId }).populate("productId");

  const cartItems = items.map(item => ({
    id: item._id,
    product: {
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image || null
    },
    qty: item.qty,
    lineTotal: item.qty * item.productId.price
  }));

  const total = cartItems.reduce((sum, it) => sum + it.lineTotal, 0);

  return { items: cartItems, total };
};

// Return all cart items for the mock user
export const getCart = async (req, res) => {
  try {
    const user = await getMockUser();
    const cart = await getCartForUser(user._id);
    res.json(cart);
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error fetching cart" });
  }
};

// Add item to the mock user's cart
export const addToCart = async (req, res) => {
  try {
    const user = await getMockUser();
    const { productId, qty } = req.body;

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({ message: "productId and qty (>=1) required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cartItem = await CartItem.findOne({ userId: user._id, productId });
    if (cartItem) {
      cartItem.qty += Number(qty);
      await cartItem.save();
    } else {
      cartItem = new CartItem({ userId: user._id, productId, qty });
      await cartItem.save();
    }

    res.status(201).json({ message: "Added to cart", id: cartItem._id });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Server error adding to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const user = await getMockUser();
    const { id } = req.params;
    const { qty } = req.body;

    if (qty <= 0) {
      await CartItem.findOneAndDelete({ _id: id, userId: user._id });
    } else {
      const cartItem = await CartItem.findOne({ _id: id, userId: user._id });
      if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
      cartItem.qty = qty;
      await cartItem.save();
    }
    
    const cart = await getCartForUser(user._id);
    res.json(cart);
  } catch (err) {
    console.error("updateCartItem error:", err);
    res.status(500).json({ message: "Server error updating cart" });
  }
};

// Remove item from the mock user's cart
export const removeFromCart = async (req, res) => {
  try {
    const user = await getMockUser();
    const id = req.params.id;

    const deleted = await CartItem.findOneAndDelete({ _id: id, userId: user._id });
    if (!deleted) return res.status(404).json({ message: "Cart item not found" });

    const cart = await getCartForUser(user._id);
    res.json(cart);
  } catch (err) {
    console.error("removeFromCart error:", err);
    res.status(500).json({ message: "Server error removing cart item" });
  }
};

// Checkout for the mock user
export const checkout = async (req, res) => {
  try {
    const user = await getMockUser();
    const items = await CartItem.find({ userId: user._id }).populate("productId");

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cartItems = items.map(item => ({
      productId: item.productId._id.toString(),
      name: item.productId.name,
      price: item.productId.price,
      qty: item.qty
    }));

    const total = cartItems.reduce((sum, it) => sum + (it.price * it.qty), 0);

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items: cartItems
    };

    // Clear the mock user's cart
    await CartItem.deleteMany({ userId: user._id });

    res.json({ message: "Checkout successful (mock)", receipt });
  } catch (err) {
    console.error("checkout error:", err);
    res.status(500).json({ message: "Server error during checkout" });
  }
};
