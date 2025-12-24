import { COLORS } from "@/src/constants/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { addAddress } from "../server";

export default function AddAddressScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "India", // Default
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.full_name ||
      !formData.phone ||
      !formData.address_line1 ||
      !formData.city ||
      !formData.zip_code
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields marked with *");
      return;
    }

    try {
        setLoading(true);
        await addAddress(formData);
        Alert.alert("Success", "Address added successfully", [
            { text: "OK", onPress: () => router.back() } 
        ]);
    } catch (error) {
        Alert.alert("Error", "Failed to add address. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.headerTitle}>New Delivery Address</Text>
        
        <View style={styles.card}>
            <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: John Doe"
                placeholderTextColor="#999"
                value={formData.full_name}
                onChangeText={(t) => handleChange("full_name", t)}
            />
            </View>

            <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number*</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 9876543210"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(t) => handleChange("phone", t)}
                maxLength={10}
            />
            </View>

            <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 1*</Text>
            <TextInput
                style={styles.input}
                placeholder="House No, Building, Street"
                placeholderTextColor="#999"
                value={formData.address_line1}
                onChangeText={(t) => handleChange("address_line1", t)}
            />
            </View>

            <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
                style={styles.input}
                placeholder="Landmark, Area (Optional)"
                placeholderTextColor="#999"
                value={formData.address_line2}
                onChangeText={(t) => handleChange("address_line2", t)}
            />
            </View>

            <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>City*</Text>
                <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#999"
                value={formData.city}
                onChangeText={(t) => handleChange("city", t)}
                />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>State*</Text>
                <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#999"
                value={formData.state}
                onChangeText={(t) => handleChange("state", t)}
                />
            </View>
            </View>

            <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Zip Code*</Text>
                <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.zip_code}
                onChangeText={(t) => handleChange("zip_code", t)}
                />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                style={[styles.input, { backgroundColor: "#F3F4F6", color: "#666" }]}
                value={formData.country}
                editable={false}
                />
            </View>
            </View>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitText}>Save Address</Text>
          )}
        </TouchableOpacity>
        
        <View style={{height: 50}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#111827",
      marginBottom: 20,
      marginTop: 10,
  },
  card: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderRadius: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    elevation: 8,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 4}
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
