import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors"; // 💜 Global Lavender Theme
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Orders() {
  const orders = [
    {
      id: "ORD-1001",
      status: "Delivered",
      date: "25 Nov 2025",
      total: 950,
      items: 2,
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "ORD-1002",
      status: "Shipped",
      date: "23 Nov 2025",
      total: 450,
      items: 1,
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "ORD-1003",
      status: "Processing",
      date: "20 Nov 2025",
      total: 600,
      items: 3,
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
  ];

  return (
    <Screen>
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: order.image }} style={styles.image} />
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.orderId}>#{order.id}</Text>
            <Text style={styles.date}>{order.date}</Text>

            {/* Status */}
            <View style={styles.statusContainer}>
              <Ionicons
                name={
                  order.status === "Delivered"
                    ? "checkmark-circle"
                    : order.status === "Shipped"
                    ? "cube"
                    : "time"
                }
                size={16}
                color={
                  order.status === "Delivered"
                    ? "#4CD964"
                    : order.status === "Shipped"
                    ? "#007AFF"
                    : "#FF9500"
                }
              />

              <Text
                style={[
                  styles.status,
                  {
                    color:
                      order.status === "Delivered"
                        ? "#4CD964"
                        : order.status === "Shipped"
                        ? "#007AFF"
                        : "#FF9500",
                  },
                ]}
              >
                {order.status}
              </Text>
            </View>

            {/* Price + Items */}
            <View style={styles.bottomRow}>
              <Text style={styles.total}>${order.total.toFixed(2)}</Text>
              <Text style={styles.items}>{order.items} items</Text>
            </View>

            {/* Track Order */}
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() =>
                router.push({
                  pathname:
                    order.status === "Delivered"
                      ? "/orders/view-order"
                      : "/orders/track-order",
                  params: order,
                })
              }
            >
              <Text style={styles.trackText}>
                {order.status === "Delivered" ? "View Order" : "Track Order"}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={{ height: 80 }} />
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
    color: COLORS.textDark, // 🖤 Black
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    padding: 14,
    elevation: 5,
    shadowColor: COLORS.primary, // 💜 Lavender shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: COLORS.lilac, // 💜 Light lavender bg
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark, // Black
  },

  date: {
    fontSize: 12,
    color: COLORS.grey,
    marginVertical: 4,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  status: {
    fontSize: 13,
    fontWeight: "600",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  total: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primaryDark, // 💜 Deep lavender
  },

  items: {
    fontSize: 13,
    color: COLORS.grey,
  },

  trackButton: {
    backgroundColor: COLORS.primaryDark, // 💜 Purple button
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
  },

  trackText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
