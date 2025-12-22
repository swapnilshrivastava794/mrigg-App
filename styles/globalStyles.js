import { Platform, StatusBar, StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 6 : 20,
    paddingBottom: 0,
    backgroundColor: "white",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    height: 42,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },

  badgeContainer: {
    position: "relative",
    marginLeft: 10,
    padding: 4,
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeNumber: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
});
