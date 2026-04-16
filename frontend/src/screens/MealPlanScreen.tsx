import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO: Implement MealPlanScreen
const MealPlanScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Meal Plan Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MealPlanScreen;
