import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@screens/HomeScreen';
import WorkoutPlanScreen from '@screens/WorkoutPlanScreen';
import MealPlanScreen from '@screens/MealPlanScreen';
import ProfileScreen from '@screens/ProfileScreen';

import { RootStackParamList, TabParamList } from '@types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// TODO: Replace placeholder tab navigator with styled bottom tab bar
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
      <Tab.Screen name="MealPlan" component={MealPlanScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* TODO: Add onboarding / auth stack before tabs */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
