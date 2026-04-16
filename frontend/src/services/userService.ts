import apiClient from './api';
import { User } from '@types/index';

// TODO: Implement user / profile service methods
export const userService = {
  submitOnboarding: async (data: Partial<User>): Promise<void> => {
    await apiClient.post('/user/onboarding', data);
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/profile');
    return response.data;
  },
};
