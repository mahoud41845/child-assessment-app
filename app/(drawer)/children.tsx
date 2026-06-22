import { useNotification } from "@/components/notification";
import { Colors } from "@/constants/colors";
import { useTranslation } from "@/context/TranslationProvider";
import { kidService } from "@/services/kidService";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Kid {
  _id: string;
  name: string;
  age: number;
  gender: "male" | "female";
}

export default function ChildrenScreen() {
  const { t, isRTL } = useTranslation();
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const router = useRouter();
  const { showSuccess, showError, showInfo } = useNotification();

  const styles = getStyles(isRTL);

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    try {
      setLoading(true);
      const res = await kidService.getAllKids();
      setKids(res.data || []);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const lower = msg.toLowerCase();
      if (
        lower.includes("token") ||
        lower.includes("expired") ||
        lower.includes("unauthorized") ||
        lower.includes("invalid")
      ) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        showError(t("sessionExpired"));
        router.replace("/login");
      } else {
        showError(msg || t("failedFetchKids"));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setGender("male");
    setIsEditing(false);
    setSelectedId(null);
  };

  const handleSave = async () => {
    if (!name || !age) return showInfo(t("fillAllFields"));
    try {
      const kidData = { name, age: Number(age), gender };
      if (isEditing && selectedId) {
        await kidService.updateKid(selectedId, kidData);
        showSuccess(t("updateChildSuccess"));
      } else {
        await kidService.createKid(kidData);
        showSuccess(t("addChildSuccess"));
      }
      setModalVisible(false);
      resetForm();
      fetchKids();
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      showError(msg || t("error"));
    }
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    Alert.alert(t("deleteChild"), t("areYouSure"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await kidService.deleteKid(id);
            showSuccess(t("deleteChildSuccess"));
            fetchKids();
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            showError(msg || t("deleteError"));
          }
        },
      },
    ]);
  };

  const openEditModal = (kid: Kid) => {
    setSelectedId(kid._id);
    setName(kid.name);
    setAge(String(kid.age));
    setGender(kid.gender);
    setIsEditing(true);
    setModalVisible(true);
  };

  const renderKidCard = ({ item }: { item: Kid }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: item.gender === "male" ? "#EBF5FF" : "#FFF0F6" },
          ]}
        >
          <Ionicons
            name="person"
            size={28}
            color={item.gender === "male" ? "#3B82F6" : "#EC4899"}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.kidName}>{item.name}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.age} {t("years")}
              </Text>
            </View>
            <Text style={styles.genderLabel}>
              {item.gender === "male" ? t("male") : t("female")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/chat", params: { kidId: item._id } })
          }
          style={[styles.iconCircle, { backgroundColor: "#E6FFFA" }]}
        >
          <Ionicons name="chatbubbles-outline" size={18} color="#059669" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/assessment",
              params: { kidId: item._id },
            })
          }
          style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}
        >
          <Ionicons name="school-outline" size={18} color="#0284C7" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openEditModal(item)}
          style={[styles.iconCircle, { backgroundColor: Colors.primaryLight }]}
        >
          <Ionicons name="pencil-sharp" size={18} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerSubtitle}>{t("hello")}</Text>
          <Text style={styles.headerTitle}>{t("childrenList")}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {!loading && kids.length > 0 && (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {t("totalChildrenAdded")}: {kids.length}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={kids}
          keyExtractor={(item) => item._id}
          renderItem={renderKidCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color={Colors.border} />
              <Text style={styles.emptyText}>{t("noChildrenAdded")}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.emptyLink}>{t("addFirstChild")}</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? t("updateData") : t("addNewChild")}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("fullName")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("example")}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("age")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("years")}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <Text style={styles.inputLabel}>{t("gender")}</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === "male" && styles.genderSelectedMale,
                ]}
                onPress={() => setGender("male")}
              >
                <Ionicons
                  name="male"
                  size={18}
                  color={gender === "male" ? "white" : "#718096"}
                />
                <Text
                  style={[
                    styles.genderBtnText,
                    { color: gender === "male" ? "white" : "#718096" },
                  ]}
                >
                  {t("male")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === "female" && styles.genderSelectedFemale,
                ]}
                onPress={() => setGender("female")}
              >
                <Ionicons
                  name="female"
                  size={18}
                  color={gender === "female" ? "white" : "#718096"}
                />
                <Text
                  style={[
                    styles.genderBtnText,
                    { color: gender === "female" ? "white" : "#718096" },
                  ]}
                >
                  {t("female")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {isEditing ? t("saveChanges") : t("addChild")}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (isRTL: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 60,
      marginBottom: 10,
    },
    headerTextGroup: { alignItems: isRTL ? "flex-end" : "flex-start" },
    headerSubtitle: { fontSize: 14, color: Colors.textSecondary },
    headerTitle: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary },
    addButton: {
      backgroundColor: Colors.primary,
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    statsBar: {
      backgroundColor: "#FFF",
      padding: 10,
      borderRadius: 12,
      marginBottom: 15,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#EDF2F7",
    },
    statsText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
    listContainer: { paddingBottom: 40 },
    loaderContainer: { flex: 1, justifyContent: "center" },
    card: {
      backgroundColor: "#FFF",
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      elevation: 2,
    },
    cardContent: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
    },
    avatarContainer: {
      width: 55,
      height: 55,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 15,
    },
    infoSection: { alignItems: isRTL ? "flex-end" : "flex-start", flex: 1 },
    kidName: {
      fontSize: 18,
      fontWeight: "700",
      color: "#2D3748",
      marginBottom: 4,
    },
    badgeRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    badge: {
      backgroundColor: "#F1F5F9",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      marginHorizontal: 8,
    },
    badgeText: { fontSize: 12, color: "#475569", fontWeight: "bold" },
    genderLabel: { fontSize: 13, color: Colors.textSecondary },
    actionContainer: { flexDirection: isRTL ? "row-reverse" : "row", gap: 8 },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      padding: 20,
    },
    modalContent: { backgroundColor: "white", borderRadius: 28, padding: 24 },
    modalHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },
    modalTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
    inputGroup: { marginBottom: 20 },
    inputLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: "#4A5568",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    input: {
      width: "100%",
      height: 54,
      backgroundColor: "#F7FAFC",
      borderRadius: 14,
      paddingHorizontal: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      textAlign: isRTL ? "right" : "left",
    },
    genderContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 30,
      gap: 12,
    },
    genderOption: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      height: 50,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F7FAFC",
      borderWidth: 1,
      borderColor: "#E2E8F0",
      gap: 8,
    },
    genderSelectedMale: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
    genderSelectedFemale: {
      backgroundColor: "#EC4899",
      borderColor: "#EC4899",
    },
    genderBtnText: { fontWeight: "bold", fontSize: 15 },
    saveButton: {
      backgroundColor: Colors.primary,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButtonText: { color: "white", fontSize: 17, fontWeight: "bold" },
    emptyContainer: { alignItems: "center", marginTop: 100 },
    emptyText: {
      marginTop: 20,
      fontSize: 16,
      color: Colors.textTertiary,
      fontWeight: "500",
    },
    emptyLink: { color: Colors.primary, fontWeight: "bold", marginTop: 10 },
  });


