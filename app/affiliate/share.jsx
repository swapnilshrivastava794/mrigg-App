import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SharePage() {
  const router = useRouter();
  const affiliateLink = "https://mriigg.com/ref/swapnil123"; // Mock referral link
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Mriigg! Use my referral link to get discounts: ${affiliateLink}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTitle: "Share & Earn",
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.white },
          headerTintColor: COLORS.textDark,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="share-social" size={60} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Invite Friends & Earn</Text>
        <Text style={styles.subtitle}>
          Share your exclusive referral link. You earn ₹50 for every friend who signs up and orders!
        </Text>

        {/* Link Box */}
        <View style={styles.linkContainer}>
          <TextInput
            style={styles.linkInput}
            value={affiliateLink}
            editable={false}
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
           <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
           <Text style={styles.shareBtnText}>Share on WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
        >
            <Text style={styles.backBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lilac,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.grey,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  linkContainer: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 20,
  },
  linkInput: {
    fontSize: 16,
    color: COLORS.textDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  shareBtn: {
    width: "100%",
    backgroundColor: "#25D366", // WhatsApp Green
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    marginBottom: 16,
  },
  shareBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  backBtn: {
    paddingVertical: 12,
  },
  backBtnText: {
    color: COLORS.grey,
    fontSize: 16,
    fontWeight: "600",
  }
});
