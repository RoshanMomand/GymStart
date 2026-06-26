import {useEffect, useState} from 'react';
import {MealPlan} from '@/types/meals';
import {API, authHeaders} from '@/utils/api';

export function useMealPlan() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const headers = await authHeaders();
      const response = await fetch(`${API}/mealplans`, {headers});

      if (!response.ok) {
        const body = await response.json();
        setFetchError(body.message ?? 'Failed to load');
        return;
      }

      const json = await response.json();
      setMealPlan(json.data);
    } catch (error: unknown) {
      setFetchError(error instanceof Error ? error.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return {mealPlan, loading, fetchError};
}
