import { ScrollView, View } from "react-native";
import Header from "./Header";

export default function Screen({ children, scroll = true }) {
  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: "#f8f9fa" }}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <Header />
      {children}
    </View>
  );
}
