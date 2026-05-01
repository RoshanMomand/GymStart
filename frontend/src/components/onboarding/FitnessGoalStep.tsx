import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface FitnessGoalStepProps {
  value: 'lose_weight' | 'build_muscle' | 'maintain' | null;
  onChange: (value: 'lose_weight' | 'build_muscle' | 'maintain') => void;
}

export default function FitnessGoalStep({ value, onChange }: FitnessGoalStepProps) {
  // Map display names to backend values
  const options: Array<{ display: string; value: 'lose_weight' | 'build_muscle' | 'maintain' }> = [
    { display: 'Weight Loss', value: 'lose_weight' },
    { display: 'Muscle Gain', value: 'build_muscle' },
    { display: 'Maintenance', value: 'maintain' },
  ];

  const styles = StyleSheet.create({
    container: { marginVertical: FitnessSpacing.lg },
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your fitness goal?</Text>
      {options.map(({ display, value: optionValue }) => (
        <TouchableOpacity
          key={optionValue}
          onPress={() => onChange(optionValue)}
          style={[
            styles.optionButton,
            value === optionValue && styles.optionButtonActive,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              value === optionValue && styles.optionTextActive,
            ]}
          >
            {display}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
