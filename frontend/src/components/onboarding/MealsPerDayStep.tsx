import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';

interface MealsPerDayStepProps {
  value: number;
  onChange: (value: number) => void;
}

const OPTIONS = [
  {
    count: 3,
    label: '3 Meals',
    description: 'Meal 1 · Meal 2 · Meal 3',
  },
  {
    count: 4,
    label: '4 Meals',
    description: 'Meal 1 · Meal 2 · Meal 3 · Meal 4',
  },
  {
    count: 5,
    label: '5 Meals',
    description: 'Meal 1 · Meal 2 · Meal 3 · Meal 4 · Meal 5',
  },
];

export default function MealsPerDayStep({value, onChange}: MealsPerDayStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How many meals per day?</Text>
      <Text style={styles.subtitle}>
        Your meal plan will be spread across this many meals
      </Text>

      <View style={styles.options}>
        {OPTIONS.map(opt => {
          const active = value === opt.count;
          return (
            <TouchableOpacity
              key={opt.count}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => onChange(opt.count)}
              activeOpacity={0.7}
            >
              <View style={styles.cardLeft}>
                <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.cardDesc}>{opt.description}</Text>
              </View>
              {active && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: FitnessSpacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: FitnessPalette.text.secondary,
    marginBottom: FitnessSpacing.xl,
  },
  options: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FitnessPalette.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: FitnessPalette.border,
  },
  cardActive: {
    borderColor: FitnessPalette.primary,
    backgroundColor: FitnessPalette.primaryDark,
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: FitnessPalette.text.primary,
  },
  cardLabelActive: {
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: 12,
    color: FitnessPalette.text.secondary,
  },
  check: {
    color: FitnessPalette.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
