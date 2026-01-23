import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { login, saveToken } from "../server";

const { width, height } = Dimensions.get("window");

export default function SignIn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { returnUrl } = useLocalSearchParams();
  const { setUser } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim()) {
      return alert("Please enter your email address");
    }

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

      await saveToken(access, refresh);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      if (setUser) setUser(user);

      if (returnUrl) {
        router.replace(returnUrl);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("LOGIN ERROR 👉", JSON.stringify(error, null, 2));
      
      let msg = "Login failed. Please check your credentials.";
      if (error?.response?.data?.detail) {
          msg = error.response.data.detail;
      } else if (error?.response?.data?.message) {
          msg = error.response.data.message;
      } else if (error?.detail) {
          msg = error.detail;
      } else if (typeof error === 'string') {
          msg = error;
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
        {/* Header with Back, Logo, Skip */}
        <View style={[styles.header, { marginTop: insets.top }]}>
            <TouchableOpacity 
                style={styles.iconBtn}
                onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.replace("/");
                }}
            >
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Image 
            source={require('../../assets/header_logo.png')} 
            style={{ width:140, height: 80, resizeMode: 'contain' }}
        />

            <TouchableOpacity 
                style={styles.skipBtn}
                onPress={() => router.replace("/(tabs)")}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        >
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.card}>
            <View style={styles.titleBlock}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter your details to sign in</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.input}
                            placeholder="user@example.com"
                            placeholderTextColor="#ccc"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={{ marginRight: 10 }} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••"
                            placeholderTextColor="#ccc"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="#999" 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.btnText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light grey background for premium feel
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  iconBtn: {
      padding: 8,
  },
  logoText: {
      fontSize: 26,
      fontWeight: '900',
      color: '#D4AF37',
      fontStyle: 'italic',
      letterSpacing: 1,
  },
  skipBtn: {
      padding: 8,
      backgroundColor: '#EFEFEF',
      borderRadius: 20,
      paddingHorizontal: 16,
  },
  skipText: {
      fontSize: 12,
      color: '#333',
      fontWeight: '700',
  },
  
  scrollContent: {
      flexGrow: 1,
      justifyContent: 'center', // VERTICALLY CENTER
      padding: 20,
      paddingBottom: 40,
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      elevation: 5, // Android Shadow
      shadowColor: "#000", // iOS Shadow
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
  },

  titleBlock: {
      alignItems: 'center',
      marginBottom: 30,
  },
  title: {
      fontSize: 24,
      fontWeight: '800',
      color: '#1a1a1a',
      marginBottom: 6,
  },
  subtitle: {
      fontSize: 14,
      color: '#888',
  },

  form: {
      gap: 16,
  },
  inputGroup: {
      gap: 8,
  },
  label: {
      fontSize: 13,
      fontWeight: '600',
      color: '#333',
      marginLeft: 4,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 52,
      backgroundColor: '#FAFAFA',
  },
  input: {
      flex: 1,
      fontSize: 15,
      color: '#333',
      height: '100%',
  },
  eyeIcon: {
      padding: 4,
  },

  forgotBtn: {
      alignSelf: 'flex-end',
  },
  forgotText: {
      fontSize: 13,
      color: COLORS.primaryDark,
      fontWeight: '600',
  },

  btn: {
      backgroundColor: COLORS.primaryDark,
      height: 54,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      elevation: 3,
      shadowColor: COLORS.primaryDark,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
  },
  btnText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
  },

  divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
      gap: 12,
      opacity: 0.6,
  },
  line: {
      flex: 1,
      height: 1,
      backgroundColor: '#ccc',
  },
  orText: {
      fontSize: 12,
      color: '#888',
      fontWeight: '600',
  },

  footerRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  footerText: {
      fontSize: 14,
      color: '#666',
  },
  linkText: {
      fontSize: 14,
      color: COLORS.primaryDark,
      fontWeight: '700',
  },
});
