import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FitnessPalette, FitnessSpacing } from '@/constants/fitness-design-tokens';

interface HeightStepProps {
  value: number;
  onChange: (value: number) => void;
}

export default function HeightStep({ value, onChange }: HeightStepProps) {
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
      <Text style={styles.title}>What is your height?</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={String(value)}
        onChangeText={(text: string) => onChange(parseInt(text) || 0)}
        placeholder="Enter your height in cm"
        placeholderTextColor={FitnessPalette.text.secondary}
      />
      <Text style={styles.hint}>Height: {value} cm</Text>
    </View>
  );
}
