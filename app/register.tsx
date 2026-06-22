import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { registerApi } from "@/services/auth";
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
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterScreen() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const styles = getStyles(isRTL);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = t("full_name_required");
    } else if (name.trim().length < 3) {
      newErrors.name = t("name_min_length");
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = t("confirm_password_required");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("passwords_dont_match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerApi(name, email, password);
      router.replace("/(drawer)");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("error");
      Alert.alert(t("error"), errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    name.trim() && email.trim() && password && confirmPassword && !loading;

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
            <Ionicons name="person-add" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{t("create_account")}</Text>
          <Text style={styles.subtitle}>{t("join_platform")}</Text>
        </View>

        {/* General Error */}
        {errors.general && (
          <View style={styles.errorAlert}>
            <Ionicons name="alert-circle" size={20} color={Colors.error} />
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("full_name")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.name && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="person"
                size={20}
                color={errors.name ? Colors.error : Colors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder={t("full_name")}
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                editable={!loading}
              />
            </View>
            {errors.name && (
              <Text style={styles.errorMessage}>{errors.name}</Text>
            )}
          </View>

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
                placeholder={t("email_address")}
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
                placeholder={t("password")}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t("confirmPassword")}</Text>
            <View
              style={[
                styles.inputContainer,
                errors.confirmPassword && styles.inputContainerError,
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={20}
                color={
                  errors.confirmPassword ? Colors.error : Colors.textSecondary
                }
              />
              <TextInput
                style={styles.input}
                placeholder={t("confirmPassword")}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color={Colors.info} />
            <Text style={styles.infoText}>{t("password_requirement")}</Text>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              !isFormValid && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!isFormValid}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.registerButtonText}>
                  {t("create_account")}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t("already_have_account")}</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>{t("sign_in")}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("terms_info")}</Text>
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
      gap: 20,
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
    infoBox: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: `${Colors.info}15`,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      gap: 8,
    },
    infoText: {
      fontSize: 12,
      color: Colors.info,
      fontWeight: "500",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
    },
    registerButton: {
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
    registerButtonDisabled: {
      backgroundColor: `${Colors.primary}80`,
    },
    registerButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    loginContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    loginText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    loginLink: {
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
      lineHeight: 18,
    },
  });
