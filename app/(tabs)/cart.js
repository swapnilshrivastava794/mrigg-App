import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors"; // 💜 GLOBAL COLORS
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Cat sports mans shoe",
      brand: "Rebook",
      price: 500,
      qty: 1,
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "2",
      name: "Nikka sports shoe",
      brand: "Nikka",
      price: 450,
      qty: 2,
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
  ]);

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <Screen>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Ionicons name="trash" size={16} color={COLORS.primaryDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.brand}>{item.brand}</Text>

            <Text style={styles.price}>${item.price.toFixed(2)}</Text>

            {/* Quantity Selector */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decreaseQty(item.id)}
              >
                <Ionicons name="remove" size={18} color={COLORS.primaryDark} />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increaseQty(item.id)}
              >
                <Ionicons name="add" size={18} color={COLORS.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Total & Checkout */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalTitle}>Total</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 6,
    color: COLORS.textDark,
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    padding: 14,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: COLORS.lilac,
    borderRadius: 14,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    resizeMode: "cover",
  },

  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.white,
    width: 26,
    height: 26,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },

  brand: {
    fontSize: 13,
    color: COLORS.grey,
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 10,
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 12,
  },

  qtyButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1.3,
    borderColor: COLORS.primaryDark,
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  /** Total Section **/
  bottomBar: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    elevation: 6,
    shadowColor: COLORS.primaryDark,
  },

  totalTitle: {
    fontSize: 14,
    color: COLORS.grey,
  },

  totalAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },

  checkoutButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  checkoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
