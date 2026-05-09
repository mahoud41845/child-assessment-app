import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthResponse {
  status: string;
  token: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
}

const API_BASE_URL = "http://10.120.61.28:5000/api/v1/auth";

export const loginApi = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.status || "Login failed");
    }

    // Save token and user to AsyncStorage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Network error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const registerApi = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.status || "Registration failed");
    }

    // Save token and user to AsyncStorage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Network error occurred");
    }
    throw new Error("An unexpected error occurred");
  }
};
