import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';

interface FoodDislikesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const OPTIONS = [
  'Nuts', 'Dairy', 'Gluten', 'Spicy Food', 'Seafood',
  'Red Meat', 'Pork', 'Mushrooms', 'Onions', 'Garlic',
  'Eggs', 'Soy', 'Raw Fish', 'Bitter Foods', 'Cilantro',
];

export default function FoodDislikesStep({value, onChange}: FoodDislikesStepProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foods to avoid</Text>
      <Text style={styles.subtitle}>Optional — select any foods you dislike</Text>
      <View style={styles.optionRow}>
        {OPTIONS.map((option) => {
          const selected = value.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggle(option)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {selected ? '✓ ' : ''}{option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginVertical: FitnessSpacing.lg},
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: FitnessPalette.text.secondary,
    marginBottom: FitnessSpacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: FitnessPalette.cardBg,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: FitnessPalette.border,
  },
  chipActive: {
    backgroundColor: FitnessPalette.primary,
    borderColor: FitnessPalette.primary,
  },
  chipText: {
    fontSize: 14,
    color: FitnessPalette.text.primary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
