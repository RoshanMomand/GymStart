import {IoniconsName} from '@/types/meals';

export const BG = '#0B0B0B';

export const SLOT_CONFIG: Record<number, {icon: IoniconsName; iconBg: string}> = {
  1: {icon: 'sunny-outline',      iconBg: '#1C2A1C'},
  2: {icon: 'restaurant-outline', iconBg: '#1A2A25'},
  3: {icon: 'moon-outline',       iconBg: '#1F1C2A'},
  4: {icon: 'nutrition-outline',  iconBg: '#2A1C1C'},
  5: {icon: 'fast-food-outline',  iconBg: '#1C1C2A'},
};

export const WORKOUT_MEAL_CONFIG: Record<string, {icon: IoniconsName; iconBg: string}> = {
  pre_workout:  {icon: 'flash-outline',   iconBg: '#1A2200'},
  post_workout: {icon: 'barbell-outline', iconBg: '#001A1A'},
};
