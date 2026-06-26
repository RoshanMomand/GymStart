import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ToggleButton from '@/components/ToggleButton';
import {MealSlot} from '@/types/meals';
import {useMealPlan} from '@/hooks/useMealPlan';
import DailyTotalsCard from '@/components/DailyTotalsCard';
import MealCard from '@/components/MealCard';
import MealInfoModal from '@/components/MealInfoModal';
import {BG} from '@/utils/mealsHelpers';
import {MUTED, TEXT} from '@/utils/homeHelpers';

export default function MealsScreen() {
  const {mealPlan, loading, fetchError} = useMealPlan();
  const [selectedDayType, setSelectedDayType] = useState<'training' | 'rest'>('training');
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [infoMeal, setInfoMeal] = useState<MealSlot | null>(null);

  const activeDay = mealPlan?.day_types.find(day => day.type === selectedDayType) ?? mealPlan?.day_types[0];
  const sortedMeals = activeDay ? [...activeDay.meals].sort((mealA, mealB) => mealA.slot - mealB.slot) : [];

  const handleToggleComplete = (mealKey: string) => {
    setCompletedMeals(previousCompleted => {
      const updatedCompleted = new Set(previousCompleted);
      updatedCompleted.has(mealKey) ? updatedCompleted.delete(mealKey) : updatedCompleted.add(mealKey);
      return updatedCompleted;
    });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{flex: 1}}>

        <View style={styles.header}>
          <Text style={styles.title}>Meal Plan</Text>
          <Text style={styles.subtitle}>Your daily nutrition</Text>
        </View>

        <ToggleButton mode={selectedDayType} setMode={setSelectedDayType}/>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator color="#4ADE80" size="large"/>
          </View>
        )}

        {!loading && fetchError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{fetchError}</Text>
          </View>
        )}

        {!loading && !fetchError && mealPlan && activeDay && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            <DailyTotalsCard
              calories={activeDay.calories}
              protein={activeDay.protein}
              carbs={activeDay.carbs}
              fats={activeDay.fats}
            />
            {sortedMeals.map(meal => {
              const mealKey = `${selectedDayType}_slot_${meal.slot}`;
              return (
                <MealCard
                  key={mealKey}
                  meal={meal}
                  mealKey={mealKey}
                  isCompleted={completedMeals.has(mealKey)}
                  onToggle={handleToggleComplete}
                  onInfo={setInfoMeal}
                />
              );
            })}
          </ScrollView>
        )}

        {!loading && !fetchError && !mealPlan && (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No meal plan yet. Complete onboarding to generate
              one.</Text>
          </View>
        )}

      </SafeAreaView>

      <MealInfoModal meal={infoMeal} onClose={() => setInfoMeal(null)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: BG, paddingHorizontal: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40},
  scroll: {gap: 12, paddingBottom: 32},
  header: {paddingTop: 8, paddingBottom: 12},
  title: {color: TEXT, fontSize: 28, fontWeight: '800'},
  subtitle: {color: MUTED, fontSize: 14, marginTop: 2},
  errorBox: {margin: 16, padding: 16, backgroundColor: '#7F1D1D', borderRadius: 12},
  errorText: {color: TEXT, fontSize: 14},
  emptyText: {color: MUTED, textAlign: 'center', paddingHorizontal: 24},
});
