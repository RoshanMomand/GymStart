import apiClient from './api';
import { WorkoutPlan } from '@types/index';

// TODO: Implement workout plan service methods
export const workoutPlanService = {
  getWorkoutPlan: async (): Promise<WorkoutPlan> => {
    const response = await apiClient.get<WorkoutPlan>('/workout-plan');
    return response.data;
  },
};
