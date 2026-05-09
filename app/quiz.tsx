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
  const { testId, testName, kidId } = useLocalSearchParams();
  const { language } = useTranslation();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // تخزين الإجابات المختارة لكل سؤال
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any;
  }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getTestQuestions(testId as string);
      setQuestions(data || []);
    } catch {
      Alert.alert("خطأ", "فشل في تحميل الأسئلة");
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
    // التحقق مرة أخرى للأمان
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

      await apiService.submitTestResults(payload);

      Alert.alert("تم بنجاح", "تم حفظ نتائج التقييم بنجاح", [
        { text: "حسناً", onPress: () => router.replace("/(drawer)/children") },
      ]);
    } catch (error) {
      Alert.alert("خطأ", "حدثت مشكلة أثناء الحفظ");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {submitting && (
          <Text style={styles.loadingText}>جاري حفظ النتائج...</Text>
        )}
      </View>
    );

  const q = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const isLastQuestion = currentIndex === questions.length - 1;

  // التحقق هل السؤال الحالي تمت الإجابة عليه أم لا
  const hasAnsweredCurrent = !!selectedAnswers[currentIndex];

  return (
    <View style={styles.container}>
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

      {/* Footer Navigation Buttons */}
      <View style={styles.footer}>
        {isLastQuestion ? (
          <TouchableOpacity
            style={[styles.saveBtn, !hasAnsweredCurrent && styles.disabledBtn]} // تطبيق ستايل التعطيل
            onPress={handleSave}
            disabled={!hasAnsweredCurrent} // تعطيل الضغط
          >
            <Ionicons name="checkmark-done" size={20} color="white" />
            <Text style={styles.saveBtnText}>حفظ وإرسال</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, !hasAnsweredCurrent && styles.disabledBtn]} // تطبيق ستايل التعطيل
            onPress={handleNext}
            disabled={!hasAnsweredCurrent} // تعطيل الضغط
          >
            <Text style={styles.nextBtnText}>التالي</Text>
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
        )}

        {currentIndex > 0 && (
          <TouchableOpacity style={styles.prevBtn} onPress={handlePrevious}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
            <Text style={styles.prevBtnText}>السابق</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 15, fontWeight: "bold", color: Colors.primary },
  header: {
    flexDirection: "row",
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
  progressFill: { height: "100%", backgroundColor: Colors.primary },
  progressText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textSecondary,
  },

  content: { padding: 25, paddingBottom: 150 },
  tag: {
    alignSelf: "flex-start",
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
    textAlign: "right",
    lineHeight: 32,
  },

  optionsContainer: { gap: 12 },
  ansBtn: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    flexDirection: "row-reverse",
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
    textAlign: "right",
    fontWeight: "500",
  },
  ansTextSelected: { color: Colors.primary, fontWeight: "700" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E0",
    marginLeft: 15,
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

  // Footer & Buttons
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    height: 54,
    borderRadius: 15,
    flexDirection: "row-reverse",
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
    paddingHorizontal: 30,
    height: 54,
    borderRadius: 15,
    flexDirection: "row-reverse",
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
    paddingHorizontal: 20,
    height: 54,
    borderRadius: 15,
    flexDirection: "row-reverse",
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

  // ستايل الزر المعطل
  disabledBtn: {
    backgroundColor: "#CBD5E0", // لون رمادي باهت
    opacity: 0.6,
  },
});