//   import { useNotification } from "@/components/notification";
//   import { Colors } from "@/constants/colors";
//   import { kidService } from "@/services/kidService";
//   import { Ionicons } from "@expo/vector-icons";
//   import AsyncStorage from "@react-native-async-storage/async-storage";
//   import { useRouter } from "expo-router";
//   import { useEffect, useState } from "react";
//   import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//   } from "react-native";

//   export default function ChildrenScreen() {
//     const [kids, setKids] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);

//     const [selectedId, setSelectedId] = useState(null);
//     const [name, setName] = useState("");
//     const [age, setAge] = useState("");
//     const [gender, setGender] = useState("male");
//     const router = useRouter();
//     useEffect(() => {
//       fetchKids();
//     }, []);

//     const { showSuccess, showError, showInfo } = useNotification();

//     const fetchKids = async () => {
//       try {
//         setLoading(true);
//         const res = await kidService.getAllKids();
//         setKids(res.data || []);
//       } catch (error) {
//         console.error(error);
//         const msg = error instanceof Error ? error.message : String(error);
//         const lower = msg.toLowerCase();
//         if (
//           lower.includes("token") ||
//           lower.includes("expired") ||
//           lower.includes("unauthorized") ||
//           lower.includes("invalid")
//         ) {
//           await AsyncStorage.removeItem("token");
//           await AsyncStorage.removeItem("user");
//           showError("جلسة منتهية — الرجاء إعادة تسجيل الدخول");
//           router.replace("/login");
//         } else {
//           showError(msg || "فشل في جلب البيانات من الخادم");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleSave = async () => {
//       if (!name || !age) return showInfo("يرجى ملء جميع البيانات");
//       try {
//         const kidData = { name, age: Number(age), gender };
//         if (isEditing && selectedId) {
//           await kidService.updateKid(selectedId, kidData);
//           showSuccess("تم تحديث بيانات الطفل بنجاح");
//         } else {
//           await kidService.createKid(kidData);
//           showSuccess("تم إضافة الطفل بنجاح");
//         }
//         setModalVisible(false);
//         resetForm();
//         fetchKids();
//       } catch (error) {
//         const msg = error instanceof Error ? error.message : String(error);
//         showError(msg || "حدث خطأ أثناء حفظ البيانات");
//       }
//     };

