import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from 'react-native-webview';
import { useCart } from "../contexts/CartContext";
import { checkout, initiateGokwik } from "../server";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { cartItems, clearCart } = useCart();
  
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
        }))
      };
      
      const orderRes = await checkout(checkoutData);
      
      // 2. Initiate Gokwik Payment
      setStatus("Initiating Payment...");
      const gokwikRes = await initiateGokwik({ order_id: orderRes.order_id });
      
      // 3. Construct Auto-Submit Form HTML
      let { url, payload, signature } = gokwikRes;
      
      // Removed manual patching as Backend now sends correct URL
      
      if (!url || !payload || !signature) {
          throw new Error("Invalid response from Payment Server");
      }

      const formInputs = Object.keys(payload).map(key => 
          `<input type="hidden" name="${key}" value="${payload[key]}" />`
      ).join('\n');

      const htmlContent = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
                .loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
        </head>
        <body onload="document.forms[0].submit()">
            <form action="${url}" method="POST">
                ${formInputs}
                <input type="hidden" name="signature" value="${signature}" />
            </form>
            <div style="text-align:center">
                <div class="loader"></div>
                <p>Redirecting to Payment...</p>
            </div>
        </body>
        </html>
      `;
      
      setPaymentData({ html: htmlContent, orderId: orderRes.order_id });

    } catch (error) {
      console.log("Payment Error Full:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Unknown error";
      if (typeof error === 'string') {
          if (error.trim().startsWith('<')) {
              if (error.includes('CSRF')) {
                  errorMessage = "Backend Error: CSRF Verification Failed. Check Server Logs.";
              } else {
                  errorMessage = "Server Error (Invalid Response)";
              }
          } else {
              errorMessage = error;
          }
      } else if (error?.error) {
          // Backend returned {'error': '...'}
          errorMessage = error.error;
      } else if (error?.message) {
          // JS Error or Axios error
          errorMessage = error.message;
      } else if (error?.detail) {
           // Django DRF default error
           errorMessage = error.detail;
      } else {
          errorMessage = JSON.stringify(error);
      }

      setStatus(`${errorMessage}`);
      // Don't auto-back immediately so user can read error
      // setTimeout(() => router.back(), 5000);
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

  if (paymentData) {
      return (
          <View style={{ flex: 1, paddingTop: 30 }}>
            <WebView
                source={{ 
                    html: paymentData.html,
                    baseUrl: "https://sandbox.gokwik.co" // Required for valid Origin/Referer headers
                }}
                originWhitelist={['*']}
                style={{ flex: 1 }}
                // Use a standard mobile user agent to prevent blocking
                userAgent="Mozilla/5.0 (Linux; Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0" 
                onMessage={handleWebViewMessage}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                    setPaymentData(null);
                    setStatus(`Payment Gateway Error: ${nativeEvent.description || "Could not load page"}`);
                }}
                onHttpError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView HTTP error: ', nativeEvent);
                    if (nativeEvent.statusCode === 403) {
                         // 403 handling
                         setStatus("Payment Gateway Access Denied (403). Possible missing credentials or WAF block.");
                    }
                }}
                injectedJavaScript={`
                    // Detect if we are on the callback page
                    if (window.location.href.includes('gokwik/callback') || document.body.innerText.includes('status')) {
                        window.ReactNativeWebView.postMessage(document.body.innerText);
                    }
                `}
            />
          </View>
      );
  }

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
