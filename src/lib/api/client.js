import axios from "axios";
import { toast } from "../hooks/use-toast";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => config,
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
        const isAuthPage =
          window.location.pathname === "/login" ||
          window.location.pathname === "/register";
        if (!isAuthPage) {
          window.location.href = "/login";
        }
      }
    }

    // Extract error message
    const errorMessage = error.response?.data?.message || "An error occurred";

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