//     const handleDelete = (id) => {
//       if (!id) return;
//       Alert.alert("حذف طفل", "هل أنت متأكد من حذف هذا السجل؟", [
//         { text: "إلغاء", style: "cancel" },
//         {
//           text: "حذف",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await kidService.deleteKid(id);
//               showSuccess("تم حذف الطفل بنجاح");
//               fetchKids();
//             } catch (error) {
//               const msg =
//                 error instanceof Error ? error.message : String(error);
//               showError(msg || "لم يتم الحذف");
//             }
//           },
//         },
//       ]);
//     };

//     const openEditModal = (kid) => {
//       setSelectedId(kid._id || null);
//       setName(kid.name);
//       setAge(String(kid.age));
//       setGender(kid.gender);
//       setIsEditing(true);
//       setModalVisible(true);
//     };

//     const resetForm = () => {
//       setName("");
//       setAge("");
//       setGender("male");
//       setIsEditing(false);
//       setSelectedId(null);
//     };

//     const renderKidCard = ({ item }) => (
//       <View style={styles.card}>
//         <View style={styles.cardContent}>
//           {/* Avatar Section */}
//           <View
//             style={[
//               styles.avatarContainer,
//               {
//                 backgroundColor: item.gender === "male" ? "#EBF5FF" : "#FFF0F6",
//               },
//             ]}
//           >
//             <Ionicons
//               name={item.gender === "male" ? "person" : "person"}
//               size={28}
//               color={item.gender === "male" ? "#3B82F6" : "#EC4899"}
//             />
//           </View>

//           <View style={styles.infoSection}>
//             <Text style={styles.kidName}>{item.name}</Text>
//             <View style={styles.badgeRow}>
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{item.age} سنوات</Text>
//               </View>
//               <Text style={styles.genderLabel}>
//                 {item.gender === "male" ? "ذكر" : "أنثى"}
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.actionContainer}>
//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/chat",
//                 params: { kidId: item._id },
//               })
//             }
//             style={[styles.iconCircle, { backgroundColor: "#E6FFFA" }]}
//           >
//             <Ionicons name="chatbubbles-outline" size={18} color="#059669" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() =>
//               router.push({
//                 pathname: "/assessment",
//                 params: { kidId: item._id },
//               })
//             }
//             style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}
//           >
//             <Ionicons name="school-outline" size={18} color="#0284C7" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => openEditModal(item)}
//             style={[
//               styles.iconCircle,
//               { backgroundColor: Colors.primaryLight },
//             ]}
//           >
//             <Ionicons name="pencil-sharp" size={18} color={Colors.primary} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => handleDelete(item._id)}
//             style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}
//           >
//             <Ionicons name="trash-outline" size={18} color={Colors.danger} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );

//     return (
//       <View style={styles.container}>
//         <StatusBar barStyle="dark-content" />

