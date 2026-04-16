import axios from 'axios';

// Base URL — set via environment variable in production.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// TODO: Add request interceptor for auth token
// TODO: Add response interceptor for error handling

export default apiClient;
