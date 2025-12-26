import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddressList() {
  const router = useRouter();
  
  // Dummy Address Data
  const [addresses, setAddresses] = useState([
      {
          id: '1',
          name: 'Swapnil Kumar',
          type: 'Home',
          phone: '+91 9876543210',
          address: 'Flat 402, Sunshine Apartments, MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
      },
      {
          id: '2',
          name: 'Swapnil Work',
          type: 'Work',
          phone: '+91 9876543210',
          address: 'Tech Park, Sector 5',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          isDefault: false,
      }
  ]);

  const AddressItem = ({ item }) => (
      <View style={styles.addressCard}>
          <View style={styles.topRow}>
              <View style={styles.typeTag}>
                  <Ionicons name={item.type === 'Home' ? "home" : "briefcase"} size={12} color={COLORS.primaryDark} />
                  <Text style={styles.typeText}>{item.type}</Text>
              </View>
              {item.isDefault && <Text style={styles.defaultText}>DEFAULT</Text>}
          </View>

          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.addressText}>{item.address}</Text>
          <Text style={styles.addressText}>{item.city}, {item.state} - {item.pincode}</Text>
          <Text style={styles.phone}>Phone: {item.phone}</Text>

          <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>EDIT</Text>
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>REMOVE</Text>
              </TouchableOpacity>
          </View>
      </View>
  );

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <TouchableOpacity onPress={() => router.push('/address/add')}>
            <Ionicons name="add" size={24} color={COLORS.primaryDark} />
          </TouchableOpacity>
      </View>

      <View style={styles.container}>
          <Text style={styles.subHeader}>{addresses.length} SAVED ADDRESSES</Text>
          
          <FlatList 
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => <AddressItem item={item} />}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 100 }} />}
          />

          <TouchableOpacity 
            style={styles.addNewBtn}
            onPress={() => router.push('/address/add')}
          >
              <Text style={styles.addNewText}>+ Add New Address</Text>
          </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F1F3F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  backBtn: {
      padding: 4,
  },
  subHeader: {
      fontSize: 13,
      color: COLORS.grey,
      fontWeight: '600',
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
  },
  listContent: {
      paddingHorizontal: 16,
  },
  
  /** Address Card */
  addressCard: {
      backgroundColor: COLORS.white,
      marginBottom: 12,
      borderRadius: 8,
      padding: 16,
      elevation: 1,
  },
  topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  typeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.lilac,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      gap: 4,
  },
  typeText: {
      fontSize: 10,
      fontWeight: '700',
      color: COLORS.primaryDark,
      textTransform: 'uppercase',
  },
  defaultText: {
      fontSize: 10,
      fontWeight: '700',
      color: COLORS.grey,
  },
  name: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textDark,
      marginBottom: 4,
  },
  addressText: {
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
  },
  phone: {
      fontSize: 14,
      color: COLORS.textDark,
      marginTop: 8,
      fontWeight: '500',
  },

  /** Actions */
  actionRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
      marginTop: 12,
      paddingTop: 12,
  },
  actionBtn: {
      flex: 1,
      alignItems: 'center',
  },
  actionBtnText: {
      color: COLORS.primaryDark,
      fontWeight: '600',
      fontSize: 13,
  },
  verticalDivider: {
      width: 1,
      backgroundColor: '#F0F0F0',
  },

  /** Floating Button */
  addNewBtn: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
      backgroundColor: COLORS.primaryDark,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      elevation: 5,
  },
  addNewText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '700',
  },
});
