import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";

import { useTranslation } from "@/context/TranslationProvider";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

export default function DrawerLayout() {
  const { t } = useTranslation();

  const headerOptions = (title: string): DrawerNavigationOptions => ({
    headerShown: true,
    title,
    headerTintColor: "#4A90E2",
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerTitleStyle: {
      color: "#1C1C1E",
      fontWeight: "600",
    },
  });

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        overlayColor: "#00000050",
        drawerStyle: {
          backgroundColor: "#FFFFFF",
          width: 280,
        },
        drawerLabelStyle: {
          marginLeft: -16,
          fontSize: 16,
          fontWeight: "500",
          color: "#1C1C1E",
        },
        drawerActiveBackgroundColor: "#4A90E220",
        drawerActiveTintColor: "#4A90E2",
        drawerInactiveTintColor: "#8E8E93",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          ...headerOptions(t("dashboard")),
          drawerLabel: t("dashboard"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="children"
        options={{
          ...headerOptions(t("children")),
          drawerLabel: t("children"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* <Drawer.Screen
        name="assessment"
        options={{
          ...headerOptions(t("assessments")),
          drawerLabel: t("assessments"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      /> */}

      {/* <Drawer.Screen
        name="reports"
        options={{
          ...headerOptions(t("reports")),
          drawerLabel: t("reports"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      /> */}

      <Drawer.Screen
        name="settings"
        options={{
          ...headerOptions(t("settings")),
          drawerLabel: t("settings"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          ...headerOptions(t("logout")),
          drawerLabel: t("logout"),
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
