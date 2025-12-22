import Screen from "@/components/Screen";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProductById, getProductsByType, searchProducts } from "../server";

const COLORS = {
  lavender: "#D9C4F0",
  lilac: "#EADCF7",
  white: "#FFFFFF",
  dark: "#333",
  gray: "#777",
  green: "#27ae60",
};

const TITLES = {
  latest: "Latest Products",
  popular: "Popular Products",
  featured: "Featured Products",
};

export default function ProductList() {
  const { category, categoryId, type, q  } = useLocalSearchParams();

  const pageTitle = q
  ? `Search results for "${q}"`
  : TITLES[type] || category || "All Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /* 🔥 RESET + FIRST LOAD */
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(1);
  }, [type, categoryId, q]);

  const loadProducts = async (pageNo) => {
    try {
      pageNo === 1 ? setLoading(true) : setLoadingMore(true);

      let res = null;

      // ✅ CASE 1: TYPE BASED (latest / popular / featured)
      // 🔍 CASE 0: SEARCH MODE (NEW)
        if (q) {
          res = await searchProducts(q, pageNo, limit);
          console.log("SEARCH RES:", res);
        }

        // ✅ CASE 1: TYPE BASED
        else if (type) {
          res = await getProductsByType(type, pageNo, limit);
        }

        // ✅ CASE 2: CATEGORY BASED
        else if (categoryId) {
          res = await getProductById(categoryId, pageNo, limit);
        }

      if (res) {
        const newProducts = Array.isArray(res)
        ? res
        : res.results || [];

        setProducts((prev) =>
          pageNo === 1 ? newProducts : [...prev, ...newProducts]
        );

        setHasMore(res.total_pages ? pageNo < res.total_pages : false);
      }
    } catch (err) {
      console.log("❌ PRODUCT LIST ERROR:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const renderItem = ({ item }) => {
    const image =
      item.image ||                    // 🔍 search result
      item.images?.[0]?.image ||        // 📂 category / type
      "https://via.placeholder.com/300";

    const discount =
      item.price && item.final_price
        ? Math.round(
            ((parseFloat(item.price) - item.final_price) /
              parseFloat(item.price)) *
              100
          )
        : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image source={{ uri: image }} style={styles.image} />

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.final_price}</Text>
          <Text style={styles.mrp}>₹{item.price}</Text>
          {discount > 0 && (
            <Text style={styles.discount}>{discount}% off</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>
            {item.stock > 0 ? "In Stock" : "Out of Stock"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: pageTitle }} />

      <Screen scroll={false}>
        {/* HEADER */}
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>{pageTitle}</Text>
          <Text style={styles.bannerSubtitle}>
            {products.length} items available
          </Text>
        </View>

        {/* FILTER BAR */}
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterItem}>
            <Ionicons name="funnel-outline" size={18} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterItem}>
            <MaterialCommunityIcons name="swap-vertical" size={20} />
            <Text style={styles.filterText}>Sort</Text>
          </TouchableOpacity>
        </View>

        {/* LOADER */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.lavender} />
          </View>
        ) : products.length === 0 ? (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>No products found</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 10,
              paddingBottom: 60,
            }}
            renderItem={renderItem}
            onEndReached={() => {
              if (hasMore && !loadingMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                loadProducts(nextPage);
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  style={{ marginVertical: 20 }}
                  size="small"
                  color={COLORS.lavender}
                />
              ) : null
            }
          />
        )}
      </Screen>
    </>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.lilac,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 10,
  },
  bannerTitle: { fontSize: 18, fontWeight: "700" },
  bannerSubtitle: { fontSize: 14, color: COLORS.gray, marginTop: 2 },

  filterBar: {
    flexDirection: "row",
    marginTop: 12,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  filterItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    elevation: 3,
    alignItems: "center",
    gap: 6,
  },
  filterText: { fontSize: 14 },

  card: {
  backgroundColor: COLORS.white,
  width: "48%",
  borderRadius: 16,
  padding: 10,
  marginBottom: 16,
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
},
  image: {
  width: "100%",
  height: 140,
  borderRadius: 14,
  backgroundColor: "#f2f2f2",
},
  name: {
  fontSize: 14,
  fontWeight: "700",
  marginTop: 8,
  color: COLORS.dark,
  lineHeight: 18,
},

  priceRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
},
price: {
  fontSize: 16,
  fontWeight: "900",
  color: COLORS.lavender,
},
mrp: {
  fontSize: 12,
  textDecorationLine: "line-through",
  color: COLORS.gray,
},
discount: {
  fontSize: 12,
  color: COLORS.green,
  fontWeight: "700",
},

  ratingRow: {
  marginTop: 8,
  backgroundColor: COLORS.lilac,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  alignSelf: "flex-start",
},
rating: {
  fontSize: 11,
  fontWeight: "800",
  color: COLORS.dark,
},


  loader: { marginTop: 50, alignItems: "center" },

  noData: {
    marginTop: 80,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: "600",
  },
});
