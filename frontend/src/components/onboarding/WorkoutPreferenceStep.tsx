import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';

interface WorkoutPreferenceStepProps {
  value: 'gym' | 'home' | 'outdoor' | null;
  onChange: (value: 'gym' | 'home' | 'outdoor') => void;
}

export default function WorkoutPreferenceStep({value, onChange}: WorkoutPreferenceStepProps) {
  const options: Array<'gym' | 'home' | 'outdoor'> = ['gym', 'home', 'outdoor'];


  const displayName = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where do you prefer to work out?</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onChange(option)}
          style={[
            styles.optionButton,
            value === option && styles.optionButtonActive,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              value === option && styles.optionTextActive,
            ]}
          >
            {displayName(option)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {marginVertical: FitnessSpacing.lg},
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.lg,
  },
  optionButton: {
    paddingVertical: FitnessSpacing.md,
    paddingHorizontal: FitnessSpacing.lg,
    backgroundColor: FitnessPalette.cardBg,
    borderRadius: 12,
    marginBottom: FitnessSpacing.md,
    borderWidth: 2,
    borderColor: FitnessPalette.border,
  },
  optionButtonActive: {
    backgroundColor: FitnessPalette.primary,
    borderColor: FitnessPalette.primary,
  },
  optionText: {
    fontSize: 16,
    color: FitnessPalette.text.primary,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
