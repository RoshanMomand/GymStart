import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface GenderStepProps {
  value: 'male' | 'female' | 'other' | null;
  onChange: (value: 'male' | 'female' | 'other') => void;
}

export default function GenderStep({ value, onChange }: GenderStepProps) {
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
      <Text style={styles.title}>What is your gender?</Text>
      {(['male', 'female', 'other'] as const).map((option) => (
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
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
