import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.64:5000/api/v1";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const adminService = {
  getAdminDashboard: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers,
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to load admin dashboard");
    }

    return json.data;
  },

  getAdminUsers: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers,
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to load admin users");
    }

    return json;
  },
};
