import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/spalsh image.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay for better text visibility */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(47,79,47,0.5)"]}
          style={styles.gradient}
        />

        {/* Animated Logo/Brand Area */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.brandName}>Mriigg</Text>
        </Animated.View>

        {/* Bottom Content Area */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <View style={styles.contentWrapper}>
              {/* Tagline with decorative elements */}
              <View style={styles.taglineContainer}>
                <View style={styles.decorativeLine} />
                <Text style={styles.tagline}>Pure. Natural. Nourishing.</Text>
                <View style={styles.decorativeLine} />
              </View>

              {/* Subtitle */}
              <Text style={styles.subtitle}>
                Discover the power of natural skincare
              </Text>

              {/* Start Button */}
              <TouchableOpacity
                style={styles.btn}
                onPress={() => router.replace("/(auth)/sign-in")}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#B8894F", "#A67842", "#8B6839"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.btnText}>Start Your Journey</Text>
                  <Text style={styles.btnArrow}>→</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Feature Pills */}
              <View style={styles.featureContainer}>
                <View style={styles.featurePill}>
                  <Text style={styles.featureText}>🌱 100% Natural</Text>
                </View>
                <View style={styles.featurePill}>
                  <Text style={styles.featureText}>✨ Premium Quality</Text>
                </View>
                <View style={styles.featurePill}>
                  <Text style={styles.featureText}>💧 Deep Hydration</Text>
                </View>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F4F2F",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  logoContainer: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    alignItems: "center",
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 240, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#2F4F2F",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    borderWidth: 3,
    borderColor: "rgba(166, 120, 66, 0.3)",
  },
  logoEmoji: {
    fontSize: 40,
  },
  brandName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFF0",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurContainer: {
    overflow: "hidden",
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    backgroundColor: "rgba(255, 255, 240, 0.75)",
  },
  contentWrapper: {
    padding: 30,
    paddingTop: 35,
    paddingBottom: 45,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  decorativeLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#A67842",
    marginHorizontal: 15,
    opacity: 0.3,
  },
  tagline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2F4F2F",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: "#2F4F2F",
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.75,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  btn: {
    marginBottom: 25,
    borderRadius: 35,
    shadowColor: "#A67842",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginRight: 8,
  },
  btnArrow: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  featurePill: {
    backgroundColor: "rgba(47, 79, 47, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(47, 79, 47, 0.2)",
  },
  featureText: {
    fontSize: 13,
    color: "#2F4F2F",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
