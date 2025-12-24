import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: "" }}>
      <Stack.Screen
        name="address"
        options={{ headerTitle: "Select Address", headerBackTitle: "Cart" }}
      />
      <Stack.Screen
        name="add-address"
        options={{ headerTitle: "Add New Address" }}
      />
      <Stack.Screen
        name="confirm"
        options={{ headerTitle: "Confirm Order" }}
      />
      <Stack.Screen
        name="payment"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="success"
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
