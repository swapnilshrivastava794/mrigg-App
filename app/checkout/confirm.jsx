import { COLORS } from "@/src/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../contexts/CartContext";

export default function ConfirmOrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addressJson } = useLocalSearchParams();
  const { cartItems, coupon } = useCart();
  
  const address = addressJson ? JSON.parse(addressJson) : null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const finalTotal = coupon 
    ? (Number(coupon.new_total) || (totalAmount - (coupon.discount_amount || 0)))
    : totalAmount;

  const handlePayNow = () => {
    router.push({
        pathname: "/checkout/payment",
        params: { addressId: address?.id, totalAmount: finalTotal.toFixed(2) }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Order Summary</Text>

        {/* Address Summary */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.editBtn}>Change</Text>
                </TouchableOpacity>
            </View>
            
            {address ? (
                <View style={styles.addressBox}>
                    <Text style={styles.name}>{address.full_name}</Text>
                    <Text style={styles.details}>{address.address_line1}, {address.address_line2}</Text>
                    <Text style={styles.details}>{address.city}, {address.state} - {address.zip_code}</Text>
                    <Text style={styles.phone}>📞 {address.phone}</Text>
                </View>
            ) : (
                <Text style={styles.errorText}>No address selected</Text>
            )}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
            {cartItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                        {item.variantName && (
                            <Text style={styles.itemVariantName}>{item.variantName}</Text>
                        )}
                        <Text style={styles.itemVariant}>Qty: {item.qty} × ₹{item.price}</Text>
                    </View>
                    <Text style={styles.itemPrice}>₹{(item.qty * item.price).toFixed(2)}</Text>
                </View>
            ))}
        </View>

        {/* Bill Details */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal</Text>
                <Text style={styles.billValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Fee</Text>
                <Text style={[styles.billValue, { color: '#059669' }]}>Free</Text>
            </View>

            {coupon && (
                <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Coupon Discount</Text>
                    <Text style={[styles.billValue, { color: '#059669' }]}>- ₹{coupon.discount_amount}</Text>
                </View>
            )}

            <View style={styles.divider} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalValue}>₹{finalTotal.toFixed(2)}</Text>
            </View>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Pay Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View>
            <Text style={styles.footerTotalLabel}>Total Amount</Text>
            <Text style={styles.footerTotalValue}>₹{finalTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayNow} activeOpacity={0.8}>
            <Text style={styles.payText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
      flex: 1,
      backgroundColor: "#F4F6F8",
  },
  container: {
    padding: 16,
  },
  header: {
      fontSize: 24,
      fontWeight: "800",
      color: "#111827",
      marginBottom: 20,
      marginTop: 10,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  editBtn: {
      color: COLORS.primaryDark,
      fontWeight: '600',
      fontSize: 14,
  },
  addressBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  name: { fontWeight: "700", fontSize: 15, marginBottom: 4, color: "#111827" },
  details: { color: "#4B5563", fontSize: 13, marginBottom: 2 },
  phone: { marginTop: 8, fontWeight: "600", color: "#374151", fontSize: 13 },
  
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#F3F4F6" },
  itemInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 4 },
  itemVariantName: { fontSize: 12, color: "#6B7280", marginBottom: 2, fontStyle: 'italic' },
  itemVariant: { fontSize: 12, color: "#9CA3AF" },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#111827" },

  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  billLabel: { color: "#6B7280", fontSize: 14 },
  billValue: { color: "#111827", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: 'flex-end'},
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#111827" },
  totalValue: { fontSize: 20, fontWeight: "800", color: COLORS.primaryDark },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: -5},
  },
  footerTotalLabel: { fontSize: 13, color: "#6B7280", marginBottom: 2 },
  footerTotalValue: { fontSize: 22, fontWeight: "800", color: "#111827" },
  payBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    elevation: 5,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4}
  },
  payText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});
