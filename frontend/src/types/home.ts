export interface Profile {
  weight_kg: number;
  fitness_goal: 'lose_weight' | 'build_muscle' | 'maintain';
  training_days: number;
  workout_preference: string;
}

export interface MealFood {
  name: string;
  calories: number;
}

export interface MealSlot {
  meal_name: string;
  calories: number;
  foods: MealFood[];
}

export interface MealPlan {
  goal: string;
  day_types: Array<{
    type: string;
    calories: number;
    meals: MealSlot[];
  }>;
}
