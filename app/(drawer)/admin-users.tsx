import { useNotification } from "@/components/notification";
import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { adminService } from "@/services/adminService";
import { getStoredUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const { showSuccess, showError } = useNotification();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      showError(t("fetch_error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      t("delete_user"),
      `${t("delete_user_confirm")} (${userName})؟`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await adminService.deleteUser(userId);
              showSuccess(t("delete_user_success"));
              fetchUsers();
            } catch (error) {
              showError(t("delete_error"));
            }
          },
        },
      ],
    );
  };

  const renderUserItem = ({ item }: { item: UserItem }) => {
    const initials = item.name.substring(0, 1).toUpperCase();
    const isAdmin = item.role === "admin";

    return (
      <View style={styles.userCard}>
        <View
          style={[
            styles.cardRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {/* Avatar Area */}
          <View
            style={[
              styles.avatar,
              { backgroundColor: isAdmin ? "#6366f1" : "#10b981" },
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {/* User Info */}
          <View
            style={[
              styles.infoContainer,
              { alignItems: isRTL ? "flex-end" : "flex-start" },
            ]}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>

            {/* Role Badge */}
            <View
              style={[
                styles.badge,
                { backgroundColor: isAdmin ? "#eef2ff" : "#ecfdf5" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isAdmin ? "#4f46e5" : "#059669" },
                ]}
              >
                {isAdmin ? t("role_admin") : t("role_user")}
              </Text>
            </View>
          </View>

          {/* Delete Action */}
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => handleDeleteUser(item._id, item.name)}
          >
            <View style={styles.deleteCircle}>
              <Ionicons name="trash" size={18} color="#ef4444" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardFooter}>
          <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
          <Text style={styles.userDate}>
            {t("joined_at")}: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
          {t("admin_users_title")}
        </Text>
        <Text
          style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}
        >
          {t("admin_users_subtitle")} ( {users.length} )
        </Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchUsers();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyText}>{t("admin_no_users")}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerArea: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardRow: {
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#334155",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  deleteIconButton: {
    padding: 5,
  },
  deleteCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 6,
  },
  userDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#94a3b8",
  },
});
