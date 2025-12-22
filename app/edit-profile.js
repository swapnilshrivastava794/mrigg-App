import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Screen>
        {/* HEADER */}
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>
            Update your basic information
          </Text>
        </View>

        {/* SECTION 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Details</Text>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Swapnil Kumar"
              placeholderTextColor={COLORS.grey}
            />
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="swapnil@example.com"
              placeholderTextColor={COLORS.grey}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 9876543210"
              placeholderTextColor={COLORS.grey}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* SECTION 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Address Info</Text>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              placeholderTextColor={COLORS.grey}
            />
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter state"
              placeholderTextColor={COLORS.grey}
            />
          </View>

          <View style={styles.fieldBox}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pincode"
              placeholderTextColor={COLORS.grey}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  headerSubtitle: {
    marginTop: 4,
    color: COLORS.grey,
    fontSize: 14,
  },

  sectionCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 12,
  },

  fieldBox: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 6,
  },

  input: {
    backgroundColor: COLORS.lilac,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 14,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.softPurple,
  },

  saveBtn: {
    backgroundColor: COLORS.primaryDark,
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.primaryDark,
  },

  saveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
