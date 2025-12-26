import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.log("Failed to load user", e);
        } finally {
            setLoading(false);
        }
    };
    loadUser();
  }, []);

  // Update User (Syncs State + Storage)
  const updateUser = async (updatedData) => {
      try {
          // Merge old user data with new updates (e.g. keep id, update name)
          const newUser = { ...user, ...updatedData };
          setUser(newUser);
          await AsyncStorage.setItem("user", JSON.stringify(newUser));
      } catch (e) {
          console.log("Failed to update user context", e);
      }
  };

  const logout = async () => {
      try {
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");
          setUser(null);
      } catch (e) {
          console.log("Logout error", e);
      }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
