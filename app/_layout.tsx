import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// ⛔ Auto hide disable (ONLY ONCE)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // ⏳ future-ready:
        // - token check
        // - api warmup
        // - fonts load
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds splash
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // ✅ Splash hide
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!appIsReady) {
      return (
          <View style={styles.splashContainer}>
               <Image 
                   source={require('../assets/header_logo.png')} 
                   style={styles.logo}
               />
               <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 20 }} />
          </View>
      )
  }

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

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    }
});
