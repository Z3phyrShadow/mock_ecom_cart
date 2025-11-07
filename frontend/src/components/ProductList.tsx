import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import type { Product, CartItem } from "../types";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showToast } = useToast();

  const fetchCart = () => {
    axios.get("http://localhost:5000/api/cart")
      .then(res => setCartItems(res.data.items))
      .catch(err => console.error("Error fetching cart:", err));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));
    fetchCart();
  }, []);

  const handleAddToCart = async (productId: string) => {
    await axios.post("http://localhost:5000/api/cart", { productId, qty: 1 });
    fetchCart();
    showToast('Product added to cart!');
  };

  const handleQuantityChange = async (item: CartItem, newQty: number) => {
    if (newQty < 0) return;
    await axios.put(`http://localhost:5000/api/cart/${item.id}`, { qty: newQty });
    fetchCart();
  };

  const getCartItem = (productId: string) => {
    return cartItems.find(item => item.product.id === productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 flex-grow">
      {products.map((p) => {
        const cartItem = getCartItem(p._id);
        return (
          <div key={p._id} className="bg-white border rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
            <img
              src={p.image || "https://via.placeholder.com/300"}
              alt={p.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-600 mt-1">₹{p.price}</p>
              <div className="mt-auto">
                {cartItem ? (
                  <div className="flex items-center justify-center">
                    <button onClick={() => handleQuantityChange(cartItem, cartItem.qty - 1)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-l">-</button>
                    <span className="px-4 py-1 bg-gray-100">{cartItem.qty}</span>
                    <button onClick={() => handleQuantityChange(cartItem, cartItem.qty + 1)} className="bg-gray-300 text-gray-700 px-3 py-1 rounded-r">+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(p._id)}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
