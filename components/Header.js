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
  const [hasSearched, setHasSearched] = useState(false); // Track if a search occurred

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setHasSearched(true);
        const res = await searchProducts(query, 1, 6);

        if (Array.isArray(res)) {
          setResults(res);
        } else {
          setResults(res?.results || []);
        }
      } catch (e) {
        console.log(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {/* LOGO IMAGE */}
        <Image 
            source={require('../assets/header_logo.png')} 
            style={{ width:70, height: 40, resizeMode: 'contain' }}
        />

        {/* Search */}
        <View style={{ flex: 1 }}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>


      </View>

      {/* 🔽 WIDE SEARCH RESULT */}
      {(loading || results.length > 0 || (hasSearched && query.length > 0)) && (
        <View style={styles.dropdownWrapper}>
           <View style={styles.dropdown}>
            
            {/* Loading State */}
            {loading && (
              <View style={styles.stateBox}>
                <ActivityIndicator size="small" color="#D4AF37" />
                <Text style={styles.stateText}>Searching...</Text>
              </View>
            )}

            {/* No Results State */}
            {!loading && results.length === 0 && hasSearched && (
                <View style={styles.stateBox}>
                    <Ionicons name="alert-circle-outline" size={24} color="#ccc" />
                    <Text style={styles.stateText}>No products found for "{query}"</Text>
                </View>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
                <>
                <ScrollView
                style={{ maxHeight: 240 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                >
                {results.map((item) => (
                    <TouchableOpacity
                    key={item.id}
                    style={styles.resultRow}
                    activeOpacity={0.7}
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

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={styles.name}>
                        {item.name}
                        </Text>

                        <Text style={styles.category}>
                        {item.subcategory?.name || "Collection"}
                        </Text>

                        <Text style={styles.price}>₹{item.final_price}</Text>
                    </View>
                    
                    <Ionicons name="chevron-forward" size={16} color="#ccc" />
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
                </>
            )}

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
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Spread items apart
    gap: 12,
  },
  
  // Text style removed as we use Image now
  
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F2F4F8", // Premium soft grey
    borderRadius: 24, // Pill shape for modern feel
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: "transparent", // Clean look
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  /* 🔥 WIDE DROPDOWN */
  dropdownWrapper: {
    position: "absolute",
    top: 75,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 999,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: 320,
    overflow: "hidden",
    elevation: 20, // Stronger pop
    shadowColor: "#000",
    shadowOpacity: 0.2, // Darker shadow for depth
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  stateBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: 'center',
    padding: 20,
  },
  stateText: {
    fontSize: 14,
    color: "#888",
    fontStyle: 'italic',
  },

  resultRow: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  thumb: {
    width: 50, // Larger thumb
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  name: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600", // Semi-bold
    marginBottom: 2,
  },
  category: {
    fontSize: 10,
    color: "#999",
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6233B5", // Use primary color
  },

  viewAll: {
    padding: 14,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  viewAllText: {
    fontSize: 14,
    color: "#6233B5", // Primary Color
    fontWeight: "700",
  },
});
