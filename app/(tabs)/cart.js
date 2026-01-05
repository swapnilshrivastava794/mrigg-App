import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors"; // 💜 GLOBAL COLORS
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cartItems, removeFromCart, updateQuantity, coupon, removeCoupon } = useCart();

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

              {/* Coupon Applied Card */}
              {coupon && (
                  <View style={styles.couponCard}>
                      <View style={styles.couponHeader}>
                          <Ionicons name="pricetag" size={20} color={COLORS.primary} />
                          <Text style={styles.couponTitle}>Coupon Applied</Text>
                      </View>
                      <View style={styles.couponRow}>
                          <Text style={styles.couponCode}>{coupon.code}</Text>
                          <TouchableOpacity onPress={removeCoupon}>
                              <Text style={styles.removeCouponText}>Remove</Text>
                          </TouchableOpacity>
                      </View>
                      <Text style={styles.couponSavings}>
                          You saved ₹{coupon.discount_amount || 0} with this coupon!
                      </Text>
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
  
  /* Coupon Card */
  couponCard: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E0E0E0', // Optional border
      borderLeftWidth: 4,
      borderLeftColor: 'green',
  },
  couponHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
  },
  couponTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  couponRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },
  couponCode: {
      fontSize: 16,
      fontWeight: '800',
      color: COLORS.textDark,
      letterSpacing: 1,
  },
  removeCouponText: {
      color: 'red',
      fontWeight: '600',
      fontSize: 12,
  },
  couponSavings: {
      fontSize: 12,
      color: 'green',
      fontWeight: '600',
  }
});
