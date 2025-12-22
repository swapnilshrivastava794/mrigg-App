import { COLORS } from "@/src/constants/colors";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { signup } from "../server";

const { width } = Dimensions.get("window");

export default function SignUp() {
  // Basic fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Additional fields
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);

  // Focus states
  const [focusedField, setFocusedField] = useState("");

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep === 1 ? 0.33 : currentStep === 2 ? 0.66 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  async function pickImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "prefer_not_to_say" },
  ];

  const countries = [
    { label: "India", value: "india" },
    { label: "United States", value: "usa" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "canada" },
    { label: "Australia", value: "australia" },
  ];

  const states = [
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Punjab", value: "punjab" },
    { label: "Delhi", value: "delhi" },
    { label: "Karnataka", value: "karnataka" },
  ];

  const cities = [
    { label: "Mumbai", value: "mumbai" },
    { label: "Pune", value: "pune" },
    { label: "Ludhiana", value: "ludhiana" },
    { label: "Kharar", value: "kharar" },
  ];

  const validateStep1 = () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your full name");
      return false;
    }
    if (!username.trim()) {
      Alert.alert("Required", "Please enter a username");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return false;
    }
    if (!mobile.trim()) {
      Alert.alert("Required", "Please enter your mobile number");
      return false;
    }
    if (mobile.length < 10) {
      Alert.alert("Invalid", "Please enter a valid mobile number");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Required", "Please enter a password");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async () => {
    try {
      if (!name || !email || !username || !mobile || !password) {
        return Alert.alert("Missing Fields", "Fill all required fields");
      }

      const formData = new FormData();
      const [first, ...last] = name.split(" ");

      formData.append("email", email.trim().toLowerCase());
      formData.append("username", username.trim());
      formData.append("password", password.trim());
      formData.append("mobile", mobile.trim());
      formData.append("first_name", first);
      formData.append("last_name", last.join(" "));
      formData.append("gender", gender);
      formData.append("date_of_birth", dob);
      formData.append("address_line1", address1);
      formData.append("address_line2", address2);
      formData.append("city", city);
      formData.append("state", stateName);
      formData.append("zip_code", zip);
      formData.append("country", country);

      if (image) {
        formData.append("profile_image", {
          uri: image.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      setLoading(true);
      await signup(formData);
      Alert.alert("Success", "Account created successfully! Please sign in.");
      router.replace("/(auth)/sign-in");
    } catch (err) {
      Alert.alert(
        "Signup Failed",
        err?.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary, COLORS.softPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Text style={styles.leafIcon}>🌿</Text>
                <Animated.View
                  style={[styles.sparkleContainer, { opacity: sparkleOpacity }]}
                >
                  <Sparkles
                    size={14}
                    color={COLORS.softPurple}
                    strokeWidth={2}
                  />
                </Animated.View>
              </View>
              <Text style={styles.title}>Join Mriigg</Text>
              <Text style={styles.subtitle}>
                Start your natural skincare journey
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[styles.progressFill, { width: progressWidth }]}
                />
              </View>
              <Text style={styles.progressText}>Step {currentStep} of 3</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {currentStep === 1 && (
                <>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  <EnhancedInput
                    icon={<User size={20} color={COLORS.softPurple} />}
                    placeholder="Full Name"
                    value={name}
                    onChange={setName}
                    focused={focusedField === "name"}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                  />
                  <EnhancedInput
                    icon={<User size={20} color={COLORS.softPurple} />}
                    placeholder="Username"
                    value={username}
                    onChange={setUsername}
                    focused={focusedField === "username"}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField("")}
                    autoCapitalize="none"
                  />
                  <EnhancedInput
                    icon={<Mail size={20} color={COLORS.softPurple} />}
                    placeholder="Email Address"
                    value={email}
                    onChange={setEmail}
                    focused={focusedField === "email"}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    keyboard="email-address"
                    autoCapitalize="none"
                  />
                  <EnhancedInput
                    icon={<Phone size={20} color={COLORS.softPurple} />}
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={setMobile}
                    focused={focusedField === "mobile"}
                    onFocus={() => setFocusedField("mobile")}
                    onBlur={() => setFocusedField("")}
                    keyboard="phone-pad"
                  />
                  <View
                    style={[
                      styles.inputGroup,
                      focusedField === "password" && styles.inputGroupFocused,
                    ]}
                  >
                    <Lock
                      size={20}
                      color={COLORS.softPurple}
                      strokeWidth={2.5}
                    />
                    <TextInput
                      placeholder="Password (min 8 characters)"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={COLORS.softPurple} />
                      ) : (
                        <Eye size={20} color={COLORS.softPurple} />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <Text style={styles.sectionTitle}>Personal Details</Text>

                  {/* Date of Birth */}
                  <TouchableOpacity
                    style={styles.inputGroup}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Calendar size={20} color={COLORS.softPurple} />
                    <Text
                      style={[
                        styles.input,
                        !dob && { color: "rgba(255,255,255,0.5)" },
                      ]}
                    >
                      {dob || "Date of Birth"}
                    </Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                      const formatted = date.toISOString().split("T")[0];
                      setDob(formatted);
                      setShowDatePicker(false);
                    }}
                    onCancel={() => setShowDatePicker(false)}
                  />

                  {/* Gender Dropdown */}
                  <View style={styles.dropdownWrapper}>
                    <User
                      size={20}
                      color={COLORS.softPurple}
                      style={styles.dropdownIcon}
                    />
                    <Dropdown
                      style={styles.dropdown}
                      containerStyle={styles.dropdownMenu}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      data={genderOptions}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Gender"
                      value={gender}
                      onChange={(item) => setGender(item.value)}
                      renderLeftIcon={() => null}
                    />
                  </View>

                  {/* Profile Image */}
                  <TouchableOpacity
                    style={styles.uploadContainer}
                    onPress={pickImage}
                  >
                    {image ? (
                      <View style={styles.imagePreview}>
                        <Image
                          source={{ uri: image.uri }}
                          style={styles.profileImage}
                        />
                        <View style={styles.checkmark}>
                          <Check size={16} color={COLORS.white} />
                        </View>
                        <Text style={styles.uploadText}>Photo Selected</Text>
                      </View>
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <Camera size={28} color={COLORS.softPurple} />
                        <Text style={styles.uploadText}>
                          Upload Profile Photo
                        </Text>
                        <Text style={styles.uploadSubtext}>Optional</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <Text style={styles.sectionTitle}>Address Information</Text>
                  <EnhancedInput
                    icon={<MapPin size={20} color={COLORS.softPurple} />}
                    placeholder="Address Line 1"
                    value={address1}
                    onChange={setAddress1}
                    focused={focusedField === "address1"}
                    onFocus={() => setFocusedField("address1")}
                    onBlur={() => setFocusedField("")}
                  />
                  <EnhancedInput
                    icon={<MapPin size={20} color={COLORS.softPurple} />}
                    placeholder="Address Line 2 (Optional)"
                    value={address2}
                    onChange={setAddress2}
                    focused={focusedField === "address2"}
                    onFocus={() => setFocusedField("address2")}
                    onBlur={() => setFocusedField("")}
                  />

                  {/* Country */}
                  <View style={styles.dropdownWrapper}>
                    <MapPin
                      size={20}
                      color={COLORS.softPurple}
                      style={styles.dropdownIcon}
                    />
                    <Dropdown
                      style={styles.dropdown}
                      containerStyle={styles.dropdownMenu}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      data={countries}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Country"
                      value={country}
                      onChange={(item) => setCountry(item.value)}
                      renderLeftIcon={() => null}
                    />
                  </View>

                  {/* State */}
                  <View style={styles.dropdownWrapper}>
                    <MapPin
                      size={20}
                      color={COLORS.softPurple}
                      style={styles.dropdownIcon}
                    />
                    <Dropdown
                      style={styles.dropdown}
                      containerStyle={styles.dropdownMenu}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      data={states}
                      labelField="label"
                      valueField="value"
                      placeholder="Select State"
                      value={stateName}
                      onChange={(item) => setStateName(item.value)}
                      renderLeftIcon={() => null}
                    />
                  </View>

                  {/* City */}
                  <View style={styles.dropdownWrapper}>
                    <MapPin
                      size={20}
                      color={COLORS.softPurple}
                      style={styles.dropdownIcon}
                    />
                    <Dropdown
                      style={styles.dropdown}
                      containerStyle={styles.dropdownMenu}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      data={cities}
                      labelField="label"
                      valueField="value"
                      placeholder="Select City"
                      value={city}
                      onChange={(item) => setCity(item.value)}
                      renderLeftIcon={() => null}
                    />
                  </View>

                  <EnhancedInput
                    placeholder="Zip Code"
                    value={zip}
                    onChange={setZip}
                    focused={focusedField === "zip"}
                    onFocus={() => setFocusedField("zip")}
                    onBlur={() => setFocusedField("")}
                    keyboard="numeric"
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={handleBack}
                    disabled={loading}
                  >
                    <Text style={styles.backBtnText}>Back</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.btn,
                    currentStep > 1 && { flex: 1 },
                    loading && styles.btnDisabled,
                  ]}
                  onPress={currentStep === 3 ? handleSignup : handleNext}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={
                      loading
                        ? ["rgba(200,179,248,0.6)", "rgba(147,112,219,0.6)"]
                        : [COLORS.softPurple, COLORS.primary]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>
                      {loading
                        ? "Creating Account..."
                        : currentStep === 3
                        ? "Create Account"
                        : "Continue"}
                    </Text>
                    {!loading && (
                      <ArrowRight size={22} color="#FFF" strokeWidth={2.5} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <Text style={styles.secureText}>
                🔒 Your information is encrypted and secure
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-in")}
                disabled={loading}
              >
                <Text style={styles.link}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

function EnhancedInput({
  icon,
  placeholder,
  value,
  onChange,
  secure,
  keyboard,
  focused,
  onFocus,
  onBlur,
  autoCapitalize = "words",
}) {
  return (
    <View style={[styles.inputGroup, focused && styles.inputGroupFocused]}>
      {icon}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.5)"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboard}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(200,179,248,0.1)",
    top: -100,
    right: -100,
    opacity: 0.5,
  },

  decorativeCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -50,
    left: -50,
    opacity: 0.5,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width < 375 ? 24 : 32,
    paddingVertical: 40,
  },

  content: { width: "100%", maxWidth: 440, alignSelf: "center" },

  header: { alignItems: "center", marginBottom: 32 },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(200,179,248,0.5)",
    shadowColor: COLORS.softPurple,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  leafIcon: { fontSize: 36, color: COLORS.white },

  sparkleContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },

  title: {
    fontSize: width < 375 ? 34 : 40,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: width < 375 ? 14 : 15,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: "center",
  },

  progressContainer: {
    marginBottom: 32,
    alignItems: "center",
  },

  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.softPurple,
    borderRadius: 3,
  },

  progressText: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.7,
    fontWeight: "600",
  },

  formContainer: { marginBottom: 24 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 20,
    opacity: 0.95,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(200,179,248,0.3)",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  inputGroupFocused: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(200,179,248,0.7)",
  },

  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },

  dropdownWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    paddingLeft: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(200,179,248,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  dropdownIcon: {
    marginRight: 14,
  },

  dropdown: {
    flex: 1,
    height: 56,
    paddingRight: 20,
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  dropdownMenu: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderColor: COLORS.softPurple,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  placeholderStyle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
    fontWeight: "500",
  },

  selectedTextStyle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },

  itemTextStyle: {
    color: COLORS.white,
    fontSize: 15,
  },

  uploadContainer: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(200,179,248,0.3)",
    borderStyle: "dashed",
    alignItems: "center",
  },

  uploadPlaceholder: {
    alignItems: "center",
    gap: 8,
  },

  imagePreview: {
    alignItems: "center",
    gap: 12,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.softPurple,
  },

  checkmark: {
    position: "absolute",
    top: 0,
    right: "38%",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },

  uploadSubtext: {
    color: COLORS.white,
    opacity: 0.6,
    fontSize: 13,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: "rgba(200,179,248,0.4)",
  },

  backBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  btn: {
    flex: 1,
    borderRadius: 18,
    shadowColor: COLORS.softPurple,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  btnDisabled: {
    opacity: 0.7,
  },

  btnGradient: {
    flexDirection: "row",
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  btnText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  secureText: {
    fontSize: 13,
    color: COLORS.white,
    opacity: 0.6,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },

  footerText: {
    fontSize: 15,
    color: COLORS.white,
    opacity: 0.75,
  },

  link: {
    fontSize: 15,
    color: COLORS.softPurple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
