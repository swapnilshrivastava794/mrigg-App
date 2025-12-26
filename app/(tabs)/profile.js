import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { user, loading, logout } = useAuth(); // ✅ Use Context

  if (loading) return null; // Or a loading spinner

  if (!user) {
      return <Redirect href="/(auth)/sign-in" />;
  }

  const handleLogout = async () => {
      await logout();
      router.replace("/(auth)/sign-in");
  }

  const QuickAction = ({ icon, label, onPress, color }) => (
      <TouchableOpacity style={styles.quickAction} onPress={onPress}>
          <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
             <Ionicons name={icon} size={22} color={COLORS.white} />
          </View>
          <Text style={styles.quickActionLabel}>{label}</Text>
      </TouchableOpacity>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header Profile Section */}
          <View style={styles.header}>
              <View style={styles.profileRow}>
                  <Image
                    source={{
                        uri: user?.profile_image 
                             ? (user.profile_image.startsWith('http') ? user.profile_image : constant.appBaseUrl + user.profile_image)
                             : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                      <Text style={styles.welcomeText}>Hello,</Text>
                      <Text style={styles.userName}>{user?.first_name || "User"} {user?.last_name || ""}</Text>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={() => router.push("/edit-profile")}>
                      <Ionicons name="pencil" size={18} color={COLORS.primaryDark} />
                  </TouchableOpacity>
              </View>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsContainer}>
              <QuickAction icon="cube-outline" label="Orders" color="#4A90E2" onPress={() => router.push("/(tabs)/orders")} />
              <QuickAction icon="heart-outline" label="Cart" color="#E91E63" onPress={() => router.push("/(tabs)/cart")} />
              <QuickAction icon="gift-outline" label="Coupons" color="#F5A623" onPress={() => {}} />
              <QuickAction icon="headset-outline" label="Help" color="#7ED321" onPress={() => {}} />
          </View>

          {/* Settings List */}
          <View style={styles.section}>
              <Text style={styles.sectionHeader}>Account Settings</Text>
              
              <View style={styles.menuCard}>
                  <MenuItem icon="person-outline" title="Edit Profile" onPress={() => router.push("/edit-profile")} />
                  <MenuItem icon="map-outline" title="Saved Addresses" onPress={() => router.push("/address/list")} />
                  <MenuItem icon="language-outline" title="Select Language" onPress={() => router.push("/language/select")} />
                  <MenuItem icon="notifications-outline" title="Notification Settings" lastItem onPress={() => {}} />
              </View>
          </View>

           <View style={styles.section}>
              <Text style={styles.sectionHeader}>My Activity</Text>
              <View style={styles.menuCard}>
                  <MenuItem icon="star-outline" title="Reviews" onPress={() => {}} />
                  <MenuItem icon="help-circle-outline" title="Questions & Answers" lastItem onPress={() => {}} />
              </View>
          </View>

          <View style={styles.section}>
               <Text style={styles.sectionHeader}>Feedback & Information</Text>
               <View style={styles.menuCard}>
                   <MenuItem icon="document-text-outline" title="Terms, Policies and Licenses" onPress={() => {}} />
                   <MenuItem icon="help-circle-outline" title="Browse FAQs" lastItem onPress={() => {}} />
               </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
      </ScrollView>
    </Screen>
  );
}

function MenuItem({ icon, title, onPress, lastItem }) {
    return (
        <TouchableOpacity 
            style={[styles.menuItem, lastItem && styles.menuItemLast]} 
            onPress={onPress}
        >
            <View style={styles.menuLeft}>
                <Ionicons name={icon} size={22} color={COLORS.primaryDark} />
                <Text style={styles.menuText}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.grey} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F3F6',
  },
  header: {
      backgroundColor: COLORS.white,
      padding: 20,
      paddingTop: 10,
  },
  profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#f0f0f0',
  },
  userInfo: {
      flex: 1,
      marginLeft: 16,
  },
  welcomeText: {
      fontSize: 14,
      color: COLORS.grey,
  },
  userName: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.textDark,
  },
  editButton: {
      backgroundColor: '#F5F5F5',
      padding: 8,
      borderRadius: 20,
  },
  
  /** Quick Actions */
  quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: COLORS.white,
      paddingHorizontal: 20,
      paddingVertical: 16,
      marginTop: 2,
      marginBottom: 10,
      elevation: 1,
  },
  quickAction: {
      alignItems: 'center',
      gap: 6,
  },
  quickActionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
  },
  quickActionLabel: {
      fontSize: 12,
      color: COLORS.textDark,
      fontWeight: '500',
  },

  /** Sections */
  section: {
      paddingHorizontal: 16,
      marginBottom: 20,
  },
  sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.grey,
      marginBottom: 10,
      textTransform: 'uppercase',
  },
  menuCard: {
      backgroundColor: COLORS.white,
      borderRadius: 8,
      elevation: 1,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 2,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
  },
  menuItemLast: {
      borderBottomWidth: 0,
  },
  menuLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
  },
  menuText: {
      fontSize: 15,
      color: COLORS.textDark,
      fontWeight: '500',
  },

  /** Logout */
  logoutButton: {
      marginHorizontal: 16,
      backgroundColor: COLORS.white,
      paddingVertical: 14,
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      marginBottom: 20,
  },
  logoutText: {
      color: '#FF3B30',
      fontSize: 16,
      fontWeight: '600',
  }
});
