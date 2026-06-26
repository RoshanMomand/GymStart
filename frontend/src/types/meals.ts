import React from 'react';
import {Ionicons} from '@expo/vector-icons';

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export interface FoodItem {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealSlot {
  slot: number;
  meal_name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: FoodItem[];
}

export interface DayType {
  type: 'training' | 'rest';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: MealSlot[];
}

export interface MealPlan {
  goal: string;
  daily_targets: {calories: number; protein: number; carbs: number; fats: number};
  day_types: DayType[];
}
