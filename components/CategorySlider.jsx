import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

import { COLORS } from "@/src/constants/colors";
import { getProductById } from "../app/server";
import ProductQuantityButton from "./ProductQuantityButton";

const CategorySlider = ({ category }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryProducts();
  }, [category.id]);

  const loadCategoryProducts = async () => {
    try {
      // API call to fetch products for this category
      // Using getProductById which acts as getProductsByCategoryId based on usage in product/index.jsx
      const res = await getProductById(category.id, 1, 10);
      
      const newProducts = Array.isArray(res) ? res : res.results || [];
      setProducts(newProducts);
    } catch (error) {
      console.log(`Error loading products for ${category.name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && products.length === 0) return null;

  // Render Product Card (Inline to avoid file dependency issues user mentioned)
  const renderItem = ({ item }) => {
    const image = item.images?.length > 0 ? item.images[0].image : item.image || "https://via.placeholder.com/300";
    const discount = Math.round(((Number(item.price) - Number(item.final_price)) / Number(item.price)) * 100);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.id}`)}
        style={styles.productCard}
        activeOpacity={0.9}
      >
        <View style={styles.productImageContainer}>
          <Animated.Image 
            source={{ uri: image }} 
            style={styles.productImage} 
            // sharedTransitionTag={`product-${item.id}`} // Avoid potential id collision
          />
          {discount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{discount}% OFF</Text>
              </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productBrand} numberOfLines={1}>{item.subcategory?.name || "Brand"}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceRow}>
            <View>
                <Text style={styles.productPrice}>₹{item.final_price}</Text>
                {discount > 0 && <Text style={styles.oldPrice}>₹{item.price}</Text>}
            </View>
            <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
                 <ProductQuantityButton item={item} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.title}>{category.name}</Text>
            <Text style={styles.subtitle}>Explore our {category.name} collection</Text>
        </View>
        <TouchableOpacity 
            style={styles.viewAllBtn}
            onPress={() => router.push({
                pathname: "/product",
                params: { 
                    categoryId: category.id.toString(),
                    category: category.name
                }
            })}
        >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="arrow-forward" size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        horizontal
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CategorySlider;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D3436",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  viewAllBtn: {
    backgroundColor: "#9B59B6", // Purple from user image/theme
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  // Copied Product Card Styles
  productCard: {
    width: 160,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: "hidden",
  },
  productImageContainer: {
    height: 180,
    width: "100%",
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  productInfo: {
    padding: 10,
  },
  productBrand: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
    minHeight: 36, // Ensure alignment
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  oldPrice: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
  },
});
