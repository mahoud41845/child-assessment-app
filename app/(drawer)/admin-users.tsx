import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { adminService } from "@/services/adminService";
import { getStoredUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await getStoredUser();
      if (!user || user.role !== "admin") {
        router.replace("/login");
        return;
      }
      fetchUsers();
    };

    load();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAdminUsers();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Admin users error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {t("admin_users_title")}
      </Text>
      <Text style={styles.subtitle}>{t("admin_users_subtitle")}</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userHeader}>
              <Ionicons name="person-circle" size={30} color={Colors.primary} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userRole}>{t(item.role)}</Text>
              <Text style={styles.userDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("admin_no_users")}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  userEmail: {
    marginTop: 2,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  userMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  userRole: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  userDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
