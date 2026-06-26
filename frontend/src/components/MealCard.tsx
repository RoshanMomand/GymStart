import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {MealSlot} from '@/types/meals';
import {CARD, GREEN, INNER, MUTED, TEXT} from '@/utils/homeHelpers';

interface Props {
  meal:        MealSlot;
  mealKey:     string;
  isCompleted: boolean;
  onToggle:    (key: string) => void;
  onInfo:      (meal: MealSlot) => void;
}

export default function MealCard({meal, mealKey, isCompleted, onToggle, onInfo}: Props) {
  const mealPreview  = meal.foods.slice(0, 2).map(food => food.name).join(' & ');
  const allFoodNames = meal.foods.map(food => food.name).join(', ');

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}/>
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{meal.meal_name}</Text>
            <View style={styles.kcalBadge}>
              <Text style={styles.kcalText}>{meal.calories} kcal</Text>
            </View>
            <TouchableOpacity style={styles.infoBtn} onPress={() => onInfo(meal)}>
              <Ionicons name="information-circle-outline" size={20} color="#888"/>
            </TouchableOpacity>
          </View>
          <Text style={styles.foodTitle}>{mealPreview}</Text>
          <Text style={styles.ingredients} numberOfLines={1}>{allFoodNames}</Text>
        </View>
      </View>

      <Text style={styles.macros}>
        P: {meal.protein}g{'  '}|{'  '}C: {meal.carbs}g{'  '}|{'  '}F: {meal.fats}g
      </Text>

      <TouchableOpacity
        style={[styles.completeBtn, isCompleted && styles.completeBtnDone]}
        onPress={() => onToggle(mealKey)}
      >
        <Text style={[styles.completeBtnText, isCompleted && styles.completeBtnTextDone]}>
          {isCompleted ? 'Meal Completed' : 'Complete meal'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card:             {backgroundColor: CARD, borderRadius: 16, padding: 14, gap: 10},
  header:           {flexDirection: 'row', gap: 12},
  icon:             {width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  titleBlock:       {flex: 1, gap: 3},
  titleRow:         {flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap'},
  name:             {color: TEXT, fontSize: 16, fontWeight: '700'},
  kcalBadge:        {backgroundColor: '#14532D', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20},
  kcalText:         {color: GREEN, fontSize: 12, fontWeight: '600'},
  infoBtn:          {width: 22, height: 22, borderRadius: 11, backgroundColor: INNER, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto'},
  foodTitle:        {color: TEXT, fontSize: 14, fontWeight: '600'},
  ingredients:      {color: MUTED, fontSize: 12},
  macros:           {color: MUTED, fontSize: 12, textAlign: 'right'},
  completeBtn:      {backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  completeBtnDone:  {backgroundColor: INNER},
  completeBtnText:  {color: '#111', fontWeight: '700', fontSize: 14},
  completeBtnTextDone: {color: MUTED},
});
