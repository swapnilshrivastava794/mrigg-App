import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { applyCoupon } from "../server"; // Import API

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);

  // Load Cart & Coupon
  useEffect(() => {
    loadCart();
  }, []);

  // Re-validate Coupon when Cart Changes
  useEffect(() => {
      const validateCoupon = async () => {
          if (!coupon || cartItems.length === 0) {
              if (coupon && cartItems.length === 0) {
                  // Cart emptied, remove coupon
                  removeCoupon();
              }
              return;
          }

          const currentTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

          try {
              // Re-check coupon with new total
              const res = await applyCoupon({
                  code: coupon.code,
                  cart_total: currentTotal
              });

              // Update coupon with new values (discount might have changed)
               setCoupon(prev => ({
                   ...prev,
                   ...res,
                   code: coupon.code // ensure code persists
               }));
               AsyncStorage.setItem("coupon", JSON.stringify({ ...coupon, ...res }));

          } catch (error) {
              console.log("Coupon no longer valid:", error);
              // Coupon became invalid (e.g. total dropped below threshold)
              removeCoupon();
              // Optional: Toast "Coupon removed as criteria not met"
          }
      };

      // Debounce slightly to avoid rapid API calls during rapid qty updates
      const timer = setTimeout(() => {
          if (coupon) validateCoupon();
      }, 500);

      return () => clearTimeout(timer);

  }, [cartItems]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      const storedCoupon = await AsyncStorage.getItem("coupon");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (error) {
      console.log("Failed to load cart/coupon", error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.log("Failed to save cart", error);
    }
  };

  const applyCouponToCart = async (couponData) => {
      setCoupon(couponData);
      try {
          await AsyncStorage.setItem("coupon", JSON.stringify(couponData));
      } catch (e) {
          console.log("Failed to save coupon", e);
      }
  };

  const removeCoupon = async () => {
      setCoupon(null);
      try {
          await AsyncStorage.removeItem("coupon");
      } catch (e) {
          console.log("Failed to remove coupon", e);
      }
  };

  // Add Item
  const addToCart = (product, variant = null) => {
    setCartItems((prevItems) => {
      const itemId = variant ? variant.id : product.id;
      const existingItemIndex = prevItems.findIndex((item) => {
        // Simple logic: if same product ID and same variant ID (if exists)
        const isSameProduct = item.productId === product.id;
        const isSameVariant = variant ? item.variantId === variant.id : !item.variantId;
        return isSameProduct && isSameVariant;
      });

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].qty += 1;
        saveCart(newItems);
        return newItems;
      } else {
        // New item
        // Normalize data structure
        const newItem = {
            id: itemId, // Unique ID for the cart item (simplification)
            productId: product.id,
            variantId: variant?.id,
            name: product.name,
            variantName: variant?.name,
            brand: product.brand || "", // Assuming product might have brand
            image: product.images?.[0]?.image || "", // Fallback
            qty: 1,
            price: variant ? (Number(variant.offerprice) > 0 ? Number(variant.offerprice) : Number(variant.price_modifier) > 0 ? Number(variant.price_modifier) : Number(product.final_price)) : Number(product.final_price),
            // Store original objects if needed later
            _product: product,
            _variant: variant
        };
        const newItems = [...prevItems, newItem];
        saveCart(newItems);
        return newItems;
      }
    });
  };

  // Remove Item
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== cartItemId);
      saveCart(newItems);
      return newItems;
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null); // Also clear coupon? Usually yes.
    saveCart([]);
    AsyncStorage.removeItem("coupon");
  };

  // Adjust Qty
  const updateQuantity = (cartItemId, change) => {
     setCartItems((prev) => {
        const newItems = prev.map(item => {
            if (item.id === cartItemId) {
                const newQty = item.qty + change;
                if (newQty < 1) return item; // limit to 1
                return { ...item, qty: newQty };
            }
            return item;
        });
        saveCart(newItems);
        return newItems;
     })
  }

  return (
    <CartContext.Provider
      value={{ cartItems, coupon, addToCart, removeFromCart, clearCart, updateQuantity, applyCouponToCart, removeCoupon }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
