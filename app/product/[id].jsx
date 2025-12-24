import Screen from "@/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getSingleProductById } from "../server";



/* ===================== COLORS ===================== */

const COLORS = {
  lavender: "#D9C4F0",
  lavenderDark: "#C5A8E8",
  lilac: "#EADCF7",
  white: "#FFFFFF",
  dark: "#1a1a1a",
  gray: "#666",
  lightGray: "#f5f5f5",
  green: "#27ae60",
  red: "#e74c3c",
  orange: "#f39c12",
  border: "#e8e8e8",
};

/* ===================== HELPERS ===================== */

const isValidColor = (color) =>
  color && color !== "#000000" && /^#[0-9A-F]{6}$/i.test(color);

const getVariantFinalPrice = (variant, product) => {
  if (!variant) return Number(product.final_price);

  if (Number(variant.offerprice) > 0) {
    return Number(variant.offerprice);
  }

  if (Number(variant.price_modifier) > 0) {
    return Number(variant.price_modifier);
  }

  return Number(product.final_price);
};

/* ===================== COMPONENT ===================== */

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const insets = useSafeAreaInsets();

  // ⭐ Same logic as TabLayout
  const bottomSpace =
    Platform.OS === "android"
      ? insets.bottom // mostly 0
      : insets.bottom;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getSingleProductById(id);

      setProduct(data);

      // auto-select first variant
      setSelectedVariant(null);
    } catch (err) {
      console.log("❌ PRODUCT DETAIL ERROR:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: "In Stock", color: COLORS.green };
    if (stock > 0) return { text: "Low Stock", color: COLORS.orange };
    return { text: "Out of Stock", color: COLORS.red };
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.lavender} />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </Screen>
    );
  }

  if (!product) return null;

  /* ===================== PRICE ===================== */

  const sellingPrice = selectedVariant
    ? getVariantFinalPrice(selectedVariant, product)
    : Number(product.final_price);

  const basePrice = Number(product.price);

  const discount =
    basePrice > sellingPrice
      ? Math.round(((basePrice - sellingPrice) / basePrice) * 100)
      : 0;

  /* ===================== TITLE ===================== */

  const getProductTitle = () => {
    if (!selectedVariant) return product.name;

    const variantName = selectedVariant.name
      ? ` – ${selectedVariant.name}`
      : "";

    const qtyUnit =
      selectedVariant.quantity && selectedVariant.unit
        ? ` (${selectedVariant.quantity} ${selectedVariant.unit})`
        : "";

    return `${product.name}${variantName}${qtyUnit}`;
  };



  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push({
        pathname: "/(auth)/sign-in",
        params: { returnUrl: `/product/${id}` }, // Manually constructing path as consistent fallback
      });
      return;
    }

    addToCart(product, selectedVariant);
    alert("Added to cart!"); // Simple feedback
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Screen scroll={false}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* IMAGE CAROUSEL */}
            <View style={styles.imageSection}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {product.images?.map((img) => (
                  <View key={img.id} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: img.image }}
                      style={styles.mainImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>

              {product.images?.length > 1 && (
                <View style={styles.paginationDots}>
                  {product.images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        currentImageIndex === index && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              )}

              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>
                    {discount}% OFF
                  </Text>
                </View>
              )}
            </View>

            {/* PRODUCT CARD */}
            <View style={styles.productCard}>
              <View style={{ marginBottom: 8 }}>
              <Text style={styles.name}>{getProductTitle()}</Text>

              <View style={styles.priceRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>₹{sellingPrice}</Text>
                  {basePrice !== sellingPrice && (
                    <Text style={styles.mrp}>₹{basePrice}</Text>
                  )}
                </View>
              </View>
            </View>

              {/* PRICE */}
              {/* <View style={styles.priceRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>₹{sellingPrice}</Text>
                  {basePrice !== sellingPrice && (
                    <Text style={styles.mrp}>₹{basePrice}</Text>
                  )}
                </View>
              </View> */}

              {/* PRODUCT INFO */}
              <View style={styles.section}>
                {/* <Text style={styles.sectionTitle}>
                  <Ionicons name="information-circle-outline" size={18} /> Product
                  Info
                </Text> */}

                {/* {product.is_sku_code && (
                  <Text style={{ color: COLORS.gray }}>
                    SKU: {product.is_sku_code}
                  </Text>
                )} */}

                {product.quantity && product.unit && (
                  <Text style={{ color: COLORS.gray }}>
                    Quantity: {product.quantity} {product.unit}
                  </Text>
                )}

                {isValidColor(product.color_code) && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: COLORS.gray, marginRight: 6 }}>
                      Color:
                    </Text>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: product.color_code,
                        borderWidth: 1,
                        borderColor: "#ccc",
                      }}
                    />
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  {product.popular && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>POPULAR</Text>
                    </View>
                  )}
                  {product.latest && (
                    <View style={[styles.tagBadge, { backgroundColor: "#FFF3CD" }]}>
                      <Text style={[styles.tagText, { color: "#F39C12" }]}>LATEST</Text>
                    </View>
                  )}
                  {product.featured && (
                    <View style={[styles.tagBadge, { backgroundColor: "#EDE7FF" }]}>
                      <Text style={[styles.tagText, { color: COLORS.lavender }]}>
                        FEATURED
                      </Text>
                    </View>
                  )}
                </View>

              </View>

              {/* VARIANTS */}
              {product.variations?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <Ionicons name="options-outline" size={18} /> Select Variant
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.variantContainer}
                  >
                    {product.variations.map((variant) => {
                      const isActive = selectedVariant?.id === variant.id;
                      const stockStatus = getStockStatus(variant.stock);

                      return (
                        <TouchableOpacity
                          key={variant.id}
                          style={[
                            styles.variantCard,
                            isActive && styles.variantActive,
                          ]}
                          // ✅ ONLY CHANGE IS HERE
                          onPress={() =>
                            setSelectedVariant((prev) =>
                              prev?.id === variant.id ? null : variant
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.variantName,
                              isActive && styles.variantNameActive,
                            ]}
                          >
                            {variant.name}
                          </Text>

                          {isValidColor(variant.color_code) && (
                            <View
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: 7,
                                backgroundColor: variant.color_code,
                                marginVertical: 6,
                              }}
                            />
                          )}

                          <Text
                            style={[
                              styles.variantPrice,
                              isActive && styles.variantPriceActive,
                            ]}
                          >
                            ₹{getVariantFinalPrice(variant, product)}
                          </Text>

                          <Text
                            style={{
                              color: isActive
                                ? COLORS.white
                                : stockStatus.color,
                              fontSize: 12,
                            }}
                          >
                            {stockStatus.text}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* DESCRIPTION */}
              {product.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <Ionicons name="document-text-outline" size={18} /> Description
                  </Text>

                <View
                  style={{
                    maxHeight: showFullDesc ? undefined : 120, // 👈 approx 5 lines height
                    overflow: "hidden",
                  }}
                >
                  <RenderHTML
                    contentWidth={width - 40}
                    source={{ html: product.description || "" }}
                    tagsStyles={{
                      p: {
                        fontSize: 14,
                        lineHeight: 22,
                        color: COLORS.gray,
                        marginBottom: 8,
                      },
                      strong: {
                        fontWeight: "700",
                        color: COLORS.dark,
                      },
                      li: {
                        fontSize: 14,
                        lineHeight: 22,
                        color: COLORS.gray,
                        marginBottom: 6,
                      },
                      h2: {
                        fontSize: 18,
                        fontWeight: "800",
                        marginBottom: 8,
                        color: COLORS.dark,
                      },
                      h3: {
                        fontSize: 16,
                        fontWeight: "700",
                        marginBottom: 6,
                        color: COLORS.dark,
                      },
                    }}
                  />
                </View>


                  <TouchableOpacity
                    onPress={() => setShowFullDesc(!showFullDesc)}
                    style={{ marginTop: 8 }}
                  >
                    <Text style={styles.readMoreText}>
                      {showFullDesc ? "Read Less ▲" : "Read More ▼"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}


              

              <View style={{ height: 120 }} />
            </View>
          </ScrollView>

          {/* BOTTOM BAR */}
          <View style={[
            styles.bottomBarContainer,
            { paddingBottom: bottomSpace },
          ]}>
            <View style={[
              styles.bottomBar,
              { marginBottom: bottomSpace > 0 ? 0 : 16 },
            ]}>
              <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
                <Ionicons name="cart-outline" size={22} color={COLORS.lavender} />
                <Text style={styles.cartBtnText}>Add to Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buyBtn}>
                <Ionicons name="flash" size={20} color={COLORS.white} />
                <Text style={styles.buyBtnText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Screen>
    </>
  );
}



