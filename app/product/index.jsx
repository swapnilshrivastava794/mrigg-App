import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
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

const TITLES = {
  latest: "Latest Drops",
  popular: "Trending Now",
  featured: "Editor's Pick",
};

export default function ProductList() {
  const { category, categoryId, type, q  } = useLocalSearchParams();

  const pageTitle = q
  ? `Results for "${q}"`
  : TITLES[type] || category || "Collection";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Increased limit for better scroll exp
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
        activeOpacity={0.9}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.imageContainer}>
             <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
             {discount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{discount}% OFF</Text>
                </View>
             )}
        </View>

        <View style={styles.infoContainer}>
            <Text style={styles.brandName} numberOfLines={1}>
                 {item.subcategory?.name || "Brand"}
            </Text>
            <Text style={styles.name} numberOfLines={2}>
            {item.name}
            </Text>

            <View style={styles.priceRow}>
                 <View>
                    <Text style={styles.price}>₹{item.final_price}</Text>
                    {discount > 0 && <Text style={styles.mrp}>₹{item.price}</Text>}
                 </View>
                {/* Add Button Visual Only */}
                <View style={styles.addBtn}>
                    <Ionicons name="add" size={16} color={COLORS.white} />
                </View>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: pageTitle, headerShown: false }} />

      <Screen scroll={false}>
        {/* HEADER */}
        <View style={styles.header}>
             <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
             </TouchableOpacity>
             <View>
                 <Text style={styles.headerTitle}>{pageTitle}</Text>
                 <Text style={styles.headerSubtitle}>{loading ? "Loading..." : `${products.length} items`}</Text>
             </View>
        </View>

        {/* CONTAINER */}
        <View style={styles.container}>
            
            {/* FILTER BAR */}
            <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="filter-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="swap-vertical-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.filterText}>Sort By</Text>
                </TouchableOpacity>
            </View>

            {/* LIST */}
            {loading ? (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLORS.primaryDark} />
            </View>
            ) : products.length === 0 ? (
            <View style={styles.noData}>
                <Ionicons name="search-outline" size={48} color="#ddd" />
                <Text style={styles.noDataText}>No products found</Text>
                <Text style={styles.noDataSubText}>Try searching for something else</Text>
            </View>
            ) : (
            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 100,
                }}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                onEndReached={() => {
                if (hasMore && !loadingMore) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadProducts(nextPage);
                }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                loadingMore ? (
                    <ActivityIndicator
                    style={{ marginVertical: 20 }}
                    size="small"
                    color={COLORS.primaryDark}
                    />
                ) : null
                }
            />
            )}
        </View>
      </Screen>
    </>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
      gap: 12,
  },
  backBtn: {
      padding: 4,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  headerSubtitle: {
      fontSize: 12,
      color: COLORS.grey,
  },

  container: {
      flex: 1,
      backgroundColor: '#F1F3F6',
  },

  /* Filters */
  filterBar: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
  },
  filterBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
  },
  filterText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  verticalDivider: {
      width: 1,
      backgroundColor: '#E0E0E0',
      height: '100%',
  },

  /* Product Card */
  card: {
      backgroundColor: COLORS.white,
      width: "48%",
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
  },
  imageContainer: {
      height: 160,
      backgroundColor: '#f9f9f9',
      position: 'relative',
  },
  image: {
      width: "100%",
      height: "100%",
  },
  badge: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      backgroundColor: COLORS.white,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FF4757',
  },

  infoContainer: {
      padding: 10,
  },
  brandName: {
      fontSize: 10,
      color: COLORS.grey,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 2,
  },
  name: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.textDark,
      lineHeight: 18,
      height: 36, // 2 lines
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 8,
  },
  price: {
      fontSize: 15,
      fontWeight: "800",
      color: COLORS.textDark,
  },
  mrp: {
      fontSize: 11,
      textDecorationLine: "line-through",
      color: COLORS.grey,
  },
  addBtn: {
      backgroundColor: COLORS.primaryDark,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },

  /* States */
  loader: { 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center" 
  },
  noData: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  noDataText: {
    fontSize: 18,
    color: COLORS.textDark,
    fontWeight: "700",
    marginTop: 12,
  },
  noDataSubText: {
      fontSize: 14,
      color: COLORS.grey,
      marginTop: 4,
  },
});
