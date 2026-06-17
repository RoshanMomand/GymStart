import AsyncStorage from '@react-native-async-storage/async-storage';

export const API = 'http://127.0.0.1:8000/api';

export async function authHeaders() {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('No token found');

  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}
