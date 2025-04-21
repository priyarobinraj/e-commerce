import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Cartcontext";

const Cart: React.FC = () => {
  const { cart, increaseQuantity, decreaseQuantity, cartItemCount } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-6 sm:py-10 min-h-screen bg-gray-100">
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-4 inline-block text-sm sm:text-base"
      >
        ← Back to Products
      </Link>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
        Shopping Cart
      </h2>
      {cartItemCount === 0 ? (
        <p className="text-sm sm:text-base">Your cart is empty.</p>
      ) : (
        <div className="bg-white p-4 sm:p-6 shadow-md rounded">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center border-b py-4 last:border-b-0"
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain mr-4"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/100x100?text=No+Image";
                }}
              />
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-medium">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  ${item.price}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm sm:text-base"
                >
                  -
                </button>
                <span className="text-sm sm:text-base">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm sm:text-base"
                >
                  +
                </button>
              </div>
              <p className="text-sm sm:text-base ml-4">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="mt-6 flex justify-end">
            <p className="text-lg sm:text-xl font-semibold">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
