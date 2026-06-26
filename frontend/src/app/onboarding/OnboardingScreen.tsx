import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';
import {useAuth} from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GenderStep from '@/components/onboarding/GenderStep';
import AgeStep from '@/components/onboarding/AgeStep';
import HeightStep from '@/components/onboarding/HeightStep';
import WeightStep from '@/components/onboarding/WeightStep';
import FitnessGoalStep from '@/components/onboarding/FitnessGoalStep';
import ExperienceLevelStep from '@/components/onboarding/ExperienceLevelStep';
import ActivityLevelStep from '@/components/onboarding/ActivityLevelStep';
import TrainingDaysStep from '@/components/onboarding/TrainingDaysStep';
import WorkoutPreferenceStep from '@/components/onboarding/WorkoutPreferenceStep';
import FoodPreferencesStep from '@/components/onboarding/FoodPreferencesStep';
import DietaryPreferencesStep from '@/components/onboarding/DietaryPreferencesStep';
import FoodDislikesStep from '@/components/onboarding/FoodDislikesStep';
import MealsPerDayStep from '@/components/onboarding/MealsPerDayStep';
import {SafeAreaView} from 'react-native-safe-area-context';

interface OnboardingFormData {
  gender: 'male' | 'female' | 'other' | null;
  age: number;
  height_cm: number;
  weight_kg: number;
  fitness_goal: 'lose_weight' | 'build_muscle' | 'maintain' | null;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | null;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  training_days: number;
  workout_preference: 'gym' | 'home' | 'outdoor' | null;
  food_preferences: string[];
  dietary_preferences: string[];
  allergies: string[];
  food_dislikes: string[];
  meals_per_day: number;
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 13;

export default function OnboardingScreen({onComplete}: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuth();

  const [formData, setFormData] = useState<OnboardingFormData>({
    gender: null,
    age: 25,
    height_cm: 175,
    weight_kg: 75,
    fitness_goal: null,
    experience_level: null,
    activity_level: null,
    training_days: 3,
    workout_preference: null,
    food_preferences: [],
    dietary_preferences: [],
    allergies: [],
    food_dislikes: [],
    meals_per_day: 4,
  });

  const updateFormData = <K extends keyof OnboardingFormData>(field: K,
    value: OnboardingFormData[K]) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.gender !== null;
      case 2:
        return formData.age >= 13 && formData.age <= 120;
      case 3:
        return formData.height_cm >= 100 && formData.height_cm <= 250;
      case 4:
        return formData.weight_kg >= 30 && formData.weight_kg <= 500;
      case 5:
        return formData.fitness_goal !== null;
      case 6:
        return formData.experience_level !== null;
      case 7:
        return formData.activity_level !== null;
      case 8:
        return formData.training_days >= 1 && formData.training_days <= 7;
      case 9:
        return formData.workout_preference !== null;
      case 10:
        return formData.food_preferences.length > 0;
      case 11:
      case 12:
        return true;
      case 13:
        return formData.meals_per_day >= 3 && formData.meals_per_day <= 5;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'No authentication token found. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/onboarding', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          gender: formData.gender,
          age: formData.age,
          height_cm: formData.height_cm,
          weight_kg: formData.weight_kg,
          fitness_goal: formData.fitness_goal,
          experience_level: formData.experience_level,
          activity_level: formData.activity_level,
          training_days: formData.training_days,
          workout_preference: formData.workout_preference,
          food_preferences: formData.food_preferences,
          dietary_preferences: formData.dietary_preferences,
          allergies: formData.allergies,
          food_dislikes: formData.food_dislikes,
          meals_per_day: formData.meals_per_day,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save onboarding data');
      }

      await AsyncStorage.setItem(`onboardingCompleted_${user!.id}`, 'true');
      onComplete();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save onboarding data';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenderStep
            value={formData.gender}
            onChange={(value) => updateFormData('gender', value)}
          />
        );
      case 2:
        return (
          <AgeStep
            value={formData.age}
            onChange={(value) => updateFormData('age', value)}
          />
        );
      case 3:
        return (
          <HeightStep
            value={formData.height_cm}
            onChange={(value) => updateFormData('height_cm', value)}
          />
        );
      case 4:
        return (
          <WeightStep
            value={formData.weight_kg}
            onChange={(value) => updateFormData('weight_kg', value)}
          />
        );
      case 5:
        return (
          <FitnessGoalStep
            value={formData.fitness_goal}
            onChange={(value) => updateFormData('fitness_goal', value)}
          />
        );
      case 6:
        return (
          <ExperienceLevelStep
            value={formData.experience_level}
            onChange={(value) => updateFormData('experience_level', value)}
          />
        );
      case 7:
        return (
          <ActivityLevelStep
            value={formData.activity_level}
            onChange={(value) => updateFormData('activity_level', value)}
          />
        );
      case 8:
        return (
          <TrainingDaysStep
            value={formData.training_days}
            onChange={(value) => updateFormData('training_days', value)}
          />
        );
      case 9:
        return (
          <WorkoutPreferenceStep
            value={formData.workout_preference}
            onChange={(value) => updateFormData('workout_preference', value)}
          />
        );
      case 10:
        return (
          <FoodPreferencesStep
            value={formData.food_preferences}
            onChange={(value) => updateFormData('food_preferences', value)}
          />
        );
      case 11:
        return (
          <DietaryPreferencesStep
            dietaryPreferences={formData.dietary_preferences}
            allergies={formData.allergies}
            onDietaryPreferencesChange={(value) => updateFormData('dietary_preferences', value)}
            onAllergiesChange={(value) => updateFormData('allergies', value)}
          />
        );
      case 12:
        return (
          <FoodDislikesStep
            value={formData.food_dislikes}
            onChange={(value) => updateFormData('food_dislikes', value)}
          />
        );
      case 13:
        return (
          <MealsPerDayStep
            value={formData.meals_per_day}
            onChange={(value) => updateFormData('meals_per_day', value)}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;
  const stepValid = isStepValid();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${progressPercentage}%`}]}/>
          </View>

          <View style={styles.stepContainer}>{renderStep()}</View>

          <View style={styles.navigationContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.navButton, styles.navButtonSecondary]}
                disabled={isLoading}
              >
                <Text style={[styles.navButtonText, styles.navButtonTextSecondary]}>
                  ← Back
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                (!stepValid || isLoading) && styles.navButtonDisabled,
              ]}
              disabled={!stepValid || isLoading}
            >
              <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
                {isLoading ? 'Saving...' : currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitnessPalette.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: FitnessSpacing.lg,
    paddingTop: FitnessSpacing.lg,
    paddingBottom: FitnessSpacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: FitnessPalette.border,
    borderRadius: 2,
    marginBottom: FitnessSpacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: FitnessPalette.primary,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    minHeight: 300,
    marginVertical: FitnessSpacing.lg,
  },
  navigationContainer: {
    marginTop: FitnessSpacing.xl,
    gap: FitnessSpacing.md,
    flexDirection: 'row',
  },
  navButton: {
    flex: 1,
    paddingVertical: FitnessSpacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPrimary: {
    backgroundColor: FitnessPalette.primary,
  },
  navButtonSecondary: {
    backgroundColor: FitnessPalette.cardBg,
    borderWidth: 1,
    borderColor: FitnessPalette.border,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  navButtonTextPrimary: {
    color: '#FFFFFF',
  },
  navButtonTextSecondary: {
    color: FitnessPalette.text.primary,
  },
});
