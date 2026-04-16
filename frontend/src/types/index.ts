// Shared domain types
// Add interfaces for API response payloads, domain models, etc.

export interface User {
  id: number;
  name: string;
  email: string;
  // TODO: extend with onboarding fields (age, weight, goal, etc.)
}

export interface WorkoutPlan {
  id: number;
  title: string;
  // TODO: extend with exercises, schedule, etc.
}

export interface MealPlan {
  id: number;
  title: string;
  // TODO: extend with meals, calories, macros, etc.
}
