export type Language = "en" | "ar";

export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Authentication
  login: {
    en: "Login",
    ar: "تسجيل الدخول",
  },
  register: {
    en: "Register",
    ar: "إنشاء حساب",
  },
  logout: {
    en: "Logout",
    ar: "تسجيل الخروج",
  },

  // Navigation
  dashboard: {
    en: "Dashboard",
    ar: "لوحة التحكم",
  },
  children: {
    en: "Children",
    ar: "الأطفال",
  },
  assessments: {
    en: "Assessments",
    ar: "التقييمات",
  },
  reports: {
    en: "Reports",
    ar: "التقارير",
  },
  settings: {
    en: "Settings",
    ar: "الإعدادات",
  },

  // Settings
  language: {
    en: "Language",
    ar: "اللغة",
  },
  switchToArabic: {
    en: "Switch to Arabic",
    ar: "التبديل إلى العربية",
  },
  switchToEnglish: {
    en: "Switch to English",
    ar: "التبديل إلى الإنجليزية",
  },

  // Common
  save: {
    en: "Save",
    ar: "حفظ",
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
  },
  loading: {
    en: "Loading...",
    ar: "جارٍ التحميل...",
  },
  error: {
    en: "Error",
    ar: "خطأ",
  },
  success: {
    en: "Success",
    ar: "نجح",
  },

  // Form fields
  email: {
    en: "Email",
    ar: "البريد الإلكتروني",
  },
  password: {
    en: "Password",
    ar: "كلمة المرور",
  },
  name: {
    en: "Name",
    ar: "الاسم",
  },
  confirmPassword: {
    en: "Confirm Password",
    ar: "تأكيد كلمة المرور",
  },
};
