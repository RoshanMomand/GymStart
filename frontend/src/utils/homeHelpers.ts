import {Profile} from '@/types/home';

export function getGreeting(): string {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good morning';
  if (hours < 18) return 'Good afternoon';
  return 'Good evening';
}

export function goalWeight(profile: Profile): number {
  const weight = profile.weight_kg;
  const fitnessGoal = profile.fitness_goal;
  if (!weight || !fitnessGoal) return 0;


  switch (fitnessGoal) {
    case 'lose_weight':
      return Math.round((weight - 5) * 10) / 10;
    case 'build_muscle':
      return Math.round((weight + 5) * 10) / 10;
    case 'maintain':
      return weight;
    default:
      return 0;
  }
}

export function formatWeight(number: number): string {
  const roundedToOneDecimal = Math.round(number * 10) / 10;
  return roundedToOneDecimal.toString().replace('.', ',');
}

export function formatLastUpdated(isoString: string): string {
  const diffInSeconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInSeconds / 86400);


  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${diffInMinutes}m ago`;
  if (diffInSeconds < 86400) return `${diffInHours}h ago`;
  return diffInDays === 1 ? 'yesterday' : `${diffInDays} days ago`;
}

export function workoutLabel(profile: Profile | null): string {
  const pref = profile?.workout_preference;

  if (!pref) return 'Training Day';

  const capitalized = pref.charAt(0).toUpperCase() + pref.slice(1);

  return `${capitalized} Workout`;
}

export const GREEN = '#4ADE80';
export const ERROR = '#F87171';
export const CARD = '#1A1A1A';
export const INNER = '#252525';
export const TEXT = '#FFFFFF';
export const MUTED = '#9CA3AF';
