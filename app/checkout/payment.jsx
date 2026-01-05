import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useCart } from "../contexts/CartContext";
import { checkout } from "../server";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, clearCart, coupon } = useCart();
  
  const [status, setStatus] = useState("Processing Order...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

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
        })),
        coupon_code: coupon ? coupon.code : null 
      };
      
      const orderRes = await checkout(checkoutData);
      
      // Removed Gokwik Integration
      // Simulate Payment Success / COD Logic
      setStatus("Order Placed Successfully!");
      handleSuccess();

    } catch (error) {
      console.log("Order Creation Error:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Unknown error";
      if (typeof error === 'string') {
          errorMessage = error;
      } else if (error?.detail) {
           errorMessage = error.detail;
      } else {
          errorMessage = "Failed to place order. Please try again.";
      }

      setStatus(`${errorMessage}`);
      setTimeout(() => router.back(), 3000);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
        // Build robust JSON parsing
        const text = event.nativeEvent.data;
        if (text.includes('"status": "ok"') || text.includes('status":"ok"') || text.includes('"status": "success"')) {
            handleSuccess();
        } else if (text.includes('"status": "error"') || text.includes('"status": "failed"')) {
            setPaymentData(null);
            setStatus("Payment Failed: Transaction Declined");
            setTimeout(() => router.back(), 3000);
        }
    } catch (e) {
        console.log("Message parse error", e);
    }
  };

  const handleSuccess = () => {
      setIsSuccess(true);
      setPaymentData(null);
      setStatus("Payment Successful!");
      clearCart();
      
      setTimeout(() => {
        router.replace("/checkout/success");
      }, 1000);
  };

  if (paymentData) return null; // Logic removed, should not happen

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
