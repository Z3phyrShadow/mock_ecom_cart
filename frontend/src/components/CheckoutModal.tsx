import React from "react";

interface Props {
  show: boolean;
  receipt: any | null;
  onClose: () => void;
}

const CheckoutModal: React.FC<Props> = ({ show, receipt, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-4">
            {receipt?.items?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name} (x{item.qty})</p>
                  <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                </div>
                <p className="text-lg font-semibold">₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t-2 border-dashed">
            <div className="flex justify-between items-center text-2xl font-bold text-gray-800">
              <span>Total</span>
              <span>₹{receipt?.total}</span>
            </div>
            <p className="text-sm text-gray-500 text-right mt-1">
              Paid at: {new Date(receipt?.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
