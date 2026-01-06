import AddressSkeleton from "@/components/AddressSkeleton"; // Import
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getUserAddresses } from "../server";

export default function AddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses(); // Assuming returns array
      // Adapt if API returns wrapped object
      const list = Array.isArray(data) ? data : data.addresses || [];
      setAddresses(list);
      
      // Auto-select default or first
      if (list.length > 0 && !selectedAddressId) {
        const defaultAddr = list.find(a => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : list[0].id);
      }
    } catch (error) {
      console.log("Error fetching addresses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedAddressId) return;
    const selected = addresses.find((a) => a.id === selectedAddressId);
    // Pass selected address to next screen params or just ID
    router.push({
        pathname: "/checkout/confirm", 
        params: { addressId: selectedAddressId, addressJson: JSON.stringify(selected) }
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedAddressId;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedAddressId(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.headerRow}>
            <View style={styles.radioContainer}>
              <Ionicons
                name={isSelected ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={isSelected ? COLORS.primaryDark : "#C5C5C5"}
              />
            </View>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[styles.name, isSelected && {color: COLORS.primaryDark}]}>{item.full_name}</Text>
                    {item.is_default && <View style={styles.tag}><Text style={styles.tagText}>Default</Text></View>}
                </View>
                <Text style={styles.phone}>{item.phone}</Text>
            </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.addressContent}>
            <Text style={styles.addressText}>
                {item.address_line1}, {item.address_line2}
            </Text>
            <Text style={styles.addressText}>
                {item.city}, {item.state} - {item.zip_code}
            </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <AddressSkeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { paddingBottom: 140 }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <TouchableOpacity
                    style={styles.addBtnHeader}
                    onPress={() => router.push("/checkout/add-address")}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color={COLORS.primaryDark} />
                    <Text style={styles.addBtnTextHeader}>Add a new address</Text>
                </TouchableOpacity>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={64} color="#E0E0E0" />
                <Text style={styles.emptyText}>No addresses found</Text>
                <Text style={styles.emptySubText}>Add a delivery address to check out.</Text>
              </View>
            }
            ListFooterComponent={<View />}
          />
        </View>
      )}

      {/* Footer Button */}
      {!loading && addresses.length > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
                <Text style={styles.proceedText}>Confirm & Proceed</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0", // Flat border
  },
  selectedCard: {
    borderColor: "#6233B5", // Primary Color
    backgroundColor: "#F8F5FF", // Very light purple tint
    borderWidth: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  phone: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  tag: {
      backgroundColor: "#EEF2FF",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
  },
  tagText: {
      fontSize: 10,
      fontWeight: "700",
      color: COLORS.primaryDark,
      textTransform: "uppercase"
  },
  divider: {
      height: 1,
      backgroundColor: "#F3F4F6",
      marginVertical: 12,
  },
  addressContent: {
      paddingLeft: 34, // align with text start
  },
  addressText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  addBtnHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff", 
    padding: 16,
    borderRadius: 12, // slightly sharper than cards
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
  },
  addBtnTextHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginLeft: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: -5},
  },
  proceedBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 5,
  },
  proceedText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
