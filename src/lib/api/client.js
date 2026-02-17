import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '28',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    
    // Attach formatted error message for toast display
    error.userMessage = errorMessage;
    
    return Promise.reject(error);
  }
);

export default apiClient;
