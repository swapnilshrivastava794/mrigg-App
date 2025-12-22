import Screen from "@/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

// ❗ This hides header only for THIS page
export const options = {
  headerShown: false,
};

export default function ViewOrder() {
  const order = useLocalSearchParams();

  return (
    <Screen>
      <Text style={styles.title}>Order Details</Text>

      <View style={styles.card}>
        <Text style={styles.orderId}>Order ID: #{order.id}</Text>
        <Text style={styles.date}>Placed on: {order.date}</Text>

        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={18} color="#4CD964" />
          <Text style={[styles.status, { color: "#4CD964" }]}>
            {order.status}
          </Text>
        </View>
      </View>

      {/* Product Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: order.image }} style={styles.image} />
          <View>
            <Text style={styles.itemName}>Items: {order.items}</Text>
            <Text style={styles.price}>${order.total}</Text>
          </View>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment Summary</Text>

        <View style={styles.rowSpace}>
          <Text style={styles.label}>Order Total</Text>
          <Text style={styles.labelValue}>${order.total}</Text>
        </View>

        <View style={styles.rowSpace}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.labelValue}>$0.00</Text>
        </View>

        <View style={styles.rowSpace}>
          <Text style={styles.totalLabel}>Final Amount</Text>
          <Text style={styles.totalAmount}>${order.total}</Text>
        </View>
      </View>

      <View style={{ height: 80 }} />
    </Screen>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    elevation: 4,
  },
  orderId: { fontSize: 16, fontWeight: "700" },
  date: { color: "#777", marginBottom: 6 },
  statusRow: { flexDirection: "row", gap: 6, marginBottom: 12 },
  image: {
    width: 70,
    height: 70,
    marginRight: 14,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  row: { flexDirection: "row", alignItems: "center" },
  itemName: { fontSize: 15, fontWeight: "700" },
  price: { fontSize: 18, fontWeight: "800", color: "#FF6B6B", marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginBottom: 12 },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#777" },
  labelValue: { fontSize: 14, fontWeight: "700" },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalAmount: { fontSize: 18, fontWeight: "900", color: "#FF6B6B" },
});
