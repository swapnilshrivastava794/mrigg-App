import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors"; // 💜 GLOBAL COLORS
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, removeFromCart, updateQuantity, coupon, removeCoupon, applyCouponToCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    try {
        // Calculate total context
        const currentTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        // Call API directly for initial check or use context if it wraps it
        // The context exposes 'applyCouponToCart' which expects the full coupon object or we might need to validate first
        // Let's use the API directly here to get the Coupon Object, then save it to Context
        
        // Wait, Context usually handles this.
        // Let's verify what applyCouponToCart does in Context.
        // in Step 100: applyCouponToCart(couponData) -> setCoupon(couponData); save to storage.
        // So we need to validate against server HERE in the UI, then pass result to Context.
        
        const { applyCoupon } = require("../server"); // Dynamic import to avoid circular dep if any, or just import at top. 
        // Better: import at top, but verify if it's there. server is usually safe.
        // Ideally we should move this logic to Context "applyCoupon(code)" but context currently has "applyCouponToCart(obj)".
        // Let's stick to valid server call here.
        
        const res = await applyCoupon({
            code: couponCode,
            cart_total: currentTotal
        });

        if (res && res.discount_amount) {
            applyCouponToCart({ ...res, code: couponCode });
            setCouponCode("");
        } else {
             alert("Invalid Coupon");
        }

    } catch (error) {
        console.log(error);
        alert(error?.detail || "Invalid Coupon Code");
    } finally {
        setLoadingCoupon(false);
    }
  };

  const increaseQty = (id) => {
    updateQuantity(id, 1);
  };

  const decreaseQty = (id) => {
    updateQuantity(id, -1);
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout/address");
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
            <Text style={styles.headerTitle}>My Cart</Text>
        </View> */}

        {cartItems.length > 0 ? (
          <>
            <ScrollView 
                contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} 
                showsVerticalScrollIndicator={false}
            >
              {/* Cart Items List */}
              <View style={styles.itemsContainer}>
                  {cartItems.map((item) => (
                    <View key={item.id} style={styles.card}>
                      {/* Product Info Row */}
                      <View style={styles.cardTopRow}>
                          <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                          </View>

                          <View style={styles.info}>
                            <Text style={styles.brand} numberOfLines={1}>{item.brand}</Text>
                            <Text style={styles.name} numberOfLines={2}>
                              {item.name}
                            </Text>

                            {/* Show Variant Name if available */}
                            {item.variantName && (
                              <View style={styles.variantBadge}>
                                <Text style={styles.variantText}>
                                  {item.variantName}
                                </Text>
                              </View>
                            )}
                            
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>₹{item.price.toFixed(0)}</Text>
                            </View>
                          </View>
                      </View>

                      {/* Actions Row (Qty & Remove) */}
                      <View style={styles.cardActions}>
                          <View style={styles.qtyContainer}>
                              <TouchableOpacity
                                style={[styles.qtyButton, item.qty <= 1 && styles.qtyButtonDisabled]}
                                onPress={() => decreaseQty(item.id)}
                                disabled={item.qty <= 1}
                              >
                                <Ionicons name="remove" size={16} color={item.qty <= 1 ? COLORS.grey : COLORS.textDark} />
                              </TouchableOpacity>

                              <View style={styles.qtyValueContainer}>
                                <Text style={styles.qtyText}>{item.qty}</Text>
                              </View>

                              <TouchableOpacity
                                style={styles.qtyButton}
                                onPress={() => increaseQty(item.id)}
                              >
                                <Ionicons name="add" size={16} color={COLORS.textDark} />
                              </TouchableOpacity>
                          </View> 

                          <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                              <Ionicons name="trash-outline" size={18} color={COLORS.grey} />
                              <Text style={styles.removeBtnText}>Remove</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>



              {/* Coupon Section - Global */}
              {!coupon ? (
                  <View style={styles.couponSection}>
                      <View style={styles.couponSectionHeader}>
                          <Ionicons name="pricetag" size={18} color={COLORS.textDark} />
                          <Text style={styles.couponSectionTitle}>Coupons</Text>
                      </View>
                      
                      <View style={styles.couponInputWrapper}>
                          <View style={styles.couponInputContainer}>
                              <TextInput 
                                  style={styles.couponInput}
                                  placeholder="Enter Coupon Code"
                                  placeholderTextColor="#999"
                                  value={couponCode}
                                  onChangeText={setCouponCode}
                                  autoCapitalize="characters"
                              />
                          </View>
                          <TouchableOpacity 
                              style={styles.applyBtn}
                              onPress={handleApplyCoupon}
                              disabled={!couponCode || loadingCoupon}
                          >
                              <Text style={[styles.applyBtnText, !couponCode && { opacity: 0.5 }]}>
                                  {loadingCoupon ? "..." : "APPLY"}
                              </Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              ) : (
                  /* Coupon Applied Card */
                  /* Coupon Applied Card */
                  <View style={styles.couponSection}>
                      <View style={styles.couponSectionHeader}>
                          <Ionicons name="pricetag" size={18} color={COLORS.textDark} />
                          <Text style={styles.couponSectionTitle}>Coupons</Text>
                      </View>
                      
                      <View style={styles.couponAppliedContainer}>
                          <View style={styles.couponAppliedRow}>
                              <View style={styles.couponCodeBadge}>
                                  <Text style={styles.couponCodeText}>{coupon.code}</Text>
                              </View>
                              <TouchableOpacity onPress={removeCoupon}>
                                  <Text style={styles.removeCouponText}>Remove</Text>
                              </TouchableOpacity>
                          </View>
                          <Text style={styles.couponSavingsText}>
                             You saved <Text style={{fontWeight:'700'}}>₹{coupon.discount_amount || 0}</Text> with this coupon
                          </Text>
                      </View>
                  </View>
              )}



              {/* Price Details Section */}
              <View style={styles.priceDetailsCard}>
                  <Text style={styles.sectionTitle}>Price Details</Text>
                  <View style={styles.divider} />
                  
                  <View style={styles.priceRowDetail}>
                      <Text style={styles.priceLabel}>Price ({cartItems.length} items)</Text>
                      <Text style={styles.priceValue}>₹{totalAmount.toFixed(0)}</Text>
                  </View>
                  
                  {coupon && (
                      <View style={styles.priceRowDetail}>
                          <Text style={styles.priceLabel}>Coupon Discount</Text>
                          <Text style={[styles.priceValue, { color: 'green' }]}>
                              - ₹{coupon.discount_amount || 0}
                          </Text>
                      </View>
                  )}
                  {/* <View style={styles.priceRowDetail}>
                      <Text style={styles.priceLabel}>Discount</Text>
                      <Text style={[styles.priceValue, { color: 'green' }]}>- ₹0</Text>
                  </View> */}

                  <View style={styles.priceRowDetail}>
                      <Text style={styles.priceLabel}>Delivery Charges</Text>
                      <Text style={[styles.priceValue, { color: 'green' }]}>Free</Text>
                  </View>

                  <View style={[styles.divider, { marginVertical: 12 }]} />
                  
                  <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total Amount</Text>
                      <Text style={styles.totalValue}>
                          ₹{coupon ? (Number(coupon.new_total) || (totalAmount - (coupon.discount_amount||0))).toFixed(0) : totalAmount.toFixed(0)}
                      </Text>
                  </View>
                  
                  <View style={[styles.divider, { marginVertical: 12 }]} />
                  {coupon && (
                      <Text style={styles.savingsText}>
                          You will save ₹{coupon.discount_amount || 0} on this order
                      </Text>
                  )}
              </View>
              
              <View style={styles.safeFooterSpacer} />
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
              <View style={styles.totalContainer}>
                {coupon && <Text style={styles.strikeThroughTotal}>₹{totalAmount.toFixed(0)}</Text>}
                <Text style={styles.finalTotal}>
                    ₹{coupon ? (Number(coupon.new_total) || (totalAmount - (coupon.discount_amount||0))).toFixed(0) : totalAmount.toFixed(0)}
                </Text>
                <Text style={styles.viewDetailsText}>View price details</Text>
              </View>

              <TouchableOpacity style={styles.placeOrderBtn} onPress={handleCheckout}>
                <Text style={styles.placeOrderText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }} 
                style={styles.emptyImage} 
              />
              <Text style={styles.emptyTitle}>Your cart is empty!</Text>
              <Text style={styles.emptySubtitle}>Explore our wide selection and find something you like</Text>
              
              <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push('/')}>
                  <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6', // Light grey background like Flipkart
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  
  /** Cart Item Card */
  itemsContainer: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTopRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    marginRight: 16,
    padding: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  info: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  brand: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  variantBadge: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  variantText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.grey,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 14,
    color: 'green',
    fontWeight: '600',
  },

  /** Actions */
  cardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 24,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  qtyButtonDisabled: {
      borderColor: '#F0F0F0',
      backgroundColor: '#FAFAFA',
  },
  qtyValueContainer: {
      width: 36,
      alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  removeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
  },
  removeBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
  },

  /** Price Details */
  priceDetailsCard: {
      backgroundColor: COLORS.white,
      padding: 16,
      marginBottom: 20,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.grey,
      marginBottom: 12,
      textTransform: 'uppercase',
  },
  divider: {
      height: 1,
      backgroundColor: '#F0F0F0',
      marginBottom: 12,
  },
  priceRowDetail: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
  },
  priceLabel: {
      fontSize: 15,
      color: COLORS.textDark,
  },
  priceValue: {
      fontSize: 15,
      color: COLORS.textDark,
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  totalLabel: {
      fontSize: 17,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  totalValue: {
      fontSize: 17,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  savingsText: {
      fontSize: 14,
      fontWeight: '600',
      color: 'green',
      marginTop: 4,
  },
  safeFooterSpacer: {
      height: 20,
  },

  /** Permanent Footer */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flex: 0.5,
  },
  strikeThroughTotal: {
    fontSize: 12,
    color: COLORS.grey,
    textDecorationLine: 'line-through',
  },
  finalTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  viewDetailsText: {
      fontSize: 12,
      color: COLORS.primaryDark,
      marginTop: 2,
  },
  placeOrderBtn: {
    flex: 0.5,
    backgroundColor: '#7445C4', // Flipkart orange/yellow
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  /** Empty State */
  emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 60,
  },
  emptyImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginBottom: 20,
      opacity: 0.8,
  },
  emptyTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.textDark,
      marginTop: 10,
  },
  emptySubtitle: {
      fontSize: 14,
      color: COLORS.grey,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 30,
  },
  shopNowBtn: {
      backgroundColor: COLORS.primaryDark,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 4,
  },
  shopNowText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '600',
  },
  
  /* Coupon Section */
  couponSection: {
      backgroundColor: COLORS.white,
      padding: 16,
      marginBottom: 10,
  },
  couponSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
  },
  couponSectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  couponInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  couponInputContainer: {
      flex: 1,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E0E0E0', 
      borderRadius: 4,
      paddingHorizontal: 12,
      height: 44,
      justifyContent: 'center',
  },
  couponInput: {
      fontSize: 14,
      color: COLORS.textDark,
      height: '100%',
  },
  applyBtn: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
  },
  applyBtnText: {
      color: COLORS.primaryDark,
      fontWeight: '700',
      fontSize: 14,
      letterSpacing: 0.5,
  },

  /* Coupon Applied State */
  couponAppliedContainer: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 4,
      padding: 12,
      backgroundColor: '#F9F9F9',
  },
  couponAppliedRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
  },
  couponCodeBadge: {
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: '#4CAF50', // Green dashed border
      backgroundColor: '#E8F5E9', // Light green bg
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
  },
  couponCodeText: {
      color: '#2E7D32',
      fontWeight: '700',
      fontSize: 13,
      letterSpacing: 0.5,
  },
  removeCouponText: {
      color: '#D32F2F', // Red for remove
      fontWeight: '600',
      fontSize: 13,
  },
  couponSavingsText: {
      fontSize: 13,
      color: '#4CAF50',
      fontWeight: '500',
  },

  
  /* Item Level Coupon */

});
