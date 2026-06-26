import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { adminService } from "@/services/adminService";
import { getStoredUser } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const CaseProgress = ({ label, value, color, total }: any) => (
    <View style={styles.caseProgressContainer}>
      <View style={styles.caseHeader}>
        <Text style={styles.caseLabelText}>{label}</Text>
        <Text style={[styles.caseValueText, { color }]}>{value}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: color,
              width: `${(value / (total || 1)) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchAdminDashboard();
          }}
        />
      }
    >
       <LinearGradient
        colors={[Colors.primary, "#4c669f"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[
            styles.headerContent,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View>
            <Text style={styles.welcomeText}>{t("welcome_admin")}</Text>
            <Text style={styles.titleText}>{t("admin_dashboard_title")}</Text>
          </View>
         
        </View>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Main Stats Row */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            value={data?.totalUsers}
            label={t("total_users")}
            color="#6366f1"
          />
          <StatCard
            icon="happy"
            value={data?.totalKids}
            label={t("total_kids")}
            color="#10b981"
          />
        </View>

        {/* Highlight Score Card */}
        <LinearGradient
          colors={["#ffffff", "#f8fafc"]}
          style={styles.scoreHighlightCard}
        >
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>{t("avg_score")}</Text>
            <Text style={styles.scoreValue}>{data?.avgScore ?? 0}%</Text>
            <Text style={styles.scoreSubtext}>{t("based_on_results")}</Text>
          </View>
          <View style={styles.scoreIconCircle}>
            <Ionicons name="trending-up" size={40} color={Colors.primary} />
          </View>
        </LinearGradient>

        {/* Severity Cases Section */}
        <View style={styles.sectionCard}>
          <Text
            style={[
              styles.sectionTitle,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {t("cases_analysis")}
          </Text>

          <CaseProgress
            label={t("high_cases")}
            value={data?.highCases ?? 0}
            color="#ef4444"
            total={data?.totalResults}
          />
          <CaseProgress
            label={t("medium_cases")}
            value={data?.mediumCases ?? 0}
            color="#f59e0b"
            total={data?.totalResults}
          />
          <CaseProgress
            label={t("low_cases")}
            value={data?.lowCases ?? 0}
            color="#3b82f6"
            total={data?.totalResults}
          />
        </View>

        {/* Small stats row */}
        <View
          style={[
            styles.miniStatsRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.miniCard}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.miniValue}>{data?.totalResults ?? 0}</Text>
            <Text style={styles.miniLabel}>{t("total_results")}</Text>
          </View>
          <View style={styles.miniCard}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.miniValue}>{"100%"}</Text>
            <Text style={styles.miniLabel}>{t("system_status")}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// مكوّن كارت الإحصائيات الرئيسي
const StatCard = ({ icon, value, label, color }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
      <Ionicons name={icon} size={26} color={color} />
    </View>
    <Text style={styles.statValue}>{value ?? 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  titleText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 4,
  },
  bellIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -40, // لرفع المحتوى فوق الـ Header قليلاً
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: width * 0.43,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
  },
  statLabel: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  scoreHighlightCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.primary,
    marginVertical: 4,
  },
  scoreSubtext: {
    fontSize: 12,
    color: "#94a3b8",
  },
  scoreIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 20,
  },
  caseProgressContainer: {
    marginBottom: 18,
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  caseLabelText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  caseValueText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  miniStatsRow: {
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  miniValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 8,
  },
  miniLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});
