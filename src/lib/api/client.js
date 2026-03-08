import axios from "axios";
import { toast } from "../hooks/use-toast";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for dynamic headers
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // console.error("API Error:", error.response.data);

    // If unauthorized, redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    // Extract error message from response (e.g., { message: "..." })
    const errorMessage = error.response?.data?.message || "An error occurred";

    // Standardize error message property
    error.message = errorMessage;

    // if (error?.errors && Array.isArray(error?.errors)) {
    //   console.error("Validation errors: ", error.errors);
    // }

    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });

    // Maintain userMessage for compatibility
    error.userMessage = errorMessage;

    return Promise.reject(error);
  },
);

export default apiClient;
