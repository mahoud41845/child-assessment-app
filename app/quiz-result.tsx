import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function QuizResult() {
  const { t, isRTL } = useTranslation();
  const { result } = useLocalSearchParams();
  const router = useRouter();

  // تحويل النتيجة من String إلى Object
  let rawData: any = null;
  try {
    rawData = result ? JSON.parse(result as string) : null;
  } catch (e) {
    rawData = null;
  }

  // الوصول للبيانات الفعلية (التعامل مع nested data إن وُجدت)
  const finalData = rawData?.data || rawData;

  if (!finalData) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorText}>{t("error_loading_result")}</Text>
        <TouchableOpacity
          onPress={() => router.replace("/(drawer)")}
          style={styles.errorButton}
        >
          <Text style={styles.buttonText}>{t("go_to_dashboard")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    totalScore,
    maxScore,
    percentage,
    level,
    interpretation,
    recommendations,
    submittedAt,
  } = finalData;

  // تحديد اللون بناءً على المستوى
  const getStatusColor = () => {
    const l = level.toLowerCase();
    if (l.includes("low") || l.includes("منخفض")) return "#10b981"; // أخضر
    if (l.includes("medium") || l.includes("متوسط")) return "#f59e0b"; // برتقالي
    return "#ef4444"; // أحمر للمرتفع
  };

  const statusColor = getStatusColor();
  const currentLang = isRTL ? "ar" : "en";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Card (The Score) */}
      <View style={styles.headerCard}>
        <View
          style={[styles.percentageCircle, { borderColor: statusColor + "30" }]}
        >
          <View style={[styles.innerCircle, { borderColor: statusColor }]}>
            <Text style={[styles.percentageText, { color: statusColor }]}>
              {isRTL ? `%${percentage}` : `${percentage}%`}
            </Text>
            <Text style={styles.percentageSubText}>{t("percentage")}</Text>
          </View>
        </View>
        <Text style={[styles.levelTitle, { color: statusColor }]}>{level}</Text>
        <Text style={styles.dateText}>
          {new Date(submittedAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* 2. Stats Summary */}
      <View
        style={[
          styles.statsRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.miniStat}>
          <Text style={styles.miniStatLabel}>{t("total_score")}</Text>
          <Text style={styles.miniStatValue}>
            {totalScore} / {maxScore}
          </Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniStatLabel}>{t("latest_level_label")}</Text>
          <Text style={[styles.miniStatValue, { color: statusColor }]}>
            {level}
          </Text>
        </View>
      </View>

      {/* 3. Interpretation Card */}
      <View style={styles.infoCard}>
        <View
          style={[
            styles.cardHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Ionicons name="bulb-outline" size={22} color={Colors.primary} />
          <Text style={styles.cardTitle}>{t("interpretation")}</Text>
        </View>
        <Text
          style={[styles.cardDesc, { textAlign: isRTL ? "right" : "left" }]}
        >
          {interpretation[currentLang]}
        </Text>
      </View>

      {/* 4. Recommendations Section (Hidden if level is Low) */}
      {level.toLowerCase() !== "low" &&
        recommendations &&
        recommendations.length > 0 && (
          <View style={styles.infoCard}>
            <View
              style={[
                styles.cardHeader,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons name="list-outline" size={22} color={Colors.primary} />
              <Text style={styles.cardTitle}>{t("recommendations")}</Text>
            </View>

            {recommendations.map((rec: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.recItem,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View
                  style={[styles.recDot, { backgroundColor: statusColor }]}
                />
                <Text
                  style={[
                    styles.recText,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {rec[currentLang]}
                </Text>
              </View>
            ))}
          </View>
        )}

      {/* 5. Home Button */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => router.replace("/(drawer)")}
      >
        <Ionicons name="home" size={20} color="white" />
        <Text style={styles.homeBtnText}>{t("go_to_dashboard")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerCard: {
    backgroundColor: "white",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  percentageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  innerCircle: {
    width: 125,
    height: 125,
    borderRadius: 65,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: { fontSize: 36, fontWeight: "900" },
  percentageSubText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  levelTitle: { fontSize: 24, fontWeight: "900", marginBottom: 5 },
  dateText: { fontSize: 13, color: "#94a3b8" },

  statsRow: { gap: 15, marginBottom: 20 },
  miniStat: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    elevation: 1,
  },
  miniStatLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "600",
  },
  miniStatValue: { fontSize: 16, fontWeight: "bold", color: "#1e293b" },

  infoCard: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    elevation: 1,
  },
  cardHeader: { alignItems: "center", gap: 10, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  cardDesc: { fontSize: 15, color: "#475569", lineHeight: 24 },

  recItem: { gap: 12, marginBottom: 15, alignItems: "flex-start" },
  recDot: { width: 8, height: 8, borderRadius: 4, marginTop: 8 },
  recText: { flex: 1, fontSize: 14, color: "#475569", lineHeight: 22 },

  homeBtn: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  homeBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 16, color: "#64748b", marginVertical: 20 },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
