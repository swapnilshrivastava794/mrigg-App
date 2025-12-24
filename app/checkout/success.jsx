import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SuccessScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    // Reset to initial route of tabs
    router.dismissAll();
    router.replace("/(tabs)"); 
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Ionicons name="bag-check" size={80} color={COLORS.white} />
        </View>
        
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.message}>
            Your order has been placed successfully. You will receive an email confirmation shortly.
        </Text>

        <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome}>
            <Text style={styles.btnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconContainer: {
    width: 140,
    height: 140,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: COLORS.grey,
    lineHeight: 24,
    marginBottom: 40,
  },
  homeBtn: {
    backgroundColor: COLORS.textDark,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  }
});
