import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';

import {AnimatedSplashOverlay} from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import OnboardingScreen from '@/app/onboarding/OnboardingScreen';
import RegisterScreen from '@/app/register/RegisterScreen';
import LoginScreen from '@/app/login/LoginScreen';
import WelcomeScreen from '@/app/WelcomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAsyncStorage} from '@/services/authService';

/**
 * RootNavigator - Handles routing based on auth state
 */
function RootNavigator() {
  const {user, isLoading, isSignOut} = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [currentAuthScreen, setCurrentAuthScreen] = useState<'welcome' | 'login' | 'register'>('welcome');

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        if (user) {
          if (useAsyncStorage) {
            const completed = await AsyncStorage.getItem(`onboardingCompleted_${user.id}`);
            setOnboardingCompleted(completed === 'true');
          }
        } else {
          setOnboardingCompleted(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingCompleted(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  // Show splash while loading auth status
  if (isLoading || isCheckingOnboarding) {
    return <AnimatedSplashOverlay/>;
  }

  // If user is not signed in - show welcome/login/register flow
  if (isSignOut) {
    switch (currentAuthScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onNavigateToRegister={() => setCurrentAuthScreen('register')}
            onNavigateToLogin={() => setCurrentAuthScreen('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen onNavigateToRegister={() => setCurrentAuthScreen('register')}/>
        );
      case 'register':
        return (
          <RegisterScreen onNavigateToLogin={() => setCurrentAuthScreen('login')}/>
        );
    }
  }

  // If the user is signed in but onboarding incomplete - show onboarding
  if (!onboardingCompleted) {
    return <OnboardingScreen onComplete={() => setOnboardingCompleted(true)}/>;
  }

  // User is fully authenticated and onboarding complete - show app
  return <AppTabs/>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator/>
      </AuthProvider>
    </ThemeProvider>
  );
}
