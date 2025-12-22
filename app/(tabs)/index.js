import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { getBanners, getCategories, getHomeProducts } from "../server"; // or correct path
const screenWidth = Dimensions.get("window").width;

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const ITEM_WIDTH = screenWidth / 4; // 👉 exactly 4 items per screen

  const [cartCount, setCartCount] = useState(3);
  const [liked, setLiked] = useState({});
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);

  const [homeProducts, setHomeProducts] = useState({
    popular: [],
    latest: [],
    featured: [],
  });

  async function loadCategories() {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      // console.log("CATEGORY API ERROR:", err);
    }
  }

  async function loadHomeProducts() {
    try {
      const res = await getHomeProducts();
      // console.log("🏠 HOME PRODUCTS:", res);
      setHomeProducts(res);
    } catch (err) {
      console.log("HOME PRODUCT API ERROR:", err);
    }
  }

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ProductCard = ({ item, horizontal }) => {
    const image =
      item.images?.length > 0
        ? item.images[0].image
        : "https://via.placeholder.com/300";

    return (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.id}`)} // ✅ HERE IS THE PATH
        style={[styles.productCard, horizontal && styles.productCardHorizontal]}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: image }} style={styles.productImage} />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {Math.round(
                ((Number(item.price) - Number(item.final_price)) /
                  Number(item.price)) *
                  100
              )}
              % OFF
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={liked[item.id] ? "heart" : "heart-outline"}
              size={20}
              color={liked[item.id] ? "#ff4757" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{item.final_price}</Text>
            <Ionicons name="add-circle" size={24} color="#8662D5" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  async function loadBanners() {
    try {
      const res = await getBanners();
      const sorted = res.data.sort((a, b) => a.order - b.order);
      console.log("🏳️ BANNERS:", sorted);
      setBanners(sorted);
    } catch (err) {
      console.log("BANNER API ERROR:", err);
    }
  }

  useEffect(() => {
    loadCategories();
    loadBanners();
    loadHomeProducts(); // 🔥 ADD THIS
  }, []);

  return (
    <Screen>
      {/* Premium Banner */}
      {/* Premium Banner Slider */}
      <View style={{ marginTop: 16, marginBottom: 8 }}>
        <Carousel
          width={screenWidth - 32}
          height={220}
          data={banners}
          autoPlay
          loop
          autoPlayInterval={3000}
          scrollAnimationDuration={1200}
          renderItem={({ item }) => (
            <View style={styles.bannerOuter}>
              <View style={styles.bannerWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.bannerBgImage}
                />

                <LinearGradient
                  colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.15)"]}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.carouselContent}>
                  <Text style={styles.carouselBadge}>{item.deal_label}</Text>

                  <Text style={styles.carouselText} numberOfLines={2}>
                    {item.ad_title}
                  </Text>

                  <Text style={styles.carouselDiscount}>
                    {item.ad_description}
                  </Text>

                  <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => {
                      if (item.redirect?.type === "product") {
                        router.push(`/product/${item.redirect.id}`);
                      }
                    }}
                  >
                    <Text style={styles.shopButtonText}>{item.cta_text}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Quick Categories */}
      {/* Quick Categories from API */}
      <View style={{ marginTop: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 6, // 👈 niche thodi space
          }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.quickCategory, { width: ITEM_WIDTH }]}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/product",
                  params: {
                    categoryId: cat.id.toString(),
                    category: cat.name,
                  },
                })
              }
            >
              <View style={styles.quickCatIcon}>
                <Image
                  source={{ uri: cat.image }}
                  style={styles.quickCatImage}
                />
              </View>

              <Text style={styles.quickCatText} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 👇 CATEGORY & LATEST PRODUCT SEPARATOR */}
      <View
        style={{
          height: 12, // spacing
        }}
      />

      <View
        style={{
          height: 1,
          backgroundColor: "#eee", // soft divider
          marginHorizontal: 16,
          marginBottom: 12,
        }}
      />

      {/* Latest Products */}
      <View style={[styles.section, styles.latestSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Products</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/product",
                params: { type: "latest" },
              })
            }
          >
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.latestProducts,
            { paddingLeft: 16, paddingBottom: 6 },
          ]}
        >
          {homeProducts.latest.map((item) => (
            <ProductCard key={item.id} item={item} horizontal />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, styles.latestSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular This Week</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/product",
                params: {
                  type: "popular",
                },
              })
            }
          >
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.latestProducts,
            { paddingLeft: 16, paddingBottom: 6 },
          ]}
        >
          {homeProducts.popular.slice(0, 2).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, styles.latestSection]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/product",
                params: {
                  type: "featured",
                },
              })
            }
          >
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.latestProducts,
            { paddingLeft: 16, paddingBottom: 6 },
          ]}
        >
          {homeProducts.featured.slice(0, 2).map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>

      {/* Featured Banner */}
      <View style={styles.featuredBanner}>
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.softPurple]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredText}>New Arrivals</Text>
          <Text style={styles.featuredSubText}>
            Check out our latest collection
          </Text>

          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Explore</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4EDFF", // lilac
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#B7B7C9",
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B7B7C9",
    borderRadius: 12,
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333333",
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  notificationIcon: {
    position: "relative",
  },

  cartIcon: {
    position: "relative",
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#A88BE4", // primary
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#A88BE4", // primary
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeNumber: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  carousel: {
    height: 220,
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#A88BE4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  carouselContent: {
    flex: 1,
    zIndex: 2,
  },

  carouselSubText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    letterSpacing: 1,
  },

  carouselText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginVertical: 8,
  },

  carouselDiscount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },

  shopButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 8,
  },

  shopButtonText: {
    color: "#8662D5", // primaryDark
    fontWeight: "700",
    fontSize: 14,
  },

  carouselImage: {
    width: 130,
    height: 180,
    resizeMode: "cover",
    position: "absolute",
    right: 10,
    bottom: 10,
    borderRadius: 12,
  },

  quickCategoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 24,
    justifyContent: "space-between",
  },

  quickCategory: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10, // ⬇️ reduce
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center", // 👈 IMPORTANT
    marginRight: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },

  quickCatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2EDFF", // soft lavender bg
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  quickCatImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },

  quickCatText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    lineHeight: 16,
  },

  section: {
    marginVertical: 12,
  },

  latestSection: {
    marginTop: 18,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },

  viewAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6A4DF4",
  },

  latestProducts: {
    paddingRight: 16,
    gap: 12,
  },

  popularProducts: {
    paddingHorizontal: 16,
    gap: 12,
  },

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    width: 160,
    elevation: 4,
    shadowColor: "#B7B7C9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  productCardHorizontal: {
    width: 160,
  },

  productImageContainer: {
    position: "relative",
    height: 160,
    backgroundColor: "#FFFFFF",
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#8662D5", // primaryDark
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8662D5", // deep lavender
    marginBottom: 6,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },

  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
  },

  reviews: {
    fontSize: 11,
    color: "#B7B7C9",
  },

  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#A88BE4", // primary
  },

  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  featuredBanner: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    elevation: 6,
  },

  featuredContent: {
    zIndex: 2,
  },

  featuredText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  featuredSubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
  },

  featuredButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  featuredButtonText: {
    color: "#8662D5", // primaryDark
    fontWeight: "700",
    fontSize: 14,
  },

  bannerWrapper: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  bannerBgImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  carouselContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  carouselBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFB703",
    color: "#000",
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },

  carouselText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 28,
    marginBottom: 6,
  },

  carouselDiscount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFD166",
    marginBottom: 14,
  },

  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#6A4DF4",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },

  shopButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  bannerOuter: {
    flex: 1,
    paddingHorizontal: 8, // 👈 banner ke beech gap
  },
});
