import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const styles = getStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name="home"
            size={40}
            color={isDark ? "#4A90E2" : "#0066CC"}
          />
          <Text style={styles.headerText}>Welcome to Dashboard</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="people" size={32} color="#4A90E2" />
          <Text style={styles.cardTitle}>Total Children</Text>
          <Text style={styles.cardValue}>5</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="clipboard" size={32} color="#10B981" />
          <Text style={styles.cardTitle}>Pending Assessments</Text>
          <Text style={styles.cardValue}>2</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="bar-chart" size={32} color="#F59E0B" />
          <Text style={styles.cardTitle}>Completed Reports</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <Text style={styles.infoText}>
            Monitor your children's progress and assessments from this
            dashboard.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    card: {
      padding: 20,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: "center",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 14,
      color: isDark ? "#8E8E93" : "#666666",
      marginTop: 12,
      fontWeight: "500",
    },
    cardValue: {
      fontSize: 28,
      fontWeight: "700",
      marginTop: 8,
    },
    infoSection: {
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      padding: 20,
      borderRadius: 12,
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    infoText: {
      fontSize: 14,
      color: isDark ? "#8E8E93" : "#666666",
      lineHeight: 20,
    },
  });
