import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen name="view-order" options={{ headerShown: false }} />
      <Stack.Screen name="track-order" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
