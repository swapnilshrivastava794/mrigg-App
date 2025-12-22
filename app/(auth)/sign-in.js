import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { login } from "../server";

const { width } = Dimensions.get("window");

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

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

    // Continuous sparkle animation
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

    // Gentle icon rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim()) {
      return alert("Please enter your email address");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return alert("Please enter a valid email address");
    }

    if (!password.trim()) {
      return alert("Please enter your password");
    }

    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      const res = await login(payload);

      const access = res?.data?.access;
      const refresh = res?.data?.refresh;
      const user = res?.data?.user;

      if (!access) {
        setLoading(false);
        return alert("Invalid email or password. Please try again.");
      }

      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (setUser) setUser(user);

      router.replace("/(tabs)");
    } catch (error) {
      console.log("LOGIN ERROR 👉", JSON.stringify(error, null, 2));
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.softPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Decorative background elements */}
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
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace("/"); // ya /(auth)/welcome
                  }
                }}
              >
                <Ionicons name="arrow-back" size={22} color={COLORS.white} />
              </TouchableOpacity>
              <View style={styles.header}>
                <Animated.View
                  style={[styles.iconCircle, { transform: [{ rotate: spin }] }]}
                >
                  <Text style={styles.leafIcon}>🌿</Text>
                  <Animated.View
                    style={[
                      styles.sparkleContainer,
                      { opacity: sparkleOpacity },
                    ]}
                  >
                    <Sparkles
                      size={16}
                      color={COLORS.softPurple}
                      strokeWidth={2}
                    />
                  </Animated.View>
                </Animated.View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>
                  Sign in to continue your wellness journey
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View
                  style={[
                    styles.inputGroup,
                    emailFocused && styles.inputGroupFocused,
                  ]}
                >
                  <Mail
                    size={20}
                    color={emailFocused ? COLORS.white : COLORS.softPurple}
                    strokeWidth={2.5}
                  />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor="rgba(242, 242, 242, 0.5)"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    editable={!loading}
                  />
                </View>

                <View
                  style={[
                    styles.inputGroup,
                    passwordFocused && styles.inputGroupFocused,
                  ]}
                >
                  <Lock
                    size={20}
                    color={passwordFocused ? COLORS.white : COLORS.softPurple}
                    strokeWidth={2.5}
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff
                        size={20}
                        color={COLORS.softPurple}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <Eye
                        size={20}
                        color={COLORS.softPurple}
                        strokeWidth={2.5}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotContainer}
                  disabled={loading}
                >
                  <Text style={styles.forgotText}>Forgot your password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  activeOpacity={0.85}
                  onPress={handleLogin}
                  disabled={loading}
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
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                    {!loading && (
                      <ArrowRight size={22} color="#FFFFFF" strokeWidth={2.5} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Additional info for international users */}
                <Text style={styles.secureText}>
                  🔒 Your data is encrypted and secure
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/sign-up")}
                  disabled={loading}
                >
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
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
    justifyContent: "center",
    paddingHorizontal: width < 375 ? 24 : 32,
    paddingVertical: 50,
  },

  content: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  header: { alignItems: "center", marginBottom: 52 },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
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
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  subtitle: {
    fontSize: width < 375 ? 15 : 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  formContainer: { marginBottom: 32 },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 18,
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
    backgroundColor: "rgba(255,255,255,0.30)",
    borderColor: "rgba(200,179,248,0.7)",
    borderWidth: 2,
  },

  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 32,
    marginTop: -6,
  },

  forgotText: {
    fontSize: 14,
    color: COLORS.softPurple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  btn: {
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
    paddingVertical: 22,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  btnText: {
    color: COLORS.white,
    fontSize: 18,
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
    marginTop: 12,
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

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start", // keeps it left aligned
    borderWidth: 1,
    borderColor: "rgba(200,179,248,0.3)",
  },
});
