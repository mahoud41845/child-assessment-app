import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.1.92:5000/api/v1";

 const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const apiService = {
  getCategories: async () => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/categories`, {
      headers,
    });

    const json = await response.json();
    return json.data;
  },

  getTestsByCategory: async (categoryId: string) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${BASE_URL}/tests/category/${categoryId}`, {
        headers,
      });

      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching tests:", error);
      throw error;
    }
  },

  getTestQuestions: async (testId: string) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${BASE_URL}/test-details/test/${testId}`, {
        headers,
      });

      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },
};
