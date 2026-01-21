import Screen from "@/components/Screen";
import constant from "@/constants/constant";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "./contexts/AuthContext";
import { deleteUser, updateProfile } from "./server";


export default function EditProfile() {
  const router = useRouter();
  const { user, updateUser } = useAuth(); // Global State
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      city: "",
      state: "",
      zip_code: ""
  });
  const [image, setImage] = useState(null); // Local image pick state

  // Prefill data from Context
  useEffect(() => {
      if (user) {
          setFormData({
              first_name: user.first_name || "",
              last_name: user.last_name || "",
              email: user.email || "",
              mobile: user.mobile || "",
              city: user.city || "",
              state: user.state || "",
              zip_code: user.zip_code || ""
          });
      }
  }, [user]);

  const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
      setLoading(true);
      try {
        const data = new FormData();
        
        // Append fields
        data.append("first_name", formData.first_name);
        data.append("last_name", formData.last_name);
        data.append("city", formData.city);
        data.append("state", formData.state);
        data.append("zip_code", formData.zip_code);
        
        // Only append image if changed
        if (image) {
            data.append("profile_image", {
                uri: image.uri,
                name: "profile.jpg",
                type: "image/jpeg"
            });
        }

        // Call API
        const updatedUser = await updateProfile(data);

        // Update Context (Global State)
        await updateUser(updatedUser);

        Alert.alert("Success", "Profile updated successfully!");
        router.back();

      } catch (error) {
          console.log("Update Error", error);
          Alert.alert("Error", "Failed to update profile. " + (error?.message || ""));
      } finally {
          setLoading(false);
      }
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} /> 
      </View>

      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                    <Image 
                        source={{ 
                            uri: image ? image.uri : (user?.profile_image 
                                ? (user.profile_image.startsWith('http') ? user.profile_image : constant.appBaseUrl + user.profile_image)
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png") 
                        }} 
                        style={styles.avatar} 
                    />
                    <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                        <Ionicons name="camera" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </View>

            {/* Form Sections */}
            <View style={styles.formContainer}>
                <Text style={styles.sectionHeader}>Personal Details</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.first_name}
                        onChangeText={(t) => handleChange('first_name', t)}
                        placeholder="Enter first name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.last_name}
                        onChangeText={(t) => handleChange('last_name', t)}
                        placeholder="Enter last name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={[styles.input, styles.disabledInput]} 
                        value={formData.email}
                        editable={false}
                    />
                    <Text style={styles.helperText}>Email cannot be changed</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput 
                        style={[styles.input, styles.disabledInput]} 
                        value={formData.mobile}
                        editable={false}
                    />
                    <Text style={styles.helperText}>Mobile cannot be changed</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionHeader}>Location</Text>
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>City</Text>
                        <TextInput 
                            style={styles.input} 
                            value={formData.city}
                            onChangeText={(t) => handleChange('city', t)}
                            placeholder="City"
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>State</Text>
                        <TextInput 
                            style={styles.input} 
                            value={formData.state}
                            onChangeText={(t) => handleChange('state', t)}
                            placeholder="State"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pincode</Text>
                    <TextInput 
                        style={styles.input} 
                        value={formData.zip_code}
                        onChangeText={(t) => handleChange('zip_code', t)}
                        keyboardType="numeric"
                        placeholder="Enter pincode"
                    />
                </View>
            </View>


            <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSave}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.white} />
                ) : (
                    <Text style={styles.saveText}>Save Changes</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.saveBtn, { backgroundColor: '#FF3B30', marginTop: 16 }]} 
                onPress={() => {
                    Alert.alert(
                        "Delete Account",
                        "Are you sure you want to delete your account? This action cannot be undone.",
                        [
                            { text: "Cancel", style: "cancel" },
                            { 
                                text: "Delete", 
                                style: "destructive", 
                                onPress: async () => {
                                    try {
                                        console.log("Attempting to delete user:", user);
                                        const userId = user?.user_id || user?.id || user?.pk;
                                        
                                        if (!userId) {
                                            Alert.alert("Error", "Could not find User ID. Please restart the app and try again.");
                                            return;
                                        }

                                        setLoading(true);
                                        console.log("Calling deleteUser API with ID:", userId);
                                        await deleteUser(userId);
                                        
                                        await updateUser(null); // Clear context
                                        Alert.alert("Account Deleted", "Your account has been permanently deleted.");
                                        router.replace("/(auth)/sign-in");
                                    } catch (err) {
                                        console.log("Delete Account Error:", err);
                                        Alert.alert("Error", "Failed to delete account. " + (err?.message || "Please try again later."));
                                        setLoading(false);
                                    }
                                }
                            }
                        ]
                    );
                }}
            >
                <Text style={styles.saveText}>Delete Account</Text>
            </TouchableOpacity>

            <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  
  /** Avatar */
  avatarContainer: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 24,
  },
  avatarWrapper: {
      position: 'relative',
  },
  avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: COLORS.white,
  },
  cameraBtn: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: COLORS.primaryDark,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS.white,
  },
  changePhotoText: {
      marginTop: 12,
      color: COLORS.primaryDark,
      fontSize: 14,
      fontWeight: '600',
  },

  /** Form */
  formContainer: {
      backgroundColor: COLORS.white,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 20,
      elevation: 1,
  },
  sectionHeader: {
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textDark,
      marginBottom: 16,
  },
  inputGroup: {
      marginBottom: 16,
  },
  row: {
      flexDirection: 'row',
  },
  label: {
      fontSize: 13,
      fontWeight: '500',
      color: COLORS.grey,
      marginBottom: 6,
  },
  input: {
      backgroundColor: '#F9F9F9',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: COLORS.textDark,
      fontSize: 15,
  },
  disabledInput: {
      backgroundColor: '#F0F0F0',
      color: '#999',
  },
  helperText: {
      fontSize: 11,
      color: COLORS.grey,
      marginTop: 4,
      fontStyle: 'italic',
  },
  divider: {
      height: 1,
      backgroundColor: '#F0F0F0',
      marginVertical: 20,
  },

  /** Button */
  saveBtn: {
    backgroundColor: COLORS.primaryDark,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 4, width: 0 }
  },
  saveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
