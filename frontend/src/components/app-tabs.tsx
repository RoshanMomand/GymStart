import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';

// import HomeScreen from '@/screens/HomeScreen';
import Workout from '@/app/workout/WorkoutScreen';
import Profile from '@/app/Profile';
import Meals from "@/app/meals/MealsScreen";
import Home from "@/app";


const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#2A2A2A",
                    borderTopWidth: 0,
                },
                tabBarActiveTintColor: '#4ADE80',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarIcon: ({color, size}) => {
                    if (!route.name) return null
                    switch (route.name) {
                        case 'Home':
                            return (<Image
                                source={require('@/assets/images/tabIcons/home.png')}
                                style={{width: size, height: size, tintColor: color}}
                                resizeMode="contain"
                            />);
                        case 'Workout':
                            return (
                                <Image
                                    source={require('@/assets/images/tabIcons/workout.png')}
                                    style={{width: 24, height: 24, tintColor: color}}
                                    resizeMode="contain"
                                />
                            );
                        case 'Meal':
                            return (
                                <Image
                                    source={require('@/assets/images/tabIcons/meal.png')}
                                    style={{width: 24, height: 20, tintColor: color}}
                                    resizeMode="contain"
                                />
                            );
                        case 'Profile':
                            return (<Image
                                source={require('@/assets/images/tabIcons/profile.png')}
                                style={{width: 24, height: 20, tintColor: color}}
                                resizeMode="contain"
                            />)
                    }

                },
            })}
        >
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Workout" component={Workout}/>
            <Tab.Screen name="Meal" component={Meals}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    );
}
