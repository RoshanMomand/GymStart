import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface ExperienceLevelStepProps {
  value: 'beginner' | 'intermediate' | 'advanced' | null;
  onChange: (value: 'beginner' | 'intermediate' | 'advanced') => void;
}

export default function ExperienceLevelStep({ value, onChange }: ExperienceLevelStepProps) {
  const options = ['beginner', 'intermediate', 'advanced'] as const;

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
      <Text style={styles.title}>What is your fitness experience?</Text>
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
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
