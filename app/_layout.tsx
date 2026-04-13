import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { useTranslation } from "@/hooks/useTranslation";

export const unstable_settings = {
  anchor: "(drawer)",
};

export default function RootLayout() {
  useTranslation();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTintColor: "#4A90E2",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            color: "#1C1C1E",
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />

        {/* Drawer Layout - Main App Navigation */}
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
 