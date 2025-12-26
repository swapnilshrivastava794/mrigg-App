import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getOrders } from "../server";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "Shipped", "Delivered", "Returned", "Cancelled"];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(activeFilter, searchQuery);
      setOrders(data);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [activeFilter, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "green";
    if (s === "cancelled") return "red";
    if (s === "returned") return "orange";
    if (s === "shipped") return COLORS.primary;
    return COLORS.grey;
  };

  const renderItem = ({ item }) => {
    const firstItem = item.items?.[0] || {};
    // Use placeholder if no image available (API response didn't show image in items)
    const imageUri = firstItem.image || "https://placehold.co/100x100/png?text=Product"; 
    
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: "/orders/view-order", params: { ...item } })}
      >
        <View style={styles.cardHeader}>
          {/* Status Icon */}
          <View style={styles.statusRow}>
            <Ionicons
              name={
                item.status?.toLowerCase() === "delivered"
                  ? "checkmark-circle"
                  : item.status?.toLowerCase() === "cancelled"
                  ? "close-circle"
                  : "ellipse"
              }
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.created)}</Text>
        </View>

        <View style={styles.productRow}>
          <View style={styles.imageWrapper}>
             <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
          <View style={styles.details}>
            <Text style={styles.productName} numberOfLines={1}>
              {firstItem.product_name || `Order #${item.id}`}
            </Text>
            <Text style={styles.productDesc}>
              {firstItem.variation_details?.name ? `${firstItem.variation_details.name} • ` : ""}
              {item.items?.length > 1 ? `+ ${item.items.length - 1} more items` : `Qty: ${firstItem.quantity || 1}`}
            </Text>
            <Text style={styles.priceText}>₹{item.total_amount}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </View>

        {/* Rating/Review Button if Delivered */}
        {item.status?.toLowerCase() === "delivered" && (
            <View style={styles.actionRow}>
                <Text style={styles.rateText}>Rate & Review Product</Text>
                <View style={styles.stars}>
                    {[1,2,3,4,5].map(s => (
                        <Ionicons key={s} name="star-outline" size={16} color="#FFC107" />
                    ))}
                </View>
            </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        {/* Header with Search */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Orders</Text>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.grey} />
                <TextInput 
                    placeholder="Search by ID or Product..." 
                    placeholderTextColor={COLORS.grey}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
            <FlatList 
                horizontal
                data={filters}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.filterChip, activeFilter === item && styles.activeFilterChip]}
                        onPress={() => setActiveFilter(item)}
                    >
                        <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>

        {loading && !refreshing && orders.length === 0 ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        ) : (
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
        )}
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
      alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
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
      marginBottom: 12,
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F5FF',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
      borderWidth: 1,
      borderColor: '#E6E6E6'
  },
  searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 14,
      color: COLORS.textDark,
  },
  filterContainer: {
      backgroundColor: COLORS.white,
      paddingVertical: 10,
  },
  filterScroll: {
      paddingHorizontal: 16,
      gap: 10,
  },
  filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: COLORS.white,
  },
  activeFilterChip: {
      backgroundColor: COLORS.primaryDark,
      borderColor: COLORS.primaryDark,
  },
  filterText: {
      fontSize: 13,
      color: COLORS.textDark,
      fontWeight: '500',
  },
  activeFilterText: {
      color: COLORS.white,
  },
  scrollContent: {
      padding: 12,
      paddingBottom: 100,
  },
  card: {
      backgroundColor: COLORS.white,
      marginBottom: 12,
      borderRadius: 8,
      padding: 16,
      elevation: 2,
      shadowColor: "#000", 
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: {width:0, height: 1}
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
  },
  statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  statusText: {
      fontSize: 12,
      fontWeight: '700',
  },
  dateText: {
      fontSize: 12,
      color: COLORS.grey,
  },
  productRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
  },
  imageWrapper: {
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: '#f0f0f0',
      borderRadius: 4,
      marginRight: 12,
      padding: 2,
      backgroundColor: '#f9f9f9',
  },
  image: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
  },
  details: {
      flex: 1,
      justifyContent: 'center',
  },
  productName: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textDark,
      marginBottom: 4,
  },
  productDesc: {
      fontSize: 12,
      color: COLORS.grey,
      marginBottom: 4
  },
  priceText: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#f5f5f5',
  },
  rateText: {
      fontSize: 12,
      color: COLORS.primary,
      fontWeight: '600',
  },
  stars: {
      flexDirection: 'row',
      gap: 2,
  },
  emptyContainer: {
      alignItems: 'center',
      marginTop: 50,
      opacity: 0.5,
  },
  emptyText: {
      marginTop: 10,
      fontSize: 16,
      color: COLORS.grey,
  },
});
