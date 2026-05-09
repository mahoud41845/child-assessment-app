import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.120.61.28:5000/api/v1";

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
  submitTestResults: async (payload: {
    kidId: string;
    testId: string;
    answers: any[];
  }) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${BASE_URL}/test-results/submit`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit results");
      }

      return await response.json();
    } catch (error) {
      console.error("Error submitting results:", error);
      throw error;
    }
  },
  
};
