import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { getBanners, getCategories, getHomeProducts } from "../server";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
  const ITEM_WIDTH = screenWidth / 4; 

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

    const discount = Math.round(
        ((Number(item.price) - Number(item.final_price)) / Number(item.price)) * 100
    );

    return (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.id}`)}
        style={[styles.productCard, horizontal && styles.productCardHorizontal]}
        activeOpacity={0.9}
      >
        <View style={styles.productImageContainer}>
          <Image source={{ uri: image }} style={styles.productImage} />

          {/* Discount Badge */}
          {discount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{discount}% OFF</Text>
              </View>
          )}

          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={liked[item.id] ? "heart" : "heart-outline"}
              size={18}
              color={liked[item.id] ? "#FF4757" : "#888"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productBrand} numberOfLines={1}>
              {item.subcategory?.name || "Brand"}
          </Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceRow}>
            <View>
                <Text style={styles.productPrice}>₹{item.final_price}</Text>
                {discount > 0 && <Text style={styles.oldPrice}>₹{item.price}</Text>}
            </View>
            <TouchableOpacity style={styles.addBtn}>
                 <Ionicons name="add" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  async function loadBanners() {
    try {
      const res = await getBanners();
      const sorted = res.data.sort((a, b) => a.order - b.order);
      setBanners(sorted);
    } catch (err) {
      console.log("BANNER API ERROR:", err);
    }
  }

  useEffect(() => {
    loadCategories();
    loadBanners();
    loadHomeProducts();
  }, []);

  return (
    <Screen>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.container}
      >
      
      {/* Premium Banner Slider */}
      <View style={styles.bannerContainer}>
        <Carousel
          width={screenWidth}
          height={240}
          data={banners}
          autoPlay
          loop
          autoPlayInterval={3000}
          scrollAnimationDuration={1000}
          renderItem={({ item }) => (
            <View style={styles.bannerWrapper}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.bannerGradient}
                />
                
                <View style={styles.bannerContent}>
                   <View style={styles.bannerTag}>
                       <Text style={styles.bannerTagText}>{item.deal_label}</Text>
                   </View>
                   <Text style={styles.bannerTitle} numberOfLines={2}>{item.ad_title}</Text>
                   <Text style={styles.bannerSubtitle} numberOfLines={1}>{item.ad_description}</Text>
                   
                   <TouchableOpacity 
                        style={styles.bannerBtn}
                        onPress={() => {
                            if (item.redirect?.type === "product") {
                                router.push(`/product/${item.redirect.id}`);
                            }
                        }}
                    >
                       <Text style={styles.bannerBtnText}>{item.cta_text}</Text>
                       <Ionicons name="arrow-forward" size={14} color={COLORS.textDark} />
                   </TouchableOpacity>
                </View>
            </View>
          )}
        />
      </View>

      {/* Quick Categories */}
      <View style={styles.categoriesSection}>
        {/* <Text style={styles.sectionHeaderTitle}>Shop by Category</Text> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryItem, { width: ITEM_WIDTH - 8 }]}
              activeOpacity={0.8}
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
              <View style={styles.categoryIconBox}>
                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              </View>
              <Text style={styles.categoryText} numberOfLines={2}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Latest Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Drops</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: "/product", params: { type: "latest" } })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {homeProducts.latest.map((item) => (
            <ProductCard key={item.id} item={item} horizontal />
          ))}
        </ScrollView>
      </View>


      {/* Popular Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Right Now</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: "/product", params: { type: "popular" } })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {homeProducts.popular.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} horizontal />
          ))}
        </ScrollView>
      </View>


      {/* Featured Banner */}
      <TouchableOpacity style={styles.featuredBanner} activeOpacity={0.9}>
        <Image 
            source={{ uri: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" }} 
            style={styles.fbImage}
        />
        <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFill}
        />
        <View style={styles.fbContent}>
            <Text style={styles.fbTitle}>Season's Best</Text>
            <Text style={styles.fbSubtitle}>Curated collection just for you</Text>
             <View style={styles.fbBtn}>
                <Text style={styles.fbBtnText}>Explore Collection</Text>
             </View>
        </View>
      </TouchableOpacity>


      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: "/product", params: { type: "featured" } })}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {homeProducts.featured.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} horizontal />
          ))}
        </ScrollView>
      </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F1F3F6', // Matching Grey Background
  },
  
  /** Banner */
  bannerContainer: {
      marginTop: 0,
  },
  bannerWrapper: {
      width: screenWidth,
      height: 240,
      position: 'relative',
  },
  bannerImage: {
      width: '100%',
      height: '100%',
  },
  bannerGradient: {
      flex: 1,
      position: 'absolute',
      width: '100%',
      height: '100%',
  },
  bannerContent: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
  },
  bannerTag: {
      backgroundColor: '#D4AF37', // Gold
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 8,
  },
  bannerTagText: {
      color: COLORS.textDark,
      fontWeight: '700',
      fontSize: 10,
      textTransform: 'uppercase',
  },
  bannerTitle: {
      color: COLORS.white,
      fontSize: 28,
      fontWeight: '800',
      lineHeight: 32,
      marginBottom: 4,
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 4,
  },
  bannerSubtitle: {
      color: '#EEE',
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 16,
  },
  bannerBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      gap: 6,
  },
  bannerBtnText: {
      color: COLORS.textDark,
      fontWeight: '700',
      fontSize: 12,
  },

  /** Categories */
  categoriesSection: {
      marginTop: 20,
      marginBottom: 10,
  },
  categoryItem: {
      alignItems: 'center',
      marginRight: 8,
  },
  categoryIconBox: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: COLORS.white,
      padding: 6,
      marginBottom: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
  },
  categoryImage: {
      width: '100%',
      height: '100%',
      borderRadius: 32,
      resizeMode: 'cover',
  },
  categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.textDark,
      textAlign: 'center',
      lineHeight: 16,
  },

  /** Sections */
  section: {
      marginTop: 24,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: COLORS.textDark,
      letterSpacing: 0.3,
  },
  viewAllText: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.primaryDark,
  },
  horizontalList: {
      paddingHorizontal: 16,
      paddingBottom: 10,
  },

  /** Product Card */
  productCard: {
      backgroundColor: COLORS.white,
      width: 160,
      borderRadius: 12,
      marginRight: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 2},
  },
  productImageContainer: {
      height: 160,
      position: 'relative',
      backgroundColor: '#f9f9f9',
  },
  productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
  badge: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: '#FF4757',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
  },
  badgeText: {
      color: COLORS.white,
      fontSize: 10,
      fontWeight: '800',
  },
  heartButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
  },
  productInfo: {
      padding: 10,
  },
  productBrand: {
      fontSize: 10,
      color: COLORS.grey,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 2,
  },
  productName: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.textDark,
      lineHeight: 18,
      height: 36, // Fixed height for 2 lines
  },
  priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 8,
  },
  productPrice: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textDark,
  },
  oldPrice: {
      fontSize: 11,
      color: COLORS.grey,
      textDecorationLine: 'line-through',
  },
  addBtn: {
      backgroundColor: COLORS.primaryDark,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
  },

  /** Featured Banner (Mid Page) */
  featuredBanner: {
      marginHorizontal: 16,
      height: 160,
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 24,
      position: 'relative',
  },
  fbImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
  },
  fbContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
  },
  fbTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: COLORS.white,
      marginBottom: 4,
      textAlign: 'center',
  },
  fbSubtitle: {
      fontSize: 14,
      color: '#EEE',
      marginBottom: 16,
      textAlign: 'center',
  },
  fbBtn: {
      backgroundColor: COLORS.white,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
  },
  fbBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textDark,
  },

});
