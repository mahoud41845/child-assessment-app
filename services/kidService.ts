import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.111:5000/api/v1";

export interface Kid {
  _id?: string;
  name: string;
  age: number | string;
  gender: "male" | "female";
}

// دالة جلب الهيدرز مع التوكن
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const kidService = {
  // جلب الكل
  getAllKids: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/kids`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch kids");
    }
    return await response.json();
  },

  // إضافة طفل
  createKid: async (kid: Kid) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/kids`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(kid),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create kid");
    }
    return await response.json();
  },

  // تعديل طفل (Patch)
  updateKid: async (id: string, kid: Partial<Kid>) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/kids/${id}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(kid),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update kid");
    }
    return await response.json();
  },

  // حذف طفل
  deleteKid: async (id: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/kids/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete kid");
    }
    // في الحذف أحياناً يكون الرد فارغاً أو رسالة نجاح
    return await response.json();
  },
};
