// client/src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      // Transform API response to match our cart structure
      const items = response.items?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product_name || item.name,
        price: item.price,
        qty: item.quantity,
      })) || [];
      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
      // If not authenticated, use empty cart
      if (!user) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setError(null);

      // Client-side stock validation
      if (!product || (product.stock_quantity || 0) <= 0) {
        setError("Product is out of stock");
        return false;
      }

      // Check if adding this quantity would exceed stock
      const existingItem = cartItems.find(item => item.product_id === product.id || item.id === product.id);
      const currentQty = existingItem ? existingItem.qty : 0;
      const newTotalQty = currentQty + quantity;

      if (newTotalQty > (product.stock_quantity || 0)) {
        const available = product.stock_quantity || 0;
        setError(`Not enough stock. Only ${available} item(s) available.`);
        return false;
      }

      // If user is logged in, sync with backend
      if (user) {
        await cartAPI.addItem(product.id, quantity);
        await fetchCart(); // Refresh cart from server
      } else {
        // Local cart for guests (not persisted)
        setCartItems((prev) => {
          const exists = prev.find(item => item.product_id === product.id || item.id === product.id);
          if (exists) {
            return prev.map(item =>
              (item.product_id === product.id || item.id === product.id)
                ? { ...item, qty: item.qty + quantity }
                : item
            );
          } else {
            return [...prev, { ...product, product_id: product.id, qty: quantity }];
          }
        });
      }
      return true;
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
      console.error("Error adding to cart:", err);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      // If user is logged in, sync with backend
      if (user) {
        await cartAPI.removeItem(itemId);
        await fetchCart(); // Refresh cart from server
      } else {
        // Local cart for guests
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
      }
      return true;
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
      console.error("Error removing from cart:", err);
      return false;
    }
  };

  const updateQty = async (itemId, qty) => {
    if (qty < 1) {
      return removeFromCart(itemId);
    }

    try {
      setError(null);
      // If user is logged in, sync with backend
      if (user) {
        await cartAPI.updateItem(itemId, qty);
        await fetchCart(); // Refresh cart from server
      } else {
        // Local cart for guests
        setCartItems((prev) => prev.map(item => item.id === itemId ? { ...item, qty } : item));
      }
      return true;
    } catch (err) {
      setError(err.message || "Failed to update quantity");
      console.error("Error updating quantity:", err);
      return false;
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        loading,
        error,
        cartTotal,
        cartItemCount,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
