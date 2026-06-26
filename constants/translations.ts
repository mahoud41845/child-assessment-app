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
  noData: {
    en: "No Data",
    ar: "لا توجد بيانات",
  },
  cancel: {
    en: "Cancel",
    ar: "إلغاء",
  },
  ok: {
    en: "OK",
    ar: "موافق",
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

  // Settings
  general: {
    en: "General",
    ar: "عام",
  },
  change_language_desc: {
    en: "Change app language completely",
    ar: "تغيير لغة التطبيق بالكامل",
  },
  notifications: {
    en: "Notifications",
    ar: "التنبيهات",
  },
  notification_desc: {
    en: "Exam schedules and reports",
    ar: "مواعيد الاختبارات والتقارير",
  },
  privacy: {
    en: "Privacy & Data",
    ar: "الخصوصية والبيانات",
  },
  improve_experience: {
    en: "Improve Experience",
    ar: "تحسين التجربة",
  },
  improve_experience_desc: {
    en: "Share usage data anonymously",
    ar: "مشاركة بيانات الاستخدام بشكل مجهول",
  },
  change_password: {
    en: "Change Password",
    ar: "تغيير كلمة المرور",
  },
  about: {
    en: "About Platform",
    ar: "عن المنصة",
  },
  help_center: {
    en: "Help Center",
    ar: "مركز المساعدة",
  },
  language_change_alert: {
    en: "Change Language",
    ar: "تغيير اللغة",
  },
  language_change_message: {
    en: "The app will restart to apply the new language",
    ar: "سيتم إعادة تشغيل التطبيق لتطبيق اللغة الجديدة",
  },
  customization_subtitle: {
    en: "Customize the platform to suit you",
    ar: "تخصيص تجربة المنصة بما يناسبك",
  },
  app_version: {
    en: "App Version",
    ar: "إصدار التطبيق",
  },
  latest: {
    en: "Latest",
    ar: "أحدث إصدار",
  },
  select_language: {
    en: "Arabic Language",
    ar: "English Language",
  },

  app_title: {
    en: "Child Assessment",
    ar: "تقييم الطفل",
  },
  email_address: {
    en: "Email Address",
    ar: "عنوان البريد الإلكتروني",
  },
  forgot_password: {
    en: "Forgot Password?",
    ar: "نسيت كلمة المرور؟",
  },
  dont_have_account: {
    en: "Don't have an account? ",
    ar: "ليس لديك حساب؟ ",
  },
  sign_up: {
    en: "Sign up",
    ar: "إنشاء حساب جديد",
  },
  secure_data_info: {
    en: "🔒 Your data is secure and encrypted",
    ar: "🔒 بياناتك آمنة ومشفرة",
  },
  email_required: {
    en: "Email is required",
    ar: "البريد الإلكتروني مطلوب",
  },
  invalid_email: {
    en: "Please enter a valid email",
    ar: "يرجى إدخال بريد إلكتروني صحيح",
  },
  password_required: {
    en: "Password is required",
    ar: "كلمة المرور مطلوبة",
  },
  password_min_length: {
    en: "Password must be at least 6 characters",
    ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
  },
  login_failed: {
    en: "Login Failed",
    ar: "فشل تسجيل الدخول",
  },

  create_account: {
    en: "Create Account",
    ar: "إنشاء حساب جديد",
  },
  join_platform: {
    en: "Join our assessment platform",
    ar: "انضم إلى منصة التقييم الخاصة بنا",
  },
  full_name: {
    en: "Full Name",
    ar: "الاسم الكامل",
  },
  full_name_required: {
    en: "Full name is required",
    ar: "الاسم بالكامل مطلوب",
  },
  name_min_length: {
    en: "Name must be at least 3 characters",
    ar: "الاسم يجب أن يكون 3 أحرف على الأقل",
  },
  confirm_password_required: {
    en: "Please confirm your password",
    ar: "يرجى تأكيد كلمة المرور",
  },
  passwords_dont_match: {
    en: "Passwords do not match",
    ar: "كلمات المرور غير متطابقة",
  },
  already_have_account: {
    en: "Already have an account? ",
    ar: "لديك حساب بالفعل؟ ",
  },
  sign_in: {
    en: "Sign in",
    ar: "تسجيل الدخول",
  },
  terms_info: {
    en: "By creating an account, you agree to our Terms & Conditions",
    ar: "بإنشائك للحساب، أنت توافق على الشروط والأحكام الخاصة بنا",
  },
  password_requirement: {
    en: "Password must be at least 6 characters long",
    ar: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  },

  error_loading_questions: {
    en: "Failed to load questions",
    ar: "فشل في تحميل الأسئلة",
  },
  saving_results: {
    en: "Saving results...",
    ar: "جاري حفظ النتائج...",
  },
  save_success: {
    en: "Success",
    ar: "تم بنجاح",
  },
  save_success_msg: {
    en: "Assessment results saved successfully",
    ar: "تم حفظ نتائج التقييم بنجاح",
  },
  error_saving: {
    en: "An error occurred while saving",
    ar: "حدثت مشكلة أثناء الحفظ",
  },
  next: {
    en: "Next",
    ar: "التالي",
  },
  previous: {
    en: "Previous",
    ar: "السابق",
  },
  save_and_submit: {
    en: "Save & Submit",
    ar: "حفظ وإرسال",
  },

  categories_title: {
    en: "Categories",
    ar: "التصنيفات",
  },
  available_tests_title: {
    en: "Available Tests",
    ar: "الاختبارات المتاحة",
  },
  start_journey_desc: {
    en: "Start the journey to explore your child's skills now",
    ar: "ابدأ رحلة استكشاف مهارات طفلك الآن",
  },
  choose_section_desc: {
    en: "Choose the appropriate section to start the assessment",
    ar: "اختر القسم المناسب للبدء بالفحص",
  },
  diagnosis_welcome: {
    en: "Welcome to the Diagnosis Section",
    ar: "مرحباً بك في قسم التشخيص",
  },
  diagnosis_desc: {
    en: "We provide a set of standardized tests to professionally monitor your child's growth.",
    ar: "نقدم لك مجموعة من الاختبارات المقننة لمتابعة نمو طفلك بشكل احترافي.",
  },
  start_new_assessment: {
    en: "Start New Assessment",
    ar: "بدء فحص جديد",
  },
  explore: {
    en: "Explore",
    ar: "استكشاف",
  },
  assessment_test: {
    en: "Assessment Test",
    ar: "اختبار تقييمي",
  },
  fetch_error: {
    en: "Error fetching data",
    ar: "خطأ في جلب البيانات",
  },
  fetch_tests_error: {
    en: "Error fetching tests",
    ar: "خطأ في جلب الاختبارات",
  },
  good_morning: {
    en: "Good Morning",
    ar: "صباح الخير",
  },
  performance_summary: {
    en: "Here is your children's performance summary today",
    ar: "إليك ملخص أداء أطفالك اليوم",
  },
  total_children: {
    en: "Total Children",
    ar: "إجمالي الأطفال",
  },
  tests_completed: {
    en: "Tests Completed",
    ar: "اختبارات منجزة",
  },
  children_reports: {
    en: "Children's Reports",
    ar: "تقارير الأطفال",
  },
  tests_unit: {
    en: "Tests",
    ar: "اختبارات",
  },
  avg_performance: {
    en: "Avg Performance",
    ar: "متوسط الأداء",
  },
  highest_ratio: {
    en: "Highest Ratio",
    ar: "أعلى نسبة",
  },
  lowest_ratio: {
    en: "Lowest Ratio",
    ar: "أقل نسبة",
  },
  latest_level_label: {
    en: "Latest Level",
    ar: "آخر مستوى",
  },
  view_detailed_report: {
    en: "View Detailed Report",
    ar: "عرض التقرير المفصل",
  },
  detailed_results_for: {
    en: "Detailed results for",
    ar: "النتائج التفصيلية لـ",
  },
  missingKidId: {
    en: "Missing child identifier.",
    ar: "معرّف الطفل مفقود.",
  },
  date: {
    en: "Date",
    ar: "التاريخ",
  },
  no_kids_data: {
    en: "No children added or tests conducted yet.",
    ar: "لم يتم إضافة أطفال أو إجراء اختبارات بعد.",
  },
  // إضافة هذه المفاتيح في ملف الترجمة الخاص بك
  sessionExpired: {
    en: "Session expired — please login again",
    ar: "جلسة منتهية — الرجاء إعادة تسجيل الدخول",
  },
  failedFetchKids: {
    en: "Failed to fetch children data",
    ar: "فشل في جلب بيانات الأطفال",
  },
  fillAllFields: { en: "Please fill all fields", ar: "يرجى ملء جميع البيانات" },
  updateChildSuccess: {
    en: "Child data updated successfully",
    ar: "تم تحديث بيانات الطفل بنجاح",
  },
  addChildSuccess: {
    en: "Child added successfully",
    ar: "تم إضافة الطفل بنجاح",
  },
  deleteChild: { en: "Delete Child", ar: "حذف طفل" },
  areYouSure: {
    en: "Are you sure you want to delete this record?",
    ar: "هل أنت متأكد من حذف هذا السجل؟",
  },
  deleteChildSuccess: {
    en: "Child deleted successfully",
    ar: "تم حذف الطفل بنجاح",
  },
  deleteError: { en: "Failed to delete child", ar: "فشل في حذف الطفل" },
  years: { en: "years", ar: "سنوات" },
  hello: { en: "Hello,", ar: "أهلاً بك،" },
  childrenList: { en: "Your Children", ar: "قائمة أطفالك" },
  totalChildrenAdded: { en: "Total children", ar: "إجمالي الأطفال المضافين" },
  noChildrenAdded: {
    en: "No children added yet",
    ar: "لا يوجد أطفال مضافين بعد",
  },
  addFirstChild: { en: "Add your first child now", ar: "أضف أول طفل الآن" },
  admin_dashboard: { en: "Admin Dashboard", ar: "لوحة تحكم المدير" },
  admin_users: { en: "Platform Users", ar: "مستخدمو المنصة" },
  admin_dashboard_title: {
    en: "Platform Overview",
    ar: "نظرة عامة على المنصة",
  },
  admin_dashboard_summary: {
    en: "Pull down to refresh the latest admin metrics.",
    ar: "اسحب للتحديث لعرض أحدث مقاييس المدير.",
  },
  total_users: { en: "Total Users", ar: "إجمالي المستخدمين" },
  total_kids: { en: "Total Kids", ar: "إجمالي الأطفال" },
  total_results: { en: "Total Results", ar: "إجمالي النتائج" },
  avg_score: { en: "Average Score", ar: "متوسط النتيجة" },
  high_cases: { en: "High Cases", ar: "الحالات الحرجة" },
  medium_cases: { en: "Medium Cases", ar: "الحالات المتوسطة" },
  low_cases: { en: "Low Cases", ar: "الحالات المنخفضة" },
  admin_users_subtitle: {
    en: "View all registered users on the platform.",
    ar: "عرض جميع المستخدمين المسجلين على المنصة.",
  },
  admin_users_title: {
    en: "Platform Users",
    ar: "مستخدمي المنصة",
  },
  welcome_admin: {
    en: "Welcome admin",
    ar: "مرحبا",
  },

  delete_user: {
    en: "Delete User",
    ar: "حذف المستخدم",
  },
  delete_user_confirm: {
    en: "Are you sure you want to delete",
    ar: "هل أنت متأكد أنك تريد حذف",
  },
  delete_user_success: {
    en: "User deleted successfully.",
    ar: "تم حذف المستخدم بنجاح.",
  },
  admin_no_users: {
    en: "No users found.",
    ar: "لم يتم العثور على مستخدمين.",
  },
  updateData: { en: "Update Data", ar: "تحديث البيانات" },
  addNewChild: { en: "Add New Child", ar: "إضافة طفل جديد" },
  fullName: { en: "Full Name", ar: "الاسم بالكامل" },
  example: { en: "Example: John Doe", ar: "مثال: أحمد محمد" },
  gender: { en: "Gender", ar: "الجنس" },
  saveChanges: { en: "Save Changes", ar: "حفظ التعديلات" },
  addChild: { en: "Add Child", ar: "إضافة الطفل" },

  smart_assistant: {
    en: "Smart Growth Assistant",
    ar: "مساعد النمو الذكي",
  },
  online_now: {
    en: "Online Now",
    ar: "متصل الآن",
  },
  preparing_chat: {
    en: "Preparing conversation...",
    ar: "جاري تحضير المحادثة...",
  },
  start_chat_now: {
    en: "Start conversation now",
    ar: "ابدأ المحادثة الآن",
  },
  ask_me_anything: {
    en: "Ask me anything about your child's growth",
    ar: "اسألني أي شيء عن نمو طفلك وتطوره",
  },
  assistant_typing: {
    en: "Assistant is thinking...",
    ar: "المساعد يفكر...",
  },
  chat_placeholder: {
    en: "Type your query here...",
    ar: "اكتب استفسارك هنا...",
  },
  write_msg_first: {
    en: "Write a message first",
    ar: "اكتب رسالة أولاً",
  },
  kid_id_missing: {
    en: "Kid ID is missing",
    ar: "رقم الطفل غير موجود",
  },
  test_results: { en: "Test Results", ar: "نتائج الاختبار" },
  go_to_dashboard: { en: "Back to Dashboard", ar: "العودة للرئيسية" },
  score: { en: "Score", ar: "الدرجة" },
  percentage: { en: "Percentage", ar: "النسبة المئوية" },
  level: { en: "Classification", ar: "التصنيف" },
  interpretation: { en: "Diagnosis Interpretation", ar: "التفسير والتشخيص" },
  submitted_at: { en: "Date", ar: "التاريخ" },
  test_summary: { en: "Test Summary", ar: "ملخص الاختبار" },

  based_on_results: {
    en: "Based on all test results",
    ar: "بناءً على جميع نتائج الفحص",
  },

  cases_analysis: {
    en: "Severity Cases Analysis",
    ar: "تحليل الحالات والخطورة",
  },

  system_status: {
    en: "System Status",
    ar: "حالة النظام",
  },

  role_user: {
    en: "User",
    ar: "مستخدم",
  },

  joined_at: {
    en: "Joined",
    ar: "انضم في",
  },

  admin_results_title: {
    en: "Assessment Results",
    ar: "نتائج التقييم",
  },

  no_results_found: {
    en: "No results found for this child",
    ar: "لا توجد نتائج لهذا الطفل حالياً",
  },

  total_score: {
    en: "Total Score",
    ar: "إجمالي الدرجات",
  },

  recommendations: {
    en: "Expert Recommendations",
    ar: "توصيات الخبراء",
  },

  error_loading_result: {
    en: "Error loading result data",
    ar: "خطأ في تحميل بيانات النتيجة",
  },
};
