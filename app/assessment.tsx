import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { apiService } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const getCategoryTheme = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("learning") || n.includes("تعلم"))
    return { icon: "book", color: "#6366F1", bg: "#EEF2FF" };
  if (n.includes("autism") || n.includes("توحد"))
    return { icon: "extension-puzzle", color: "#EC4899", bg: "#FDF2F8" };
  if (n.includes("hyper") || n.includes("حركة"))
    return { icon: "flash", color: "#F59E0B", bg: "#FFFBEB" };
  return { icon: "apps", color: Colors.primary, bg: Colors.primaryLight };
};

export default function Assessment() {
  const { isRTL, language } = useTranslation();
  const router = useRouter();
  const { kidId } = useLocalSearchParams();

  const [view, setView] = useState<"dashboard" | "categories" | "tests">(
    "dashboard",
  );
  const [categories, setCategories] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const styles = getStyles(isRTL);

  const handleStartAssessment = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCategories();
      setCategories(data);
      setView("categories");
    } catch (error) {
      alert("خطأ في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

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
      params: { testId, testName, kidId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          {view !== "dashboard" && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                setView(view === "tests" ? "categories" : "dashboard")
              }
            >
              <Ionicons
                name={isRTL ? "arrow-forward" : "arrow-back"}
                size={22}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.screenTitle}>
            {view === "dashboard"
              ? "التقييمات"
              : view === "categories"
                ? "التصنيفات"
                : "الاختبارات المتاحة"}
          </Text>
        </View>
        <Text style={styles.headerDesc}>
          {view === "dashboard"
            ? "ابدأ رحلة استكشاف مهارات طفلك الآن"
            : "اختر القسم المناسب للبدء بالفحص"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>جاري التحميل...</Text>
          </View>
        )}

        {!loading && view === "dashboard" && (
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeInfo}>
              <Text style={styles.welcomeTitle}>مرحباً بك في قسم التشخيص</Text>
              <Text style={styles.welcomeText}>
                نقدم لك مجموعة من الاختبارات المقننة لمتابعة نمو طفلك بشكل
                احترافي.
              </Text>
              <TouchableOpacity
                style={styles.mainStartBtn}
                onPress={handleStartAssessment}
              >
                <Text style={styles.mainStartBtnText}>بدأ فحص جديد</Text>
                <Ionicons name="rocket" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!loading && view === "categories" && (
          <View style={styles.gridContainer}>
            {categories.map((item: any) => {
              const theme = getCategoryTheme(item.name_en);
              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.categoryCard}
                  onPress={() => handleCategorySelect(item._id)}
                  activeOpacity={0.9}
                >
                  <View
                    style={[styles.catIconBox, { backgroundColor: theme.bg }]}
                  >
                    <Ionicons
                      name={theme.icon as any}
                      size={30}
                      color={theme.color}
                    />
                  </View>
                  <Text style={styles.catName} numberOfLines={2}>
                    {language === "ar" ? item.name_ar : item.name_en}
                  </Text>
                  <View style={styles.catFooter}>
                    <Text style={styles.catActionText}>استكشاف</Text>
                    <Ionicons
                      name={isRTL ? "chevron-back" : "chevron-forward"}
                      size={14}
                      color={Colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {!loading && view === "tests" && (
          <View style={styles.testList}>
            {tests.map((item: any) => (
              <TouchableOpacity
                key={item._id}
                style={styles.testItem}
                onPress={() =>
                  handleTestSelect(
                    item._id,
                    language === "ar" ? item.name_ar : item.name_en,
                  )
                }
              >
                <View style={styles.testIconWrap}>
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testTitle}>
                    {language === "ar" ? item.name_ar : item.name_en}
                  </Text>
                  <Text style={styles.testType}>
                    {item.type || "اختبار تقييمي"}
                  </Text>
                </View>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={16} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    headerContainer: {
      paddingTop: 60,
      paddingHorizontal: 25,
      paddingBottom: 20,
      backgroundColor: "#FFF",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    headerTop: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 8,
    },
    backButton: {
      marginRight: isRTL ? 0 : 15,
      marginLeft: isRTL ? 15 : 0,
      padding: 5,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: "#1E293B",
      textAlign: isRTL ? "right" : "left",
    },
    headerDesc: {
      fontSize: 14,
      color: "#64748B",
      textAlign: isRTL ? "right" : "left",
    },

    scrollContent: { padding: 20, paddingBottom: 50 },
    loader: { marginTop: 100, alignItems: "center" },
    loadingText: {
      marginTop: 10,
      color: Colors.textSecondary,
      fontWeight: "600",
    },

    // Dashboard View
    welcomeCard: {
      backgroundColor: Colors.primary,
      borderRadius: 25,
      padding: 25,
      overflow: "hidden",
      elevation: 5,
    },
    welcomeInfo: {
      alignItems: isRTL ? "flex-end" : "flex-start",
      width: "100%",
    },
    welcomeTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#FFF",
      marginBottom: 10,
      textAlign: isRTL ? "right" : "left",
    },
    welcomeText: {
      fontSize: 15,
      color: "rgba(255,255,255,0.8)",
      textAlign: isRTL ? "right" : "left",
      lineHeight: 22,
      marginBottom: 20,
    },
    mainStartBtn: {
      backgroundColor: "#FFF",
      paddingVertical: 14,
      paddingHorizontal: 25,
      borderRadius: 15,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      alignSelf: isRTL ? "flex-start" : "flex-end",
      gap: 10,
    },
    mainStartBtnText: {
      color: Colors.primary,
      fontWeight: "800",
      fontSize: 16,
    },

    gridContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    categoryCard: {
      width: (width - 60) / 2,
      backgroundColor: "#FFF",
      borderRadius: 22,
      padding: 20,
      marginBottom: 20,
      alignItems: isRTL ? "flex-end" : "flex-start",
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    catIconBox: {
      width: 60,
      height: 60,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    catName: {
      fontSize: 16,
      fontWeight: "800",
      color: "#334155",
      marginBottom: 10,
      textAlign: isRTL ? "right" : "left",
    },
    catFooter: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 5,
    },
    catActionText: {
      fontSize: 12,
      color: Colors.textSecondary,
      fontWeight: "600",
    },

    // Tests View
    testList: { gap: 15 },
    testItem: {
      backgroundColor: "#FFF",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#F1F5F9",
    },
    testIconWrap: {
      width: 45,
      height: 45,
      borderRadius: 12,
      backgroundColor: "#F1F5F9",
      justifyContent: "center",
      alignItems: "center",
    },
    testInfo: {
      flex: 1,
      marginHorizontal: 15,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    testTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#1E293B",
      textAlign: isRTL ? "right" : "left",
    },
    testType: {
      fontSize: 11,
      color: Colors.textSecondary,
      marginTop: 3,
      textAlign: isRTL ? "right" : "left",
    },
    playBtn: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: Colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
  });
