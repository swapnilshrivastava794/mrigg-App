import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePassword() {
  return (
    <>
      {/* 🚫 Hide Default Header */}
      <Stack.Screen options={{ headerShown: false }} />

      <Screen>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current password"
            placeholderTextColor={COLORS.grey}
            secureTextEntry
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={COLORS.grey}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={COLORS.grey}
            secureTextEntry
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Update Password</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 18,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginTop: 14,
    marginBottom: 4,
  },

  input: {
    backgroundColor: COLORS.lilac,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: COLORS.softPurple,
  },

  saveBtn: {
    marginTop: 26,
    marginHorizontal: 18,
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.primaryDark,
  },

  saveText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
