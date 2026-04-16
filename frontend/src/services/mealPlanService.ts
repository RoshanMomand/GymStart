import apiClient from './api';
import { MealPlan } from '@types/index';

// TODO: Implement meal plan service methods
export const mealPlanService = {
  getMealPlan: async (): Promise<MealPlan> => {
    const response = await apiClient.get<MealPlan>('/meal-plan');
    return response.data;
  },
};
