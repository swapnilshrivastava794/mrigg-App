import Screen from "@/components/Screen";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { getProductsByType } from "../server";

const TITLES = {
  latest: "Latest Products",
  popular: "Popular Products",
  featured: "Featured Products",
};

export default function ProductListByType() {
  // 🔥 FIX 1: normalize param (string only)
  console.log("🔥 TYPE SCREEN LOADED");

  const params = useLocalSearchParams();
  const type = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  console.log("📌 PRODUCT LIST TYPE:", type);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type) {
          console.log("📌 PRODUCT LIST TYPE:", type);
      fetchProducts(type);
    }
  }, [type]);

  const fetchProducts = async (finalType) => {
    try {
      setLoading(true);
      console.log("🚀 Fetch products type:", finalType);

      const data = await getProductsByType(finalType);

      console.log("✅ API RESPONSE:", data);

      // 🔒 Safety: always array
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("❌ PRODUCT LIST ERROR:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /* 🔄 LOADER */
  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: TITLES[type] || "Products" }} />

      <Screen>
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const image =
              item?.images?.length > 0
                ? item.images[0].image
                : "https://via.placeholder.com/300";

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <Image source={{ uri: image }} style={styles.image} />

                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.price}>₹{item.final_price}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No products found
            </Text>
          }
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },
  name: {
    marginTop: 6,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontWeight: "700",
    color: "#8662D5",
  },
});
