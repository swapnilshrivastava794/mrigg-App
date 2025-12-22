export const unstable_settings = {
  headerShown: false,
};

import Screen from "@/components/Screen";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "@/src/constants/colors"; // 💜 GLOBAL LAVENDER PALETTE

/* ---------------------- Rank Logic ---------------------- */

function getRank(orderCount) {
  if (orderCount >= 200)
    return { rank: "Platinum", color: "#A0C3FF", next: 300 };
  if (orderCount >= 100)
    return { rank: "Gold", color: "#FFD700", next: 200 };
  if (orderCount >= 50)
    return { rank: "Silver", color: "#C0C0C0", next: 100 };
  return { rank: "Bronze", color: "#cd7f32", next: 50 };
}

export default function AffiliateDashboard() {
  const totalOrders = 120;
  const rankData = getRank(totalOrders);

  const progress = (totalOrders / rankData.next) * 100;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Screen scroll={false}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Total Earnings */}
          <View style={styles.earnCard}>
            <Text style={styles.earnAmount}>₹ 12,540</Text>
            <Text style={styles.earnLabel}>Total Earnings</Text>
          </View>

          {/* Rank Section */}
          <View style={styles.rankCard}>
            <Text style={styles.rankTitle}>Your Rank</Text>

            <Text style={[styles.rankName, { color: rankData.color }]}>
              {rankData.rank}
            </Text>

            <Text style={styles.rankProgressText}>
              {totalOrders} / {rankData.next} Orders
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: rankData.color },
                ]}
              />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.row}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹ 350</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹ 1800</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>

          {/* Withdraw Button */}
          <TouchableOpacity style={styles.withdrawBtn}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
            <Text style={styles.withdrawText}>Withdraw Earnings</Text>
          </TouchableOpacity>

          {/* Share Products */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => router.push("/affiliate/share")}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={COLORS.primaryDark}
            />
            <Text style={styles.shareText}>Share Products to Earn</Text>
          </TouchableOpacity>

          {/* Recent Earnings */}
          <Text style={styles.sectionTitle}>Recent Earnings</Text>

          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.earningItem}>
              <View>
                <Text style={styles.earningTitle}>Order #{item}</Text>
                <Text style={styles.earningDate}>12 Feb 2025</Text>
              </View>

              <Text style={styles.earningAmountList}>+₹40</Text>
            </View>
          ))}
        </ScrollView>
      </Screen>
    </>
  );
}

/* ---------------------- Styles ---------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },

  /* Earnings Card */
  earnCard: {
    backgroundColor: COLORS.primaryDark,
    padding: 24,
    borderRadius: 18,
    alignItems: "center",
  },

  earnAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
  },

  earnLabel: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 6,
  },

  /* Rank Section */
  rankCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: 18,
    borderRadius: 18,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
  },

  rankTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  rankName: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 6,
  },

  rankProgressText: {
    marginTop: 6,
    color: COLORS.grey,
    fontWeight: "600",
  },

  progressBar: {
    height: 10,
    backgroundColor: COLORS.lilac,
    marginTop: 12,
    borderRadius: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  /* Stats Boxes */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  statBox: {
    backgroundColor: COLORS.white,
    flex: 1,
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  statLabel: {
    color: COLORS.grey,
    marginTop: 4,
    fontSize: 12,
  },

  /* Withdraw Button */
  withdrawBtn: {
    backgroundColor: COLORS.primaryDark,
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  withdrawText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  /* Share Button */
  shareBtn: {
    backgroundColor: COLORS.lilac,
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  shareText: {
    color: COLORS.primaryDark,
    fontWeight: "700",
  },

  /* Recent Earnings */
  sectionTitle: {
    marginTop: 26,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  earningItem: {
    backgroundColor: COLORS.white,
    padding: 14,
    marginTop: 12,
    borderRadius: 14,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  earningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  earningDate: {
    fontSize: 12,
    color: COLORS.grey,
  },

  earningAmountList: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
});
