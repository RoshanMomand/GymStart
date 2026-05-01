import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from "react-native";

const API_URL = 'http://127.0.0.1:8000/api';

export const useAsyncStorage = Platform.OS !== 'web';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string | null;
    updatedAt: string | null;
    rememberToken: string | null;
  };
  token: string;
}


class AuthService {

  // Register new user.
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const authData = await response.json();

      // API returns { message, data: { user, token } }
      const token: string = authData.data?.token;
      const user = authData.data?.user;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      if (useAsyncStorage) {
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      return {user, token};
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // LoginScreen existing user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'LoginScreen failed');
      }

      const authData = await response.json();

      // Handle different response formats
      let token, user;

      // Check if response is in new format (data.token, data.user)
      if (authData.data && authData.data.token && authData.data.user) {
        token = authData.data.token;
        user = authData.data.user;
      }
      // Check if response is in old format (token, user at root level)
      else if (authData.token && authData.user) {
        token = authData.token;
        user = authData.user;
      } else {
        console.error('Invalid response format:', authData);
        throw new Error(`Registration failed: Invalid response format. Got: ${JSON.stringify(authData)}`);
      }

      // Save token to AsyncStorage
      if (useAsyncStorage) {
        if (!token || typeof token !== 'string') {
          throw new Error(`Invalid token: ${typeof token} - ${token}`);
        }
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }

      // Return in expected format
      return {token, user};

    } catch (error: any) {
      throw new Error(error.message || 'LoginScreen failed');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      }

      // Clear stored data
      await AsyncStorage.multiRemove(['authToken', 'user', 'userProfile']);
    } catch (error) {
      console.error('Logout error:', error);

      // Still clear local data even if an API call fails
      await AsyncStorage.multiRemove(['authToken', 'user', 'userProfile']);
    }
  }

  /**
   * Get a stored auth token
   */
  async getToken(): Promise<string | null> {
    if (useAsyncStorage) {
      return await AsyncStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Get stored user data
   */
  async getUser() {
    if (useAsyncStorage) {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  /**
   * Check if a user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (useAsyncStorage) {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');

      return !!(token && user);
    }
    return false;
  }

  /**
   * Get authorization headers
   */
  async getAuthHeaders() {
    const token = await this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
}

export default new AuthService();
