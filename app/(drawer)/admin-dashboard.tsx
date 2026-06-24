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
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AdminDashboardData {
  totalUsers: number;
  totalKids: number;
  totalResults: number;
  avgScore: number;
  highCases: number;
  mediumCases: number;
  lowCases: number;
}

export default function AdminDashboard() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const user = await getStoredUser();
      if (!user || user.role !== "admin") {
        router.replace("/login");
        return;
      }
      fetchAdminDashboard();
    };

    load();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      setLoading(true);
      const dashboard = await adminService.getAdminDashboard();
      setData(dashboard);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminDashboard();
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
      <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
        {t("admin_dashboard_title")}
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>{data?.totalUsers ?? 0}</Text>
          <Text style={styles.statLabel}>{t("total_users")}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="person-add" size={24} color={Colors.success} />
          <Text style={styles.statValue}>{data?.totalKids ?? 0}</Text>
          <Text style={styles.statLabel}>{t("total_kids")}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color={Colors.info} />
          <Text style={styles.statValue}>{data?.totalResults ?? 0}</Text>
          <Text style={styles.statLabel}>{t("total_results")}</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="stats-chart" size={24} color={Colors.warning} />
          <Text style={styles.statValue}>{data?.avgScore ?? 0}%</Text>
          <Text style={styles.statLabel}>{t("avg_score")}</Text>
        </View>
      </View>

      <View style={styles.casesRow}>
        <View style={styles.caseCard}>
          <Text style={styles.caseValue}>{data?.highCases ?? 0}</Text>
          <Text style={styles.caseLabel}>{t("high_cases")}</Text>
        </View>
        <View style={styles.caseCard}>
          <Text style={styles.caseValue}>{data?.mediumCases ?? 0}</Text>
          <Text style={styles.caseLabel}>{t("medium_cases")}</Text>
        </View>
        <View style={styles.caseCard}>
          <Text style={styles.caseValue}>{data?.lowCases ?? 0}</Text>
          <Text style={styles.caseLabel}>{t("low_cases")}</Text>
        </View>
      </View>

      <FlatList<any>
        data={[] as any[]}
        keyExtractor={(item, index) => String(index)}
        renderItem={() => null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t("admin_dashboard_summary")}</Text>
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
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    backgroundColor: Colors.card,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 14,
    color: Colors.textPrimary,
  },
  statLabel: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  casesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  caseCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: Colors.card,
    padding: 16,
    marginHorizontal: 4,
  },
  caseValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  caseLabel: {
    marginTop: 6,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  emptyText: {
    marginTop: 28,
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
