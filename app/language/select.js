import Screen from "@/components/Screen";
import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SelectLanguage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('English');

  const languages = [
      { code: 'en', name: 'English', sub: 'English' },
      { code: 'hi', name: 'Hindi', sub: 'हिंदी' },
      { code: 'ta', name: 'Tamil', sub: 'தமிழ்' },
      { code: 'te', name: 'Telugu', sub: 'తెలుగు' },
  ];

  const handleSelect = (lang) => {
      setSelectedLang(lang.name);
      // Logic to save preference would go here
  }

  return (
    <Screen>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Language</Text>
          <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
          <Text style={styles.subHeader}>Choose your preferred language</Text>
          
          <View style={styles.langList}>
              {languages.map((lang) => (
                  <TouchableOpacity 
                    key={lang.code} 
                    style={[styles.langItem, selectedLang === lang.name && styles.selectedItem]}
                    onPress={() => handleSelect(lang)}
                  >
                      <View>
                          <Text style={styles.langName}>{lang.name}</Text>
                          <Text style={styles.langSub}>{lang.sub}</Text>
                      </View>
                      
                      {selectedLang === lang.name && (
                          <Ionicons name="checkmark-circle" size={24} color={COLORS.primaryDark} />
                      )}
                  </TouchableOpacity>
              ))}
          </View>
          
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.back()}>
              <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#F1F3F6',
      padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  subHeader: {
      fontSize: 14,
      color: COLORS.grey,
      marginBottom: 20,
      marginTop: 10,
  },
  
  langList: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      paddingVertical: 8,
      elevation: 2,
  },
  langItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
  },
  selectedItem: {
      backgroundColor: COLORS.lilac + '30', // Transparent lilac
  },
  langName: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textDark,
  },
  langSub: {
      fontSize: 12,
      color: COLORS.grey,
      marginTop: 2,
  },

  continueBtn: {
      backgroundColor: COLORS.primaryDark,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 30,
      elevation: 4,
  },
  continueText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '700',
  },
});
