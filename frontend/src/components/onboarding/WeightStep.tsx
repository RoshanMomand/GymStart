import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface WeightStepProps {
  value: number;
  onChange: (value: number) => void;
}

export default function WeightStep({ value, onChange }: WeightStepProps) {
  const styles = StyleSheet.create({
    container: { marginVertical: FitnessSpacing.lg },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: FitnessPalette.text.primary,
      marginBottom: FitnessSpacing.lg,
    },
    input: {
      paddingVertical: FitnessSpacing.md,
      paddingHorizontal: FitnessSpacing.lg,
      backgroundColor: FitnessPalette.cardBg,
      borderRadius: 12,
      marginBottom: FitnessSpacing.md,
      borderWidth: 1,
      borderColor: FitnessPalette.border,
      fontSize: 16,
      color: FitnessPalette.text.primary,
    },
    hint: {
      fontSize: 14,
      color: FitnessPalette.text.secondary,
      marginBottom: FitnessSpacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your weight?</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={String(value)}
        onChangeText={(text: string) => onChange(parseInt(text) || 0)}
        placeholder="Enter your weight in kg"
        placeholderTextColor={FitnessPalette.text.secondary}
      />
      <Text style={styles.hint}>Weight: {value} kg</Text>
    </View>
  );
}
