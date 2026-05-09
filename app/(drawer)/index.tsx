import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const { isRTL, language } = useTranslation();
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        "http://192.168.1.111:5000/api/v1/results/parent/dashboard",
        {
          method: "GET",
          headers,
        },
      );

      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getLevelColor = (level: string | null) => {
    if (!level) return "#94A3B8";
    if (level.includes("طبيعي") || level.includes("Normal"))
      return Colors.success;
    if (level.includes("متوسط") || level.includes("Moderate"))
      return Colors.warning;
    return Colors.danger;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderKidCard = ({ item }: { item: any }) => (
    <View style={styles.kidCard}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.avatarBox,
            {
              backgroundColor:
                item.totalTests > 0 ? Colors.primaryLight : "#F1F5F9",
            },
          ]}
        >
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.nameSection}>
          <Text style={styles.kidName}>{item.name}</Text>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>{item.totalTests} اختبارات</Text>
          </View>
        </View>
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={Colors.textTertiary}
        />
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statLabelRow}>
          <Text style={styles.statValue}>{item.avgPercentage}%</Text>
          <Text style={styles.statLabel}>متوسط الأداء</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${item.avgPercentage}%`,
                backgroundColor: getLevelColor(item.latestLevel),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.gridStats}>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>أعلى نسبة</Text>
          <Text style={[styles.miniValue, { color: Colors.success }]}>
            {item.highestPercentage}%
          </Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>أقل نسبة</Text>
          <Text style={[styles.miniValue, { color: Colors.danger }]}>
            {item.lowestPercentage}%
          </Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>آخر مستوى {t("noData")}</Text>
          <Text
            style={[
              styles.miniValue,
              { color: getLevelColor(item.latestLevel) },
            ]}
          >
            {item.latestLevel || t("noData")}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsBtn}>
        <Text style={styles.detailsBtnText}>عرض التقرير المفصل</Text>
        <Ionicons
          name={isRTL ? "arrow-back" : "arrow-forward"}
          size={16}
          color={Colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greeting}>صباح الخير </Text>
            <Text style={styles.subGreeting}>إليك ملخص أداء أطفالك اليوم</Text>
          </View>
          <View style={styles.profileCircle}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.overviewGrid}>
          <View style={[styles.overviewCard, { backgroundColor: "#EEF2FF" }]}>
            <Ionicons name="people" size={24} color="#6366F1" />
            <Text style={styles.overviewValue}>{data?.kids?.length || 0}</Text>
            <Text style={styles.overviewLabel}>إجمالي الأطفال</Text>
          </View>
          <View style={[styles.overviewCard, { backgroundColor: "#ECFDF5" }]}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.overviewValue}>
              {data?.kids?.reduce(
                (acc: number, curr: any) => acc + curr.totalTests,
                0,
              )}
            </Text>
            <Text style={styles.overviewLabel}>اختبارات منجزة</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>تقارير الأطفال</Text>

        <FlatList
          data={data?.kids}
          renderItem={renderKidCard}
          keyExtractor={(item) => item.kidId}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              لم يتم إضافة أطفال أو إجراء اختبارات بعد.
{              t("noData")
}            </Text>
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingTop: 60 },

  // Header
  topHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  // Overview Stats
  overviewGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  overviewCard: {
    width: (width - 55) / 2,
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: "right",
  },

  kidCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
  nameSection: { flex: 1, marginRight: 15, alignItems: "flex-end" },
  kidName: { fontSize: 18, fontWeight: "800", color: Colors.textPrimary },
  testBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  testBadgeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "700",
  },

  statsSection: { marginBottom: 20 },
  statLabelRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  statLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
  statValue: { fontSize: 22, fontWeight: "900", color: Colors.textPrimary },
  progressBarBg: {
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5 },

  gridStats: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 15,
  },
  miniStat: { alignItems: "center", flex: 1 },
  miniLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  miniValue: { fontSize: 14, fontWeight: "800" },

  detailsBtn: {
    marginTop: 20,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  detailsBtnText: { color: Colors.primary, fontWeight: "800", fontSize: 14 },

  emptyText: {
    textAlign: "center",
    color: Colors.textTertiary,
    marginTop: 40,
    fontSize: 15,
  },
});
