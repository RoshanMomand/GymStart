import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface WorkoutCardProps {
    workout: string;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({workout}) => {
    return (
        <View style={styles.card}>

            {/* Upper section*/}
            <View style={styles.upperSection}>
                <View style={styles.icon}/>
                <View>
                    <Text style={styles.title}>Today's Workout</Text>
                    <Text style={styles.subtitle}>{workout}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        color: '#fff',
    },
    subtitle: {
        color: '#FFF',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#4ADE80',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#6D28D9',
        marginRight: 12,
    },
    upperSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    }
});

export default WorkoutCard;
