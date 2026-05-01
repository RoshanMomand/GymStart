import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface ActivityLevelStepProps {
  value: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  onChange: (value: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active') => void;
}

export default function ActivityLevelStep({ value, onChange }: ActivityLevelStepProps) {
  const options = ['sedentary', 'light', 'moderate', 'active', 'very_active'] as const;

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

  const displayName = (text: string) => {
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your activity level?</Text>
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
