import ProductListSkeleton from "@/components/ProductListSkeleton";
import ProductQuantityButton from "@/components/ProductQuantityButton";
import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Reanimated from "react-native-reanimated"; // Aliased for shared transition
import { useCart } from "../contexts/CartContext";
import { getOfferById, getProductById, getProductsByType, searchProducts } from "../server";

const TITLES = {
  latest: "Latest Drops",
  popular: "Trending Now",
  featured: "Editor's Pick",
};

export default function ProductList() {
  const { addToCart } = useCart();
  const { category, categoryId, type, q, offerId, customTitle } = useLocalSearchParams();

  const pageTitle = q
  ? `Results for "${q}"`
  : customTitle || TITLES[type] || category || "Collection";

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
  }, [type, categoryId, q, offerId]);

  const loadProducts = async (pageNo) => {
    try {
      pageNo === 1 ? setLoading(true) : setLoadingMore(true);

      let res = null;

      // ✅ CASE 1: TYPE BASED (latest / popular / featured)
      // 🔍 CASE 0: SEARCH MODE (NEW)
        if (q) {
          res = await searchProducts(q, pageNo, limit);
        }

        // ✅ CASE 2: OFFER BASED (High Priority)
        else if (offerId) {
             res = await getOfferById(offerId);
             // Offer API returns { products: [...] }
             if (res && res.products) {
                 res = res.products; 
             }
        }

        // ✅ CASE 3: TYPE BASED
        else if (type) {
          res = await getProductsByType(type, pageNo, limit);
        }

        // ✅ CASE 4: CATEGORY BASED
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
      item.image ||                    
      item.images?.[0]?.image ||        
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
             <Reanimated.Image 
                source={{ uri: image }} 
                style={styles.image} 
                resizeMode="cover"
                sharedTransitionTag={`product-${item.id}`} // Hero Animation Link
             />
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
                <View style={{ width: 80, alignItems: 'flex-end' }}>
                    <ProductQuantityButton item={item} />
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
            {/* <View style={styles.filterBar}>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="filter-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="swap-vertical-outline" size={16} color={COLORS.textDark} />
                    <Text style={styles.filterText}>Sort By</Text>
                </TouchableOpacity>
            </View> */}

            {/* LIST */}
            {loading && products.length === 0 ? (
                <ProductListSkeleton />
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
      // Premium Flat Style
      borderWidth: 1,
      borderColor: '#F0F0F0',
  },
  imageContainer: {
      height: 180, // Taller images for PLP
      backgroundColor: '#f9f9f9',
      position: 'relative',
      overflow: 'hidden',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
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
      paddingVertical: 3,
      borderRadius: 4,
      elevation: 1,
  },
  badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FF4757',
  },

  infoContainer: {
      padding: 12,
  },
  brandName: {
      fontSize: 10,
      color: '#999',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
  },
  name: {
      fontSize: 13,
      fontWeight: '500',
      color: COLORS.textDark,
      lineHeight: 18,
      height: 36, // 2 lines
      marginBottom: 6,
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 2,
  },
  price: {
      fontSize: 16, // Pro size
      fontWeight: "700",
      color: COLORS.textDark,
      letterSpacing: -0.3,
  },
  mrp: {
      fontSize: 11,
      textDecorationLine: "line-through",
      color: COLORS.grey,
      marginLeft: 4,
  },
  addBtn: {
      backgroundColor: COLORS.primaryDark,
      width: 28,
      height: 28,
      borderRadius: 14,
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
