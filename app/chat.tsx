import { useNotification } from "@/components/notification";
import { Colors } from "@/constants/colors";
import { chatService } from "@/services/chatService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");

export default function ChatScreen() {
  const { kidId } = useLocalSearchParams();
  const router = useRouter();
  const { showError } = useNotification();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState("");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchChats();
  }, [kidId]);

  const normalizeChatResponse = (res: any) => {
    if (Array.isArray(res)) return res;
    if (!res) return [];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.messages)) return res.messages;
    if (Array.isArray(res.chat)) return res.chat;
    if (Array.isArray(res.conversation)) return res.conversation;
    return [];
  };

  const fetchChats = async () => {
    try {
      if (!kidId) {
        showError("رقم الطفل غير موجود");
        setMessages([]);
        return;
      }
      const res = await chatService.getChats(String(kidId));
      const data = normalizeChatResponse(res);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "حدث خطأ غير متوقع";
  };

  //   const handleSend = async () => {
  //     if (!text.trim()) return showError("اكتب رسالة أولاً");

  //     const userMsg = text.trim();
  //     setText("");

  //     const newMessage = {
  //       _id: Date.now().toString(),
  //       message: userMsg,
  //       sender: "user",
  //       createdAt: new Date(),
  //     };

  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //     setMessages((prev) => [...(Array.isArray(prev) ? prev : []), newMessage]);
  //     scrollToBottom();

  //     try {
  //       setIsTyping(true);

  //       await chatService.sendMessage({
  //         kidId: String(kidId),
  //         message: userMsg,
  //       });

  //       await fetchChats();
  //     } catch (error) {
  //       showError(getErrorMessage(error));
  //     } finally {
  //       setIsTyping(false);
  //     }
  //   };

  const handleSend = async () => {
    if (!text.trim()) {
      return showError("اكتب رسالة أولاً");
    }

    const userMsg = text.trim();
    setText("");

    // إضافة رسالة المستخدم مباشرة
    const userMessage = {
      _id: Date.now().toString(),
      message: userMsg,
      sender: "user",
      createdAt: new Date(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...(Array.isArray(prev) ? prev : []), userMessage]);
    scrollToBottom();

    try {
      setIsTyping(true);

      const res = await chatService.sendMessage({
        kidId: String(kidId),
        message: userMsg,
      });

      console.log("CHAT RESPONSE:", res);

      const data = res.data;

      let botMessage = "No response";

      switch (data?.type) {
        case "reassurance":
          botMessage = data.message;
          break;

        case "info":
          botMessage = data.explanation;
          break;

        case "guidance":
          botMessage = `${data.reason}\n\n• ${data.solutions.join("\n• ")}`;
          break;

        case "mixed":
          botMessage = `${data.reassurance}\n\n${data.guidance.reason}\n\n• ${data.guidance.solutions.join(
            "\n• ",
          )}`;
          break;

        default:
          botMessage =
            data?.message || data?.explanation || data?.reason || "No response";
      }

      const botReply = {
        _id: (Date.now() + 1).toString(),
        message: botMessage,
        sender: "bot",
        createdAt: new Date(),
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setMessages((prev) => [...prev, botReply]);

      scrollToBottom();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setIsTyping(false);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isUser = item.sender === "user" || item.from === "user";
    const showTime = true;

    return (
      <View
        style={[styles.msgWrapper, isUser ? styles.msgRight : styles.msgLeft]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
        )}
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        >
          <Text
            style={[styles.msgText, isUser ? styles.userText : styles.botText]}
          >
            {item.message || item.text}
          </Text>
          {item.createdAt && (
            <Text
              style={[styles.time, isUser ? styles.userTime : styles.botTime]}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.botAvatar}>
        <Ionicons name="sparkles" size={14} color="#fff" />
      </View>
      <View style={styles.typingBubble}>
        <ActivityIndicator size="small" color={Colors.textSecondary} />
        <Text style={styles.typingText}>المساعد يفكر...</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>مساعد النمو الذكي</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.subtitle}>متصل الآن</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.infoBtn}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>جاري تحضير المحادثة...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item, idx) => item._id || idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={60}
                  color={Colors.border}
                />
                <Text style={styles.emptyTitle}>ابدأ المحادثة الآن</Text>
                <Text style={styles.emptySub}>
                  اسألني أي شيء عن نمو طفلك وتطوره
                </Text>
              </View>
            }
            ListFooterComponent={
              isTyping ? <TypingIndicator /> : <View style={{ height: 20 }} />
            }
          />
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="اكتب استفسارك هنا..."
              style={styles.input}
              multiline
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!text.trim() || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color="#fff"
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerTitleContainer: { flex: 1, alignItems: "flex-end", marginRight: 12 },
  title: { fontSize: 17, fontWeight: "800", color: Colors.textPrimary },
  statusRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginLeft: 4,
  },
  subtitle: { fontSize: 11, color: Colors.textSecondary },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBtn: { padding: 4 },

  content: { flex: 1 },
  list: { padding: 16, paddingBottom: 30 },

  msgWrapper: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },

  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  bubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  msgText: { fontSize: 15, lineHeight: 22 },
  userText: { color: "#FFFFFF" },
  botText: { color: "#1E293B" },

  time: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  userTime: { color: "rgba(255,255,255,0.7)" },
  botTime: { color: "#94A3B8" },

  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    gap: 8,
  },
  typingText: { fontSize: 12, color: Colors.textSecondary },

  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  inputRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 100,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    textAlign: "right",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: Colors.textSecondary, fontSize: 14 },
});
