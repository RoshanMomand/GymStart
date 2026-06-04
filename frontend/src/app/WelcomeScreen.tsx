import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {FitnessPalette, FitnessSpacing, FitnessTypography} from '@/constants/fitness-design-tokens';

interface WelcomeScreenProps {
  onNavigateToRegister?: () => void;
  onNavigateToLogin?: () => void;
}

export default function WelcomeScreen({onNavigateToRegister, onNavigateToLogin}: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroPlaceholder}>
            <Ionicons name="barbell-outline" size={64} color="#4ADE80"/>
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Transform your body</Text>
          <Text style={styles.subtitle}>Personal plans tailored to your goals</Text>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onNavigateToRegister}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitnessPalette.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: FitnessSpacing.lg,
    paddingVertical: FitnessSpacing.xl,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FitnessSpacing.xl,
  },
  heroPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: FitnessPalette.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: FitnessPalette.primary,
  },
  heroText: {
    fontSize: 80,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: FitnessSpacing.xl,
  },
  title: {
    fontSize: FitnessTypography.h1.fontSize,
    fontWeight: FitnessTypography.h1.fontWeight as any,
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FitnessTypography.body.fontSize,
    color: FitnessPalette.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    gap: FitnessSpacing.lg,
  },
  primaryButton: {
    backgroundColor: FitnessPalette.primary,
    paddingVertical: FitnessSpacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: FitnessSpacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: FitnessTypography.subtitle.fontSize,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: FitnessSpacing.sm,
  },
  signInText: {
    fontSize: FitnessTypography.bodySmall.fontSize,
    color: FitnessPalette.text.secondary,
  },
  signInLink: {
    fontSize: FitnessTypography.bodySmall.fontSize,
    color: FitnessPalette.primary,
    fontWeight: '600',
  },
});
