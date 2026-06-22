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

  const styles = getStyles(isRTL);

  let data: any = null;
  try {
    data = result ? JSON.parse(result as string) : null;
  } catch (e) {
    data = null;
  }

  // إذا كانت البيانات موجودة داخل كائن data (حسب استجابة الـ API الخاص بك)
  const finalData = data?.data || data;

  if (!finalData) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={64} color={Colors.error} />
        <Text style={styles.errorText}>{t("error")}</Text>
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
    submittedAt,
  } = finalData;

  // تحديد لون الحالة بناءً على النسبة
  const getStatusColor = () => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 50) return "#F59E0B"; // Amber/Warning
    return Colors.error;
  };

  const statusColor = getStatusColor();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Section */}
      <View style={styles.headerCard}>
        <View style={[styles.percentageCircle, { borderColor: statusColor }]}>
          <Text style={[styles.percentageText, { color: statusColor }]}>
            {percentage}%
          </Text>
          <Text style={styles.percentageSubText}>{t("percentage")}</Text>
        </View>
        <Text style={styles.levelTitle}>{level}</Text>
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={Colors.textSecondary}
          />
          <Text style={styles.dateText}>
            {new Date(submittedAt).toLocaleDateString(
              isRTL ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </Text>
        </View>
      </View>

      {/* Summary Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Ionicons name="stats-chart" size={20} color={Colors.primary} />
          <Text style={styles.statLabel}>{t("score")}</Text>
          <Text style={styles.statValue}>
            {totalScore} / {maxScore}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="ribbon" size={20} color={Colors.primary} />
          <Text style={styles.statLabel}>{t("level")}</Text>
          <Text style={styles.statValue} numberOfLines={1}>
            {level}
          </Text>
        </View>
      </View>

      {/* Interpretation Section */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text" size={22} color={Colors.primary} />
          <Text style={styles.cardTitle}>{t("interpretation")}</Text>
        </View>
        <Text style={styles.interpretationText}>{interpretation}</Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.replace("/(drawer)")}
      >
        <Ionicons name="home" size={20} color="white" />
        <Text style={styles.mainButtonText}>{t("go_to_dashboard")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F1F5F9" },
    scrollContent: { padding: 20, paddingTop: 60, alignItems: "center" },

    headerCard: {
      width: "100%",
      backgroundColor: "#FFF",
      borderRadius: 30,
      padding: 30,
      alignItems: "center",
      marginBottom: 20,
      elevation: 4,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    percentageCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    percentageText: { fontSize: 28, fontWeight: "900" },
    percentageSubText: {
      fontSize: 12,
      color: Colors.textSecondary,
      fontWeight: "600",
    },
    levelTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.textPrimary,
      marginBottom: 8,
    },
    dateRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 6,
    },
    dateText: { fontSize: 13, color: Colors.textSecondary },

    statsGrid: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 20,
    },
    statBox: {
      width: (width - 55) / 2,
      backgroundColor: "#FFF",
      borderRadius: 20,
      padding: 20,
      alignItems: isRTL ? "flex-end" : "flex-start",
      elevation: 2,
    },
    statLabel: {
      fontSize: 12,
      color: Colors.textSecondary,
      marginTop: 10,
      fontWeight: "600",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.textPrimary,
      marginTop: 4,
    },

    infoCard: {
      width: "100%",
      backgroundColor: "#FFF",
      borderRadius: 25,
      padding: 25,
      marginBottom: 30,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 15,
      gap: 10,
    },
    cardTitle: { fontSize: 18, fontWeight: "800", color: Colors.textPrimary },
    interpretationText: {
      fontSize: 15,
      color: "#475569",
      lineHeight: 24,
      textAlign: isRTL ? "right" : "left",
    },

    mainButton: {
      width: "100%",
      backgroundColor: Colors.primary,
      height: 56,
      borderRadius: 18,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      elevation: 4,
    },
    mainButtonText: { color: "white", fontWeight: "800", fontSize: 16 },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      color: Colors.textSecondary,
      marginVertical: 15,
    },
    errorButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 12,
    },
    buttonText: { color: "white", fontWeight: "bold" },
  });
