import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../app/contexts/CartContext";

const ProductQuantityButton = ({ item }) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((c) => c.productId === item.id);
  const qty = cartItem ? cartItem.qty : 0;

  if (qty === 0) {
    // Initial State: "ADD" Button
    return (
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => addToCart(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.addText}>ADD</Text>
      </TouchableOpacity>
    );
  }

  // Active State: Quantity Stepper [ - Qty + ]
  return (
    <View style={styles.stepperContainer}>
      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => {
            if (qty === 1) {
                removeFromCart(cartItem.id);
            } else {
                updateQuantity(cartItem.id, -1);
            }
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="remove" size={16} color={COLORS.white} />
      </TouchableOpacity>

      <Text style={styles.stepperQty}>{qty}</Text>

      <TouchableOpacity
        style={styles.stepperBtn}
        onPress={() => updateQuantity(cartItem.id, 1)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={16} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductQuantityButton;

const styles = StyleSheet.create({
  // Initial "ADD" Button (Pill shape to match Blinkit style better than just a circle)
  addBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  addText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Active Stepper
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryDark,
    borderRadius: 6,
    overflow: "hidden",
    minWidth: 70,
    justifyContent: "space-between",
  },
  stepperBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  stepperQty: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    minWidth: 16,
  },
});
