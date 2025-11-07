import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { CartResponse } from "../types";
import CheckoutModal from "./CheckoutModal";
import { debounce } from "lodash";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartResponse>({ items: [], total: 0 });
  const [receipt, setReceipt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCart = async () => {
    const res = await axios.get("http://localhost:5000/api/cart");
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: string) => {
    const res = await axios.delete(`http://localhost:5000/api/cart/${id}`);
    setCart(res.data); // The backend now returns the updated cart
  };

  const debouncedUpdate = useCallback(
    debounce(async (id: string, qty: number) => {
      if (qty > 0) {
        const res = await axios.put(`http://localhost:5000/api/cart/${id}`, { qty });
        setCart(res.data);
      } else {
        handleRemove(id);
      }
    }, 300),
    []
  );

  const handleQuantityChange = (id: string, newQty: number) => {
    // Optimistically update the UI
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === id ? { ...item, qty: newQty, lineTotal: item.product.price * newQty } : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      return { items: updatedItems, total: newTotal };
    });
    debouncedUpdate(id, newQty);
  };

  const handleCheckout = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/checkout");
      setReceipt(res.data.receipt);
      setShowModal(true);
      fetchCart();
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {cart.items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b">
                <div className="flex items-center">
                  <img src={item.product.image || 'https://via.placeholder.com/100'} alt={item.product.name} className="w-20 h-20 object-cover rounded mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <div className="flex items-center mt-2">
                      <label htmlFor={`qty-${item.id}`} className="text-sm mr-2">Qty:</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                        className="w-16 p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">₹{item.lineTotal.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6 text-right">
              <p className="text-2xl font-bold">Total: ₹{cart.total.toFixed(2)}</p>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-600 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
      <CheckoutModal
        show={showModal}
        receipt={receipt}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Cart;
