import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';

interface DietaryPreferencesStepProps {
  dietaryPreferences: string[];
  allergies: string[];
  onDietaryPreferencesChange: (value: string[]) => void;
  onAllergiesChange: (value: string[]) => void;
}

const DIETARY_OPTIONS = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
const ALLERGY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Nut-free', 'Egg-free', 'Shellfish-free', 'Soy-free'];

export default function DietaryPreferencesStep({
  dietaryPreferences,
  allergies,
  onDietaryPreferencesChange,
  onAllergiesChange,
}: DietaryPreferencesStepProps) {
  const toggleDietary = (option: string) => {
    if (dietaryPreferences.includes(option)) {
      onDietaryPreferencesChange(dietaryPreferences.filter((i) => i !== option));
    } else {
      onDietaryPreferencesChange([...dietaryPreferences, option]);
    }
  };

  const toggleAllergy = (option: string) => {
    if (allergies.includes(option)) {
      onAllergiesChange(allergies.filter((i) => i !== option));
    } else {
      onAllergiesChange([...allergies, option]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dietary style & allergies</Text>
      <Text style={styles.subtitle}>Optional — skip if none apply</Text>

      <Text style={styles.sectionTitle}>Dietary Style</Text>
      <View style={styles.optionRow}>
        {DIETARY_OPTIONS.map((option) => {
          const selected = dietaryPreferences.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggleDietary(option)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {selected ? '✓ ' : ''}{option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Allergies & Restrictions</Text>
      <View style={styles.optionRow}>
        {ALLERGY_OPTIONS.map((option) => {
          const selected = allergies.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => toggleAllergy(option)}
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: FitnessPalette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: FitnessSpacing.sm,
  },
  sectionSpacing: {
    marginTop: FitnessSpacing.lg,
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
