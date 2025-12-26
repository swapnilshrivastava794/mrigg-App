import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useCart } from "../contexts/CartContext";
import { checkout, paymentSuccess } from "../server";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, clearCart } = useCart();
  
  const [status, setStatus] = useState("Processing Payment...");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    processOrder();
  }, []);

  const processOrder = async () => {
    try {
      // 1. Create Order
      setStatus("Creating Order...");
      const checkoutData = {
        address_id: Number(params.addressId),
        items: cartItems.map(item => ({
            product_id: item.productId,
            quantity: item.qty,
            variation_id: item.variantId || null
        }))
      };
      
      const orderRes = await checkout(checkoutData);
      
      // 2. Mock Payment Delay
      setStatus("Contacting Bank...");
      await new Promise(r => setTimeout(r, 2000));
      
      // 3. Confirm Payment
      setStatus("Confirming Transaction...");
      const paymentData = { order_id: orderRes.order_id || 1 }; // Fallback if mock returns differ
      await paymentSuccess(paymentData);
      
      // 4. Success
      setIsSuccess(true);
      setStatus("Payment Successful!");
      clearCart();
      
      setTimeout(() => {
        router.replace("/checkout/success");
      }, 1000);

    } catch (error) {
      console.log("Payment Error", error);
      setStatus("Payment Failed");
      // Handle error (maybe go back)
      setTimeout(() => router.back(), 2000);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.content}>
            {isSuccess ? (
                <Ionicons name="checkmark-circle" size={80} color={COLORS.primaryDark} />
            ) : (
                <ActivityIndicator size={60} color={COLORS.primaryDark} />
            )}
            
            <Text style={styles.status}>{status}</Text>
            <Text style={styles.subtext}>Please do not close this screen</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  status: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.grey,
  }
});
