import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationType = "success" | "error" | "info";

interface NotificationContextValue {
  show: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return {
    showSuccess: (msg: string) => ctx.show(msg, "success"),
    showError: (msg: string) => ctx.show(msg, "error"),
    showInfo: (msg: string) => ctx.show(msg, "info"),
  };
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const translateY = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<number | null>(null);

  const show = useCallback(
    (msg: string, t: NotificationType = "info") => {
      setMessage(msg);
      setType(t);
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as any);
      }
      timeoutRef.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 3000) as unknown as number;
    },
    [translateY],
  );

  const bgColor =
    type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#2563EB";

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }], backgroundColor: bgColor },
          ]}
          pointerEvents="box-none"
        >
          <View style={styles.inner}>
            <Text style={styles.text} numberOfLines={3}>
              {message}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Animated.timing(translateY, {
                  toValue: -100,
                  duration: 200,
                  useNativeDriver: true,
                }).start(() => setVisible(false));
              }}
              style={styles.close}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    width: width - 40,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
  },
  inner: { flexDirection: "row", alignItems: "center" },
  text: { color: "white", flex: 1, fontSize: 14, fontWeight: "600" },
  close: { marginLeft: 12, paddingHorizontal: 8 },
  closeText: { color: "white", fontSize: 20, lineHeight: 20 },
});

export default NotificationProvider;
