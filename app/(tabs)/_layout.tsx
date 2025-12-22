import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
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

  // ⭐ Android ke liye NO extra padding
  const bottomSpace =
    Platform.OS === "android"
      ? insets.bottom // mostly 0
      : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.grey,

        tabBarStyle: {
          backgroundColor: COLORS.lilac,
          borderTopWidth: 1,
          borderTopColor: COLORS.softPurple,

          // ⭐ Perfect safe area with ZERO extra padding
          height: 60 + bottomSpace,
          paddingBottom: bottomSpace,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Screens */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
