import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        router.replace("/login");
      }
    };

    logout();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A90E2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