//         {/* Dynamic Header */}
//         <View style={styles.header}>
//           <View>
//             <Text style={styles.headerSubtitle}>أهلاً بك،</Text>
//             <Text style={styles.headerTitle}>قائمة أطفالك</Text>
//           </View>
//           <TouchableOpacity
//             style={styles.addButton}
//             onPress={() => {
//               resetForm();
//               setModalVisible(true);
//             }}
//           >
//             <Ionicons name="add" size={24} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* Stats Summary */}
//         {!loading && kids.length > 0 && (
//           <View style={styles.statsBar}>
//             <Text style={styles.statsText}>
//               إجمالي الأطفال المضافين: {kids.length}
//             </Text>
//           </View>
//         )}

//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color={Colors.primary} />
//           </View>
//         ) : (
//           <FlatList
//             data={kids}
//             keyExtractor={(item) => item._id || Math.random().toString()}
//             renderItem={renderKidCard}
//             contentContainerStyle={styles.listContainer}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               <View style={styles.emptyContainer}>
//                 <Ionicons
//                   name="people-outline"
//                   size={80}
//                   color={Colors.border}
//                 />
//                 <Text style={styles.emptyText}>لا يوجد أطفال مضافين بعد</Text>
//                 <TouchableOpacity onPress={() => setModalVisible(true)}>
//                   <Text
//                     style={{
//                       color: Colors.primary,
//                       fontWeight: "bold",
//                       marginTop: 10,
//                     }}
//                   >
//                     أضف أول طفل الآن
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             }
//           />
//         )}

//         {/* Stylish Modal */}
//         <Modal visible={modalVisible} animationType="fade" transparent>
//           <View style={styles.modalOverlay}>
//             <KeyboardAvoidingView
//               behavior={Platform.OS === "ios" ? "padding" : "height"}
//               style={styles.modalContent}
//             >
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   {isEditing ? "تحديث البيانات" : "إضافة طفل جديد"}
//                 </Text>
//                 <TouchableOpacity onPress={() => setModalVisible(false)}>
//                   <Ionicons
//                     name="close"
//                     size={24}
//                     color={Colors.textSecondary}
//                   />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>الاسم بالكامل</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="مثال: أحمد محمد"
//                   value={name}
//                   onChangeText={setName}
//                   placeholderTextColor="#A0AEC0"
//                 />
//               </View>

//               <View style={styles.inputGroup}>
//                 <Text style={styles.inputLabel}>العمر</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="سنوات"
//                   value={age}
//                   onChangeText={setAge}
//                   keyboardType="numeric"
//                   placeholderTextColor="#A0AEC0"
//                 />
//               </View>

//               <Text style={styles.inputLabel}>الجنس</Text>
//               <View style={styles.genderContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.genderOption,
//                     gender === "male" && styles.genderSelectedMale,
//                   ]}
//                   onPress={() => setGender("male")}
//                 >
//                   <Ionicons
//                     name="male"
//                     size={18}
//                     color={gender === "male" ? "white" : "#718096"}
//                   />
//                   <Text
//                     style={[
//                       styles.genderBtnText,
//                       { color: gender === "male" ? "white" : "#718096" },
//                     ]}
//                   >
//                     ذكر
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.genderOption,
//                     gender === "female" && styles.genderSelectedFemale,
//                   ]}
//                   onPress={() => setGender("female")}
//                 >
//                   <Ionicons
//                     name="female"
//                     size={18}
//                     color={gender === "female" ? "white" : "#718096"}
//                   />
//                   <Text
//                     style={[
//                       styles.genderBtnText,
//                       { color: gender === "female" ? "white" : "#718096" },
//                     ]}
//                   >
//                     أنثى
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity
//                 style={styles.saveButton}
//                 onPress={handleSave}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.saveButtonText}>
//                   {isEditing ? "حفظ التعديلات" : "إضافة الطفل"}
//                 </Text>
//               </TouchableOpacity>
//             </KeyboardAvoidingView>
//           </View>
//         </Modal>
//       </View>
//     );
//   }

