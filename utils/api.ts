import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API configuration
export const API_BASE_URL = 'http://10.10.45.109:5001/'; // Replace with your actual API URL

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate client for JWT verification (without automatic token headers)
export const jwtClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (for other API calls)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      try {
        await AsyncStorage.multiRemove(['authToken', 'userData']);
        // You can add navigation logic here if needed
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

// Common API functions
export const authAPI = {
  signup: async (signupData: any) => {
    return apiClient.post('doctor/auth/signup', signupData);
  },
  
  login: async (loginData: any) => {
    return apiClient.post('doctor/auth/login', loginData);
  },
  
  verifyJWT: async (token: string) => {
    return jwtClient.post('doctor/auth/jwt', { token });
  },
  
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
};

// Storage utility functions
export const storage = {
  getToken: async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
  
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },
  
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('authToken', token);
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      return false;
    }
  },
  
  setUserData: async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error setting user data:', error);
      return false;
    }
  },
  
  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
}; 