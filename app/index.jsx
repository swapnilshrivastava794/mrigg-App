import { Redirect } from "expo-router";

export default function Index() {
  // Always open Tabs first
  return <Redirect href="(tabs)" />;
}
