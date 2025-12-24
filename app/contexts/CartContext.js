import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load Cart
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.log("Failed to load cart", error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(items));
    } catch (error) {
      console.log("Failed to save cart", error);
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
    saveCart([]);
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
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
