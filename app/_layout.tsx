import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// ⛔ Auto hide disable (ONLY ONCE)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // ⏳ future-ready:
        // - token check
        // - api warmup
        // - fonts load
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // ✅ Splash hide
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
