import { Colors } from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { apiService } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // مهم للتنقل
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Assessment() {
  const { isRTL, language } = useTranslation();
  const router = useRouter();

  // الحالات: 'dashboard' | 'categories' | 'tests'
  const [view, setView] = useState<"dashboard" | "categories" | "tests">(
    "dashboard",
  );
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = getStyles(isRTL);

  // 1. جلب التصنيفات
  const handleStartAssessment = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
      setView("categories");
    } catch (error) {
      alert("خطأ في جلب التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  // 2. جلب اختبارات تصنيف معين
  const handleCategorySelect = async (catId: string) => {
    setLoading(true);
    try {
      const data = await apiService.getTestsByCategory(catId);
      setTests(data);
      setView("tests");
    } catch (error) {
      alert("خطأ في جلب الاختبارات");
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = (testId: string, testName: string) => {
    router.push({
      pathname: "/quiz",
      params: { testId, testName },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Dynamic */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              {view === "dashboard"
                ? "الاختبارات"
                : view === "categories"
                  ? "اختر التصنيف"
                  : "اختر الاختبار"}
            </Text>
          </View>
          {view !== "dashboard" && (
            <TouchableOpacity
              onPress={() =>
                setView(view === "tests" ? "categories" : "dashboard")
              }
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                رجوع
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && <ActivityIndicator size="large" color={Colors.primary} />}

        {!loading && view === "dashboard" && (
          <>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartAssessment}
            >
              <Ionicons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.startButtonText}>ابدأ اختبار جديد</Text>
            </TouchableOpacity>
          </>
        )}

        {!loading && view === "categories" && (
          <View>
            {categories.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                style={styles.catCard}
                onPress={() => handleCategorySelect(item._id)}
              >
                <View style={styles.catIconContainer}>
                  <Ionicons name="list" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.catTitle}>
                  {language === "ar" ? item.name_ar : item.name_en}
                </Text>
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!loading && view === "tests" && (
          <View>
            {tests.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                style={styles.catCard}
                onPress={() =>
                  handleTestSelect(
                    item._id,
                    language === "ar" ? item.name_ar : item.name_en,
                  )
                }
              >
                <View
                  style={[
                    styles.catIconContainer,
                    { backgroundColor: "#E8F5E9" },
                  ]}
                >
                  <Ionicons name="document-text" size={24} color="#4CAF50" />
                </View>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={styles.catTitle}>
                    {language === "ar" ? item.name_ar : item.name_en}
                  </Text>
                  <Text style={{ fontSize: 10, color: Colors.textSecondary }}>
                    {item.type}
                  </Text>
                </View>
                <Ionicons name="play-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { padding: 20, paddingTop: 50 },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 30,
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: Colors.textPrimary },
    startButton: {
      backgroundColor: Colors.primary,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 18,
      borderRadius: 16,
      marginBottom: 25,
    },
    startButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
      marginHorizontal: 10,
    },
    catCard: {
      backgroundColor: Colors.card,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    catIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: Colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    catTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.textPrimary,
      flex: 1,
      marginHorizontal: 10,
      textAlign: isRTL ? "right" : "left",
    },
  });
