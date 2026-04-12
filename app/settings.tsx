import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [offlineModeEnabled, setOfflineModeEnabled] = useState(false);

  const styles = getStyles(isDark);

  const SettingRow = ({ icon, label, description, toggle, value }: any) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={24}
          color={isDark ? "#4A90E2" : "#0066CC"}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {toggle && (
        <Switch
          value={value}
          onValueChange={toggle}
          trackColor={{ false: "#D1D5DB", true: "#4A90E2" }}
          thumbColor={value ? "#0066CC" : "#E5E7EB"}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name="settings"
            size={40}
            color={isDark ? "#4A90E2" : "#0066CC"}
          />
          <Text style={styles.headerText}>Settings</Text>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.section}>
          <SettingRow
            icon="notifications"
            label="Enable Notifications"
            description="Receive alerts about assessments and updates"
            toggle={setNotificationsEnabled}
            value={notificationsEnabled}
          />
        </View>

        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        <View style={styles.section}>
          <SettingRow
            icon="analytics"
            label="Share Analytics"
            description="Help us improve the app with usage analytics"
            toggle={setAnalyticsEnabled}
            value={analyticsEnabled}
          />
          <SettingRow
            icon="download"
            label="Offline Mode"
            description="Cache data for offline access"
            toggle={setOfflineModeEnabled}
            value={offlineModeEnabled}
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="person"
                size={24}
                color={isDark ? "#4A90E2" : "#0066CC"}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Profile Settings</Text>
              <Text style={styles.settingDescription}>
                Manage your profile information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#8E8E93" : "#CCCCCC"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="lock-closed"
                size={24}
                color={isDark ? "#4A90E2" : "#0066CC"}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingDescription}>
                Update your password
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#8E8E93" : "#CCCCCC"}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="information"
                size={24}
                color={isDark ? "#4A90E2" : "#0066CC"}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingDescription}>App Version 1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons
                name="help-circle"
                size={24}
                color={isDark ? "#4A90E2" : "#0066CC"}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Contact support team
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? "#8E8E93" : "#CCCCCC"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#F5F5F7",
    },
    content: {
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
      paddingVertical: 20,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "700",
      marginLeft: 15,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginTop: 24,
      marginBottom: 12,
      color: isDark ? "#8E8E93" : "#999999",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    section: {
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#2C2C2E" : "#F0F0F2",
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDark ? "#333333" : "#F0F0F2",
      justifyContent: "center",
      alignItems: "center",
    },
    settingContent: {
      flex: 1,
      marginLeft: 12,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#000000",
    },
    settingDescription: {
      fontSize: 12,
      color: isDark ? "#8E8E93" : "#666666",
      marginTop: 4,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 32,
      borderWidth: 1,
      borderColor: "#EF4444",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutButtonText: {
      color: "#EF4444",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
