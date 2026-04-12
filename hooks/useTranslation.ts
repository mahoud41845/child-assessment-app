import { Language, translations } from "@/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { DevSettings, I18nManager } from "react-native";

const LANGUAGE_KEY = "language";
const DEFAULT_LANGUAGE: Language = "en";

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

   useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage === "en" || savedLanguage === "ar") {
          setLanguage(savedLanguage);
           applyLayoutDirection(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language:", error);
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

  // Change language
  const changeLanguage = useCallback(
    async (newLanguage: Language) => {
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);

        applyLayoutDirection(newLanguage);

        DevSettings.reload();
      } catch (error) {
        console.error("Failed to save language:", error);
      }
    },
    [applyLayoutDirection],
  );

  // Translation function
  const t = useCallback(
    (key: string): string => {
      return translations[key]?.[language] || key;
    },
    [language],
  );

  return {
    language,
    t,
    changeLanguage,
    isRTL: language === "ar",
  };
};
