import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { loginApi } from "@/services/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginScreen() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const styles = getStyles(isRTL);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = t("email_required");  
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("invalid_email");
    }

    if (!password) {
      newErrors.password = t("password_required");
    } else if (password.length < 6) {
      newErrors.password = t("password_min_length");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await loginApi(email, password);
      router.replace("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("login_failed_msg");
      Alert.alert(t("login_failed"), errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && password && !loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{t("app_title")}</Text>
          <Text style={styles.subtitle}>{t("login")}</Text>
        </View>

        {/* General Error */}
        {errors.general && (
          <View style={styles.errorAlert}>
            <Ionicons name="alert-circle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("email_address")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.email && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="mail"
                size={20}
                color={errors.email ? Colors.error : Colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                editable={!loading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorMessage}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("password")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color={errors.password ? Colors.error : Colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorMessage}>{errors.password}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              !isFormValid && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons
                  name={isRTL ? "log-in-outline" : "log-in"}
                  size={20}
                  color="#FFFFFF"
                  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                />
                <Text style={styles.loginButtonText}>{t("login")}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t("dont_have_account")}</Text>
            <Link href="/register" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.registerLink}>{t("sign_up")}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("secure_data_info")}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
      marginTop: 80,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: Colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: Colors.textPrimary,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: Colors.textSecondary,
      textAlign: "center",
    },
    errorAlert: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: `${Colors.error}15`,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 24,
      borderStartWidth: 4,
      borderStartColor: Colors.error,
    },
    errorText: {
      color: Colors.error,
      marginHorizontal: 12,
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
    },
    form: {
      gap: 24,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.textPrimary,
      textAlign: isRTL ? "right" : "left",
    },
    inputContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: "#F9FAFB",
      paddingHorizontal: 16,
      height: 56,
      gap: 12,
    },
    inputContainerError: {
      borderColor: Colors.error,
      backgroundColor: `${Colors.error}08`,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: Colors.textPrimary,
      textAlign: isRTL ? "right" : "left",
    },
    errorMessage: {
      fontSize: 12,
      color: Colors.error,
      fontWeight: "500",
      textAlign: isRTL ? "right" : "left",
    },
    loginButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      backgroundColor: Colors.primary,
      height: 56,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 12,
      elevation: 5,
    },
    loginButtonDisabled: {
      backgroundColor: `${Colors.primary}80`,
    },
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    registerContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    registerText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    registerLink: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.primary,
    },
    footer: {
      marginTop: "auto",
      paddingTop: 24,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: Colors.textSecondary,
      textAlign: "center",
    },
  });
