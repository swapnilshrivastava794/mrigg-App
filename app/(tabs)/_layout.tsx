import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#7445C4",
  primaryDark: "#6233B5",
  lilac: "#EDE3FF",
  softPurple: "#C8B3F8",
  white: "#FFFFFF",
  grey: "#B7B7C9",
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Fix: Ensure we always respect the safe area bottom
  // Android gesture bars often have a non-zero inset.
  const paddingBottom = Math.max(insets.bottom, 10);
  const tabBarHeight = 60 + paddingBottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        
        // Colors
        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.grey,

        // Premium Tab Bar Style
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: tabBarHeight,
          paddingBottom: paddingBottom,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      {/* Screens */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
            />
          ),
        }}
      />
      
      {/* Wishlist Screen (Commented out) 
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
                name={focused ? "cart" : "cart-outline"} 
                size={24} 
                color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
                name={focused ? "cube" : "cube-outline"} 
                size={24} 
                color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
