import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { getSingleProductById } from "../server";

const { width } = Dimensions.get("window");

// Local Status Colors
const STATUS_COLORS = {
  green: "#27ae60",
  red: "#e74c3c",
  orange: "#f39c12",
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

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const bottomSpace = insets.bottom;

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
    if (stock > 10) return { text: "In Stock", color: STATUS_COLORS.green };
    if (stock > 0) return { text: "Low Stock", color: STATUS_COLORS.orange };
    return { text: "Out of Stock", color: STATUS_COLORS.red };
  };

  /* ===================== LOGIC ===================== */

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) return null;

  const sellingPrice = selectedVariant
    ? getVariantFinalPrice(selectedVariant, product)
    : Number(product.final_price);

  const basePrice = Number(product.price);

  const discount =
    basePrice > sellingPrice
      ? Math.round(((basePrice - sellingPrice) / basePrice) * 100)
      : 0;

  const getProductTitle = () => {
    if (!selectedVariant) return product.name;
    const variantName = selectedVariant.name ? ` – ${selectedVariant.name}` : "";
    const qtyUnit =
      selectedVariant.quantity && selectedVariant.unit
        ? ` (${selectedVariant.quantity} ${selectedVariant.unit})`
        : "";
    return `${product.name}${variantName}${qtyUnit}`;
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push({
        pathname: "/(auth)/sign-in",
        params: { returnUrl: `/product/${id}` },
      });
      return;
    }
    addToCart(product, selectedVariant);
    alert("Added to cart!");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        
        {/* HEADER (Floating or Fixed) */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
             <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                 <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
             </TouchableOpacity>
             <View style={styles.headerActions}>
                 <TouchableOpacity style={styles.actionBtn}>
                     <Ionicons name="heart-outline" size={24} color={COLORS.textDark} />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.actionBtn} onPress={()=> router.push('/(tabs)/cart')}>
                     <Ionicons name="cart-outline" size={24} color={COLORS.textDark} />
                 </TouchableOpacity>
             </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* IMAGE CAROUSEL */}
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {product.images?.map((img) => (
                <View key={img.id} style={styles.imageSlide}>
                  <Image source={{ uri: img.image }} style={styles.image} resizeMode="cover" />
                </View>
              ))}
            </ScrollView>

            <View style={styles.dotsContainer}>
              {product.images?.map((_, i) => (
                <View key={i} style={[styles.dot, i === currentImageIndex && styles.activeDot]} />
              ))}
            </View>
          </View>

          {/* MAIN INFO DETAILS */}
          <View style={styles.detailsContainer}>
              
              {/* Brand & Rating */}
              <View style={styles.brandRow}>
                  <Text style={styles.brandText}>{product.subcategory?.name || "PREMIUM BRAND"}</Text>
                  <View style={styles.ratingBox}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.ratingText}>4.5</Text>
                  </View>
              </View>

              {/* Title */}
              <Text style={styles.productTitle}>{getProductTitle()}</Text>

              {/* Price */}
              <View style={styles.priceRow}>
                  <Text style={styles.sellingPrice}>₹{sellingPrice}</Text>
                  {basePrice > sellingPrice && <Text style={styles.mrp}>₹{basePrice}</Text>}
                  {discount > 0 && (
                      <View style={styles.discountTag}>
                          <Text style={styles.discountText}>{discount}% OFF</Text>
                      </View>
                  )}
              </View>

              <View style={styles.divider} />

              {/* VARIANTS */}
              {product.variations?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Select Option</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {product.variations.map((variant) => {
                      const isActive = selectedVariant?.id === variant.id;
                      return (
                        <TouchableOpacity
                          key={variant.id}
                          style={[styles.variantChip, isActive && styles.variantChipActive]}
                          onPress={() => setSelectedVariant(isActive ? null : variant)}
                        >
                          <Text style={[styles.variantText, isActive && styles.variantTextActive]}>
                              {variant.name}
                          </Text>
                          {isValidColor(variant.color_code) && (
                              <View style={[styles.colorDot, { backgroundColor: variant.color_code }]} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}


              {/* INFO BADGES */}
              <View style={styles.infoRow}>
                   {product.quantity && product.unit && (
                      <View style={styles.infoBadge}>
                          <Ionicons name="cube-outline" size={14} color={COLORS.grey} />
                          <Text style={styles.infoText}>{product.quantity} {product.unit}</Text>
                      </View>
                   )}
                   <View style={styles.infoBadge}>
                       <Ionicons name="checkmark-circle-outline" size={14} color={COLORS.grey} />
                       <Text style={styles.infoText}>{getStockStatus(product.quantity || 10).text}</Text>
                   </View>
              </View>


              <View style={styles.divider} />

              {/* DESCRIPTION */}
              <View style={styles.section}>
                   <Text style={styles.sectionTitle}>Description</Text>
                   <View style={{ height: showFullDesc ? 'auto' : 100, overflow: 'hidden' }}>
                      <RenderHTML
                        contentWidth={width - 32}
                        source={{ html: product.description || "<p>No description available.</p>" }}
                        tagsStyles={htmlStyles}
                      />
                   </View>
                   <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)} style={styles.readMoreBtn}>
                       <Text style={styles.readMoreText}>{showFullDesc ? "View Less" : "View More"}</Text>
                       <Ionicons name={showFullDesc ? "chevron-up" : "chevron-down"} size={16} color={COLORS.primary} />
                   </TouchableOpacity>
              </View>

          </View>
        </ScrollView>

        {/* STICKY FOOTER */}
        <View style={[styles.footer, { paddingBottom: bottomSpace > 0 ? bottomSpace : 20 }]}>
            <View style={styles.footerPriceBlock}>
                 <Text style={styles.footerPriceLabel}>Total Price</Text>
                 <Text style={styles.footerPrice}>₹{sellingPrice}</Text>
            </View>

            <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8} onPress={handleAddToCart}>
                <Ionicons name="bag-handle" size={20} color={COLORS.white} />
                <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
        </View>

      </View>
    </>
  );
}

const htmlStyles = {
    p: { fontSize: 14, lineHeight: 22, color: COLORS.textDark, marginBottom: 8 },
    strong: { fontWeight: "700", color: COLORS.textDark },
    li: { fontSize: 14, color: COLORS.textDark },
};

const styles = StyleSheet.create({
  loadingContainer: {
      flex: 1, 
      backgroundColor: '#fff', 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  container: {
      flex: 1,
      backgroundColor: '#fff', // Clean white background for details
  },
  
  /* Header */
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 10,
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
  },
  backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
  },
  headerActions: {
      flexDirection: 'row',
      gap: 12,
  },
  actionBtn: {
      width: 40,
      height: 40, 
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
  },

  /* Carousel */
  carouselContainer: {
      width: width,
      height: 420, // Taller premium image
      backgroundColor: '#F7F7F7',
      position: 'relative',
  },
  imageSlide: {
      width: width,
      height: 420,
  },
  image: {
      width: '100%',
      height: '100%',
  },
  dotsContainer: {
      position: 'absolute',
      bottom: 20,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
  },
  dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.2)',
  },
  activeDot: {
      backgroundColor: COLORS.primary,
      width: 20,
  },

  /* Details */
  detailsContainer: {
      padding: 16,
      backgroundColor: '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24, // Overlap effect
  },
  brandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
  },
  brandText: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.grey,
      textTransform: 'uppercase',
      letterSpacing: 1,
  },
  ratingBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
  },
  ratingText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '700',
  },
  productTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: COLORS.textDark,
      lineHeight: 32,
      marginBottom: 12,
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 10,
      marginBottom: 20,
  },
  sellingPrice: {
      fontSize: 26,
      fontWeight: '900',
      color: COLORS.textDark,
  },
  mrp: {
      fontSize: 16,
      color: COLORS.grey,
      textDecorationLine: 'line-through',
  },
  discountTag: {
      backgroundColor: STATUS_COLORS.green,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
  },
  discountText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '700',
  },
  divider: {
      height: 1,
      backgroundColor: '#F0F0F0',
      marginVertical: 16,
  },

  /* Variants */
  section: {
      marginBottom: 16,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textDark,
      marginBottom: 12,
  },
  variantChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#fff',
  },
  variantChipActive: {
      borderColor: COLORS.primary,
      backgroundColor: COLORS.lilac,
  },
  variantText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  variantTextActive: {
      color: COLORS.primaryDark,
  },
  colorDot: {
      width: 12, 
      height: 12, 
      borderRadius: 6, 
      borderWidth: 1, 
      borderColor: 'rgba(0,0,0,0.1)' 
  },

  /* Info Badges */
  infoRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
  },
  infoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
  },
  infoText: {
      fontSize: 12,
      color: COLORS.textDark,
      fontWeight: '500',
  },

  /* Read More */
  readMoreBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      gap: 4,
  },
  readMoreText: {
      color: COLORS.primary,
      fontWeight: '700',
      fontSize: 14,
  },

  /* Sticky Footer */
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      paddingTop: 16,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
      elevation: 20,
      shadowColor: "#000",
      shadowOffset: {width: 0, height: -4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
  },
  footerPriceBlock: {
      flex: 1,
  },
  footerPriceLabel: {
      fontSize: 12,
      color: COLORS.grey,
      marginBottom: 2,
  },
  footerPrice: {
      fontSize: 20,
      fontWeight: '800',
      color: COLORS.textDark,
  },
  addToCartBtn: {
      backgroundColor: COLORS.primaryDark,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      elevation: 4,
  },
  addToCartText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
  },

});