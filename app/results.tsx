import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";

const { width } = Dimensions.get("window");

interface ResultItem {
  _id: string;
  kid_ref: string;
  test: {
    _id: string;
    name_ar: string;
    name_en: string;
  };
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export default function Results() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { kidId, kidName } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.64:5000/api/v1/results/${kidId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      const json = await response.json();
      setResults(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [kidId]);

  const getLevelColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes("low") || l.includes("منخفض")) return "#10b981"; // الأخضر للحالات المنخفضة
    if (l.includes("medium") || l.includes("متوسط")) return "#f59e0b";
    if (l.includes("high") || l.includes("مرتفع")) return "#ef4444";
    return Colors.primary;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchResults();
          }}
        />
      }
    >
      {/* Header Section - Solid & Clean */}
      <View style={styles.whiteHeader}>
        <View
          style={[
            styles.headerTopRow,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={24}
              color="#1e293b"
            />
          </TouchableOpacity>
          <Text style={styles.headerMainTitle}>{t("admin_results_title")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View
          style={[
            styles.kidInfoBox,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.kidAvatar}>
            <Text style={styles.avatarTxt}>
              {(kidName as string)?.charAt(0) || "K"}
            </Text>
          </View>
          <View
            style={{ flex: 1, alignItems: isRTL ? "flex-end" : "flex-start" }}
          >
            <Text style={styles.kidLabel}>{t("detailed_results_for")}</Text>
            <Text style={styles.kidName}>{kidName || "---"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {results.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="document-text-outline" size={70} color="#cbd5e1" />
            <Text style={styles.emptyTxt}>{t("no_results_found")}</Text>
          </View>
        ) : (
          results.map((item) => {
            const levelColor = getLevelColor(item.level);
            return (
              <View key={item._id} style={styles.resultCard}>
                <View
                  style={[
                    styles.cardHeader,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text style={styles.testTitle}>
                    {isRTL ? item.test.name_ar : item.test.name_en}
                  </Text>
                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: levelColor + "15" },
                    ]}
                  >
                    <Text
                      style={[styles.levelBadgeText, { color: levelColor }]}
                    >
                      {item.level}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statsGrid,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <View style={styles.statBox}>
                    <Text style={styles.statLab}>
                      {t("latest_level_label")}
                    </Text>
                    <Text style={[styles.statVal, { color: levelColor }]}>
                      {item.level}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLab}>{t("percentage")}</Text>
                    <Text style={styles.statVal}>
                      {isRTL ? `%${item.percentage}` : `${item.percentage}%`}
                    </Text>
                  </View>
                </View>

              
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  whiteHeader: {
    backgroundColor: "white",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTopRow: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerMainTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  kidInfoBox: { alignItems: "center", gap: 15 },
  kidAvatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTxt: { color: "white", fontSize: 22, fontWeight: "bold" },
  kidLabel: { fontSize: 13, color: "#64748b" },
  kidName: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  content: { padding: 20 },
  resultCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  testTitle: { fontSize: 16, fontWeight: "bold", color: "#334155", flex: 1 },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  levelBadgeText: { fontSize: 12, fontWeight: "bold" },
  statsGrid: { gap: 20, marginBottom: 15 },
  statBox: { flex: 1 },
  statLab: { fontSize: 12, color: "#94a3b8", marginBottom: 2 },
  statVal: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 5,
  },
  detailBtnTxt: { fontSize: 14, color: Colors.primary, fontWeight: "600" },
  emptyBox: { alignItems: "center", marginTop: 80 },
  emptyTxt: { marginTop: 15, fontSize: 16, color: "#94a3b8" },
});
