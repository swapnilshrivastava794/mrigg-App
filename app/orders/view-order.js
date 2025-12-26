import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getSingleOrder } from "../server";

// ❗ This hides header only for THIS page
export const options = {
  headerShown: false,
};

export default function ViewOrder() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getSingleOrder(params.id);
      setOrder(data);
    } catch (error) {
      console.log("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "placed":
      case "created":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "out_for_delivery":
        return 4;
      case "delivered":
        return 5;
      case "cancelled":
        return -1;
      case "returned":
        return -2;
      default:
        return 1;
    }
  };

  const renderTimeline = () => {
    if (!order) return null;
    const currentStep = getStatusStep(order.status);
    const isCancelled = currentStep === -1;
    const isReturned = currentStep === -2;

    const steps = [
      { title: "Order Placed", date: order.created },
      { title: "Processing", date: "" },
      { title: "Shipped", date: "" },
      { title: "Out for Delivery", date: "" },
      { title: "Delivered", date: "" },
    ];

    if (isCancelled) {
        return (
            <View style={styles.cancelledCard}>
                <Ionicons name="close-circle" size={40} color="red" />
                <View style={{ marginLeft: 16 }}>
                    <Text style={styles.cancelledTitle}>Order Cancelled</Text>
                    <Text style={styles.cancelledSub}>As requested on {new Date(order.created).toLocaleDateString()}</Text>
                </View>
            </View>
        )
    }

    if (isReturned) {
        return (
            <View style={[styles.cancelledCard, { borderColor: 'orange', backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="return-down-back" size={40} color="orange" />
                <View style={{ marginLeft: 16 }}>
                    <Text style={[styles.cancelledTitle, { color: 'orange' }]}>Order Returned</Text>
                    <Text style={styles.cancelledSub}>This order has been returned.</Text>
                </View>
            </View>
        )
    }

    return (
      <View style={styles.timelineContainer}>
        {steps.map((step, index) => {
          const isCompleted = index + 1 <= currentStep;
          const isLast = index === steps.length - 1;
          const isActive = index + 1 === currentStep;

          return (
            <View key={index} style={styles.timelineRow}>
              {/* Dot and Line */}
              <View style={styles.timelineIndicator}>
                <View
                  style={[
                    styles.dot,
                    isCompleted ? styles.dotActive : styles.dotInactive,
                    isActive && styles.dotCurrent, // Pulse effect placeholder
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  )}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.line,
                      index + 1 < currentStep ? styles.lineActive : styles.lineInactive,
                    ]}
                  />
                )}
              </View>

              {/* Text */}
              <View style={[styles.timelineContent, isLast && { paddingBottom: 0 }]}>
                <Text
                  style={[
                    styles.stepTitle,
                    isCompleted ? styles.textActive : styles.textInactive,
                  ]}
                >
                  {step.title}
                </Text>
                {step.date && isCompleted ? (
                   <Text style={styles.stepDate}>{new Date(step.date).toDateString()}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Screen>
    );
  }

  if (!order) {
    return (
        <Screen>
             <View style={styles.center}>
                <Text>Order not found</Text>
             </View>
        </Screen>
    )
  }

  return (
    <Screen>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
            <View style={{width: 24}} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Order ID Block */}
            <View style={styles.idBlock}>
                <Text style={styles.orderIdLabel}>Order ID - {order.id}</Text>
            </View>

            {/* Product Card */}
            {order.items?.map((item, index) => (
                <View key={index} style={styles.productCard}>
                    <View style={styles.productRow}>
                        <View style={styles.details}>
                            <Text style={styles.productName}>{item.product_name}</Text>
                            {item.variation_details?.name && (
                                <Text style={styles.productMeta}>
                                    {item.variation_details.name}
                                </Text>
                            )}
                            <Text style={styles.productMeta}>Qty: {item.quantity}</Text>
                            <Text style={styles.price}>₹{item.price}</Text>
                        </View>
                        <View style={styles.imageWrapper}>
                             {/* Placeholder if no image */}
                            <Image source={{ uri: "https://placehold.co/100x100/png?text=Item" }} style={styles.image} />
                        </View>
                    </View>
                </View>
            ))}

            {/* Tracking Timeline */}
            {renderTimeline()}

            {/* Shipping Details */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Shipping Details</Text>
                <View style={styles.addressRow}>
                    <Text style={styles.addressName}>{order.city}</Text> 
                    {/* Using City as that's what we have in API */}
                    <View style={styles.tagHome}>
                        <Text style={styles.tagText}>HOME</Text>
                    </View>
                </View>
                <Text style={styles.addressText}>
                    {order.city ? `Delivery address in ${order.city}` : "Address not available"}
                </Text>
                <Text style={styles.addressPhone}>Phone number not provided</Text>
            </View>

            {/* Price Details */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Price Details</Text>
                
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>List Price</Text>
                    <Text style={styles.priceValue}>₹{order.total_amount}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Selling Price</Text>
                    <Text style={styles.priceValue}>₹{order.total_amount}</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>In-cart Discount</Text>
                    <Text style={[styles.priceValue, { color: 'green' }]}>-₹0</Text>
                </View>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Shipping Fee</Text>
                    <Text style={[styles.priceValue, { color: 'green' }]}>FREE</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{order.total_amount}</Text>
                </View>
            </View>

            {/* Need Help */}
            <TouchableOpacity style={styles.helpBtn}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.primary} />
                <Text style={styles.helpText}>Need Help with this Order?</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>

      </View>
    </Screen>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  center: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  scrollContent: {
      paddingBottom: 40,
  },
  idBlock: {
      padding: 16,
      backgroundColor: COLORS.white,
      marginBottom: 2,
  },
  orderIdLabel: {
      fontSize: 14,
      color: COLORS.grey,
      fontWeight: '500',
  },
  productCard: {
      backgroundColor: COLORS.white,
      padding: 16,
      marginBottom: 8,
  },
  productRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  details: {
      flex: 1,
      marginRight: 12,
  },
  productName: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textDark,
      marginBottom: 4,
  },
  productMeta: {
      fontSize: 13, 
      color: COLORS.grey,
      marginBottom: 8,
  },
  price: {
      fontSize: 18,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  imageWrapper: {
      width: 80, 
      height: 80,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 4,
      padding: 4,
  },
  image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
  },
  
  /* Timeline */
  timelineContainer: {
      backgroundColor: COLORS.white,
      padding: 20,
      marginBottom: 8,
  },
  timelineRow: {
      flexDirection: 'row',
  },
  timelineIndicator: {
      alignItems: 'center',
      width: 24,
      marginRight: 12,
  },
  dot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
  },
  dotActive: {
      backgroundColor: 'green',
  },
  dotCurrent: {
      borderWidth: 2,
      borderColor: '#b2fab4', // light green halo
      transform: [{ scale: 1.2 }]
  },
  dotInactive: {
      backgroundColor: '#ddd',
  },
  line: {
      width: 2,
      flex: 1, 
      marginVertical: -2, // pull lines to touch dots
  },
  lineActive: {
      backgroundColor: 'green',
  },
  lineInactive: {
      backgroundColor: '#ddd',
  },
  timelineContent: {
      flex: 1,
      paddingBottom: 32, // space between steps
  },
  stepTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
  },
  stepDate: {
      fontSize: 12,
      color: COLORS.grey,
  },
  textActive: {
      color: COLORS.textDark,
  },
  textInactive: {
      color: '#bbb',
  },
  cancelledCard: {
      backgroundColor: '#FFEBEE',
      margin: 16,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#FFCDD2',
      flexDirection: 'row',
      alignItems: 'center',
  },
  cancelledTitle: {
      fontSize: 16, 
      fontWeight: '700',
      color: '#D32F2F',
  },
  cancelledSub: {
      fontSize: 13, 
      color: '#B71C1C',
      marginTop: 2,
  },

  /* Sections */
  sectionCard: {
      backgroundColor: COLORS.white,
      padding: 16,
      marginBottom: 8,
  },
  sectionTitle: {
      fontSize: 14,
      color: COLORS.grey,
      fontWeight: '700',
      marginBottom: 12,
      textTransform: 'uppercase',
  },
  addressRow: {
      flexDirection: 'row', 
      alignItems: 'center', 
      gap: 8,
      marginBottom: 6,
  },
  addressName: {
      fontSize: 15, 
      fontWeight: '700', 
      color: COLORS.textDark
  },
  tagHome: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  tagText: {
      fontSize: 10,
      fontWeight: '700',
      color: COLORS.grey
  },
  addressText: {
      fontSize: 14, 
      color: COLORS.textDark,
      lineHeight: 20,
  },
  addressPhone: {
      fontSize: 14, 
      color: COLORS.textDark,
      marginTop: 4,
  },
  
  /* Prices */
  priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  priceLabel: {
      fontSize: 14,
      color: COLORS.textDark,
  },
  priceValue: {
      fontSize: 14,
      color: COLORS.textDark,
  },
  divider: {
      height: 1, 
      backgroundColor: '#eee',
      marginVertical: 12, 
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: '#eee', // dashed border trick needs view height 0 usually but plain is fine
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  totalLabel: {
      fontSize: 16, 
      fontWeight: '700', 
      color: COLORS.textDark
  },
  totalValue: {
      fontSize: 16, 
      fontWeight: '700', 
      color: COLORS.textDark
  },

  /* Help */
  helpBtn: {
      backgroundColor: COLORS.white,
      padding: 16, 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
  },
  helpText: {
      fontSize: 14, 
      fontWeight: '600', 
      color: COLORS.primary
  }
});
