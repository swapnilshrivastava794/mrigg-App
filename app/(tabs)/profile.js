import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState(null); // 👈 STORE USER HERE

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = await AsyncStorage.getItem("accessToken");
    const savedUser = await AsyncStorage.getItem("user");

    setLoggedIn(!!token);

    if (savedUser) {
      setUser(JSON.parse(savedUser)); // 👈 SET USER FROM STORAGE
    }

    setLoading(false);
  }

  // ⏳ While checking token
  if (isLoading) return null;

  // ❌ If not logged in → redirect
  if (!isLoggedIn || !user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // 🧹 Logout function
  async function handleLogout() {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");

    router.replace("/(auth)/sign-in");
  }

  return (
    <Screen>
      {/* Header card */}
      <View style={styles.headerCard}>
        <Image
          source={{
            uri:
              user?.profile_image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userPhone}>{user?.mobile}</Text>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/edit-profile")}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={COLORS.primaryDark}
          />
        </TouchableOpacity>
      </View>

      {/* MENU LIST */}
      <View style={styles.menuSection}>
        <SectionTitle text="My Activity" />

        <MenuItem
          icon="cart-outline"
          title="My Orders"
          onPress={() => router.push("/(tabs)/orders")}
        />

        <MenuItem
          icon="heart-outline"
          title="Wishlist"
          onPress={() => router.push("/(tabs)/wishlist")}
        />

        <MenuItem
          icon="gift-outline"
          title="My Earnings"
          onPress={() => router.push("/affiliate")}
        />

        <SectionTitle text="Settings" />

        <MenuItem
          icon="account-edit-outline"
          title="Edit Profile"
          onPress={() => router.push("/edit-profile")}
        />

        <MenuItem
          icon="lock-outline"
          title="Change Password"
          onPress={() => router.push("/change-password")}
        />

        {/* 🔥 Logout Button */}
        <MenuItem icon="logout" title="Logout" logout onPress={handleLogout} />
      </View>

      <View style={{ height: 100 }} />
    </Screen>
  );
}

/* SECTION TITLE */
function SectionTitle({ text }) {
  return <Text style={styles.sectionTitle}>{text}</Text>;
}

/* MENU ITEM */
function MenuItem({ icon, title, logout, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={logout ? "#FF3B30" : COLORS.primaryDark}
        />
        <Text
          style={[
            styles.menuText,
            logout && { color: "#FF3B30", fontWeight: "700" },
          ]}
        >
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={logout ? "#FF3B30" : COLORS.grey}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { height: 4, width: 0 },
    gap: 16,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: COLORS.lilac,
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  userEmail: {
    fontSize: 13,
    color: COLORS.grey,
    marginTop: 2,
  },

  userPhone: {
    fontSize: 13,
    color: COLORS.grey,
    marginTop: 2,
  },

  editBtn: {
    backgroundColor: COLORS.lilac,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },

  menuSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 5,
    paddingBottom: 10,
    shadowColor: COLORS.primaryDark,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primaryDark,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
    opacity: 0.75,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lilac,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
  },
});
