import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { apiService } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuizScreen() {
  const { testId, kidId } = useLocalSearchParams();
  const { t, language, isRTL } = useTranslation(); // أضفنا t و isRTL
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any;
  }>({});

  const styles = getStyles(isRTL);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getTestQuestions(testId as string);
      setQuestions(data || []);
    } catch {
      Alert.alert(t("error"), t("error_loading_questions"));
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const onSelectOption = (questionId: string, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: { questionId, selectedAnswer: answerId },
    });
  };

  const handleNext = () => {
    if (selectedAnswers[currentIndex]) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSave = async () => {
    if (!selectedAnswers[currentIndex]) return;

    setSubmitting(true);
    try {
      const payload = {
        kidId: kidId as string,
        testId: testId as string,
        answers: Object.values(selectedAnswers),
      };

      const res = await apiService.submitTestResults(payload);

      // Navigate to result page and show API response
      router.replace({
        pathname: "/quiz-result",
        params: { result: JSON.stringify(res) },
      });
    } catch (error) {
      Alert.alert(t("error"), t("error_saving"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {submitting && (
          <Text style={styles.loadingText}>{t("saving_results")}</Text>
        )}
      </View>
    );

  const q = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = !!selectedAnswers[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1}/{questions.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tag}>
          <Text style={styles.qType}>
            {language === "ar" ? q.type_ar : q.type_en}
          </Text>
        </View>
        <Text style={styles.qText}>
          {language === "ar" ? q.name_ar : q.name_en}
        </Text>

        <View style={styles.optionsContainer}>
          {q.answers.map((ans: any) => {
            const isSelected =
              selectedAnswers[currentIndex]?.selectedAnswer === ans._id;
            return (
              <TouchableOpacity
                key={ans._id}
                style={[styles.ansBtn, isSelected && styles.ansBtnSelected]}
                onPress={() => onSelectOption(q._id, ans._id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.ansText, isSelected && styles.ansTextSelected]}
                >
                  {language === "ar" ? ans.text_ar : ans.text_en}
                </Text>
                <View
                  style={[styles.radio, isSelected && styles.radioSelected]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.saveBtn, !hasAnsweredCurrent && styles.disabledBtn]}
            onPress={handleSave}
            disabled={!hasAnsweredCurrent}
          >
            <Ionicons name="checkmark-done" size={20} color="white" />
            <Text style={styles.saveBtnText}>{t("save_and_submit")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, !hasAnsweredCurrent && styles.disabledBtn]}
            onPress={handleNext}
            disabled={!hasAnsweredCurrent}
          >
            <Text style={styles.nextBtnText}>{t("next")}</Text>
            <Ionicons
              name={isRTL ? "chevron-back" : "chevron-forward"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        )}

        {currentIndex > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={handlePrevious}>
            <Ionicons
              name={isRTL ? "chevron-forward" : "chevron-back"}
              size={20}
              color={Colors.textSecondary}
            />
            <Text style={styles.prevBtnText}>{t("previous")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 15, fontWeight: "bold", color: Colors.primary },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 20,
      marginTop: 50,
      marginBottom: 20,
    },
    closeBtn: { padding: 5 },
    progressContainer: {
      flex: 1,
      height: 8,
      backgroundColor: "#E2E8F0",
      borderRadius: 4,
      marginHorizontal: 15,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.primary,
    },
    progressText: {
      fontSize: 13,
      fontWeight: "800",
      color: Colors.textSecondary,
    },
    content: { padding: 25, paddingBottom: 150 },
    tag: {
      alignSelf: isRTL ? "flex-end" : "flex-start",
      backgroundColor: Colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 15,
    },
    qType: { color: Colors.primary, fontWeight: "bold", fontSize: 12 },
    qText: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.textPrimary,
      marginBottom: 35,
      textAlign: isRTL ? "right" : "left",
      lineHeight: 32,
    },
    optionsContainer: { gap: 12 },
    ansBtn: {
      backgroundColor: "#FFF",
      padding: 20,
      borderRadius: 18,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#EDF2F7",
    },
    ansBtnSelected: { borderColor: Colors.primary, backgroundColor: "#F0F7FF" },
    ansText: {
      fontSize: 16,
      color: Colors.textPrimary,
      flex: 1,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "500",
    },
    ansTextSelected: { color: Colors.primary, fontWeight: "700" },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: "#CBD5E0",
      marginHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    radioSelected: { borderColor: Colors.primary },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: Colors.primary,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      padding: 20,
      paddingBottom: Platform.OS === "ios" ? 40 : 20,
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "#EDF2F7",
    },
    nextBtn: {
      backgroundColor: Colors.primary,
      paddingHorizontal: 20,
      height: 54,
      borderRadius: 15,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 0.6,
      justifyContent: "center",
    },
    nextBtnText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 8,
    },
    saveBtn: {
      backgroundColor: Colors.success,
      paddingHorizontal: 20,
      height: 54,
      borderRadius: 15,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 0.6,
      justifyContent: "center",
    },
    saveBtnText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 8,
    },
    prevBtn: {
      backgroundColor: "#F1F5F9",
      paddingHorizontal: 15,
      height: 54,
      borderRadius: 15,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 0.35,
      justifyContent: "center",
    },
    prevBtnText: {
      color: Colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
      marginHorizontal: 5,
    },
    disabledBtn: {
      backgroundColor: "#CBD5E0",
      opacity: 0.6,
    },
  });
