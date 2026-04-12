import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Reports() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const styles = getStyles(isDark);

  const reports = [
    {
      id: "1",
      title: "Q1 2024 Assessment Report",
      date: "2024-03-31",
      children: 4,
      status: "Completed",
    },
    {
      id: "2",
      title: "Individual Progress - Ahmed",
      date: "2024-04-08",
      children: 1,
      status: "Completed",
    },
    {
      id: "3",
      title: "Monthly Development Summary",
      date: "2024-03-30",
      children: 5,
      status: "Completed",
    },
    {
      id: "4",
      title: "Cognitive Skills Analysis",
      date: "2024-04-01",
      children: 3,
      status: "Completed",
    },
  ];

  const renderReport = ({ item }: any) => (
    <TouchableOpacity style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.reportIcon}>
          <Ionicons name="document-text" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <View style={styles.reportMeta}>
            <Text style={styles.reportDate}>{item.date}</Text>
            <Text style={styles.reportChildren}>•</Text>
            <Text style={styles.reportChildren}>{item.children} children</Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={isDark ? "#8E8E93" : "#CCCCCC"}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name="bar-chart"
            size={40}
            color={isDark ? "#4A90E2" : "#0066CC"}
          />
          <Text style={styles.headerText}>Reports</Text>
        </View>

        <TouchableOpacity style={styles.generateButton}>
          <Ionicons name="download" size={24} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Generate Report</Text>
        </TouchableOpacity>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="document" size={32} color="#0066CC" />
            <Text style={styles.summaryValue}>12</Text>
            <Text style={styles.summaryLabel}>Total Reports</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="calendar" size={32} color="#10B981" />
            <Text style={styles.summaryValue}>3</Text>
            <Text style={styles.summaryLabel}>This Month</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Reports</Text>

        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
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
    generateButton: {
      backgroundColor: "#0066CC",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginBottom: 24,
    },
    generateButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 28,
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#000000",
      marginTop: 10,
    },
    summaryLabel: {
      fontSize: 12,
      color: isDark ? "#8E8E93" : "#666666",
      marginTop: 6,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 16,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    reportCard: {
      backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    reportHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    reportIcon: {
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: "#0066CC",
      justifyContent: "center",
      alignItems: "center",
    },
    reportInfo: {
      flex: 1,
      marginLeft: 12,
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#000000",
    },
    reportMeta: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    reportDate: {
      fontSize: 12,
      color: isDark ? "#8E8E93" : "#666666",
    },
    reportChildren: {
      fontSize: 12,
      color: isDark ? "#8E8E93" : "#666666",
      marginHorizontal: 4,
    },
  });
