import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import Screen from "@/components/Screen";

export default function TrackOrder() {
  const order = useLocalSearchParams();

  const steps = [
    { label: "Order Placed", icon: "cart", done: true },
    { label: "Processing", icon: "settings", done: true },
    { label: "Shipped", icon: "cube", done: order.status !== "Processing" },
    { label: "Out for Delivery", icon: "bicycle", done: false },
    { label: "Delivered", icon: "checkmark-circle", done: false },
  ];

  return (
    <Screen>
      <Text style={styles.title}>Track Your Order</Text>

      <View style={styles.card}>
        {steps.map((s, index) => (
          <View key={index} style={styles.stepRow}>
            <Ionicons
              name={s.icon}
              size={22}
              color={s.done ? "#4CD964" : "#aaa"}
            />

            <View style={styles.stepInfo}>
              <Text
                style={[
                  styles.stepLabel,
                  { color: s.done ? "#4CD964" : "#777" },
                ]}
              >
                {s.label}
              </Text>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: s.done ? "#4CD964" : "#ddd" },
                  ]}
                />
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    margin: 16,
    elevation: 4,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  stepInfo: {
    marginLeft: 14,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  line: {
    width: 2,
    height: 30,
    marginTop: 6,
    marginLeft: 10,
  },
});
