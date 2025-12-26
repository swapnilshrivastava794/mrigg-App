import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddAddress() {
  const router = useRouter();
  const [tag, setTag] = useState('Home'); // Home or Work
  
  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Address</Text>
          <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.section}>
            <Text style={styles.label}>Full Name (Required)*</Text>
            <TextInput style={styles.input} placeholder="Name" />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone number (Required)*</Text>
            <TextInput style={styles.input} placeholder="10-digit mobile number" keyboardType="phone-pad" />
          </View>

          <View style={styles.row}>
              <View style={[styles.section, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Pincode (Required)*</Text>
                <TextInput style={styles.input} placeholder="Pincode" keyboardType="numeric" />
              </View>
              <View style={[styles.section, { flex: 1 }]}>
                <Text style={styles.label}>State (Required)*</Text>
                <TextInput style={styles.input} placeholder="State" />
              </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>City (Required)*</Text>
            <TextInput style={styles.input} placeholder="City" />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>House No., Building Name (Required)*</Text>
            <TextInput style={styles.input} placeholder="House No., Building Name" />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Road name, Area, Colony (Required)*</Text>
            <TextInput style={styles.input} placeholder="Road name, Area, Colony" />
          </View>

          {/* Type Tags */}
          <View style={styles.section}>
              <Text style={styles.label}>Type of address</Text>
              <View style={styles.tagRow}>
                  <TouchableOpacity 
                    style={[styles.tag, tag === 'Home' && styles.activeTag]}
                    onPress={() => setTag('Home')}
                >
                      <Ionicons name="home" size={16} color={tag === 'Home' ? COLORS.primaryDark : COLORS.grey} />
                      <Text style={[styles.tagText, tag === 'Home' && styles.activeTagText]}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.tag, tag === 'Work' && styles.activeTag]}
                    onPress={() => setTag('Work')}
                  >
                      <Ionicons name="briefcase" size={16} color={tag === 'Work' ? COLORS.primaryDark : COLORS.grey} />
                      <Text style={[styles.tagText, tag === 'Work' && styles.activeTagText]}>Work</Text>
                  </TouchableOpacity>
              </View>
          </View>

          <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveText}>Save Address</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  section: {
      marginBottom: 16,
  },
  row: {
      flexDirection: 'row',
  },
  label: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.grey,
      marginBottom: 8,
  },
  input: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 15,
      color: COLORS.textDark,
  },
  
  /** Tags */
  tagRow: {
      flexDirection: 'row',
      gap: 12,
  },
  tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
  },
  activeTag: {
      borderColor: COLORS.primaryDark,
      backgroundColor: COLORS.lilac,
  },
  tagText: {
      fontSize: 14,
      color: COLORS.grey,
      fontWeight: '600',
  },
  activeTagText: {
      color: COLORS.primaryDark,
  },

  saveBtn: {
      backgroundColor: COLORS.primaryDark,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
  },
  saveText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '700',
  },
});
