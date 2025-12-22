import { globalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchProducts } from "../app/server.jsx";

export default function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchProducts(query, 1, 6);

        if (Array.isArray(res)) {
          setResults(res);
        } else {
          setResults(res?.results || []);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {/* Avatar */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />

        {/* Search */}
        <View style={{ flex: 1 }}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products"
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        {/* Bell */}
        <TouchableOpacity style={globalStyles.badgeContainer}>
          <Ionicons name="notifications-outline" size={26} color="#444" />
          <View style={globalStyles.badge}>
            <Text style={globalStyles.badgeNumber}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 🔽 WIDE SEARCH RESULT */}
      {(loading || results.length > 0) && (
        <View style={styles.dropdownWrapper}>
          <View style={styles.dropdown}>
            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#888" />
                <Text style={styles.loadingText}>Searching…</Text>
              </View>
            )}

            <ScrollView
              style={{ maxHeight: 220 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {results.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.resultRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    setQuery("");
                    setResults([]);
                    router.push({
                      pathname: "/product/[id]",
                      params: { id: item.id },
                    });
                  }}
                >
                  <Image source={{ uri: item.image }} style={styles.thumb} />

                  <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.name}>
                      {item.name}
                    </Text>

                    <Text style={styles.category}>
                      {item.subcategory?.name}
                    </Text>

                    <Text style={styles.price}>₹{item.final_price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.viewAll}
              onPress={() => {
                setResults([]);
                router.push({
                  pathname: "/product",
                  params: {
                    q: query,
                  },
                });
              }}
            >
              <Text style={styles.viewAllText}>View all results</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingBottom: 8,
    zIndex: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  /* 🔥 WIDE DROPDOWN */
  dropdownWrapper: {
    position: "absolute",
    top: 72,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    zIndex: 999,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 14,
    maxHeight: 300,
    overflow: "hidden",
    elevation: 8,
  },

  loadingBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 12,
  },
  loadingText: {
    fontSize: 12,
    color: "#777",
  },

  resultRow: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  thumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#eaeaea",
  },
  name: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  category: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },

  viewAll: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  viewAllText: {
    fontSize: 13,
    color: "#007bff",
    fontWeight: "500",
  },
});
