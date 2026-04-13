import { Colors } from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { DevSettings } from "react-native";

export default function Settings() {
  const { t, language, changeLanguage, isRTL } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const styles = getStyles(isRTL);

   const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "ar" : "en";

    Alert.alert(
      "تغيير اللغة",
      "سيتم إعادة تشغيل التطبيق لتطبيق اللغة الجديدة",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "موافق",
          onPress: async () => {
            await changeLanguage(newLanguage);
            DevSettings.reload();
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onValueChange,
    type = "toggle",
    onPress,
    description,
  }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={type === "toggle"}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{label}</Text>
        {description && (
          <Text style={styles.itemDescription}>{description}</Text>
        )}
      </View>

      {type === "toggle" ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#CBD5E1", true: Colors.primaryLight }}
          thumbColor={value ? Colors.primary : "#F1F5F9"}
        />
      ) : (
        <Ionicons
          name={isRTL ? "chevron-back" : "chevron-forward"}
          size={20}
          color="#CBD5E1"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("settings")}</Text>
        <Text style={styles.headerSubtitle}>تخصيص تجربة المنصة بما يناسبك</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>{t("general") || "عام"}</Text>
        <View style={styles.card}>
          <SettingItem
            icon="language-outline"
            label={language === "en" ? "اللغة العربية" : "English Language"}
            description={
              t("change_language_desc") || "تغيير لغة التطبيق بالكامل"
            }
            type="link"
            onPress={handleLanguageChange}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="notifications-outline"
            label="التنبيهات"
            description="مواعيد الاختبارات والتقارير"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            type="toggle"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>الخصوصية والبيانات</Text>
        <View style={styles.card}>
          <SettingItem
            icon="shield-checkmark-outline"
            label="تحسين التجربة"
            description="مشاركة بيانات الاستخدام بشكل مجهول"
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
            type="toggle"
          />
          <View style={styles.separator} />
          <SettingItem
            icon="lock-closed-outline"
            label="تغيير كلمة المرور"
            type="link"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>عن المنصة</Text>
        <View style={styles.card}>
          <SettingItem
            icon="help-circle-outline"
            label="مركز المساعدة"
            type="link"
            onPress={() => {}}
          />
          <View style={styles.separator} />
          <SettingItem
            icon="information-circle-outline"
            label="إصدار التطبيق"
            description="1.0.0 (Latest)"
            type="info"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.logoutText}>{t("logout")}</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: Colors.card,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.textPrimary,
      textAlign: isRTL ? "right" : "left",
    },
    headerSubtitle: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginTop: 4,
      textAlign: isRTL ? "right" : "left",
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      fontSize: 13,
      fontWeight: "700",
      color: Colors.textSecondary,
      marginBottom: 10,
      marginHorizontal: 4,
      textTransform: "uppercase",
      textAlign: isRTL ? "right" : "left",
    },
    card: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    item: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 16,
    },
    itemIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: Colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    itemContent: {
      flex: 1,
      marginHorizontal: 12,
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    itemLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.textPrimary,
    },
    itemDescription: {
      fontSize: 12,
      color: Colors.textSecondary,
      marginTop: 2,
    },
    separator: {
      height: 1,
      backgroundColor: Colors.grayLight,
      marginHorizontal: 16,
    },
    logoutButton: {
      marginTop: 32,
      marginHorizontal: 20,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FEF2F2",
      paddingVertical: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#FEE2E2",
    },
    logoutText: {
      color: Colors.danger,
      fontSize: 16,
      fontWeight: "700",
      marginHorizontal: 8,
    },
  });