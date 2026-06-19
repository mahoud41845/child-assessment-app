import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.24:5000/api/v1";

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const chatService = {
  getChats: async (kidId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/chat/${kidId}`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const errorData = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };
      throw new Error(errorData.message || "Failed to fetch chats");
    }
    return await response.json();
  },

  sendMessage: async (payload: { kidId: string; message: string }) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const errorData = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };
      throw new Error(errorData.message || "Failed to send message");
    }
    return await response.json();
  },
};
