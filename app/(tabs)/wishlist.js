import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors"; // 💜 Global Lavender Palette
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WishList() {
  const wishlist = [
    {
      id: "1",
      name: "Cat sports mans shoe",
      brand: "Rebook",
      price: "$500.00",
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "2",
      name: "Nikka sports mans shoe",
      brand: "Nikka",
      price: "$450.00",
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "3",
      name: "Adur sports shoe",
      brand: "Rebook",
      price: "$399.00",
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
    {
      id: "4",
      name: "Fnik sports mans shoe",
      brand: "Rebook",
      price: "$410.00",
      image: "/mnt/data/62eda322-de03-48be-a14d-637954863bdb.png",
    },
  ];

  return (
    <Screen>
      {wishlist.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <TouchableOpacity style={styles.removeButton}>
              <Ionicons name="close" size={18} color={COLORS.primaryDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.brand}>{item.brand}</Text>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>{item.price}</Text>

              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="cart" size={18} color={COLORS.white} />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={{ height: 80 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    color: "#000", // 🖤 Black Text
    paddingTop: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    padding: 14,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },

  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: COLORS.lilac,
    borderRadius: 14,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    resizeMode: "cover",
  },

  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.white,
    width: 26,
    height: 26,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.primaryDark,
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000", // 🖤 Black Text
    marginBottom: 4,
  },

  brand: {
    fontSize: 13,
    color: "#000", // 🖤 Black Text
    marginBottom: 8,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000", // 🖤 Black Text
  },

  addButton: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
