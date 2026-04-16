import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO: Implement WorkoutPlanScreen
const WorkoutPlanScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Workout Plan Screen</Text>
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

export default WorkoutPlanScreen;
