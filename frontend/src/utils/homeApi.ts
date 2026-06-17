import {API, authHeaders} from '@/utils/api';
import {MealPlan, Profile} from '@/types/home';

export async function fetchProfile(): Promise<Profile | null> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/onboarding/profile`, {headers});
  if (!res.ok) return null;

  const json = await res.json();
  return json.data as Profile;
}

export async function fetchMealPlan(): Promise<MealPlan | null> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/mealplans`, {headers});
  if (!res.ok) return null;

  const json = await res.json();
  return json.data as MealPlan;
}

export async function updateWeight(weightKg: number): Promise<{ delta_kg: number | null } | { error: string }> {
  const headers = await authHeaders();
  const res = await fetch(`${API}/profile/weight`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({weight_kg: weightKg}),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {error: body?.message ?? 'Something went wrong'};
  }

  const json = await res.json();
  return {delta_kg: json.data?.delta_kg ?? null};
}
