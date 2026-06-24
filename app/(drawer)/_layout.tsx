// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { Drawer } from "expo-router/drawer";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import "react-native-reanimated";

// import { useTranslation } from "@/context/TranslationProvider";
// import { DrawerNavigationOptions } from "@react-navigation/drawer";

// export default function DrawerLayout() {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         router.replace("/login");
//       } else {
//         setCheckingAuth(false);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (checkingAuth) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#4A90E2" />
//       </View>
//     );
//   }

//   const headerOptions = (title: string): DrawerNavigationOptions => ({
//     headerShown: true,
//     title,
//     headerTintColor: "#4A90E2",
//     headerStyle: {
//       backgroundColor: "#FFFFFF",
//     },
//     headerTitleStyle: {
//       color: "#1C1C1E",
//       fontWeight: "600",
//     },
//   });

//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: true,
//         drawerType: "slide",
//         overlayColor: "#00000050",
//         drawerStyle: {
//           backgroundColor: "#FFFFFF",
//           width: 280,
//         },
//         drawerLabelStyle: {
//           marginLeft: -16,
//           fontSize: 16,
//           fontWeight: "500",
//           color: "#1C1C1E",
//         },
//         drawerActiveBackgroundColor: "#4A90E220",
//         drawerActiveTintColor: "#4A90E2",
//         drawerInactiveTintColor: "#8E8E93",
//       }}
//     >
//       <Drawer.Screen
//         name="index"
//         options={{
//           ...headerOptions(t("dashboard")),
//           drawerLabel: t("dashboard"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="children"
//         options={{
//           ...headerOptions(t("children")),
//           drawerLabel: t("children"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="people-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* <Drawer.Screen
//         name="assessment"
//         options={{
//           ...headerOptions(t("assessments")),
//           drawerLabel: t("assessments"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="clipboard-outline" size={size} color={color} />
//           ),
//         }}
//       /> */}

//       {/* <Drawer.Screen
//         name="reports"
//         options={{
//           ...headerOptions(t("reports")),
//           drawerLabel: t("reports"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="bar-chart-outline" size={size} color={color} />
//           ),
//         }}
//       /> */}

//       <Drawer.Screen
//         name="settings"
//         options={{
//           ...headerOptions(t("settings")),
//           drawerLabel: t("settings"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="settings-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="logout"
//         options={{
//           ...headerOptions(t("logout")),
//           drawerLabel: t("logout"),
//           drawerIcon: ({ size, color }: { size: number; color: string }) => (
//             <Ionicons name="log-out-outline" size={size} color={color} />
//           ),
//         }}
//       />
//     </Drawer>
//   );
// }

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-reanimated";

import { useTranslation } from "@/context/TranslationProvider";
import { getStoredUser } from "@/services/auth";

// مكون مخصص لمحتوى القائمة الجانبية (هذا سيحل كل مشاكل التصميم والتعليق)
function CustomDrawerContent(props: any) {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const pathname = usePathname(); // لمعرفة الصفحة الحالية وتلوينها
  const { userRole } = props;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  const menuItems =
    userRole === "admin"
      ? [
          {
            label: t("admin_dashboard"),
            icon: "speedometer-outline",
            route: "/admin-dashboard",
          },
          {
            label: t("admin_users"),
            icon: "people-outline",
            route: "/admin-users",
          },
          {
            label: t("settings"),
            icon: "settings-outline",
            route: "/settings",
          },
        ]
      : [
          { label: t("dashboard"), icon: "home-outline", route: "/" },
          { label: t("children"), icon: "people-outline", route: "/children" },
          {
            label: t("settings"),
            icon: "settings-outline",
            route: "/settings",
          },
        ];

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingTop: 20 }}>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.route ||
            (item.route === "/" && pathname === "/index");

          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              style={[
                styles.drawerItem,
                isActive && styles.activeDrawerItem,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={isActive ? "#4A90E2" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.drawerLabel,
                  isActive && styles.activeDrawerLabel,
                  { textAlign: isRTL ? "right" : "left", marginHorizontal: 20 },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* زر تسجيل الخروج المنفصل لضمان عدم التعليق */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.drawerItem,
            styles.logoutItem,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text
            style={[
              styles.drawerLabel,
              { color: "#FF3B30", marginHorizontal: 20 },
            ]}
          >
            {t("logout")}
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const user = await getStoredUser();

      if (!token || !user) {
        router.replace("/login");
        return;
      }

      setUserRole(user.role);
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props} userRole={userRole} />
      )}
      screenOptions={{
        headerShown: true,
        drawerPosition: isRTL ? "right" : "left",
        drawerStyle: { width: 280 },
        headerTintColor: "#4A90E2",
        headerTitleAlign: "center",
      }}
    >
      {/* تعريف الشاشات هنا (بدون خيارات التصميم لأننا صممناها في CustomDrawerContent) */}
      {userRole === "admin" ? (
        <>
          <Drawer.Screen
            name="admin-dashboard"
            options={{ title: t("admin_dashboard") }}
          />
          <Drawer.Screen
            name="admin-users"
            options={{ title: t("admin_users") }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen name="index" options={{ title: t("dashboard") }} />
          <Drawer.Screen name="children" options={{ title: t("children") }} />
        </>
      )}
      <Drawer.Screen name="settings" options={{ title: t("settings") }} />
      <Drawer.Screen
        name="logout"
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerItem: {
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  activeDrawerItem: {
    backgroundColor: "#4A90E220",
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    flex: 1,
  },
  activeDrawerLabel: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  logoutItem: {
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D1D1D6",
    paddingTop: 20,
  },
});
