import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MealsCardProps {
    meals: string[]
}


const MealsCard: React.FC<MealsCardProps> = ({meals}) => {

    //  TODO:: Fetch API call to MealsResource
    // const renderMealsList = () => {
    //     if (meals.length === 0) return (<Text style={styles.value}>No meals planned</Text>)
    //
    //     // Map through the meals and return the name and calories
    // };


    {/*
    When the user opens the app,
    he will get a popup whether he will train or rest based on that it will show the meals*/
    }
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Today's Meals</Text>
            <View style={styles.meal}>
                <Text style={styles.mealText}>Breakfast</Text>
                <Text style={styles.cal}>320 cal</Text>
            </View>

            <View style={styles.meal}>
                <Text style={styles.mealText}>Lunch</Text>
                <Text style={styles.cal}>450 cal</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View All Meals</Text>
            </TouchableOpacity>

            {/* Remove comments */}
            {/*{renderMealsList()}*/}
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    title: {
        color: '#fff',
        marginBottom: 12,
    },
    meal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    mealText: {
        color: '#fff',
    },
    cal: {
        color: '#aaa',
    },
    button: {
        marginTop: 12,
        backgroundColor: '#4ADE80',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
});

export default MealsCard;
