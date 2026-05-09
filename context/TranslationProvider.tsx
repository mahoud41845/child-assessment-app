import { Language, translations } from "@/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { I18nManager } from "react-native";

interface TranslationContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType>(null!);

const LANGUAGE_KEY = "language";
const DEFAULT_LANGUAGE: Language = "en";

export const TranslationProvider = ({ children }: any) => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isReady, setIsReady] = useState(false);

  // تحميل اللغة المحفوظة عند بدء التطبيق
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage === "en" || savedLanguage === "ar") {
          setLanguage(savedLanguage);
          applyLayoutDirection(savedLanguage);
        } else {
          applyLayoutDirection(DEFAULT_LANGUAGE);
        }
      } catch (error) {
        console.error("Failed to load language:", error);
        applyLayoutDirection(DEFAULT_LANGUAGE);
      } finally {
        setIsReady(true);
      }
    };

    loadLanguage();
  }, []);

  const applyLayoutDirection = useCallback((lang: Language) => {
    const isRTL = lang === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, []);

  const changeLanguage = useCallback(
    async (newLanguage: Language) => {
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
        setLanguage(newLanguage);
        applyLayoutDirection(newLanguage);
      } catch (error) {
        console.error("Failed to save language:", error);
      }
    },
    [applyLayoutDirection],
  );

  const t = useCallback(
    (key: string) => {
      return translations[key]?.[language] || key;
    },
    [language],
  );

  return (
    <TranslationContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        isRTL: language === "ar",
      }}
    >
      {isReady ? children : null}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};
