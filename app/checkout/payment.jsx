import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import RazorpayCheckout from 'react-native-razorpay';
import { useCart } from "../contexts/CartContext";
import { checkout, createRazorpayOrder, verifyRazorpayPayment } from "../server";

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
        coupon_code: coupon ? coupon.code : "" 
      };
      
      const orderRes = await checkout(checkoutData);
      console.log("CHECKOUT RESPONSE:", JSON.stringify(orderRes, null, 2));

      console.log("CHECKOUT RESPONSE:", JSON.stringify(orderRes, null, 2));

      // Check if already paid
      // NOTE: Commented out to force Razorpay flow as per user request
      /*
      if (orderRes.payment_status === 'Success' || orderRes.message?.toLowerCase().includes('success')) {
         console.log("Order already paid. Skipping Razorpay.");
         handleSuccess();
         return;
      }
      */
      
      // 2. Create Razorpay Order
      setStatus("Initializing Payment...");
      console.log("Calling createRazorpayOrder with ID:", orderRes.id || orderRes.order_id || orderRes.order?.id);
      
      const razorpayOrder = await createRazorpayOrder({
          order_id: orderRes.id || orderRes.order_id || orderRes.order?.id // Try fallback keys
      });
      console.log("RAZORPAY ORDER RESPONSE:", JSON.stringify(razorpayOrder, null, 2));

      // 3. Open Razorpay Checkout
      const options = {
        description: 'Order Payment',
        image: 'https://mriigg.com/static/images/logo.png', 
        currency: 'INR',
        key: razorpayOrder.keyId || razorpayOrder.key, // FIX: Check for keyId
        amount: razorpayOrder.amount, 
        name: 'Mrigg',
        order_id: razorpayOrder.id,
        prefill: {
          email: razorpayOrder.prefill_email || 'user@example.com', 
          contact: razorpayOrder.prefill_contact || '9999999999',
          name: razorpayOrder.prefill_name || 'User'
        },
        theme: { color: COLORS.primary }
      };

      console.log("OPENING RAZORPAY WITH OPTIONS:", JSON.stringify(options, null, 2));

      RazorpayCheckout.open(options).then(async (data) => {
        // handle success
        setStatus("Verifying Payment...");
        try {
            await verifyRazorpayPayment({
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_signature: data.razorpay_signature
            });
            handleSuccess();
        } catch (verifyError) {
             console.log("Verification Error:", verifyError);
             setStatus("Payment Verification Failed");
             Alert.alert("Error", "Payment verification failed. Please contact support if money was deducted.");
             setTimeout(() => router.back(), 3000);
        }
      }).catch((error) => {
        // handle failure
        console.log("Razorpay Error:", error);
        let errorMsg = 'Payment Failed';
        if (error.code === 0 && error.description) {
            errorMsg = error.description;
        } else if (error.error && error.error.description) {
            errorMsg = error.error.description;
        }
        
        setStatus(`Payment Failed: ${errorMsg}`);
        Alert.alert("Payment Failed", errorMsg);
        setTimeout(() => router.back(), 3000);
      });

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

            {/* DEV ONLY: Simulate Success Button */}
            
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