/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.gray,
  },

  container: {
    backgroundColor: COLORS.lightGray,
  },

  imageSection: {
    position: "relative",
    backgroundColor: COLORS.white,
  },

  imageWrapper: {
    width: Dimensions.get("window").width,
    height: 320,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },

  activeDot: {
    width: 24,
    backgroundColor: COLORS.lavender,
  },

discountBadge: {
  position: "absolute",
  top: 18,
  right: 18,
  backgroundColor: COLORS.green,
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 18,
  elevation: 6,
},
discountBadgeText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "900",
},

  productCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.dark,
    lineHeight: 30,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  priceBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },

  price: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.lavender,
  },

  mrp: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: COLORS.gray,
  },

  savingsTag: {
    backgroundColor: COLORS.green + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  savingsText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: "700",
  },

  section: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 12,
    color: COLORS.dark,
  },

  htmlContent: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 12,
  },

  variantContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 4,
  },

  variantCard: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    minWidth: 130,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  variantActive: {
    backgroundColor: COLORS.lavender,
    borderColor: COLORS.lavenderDark,
    shadowColor: COLORS.lavender,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  variantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  variantName: {
    fontWeight: "700",
    color: COLORS.dark,
    fontSize: 15,
  },

  variantNameActive: {
    color: COLORS.white,
  },

  variantPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.lavender,
    marginBottom: 8,
  },

  variantPriceActive: {
    color: COLORS.white,
  },

  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  stockText: {
    fontSize: 11,
    fontWeight: "700",
  },

  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },

  bottomBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 8,
    borderRadius: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },

  cartBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lavender,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  cartBtnText: {
    fontSize: 15,
    color: COLORS.lavender,
    fontWeight: "800",
  },

  buyBtn: {
    flex: 1,
    backgroundColor: COLORS.lavender,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    shadowColor: COLORS.lavender,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buyBtnText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "800",
  },
  descriptionText: {
  fontSize: 14,
  color: COLORS.gray,
  lineHeight: 22,
},

readMoreText: {
  fontSize: 14,
  fontWeight: "700",
  color: COLORS.lavender,
},

tagBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
  backgroundColor: "#E8F8F0",
},
tagText: {
  fontSize: 11,
  fontWeight: "800",
  color: COLORS.green,
},

});