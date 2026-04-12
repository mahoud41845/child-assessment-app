import { Colors } from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { apiService } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuizScreen() {
  const { testId, testName } = useLocalSearchParams();
  const { language, isRTL } = useTranslation();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiService.getTestQuestions(testId as string);
      setQuestions(data || []);
    } catch {
      alert("خطأ في تحميل الأسئلة");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (points: number) => {
    setScore(score + points);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert(`اكتمل الاختبار! مجموع نقاطك: ${score + points}`);
      router.back();
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.textPrimary }}>
          لا توجد أسئلة متاحة لهذا الاختبار.
        </Text>
      </View>
    );
  }

  const q = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
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

      <ScrollView contentContainerStyle={styles.qBox}>
        <Text style={styles.qType}>
          {language === "ar" ? q.type_ar : q.type_en}
        </Text>
        <Text style={styles.qText}>
          {language === "ar" ? q.name_ar : q.name_en}
        </Text>

        {q.answers.map((ans: any) => (
          <TouchableOpacity
            key={ans._id}
            style={styles.ansBtn}
            onPress={() => handleAnswer(ans.score)}
          >
            <Text style={styles.ansText}>
              {language === "ar" ? ans.text_ar : ans.text_en}
            </Text>
            <View style={styles.radio} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
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
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  qBox: { padding: 25 },
  qType: {
    color: Colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 12,
  },
  qText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 40,
    lineHeight: 30,
  },
  ansBtn: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ansText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "left",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginLeft: 10,
  },
});
