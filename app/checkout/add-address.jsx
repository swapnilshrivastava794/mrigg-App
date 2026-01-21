import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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

  // Refs for seamless keyboard navigation
  const phoneRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);

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

  const renderInput = ({ label, icon, placeholder, value, onChange, ref, nextRef, keyboardType = "default", maxLength, editable = true }) => (
    <View style={styles.formGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputContainer, !editable && styles.disabledInput]}>
            <Ionicons name={icon} size={20} color={COLORS.grey} style={styles.inputIcon} />
            <TextInput
                ref={ref}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
                maxLength={maxLength}
                editable={editable}
                returnKeyType={nextRef ? "next" : "done"}
                onSubmitEditing={() => nextRef?.current?.focus()}
                blurOnSubmit={!nextRef}
            />
        </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Header */}
        
        
        <View style={styles.card}>
            {renderInput({
                label: "Full Name*",
                icon: "person-outline",
                placeholder: "Ex: John Doe",
                value: formData.full_name,
                onChange: (t) => handleChange("full_name", t),
                nextRef: phoneRef
            })}

            {renderInput({
                label: "Phone Number*",
                icon: "call-outline",
                placeholder: "Ex: 9876543210",
                value: formData.phone,
                onChange: (t) => handleChange("phone", t),
                ref: phoneRef,
                nextRef: address1Ref,
                keyboardType: "phone-pad",
                maxLength: 10
            })}

            {renderInput({
                label: "Address Line 1*",
                icon: "location-outline",
                placeholder: "House No, Building, Street",
                value: formData.address_line1,
                onChange: (t) => handleChange("address_line1", t),
                ref: address1Ref,
                nextRef: address2Ref
            })}

            {renderInput({
                label: "Address Line 2",
                icon: "map-outline",
                placeholder: "Landmark, Area (Optional)",
                value: formData.address_line2,
                onChange: (t) => handleChange("address_line2", t),
                ref: address2Ref,
                nextRef: cityRef
            })}

            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    {renderInput({
                        label: "City*",
                        icon: "business-outline",
                        placeholder: "City",
                        value: formData.city,
                        onChange: (t) => handleChange("city", t),
                        ref: cityRef,
                        nextRef: stateRef
                    })}
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    {renderInput({
                        label: "State*",
                        icon: "map-sharp",
                        placeholder: "State",
                        value: formData.state,
                        onChange: (t) => handleChange("state", t),
                        ref: stateRef,
                        nextRef: zipRef
                    })}
                </View>
            </View>

            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    {renderInput({
                        label: "Zip Code*",
                        icon: "pin-outline",
                        placeholder: "000000",
                        value: formData.zip_code,
                        onChange: (t) => handleChange("zip_code", t),
                        ref: zipRef,
                        keyboardType: "numeric"
                    })}
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                     {renderInput({
                        label: "Country",
                        icon: "globe-outline",
                        placeholder: "India",
                        value: formData.country,
                        editable: false
                    })}
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
        
        <View style={{height: 100}} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
    gap: 12,
  },
  backBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#111827",
  },
  card: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderRadius: 24,
      // Soft modern shadow
      shadowColor: "#6233B5",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  disabledInput: {
      backgroundColor: "#E5E7EB",
      opacity: 0.7,
  },
  inputIcon: {
      marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    fontWeight: '500',
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
    marginBottom: 20,
    // Glow effect
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 16,
    elevation: 8,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