//   const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 20 },
//     header: {
//       flexDirection: "row-reverse",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginTop: 60,
//       marginBottom: 10,
//     },
//     headerSubtitle: {
//       fontSize: 14,
//       color: Colors.textSecondary,
//       textAlign: "right",
//     },
//     headerTitle: {
//       fontSize: 28,
//       fontWeight: "800",
//       color: Colors.textPrimary,
//       textAlign: "right",
//     },
//     addButton: {
//       backgroundColor: Colors.primary,
//       width: 48,
//       height: 48,
//       borderRadius: 14,
//       justifyContent: "center",
//       alignItems: "center",
//       elevation: 4,
//       shadowColor: Colors.primary,
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 8,
//     },
//     statsBar: {
//       backgroundColor: "#FFF",
//       padding: 10,
//       borderRadius: 12,
//       marginBottom: 15,
//       alignItems: "center",
//       borderWidth: 1,
//       borderColor: "#EDF2F7",
//     },
//     statsText: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600" },
//     listContainer: { paddingBottom: 40 },
//     loaderContainer: { flex: 1, justifyContent: "center" },

//     // Card Design
//     card: {
//       backgroundColor: "#FFF",
//       borderRadius: 20,
//       padding: 16,
//       marginBottom: 16,
//       flexDirection: "row-reverse",
//       alignItems: "center",
//       justifyContent: "space-between",
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.05,
//       shadowRadius: 10,
//     },
//     cardContent: {
//       flexDirection: "row-reverse",
//       alignItems: "center",
//       flex: 1,
//     },
//     avatarContainer: {
//       width: 55,
//       height: 55,
//       borderRadius: 18,
//       justifyContent: "center",
//       alignItems: "center",
//       marginLeft: 15,
//     },
//     infoSection: { alignItems: "flex-end", flex: 1 },
//     kidName: {
//       fontSize: 18,
//       fontWeight: "700",
//       color: "#2D3748",
//       marginBottom: 4,
//     },
//     badgeRow: { flexDirection: "row-reverse", alignItems: "center" },
//     badge: {
//       backgroundColor: "#F1F5F9",
//       paddingHorizontal: 8,
//       paddingVertical: 2,
//       borderRadius: 6,
//       marginLeft: 8,
//     },
//     badgeText: { fontSize: 12, color: "#475569", fontWeight: "bold" },
//     genderLabel: { fontSize: 13, color: Colors.textSecondary },

//     actionContainer: { flexDirection: "row", gap: 8 },
//     iconCircle: {
//       width: 36,
//       height: 36,
//       borderRadius: 12,
//       justifyContent: "center",
//       alignItems: "center",
//     },

//     // Modal Styling
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: "rgba(0,0,0,0.4)",
//       justifyContent: "center",
//       padding: 20,
//     },
//     modalContent: {
//       backgroundColor: "white",
//       borderRadius: 28,
//       padding: 24,
//       shadowColor: "#000",
//       shadowOpacity: 0.1,
//       shadowRadius: 20,
//       elevation: 10,
//     },
//     modalHeader: {
//       flexDirection: "row-reverse",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 25,
//     },
//     modalTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
//     inputGroup: { marginBottom: 20 },
//     inputLabel: {
//       fontSize: 14,
//       fontWeight: "700",
//       color: "#4A5568",
//       marginBottom: 8,
//       textAlign: "right",
//     },
//     input: {
//       width: "100%",
//       height: 54,
//       backgroundColor: "#F7FAFC",
//       borderRadius: 14,
//       paddingHorizontal: 15,
//       fontSize: 16,
//       borderWidth: 1,
//       borderColor: "#E2E8F0",
//       textAlign: "right",
//     },
//     genderContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginBottom: 30,
//       gap: 12,
//     },
//     genderOption: {
//       flex: 1,
//       flexDirection: "row",
//       height: 50,
//       borderRadius: 14,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "#F7FAFC",
//       borderWidth: 1,
//       borderColor: "#E2E8F0",
//       gap: 8,
//     },
//     genderSelectedMale: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
//     genderSelectedFemale: {
//       backgroundColor: "#EC4899",
//       borderColor: "#EC4899",
//     },
//     genderBtnText: { fontWeight: "bold", fontSize: 15 },
//     saveButton: {
//       backgroundColor: Colors.primary,
//       height: 56,
//       borderRadius: 16,
//       justifyContent: "center",
//       alignItems: "center",
//       elevation: 4,
//     },
//     saveButtonText: { color: "white", fontSize: 17, fontWeight: "bold" },

//     emptyContainer: { alignItems: "center", marginTop: 100 },
//     emptyText: {
//       marginTop: 20,
//       fontSize: 16,
//       color: Colors.textTertiary,
//       fontWeight: "500",
//     },
//   });
