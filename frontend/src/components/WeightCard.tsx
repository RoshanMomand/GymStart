import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface WeightCardProps {
    weight :number;
    goal: number;
}

const WeightCard: React.FC<WeightCardProps> = ({weight, goal}) => {
    return (
        <View style={styles.card}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.icon}/>

                <View>
                    <Text style={styles.title}>Your Weight</Text>
                    <Text style={styles.subtitle}>Last updated today</Text>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>

                {/* Left side */}
                <View style={styles.left}>
                    <View style={styles.weightRow}>
                        <Text style={styles.weight}>{weight}</Text>
                        <Text style={styles.unit}>kg</Text>
                    </View>

                    <Text style={styles.change}>↓ 0.5 kg this week</Text>
                </View>

                {/* Right side */}
                <View style={styles.right}>
                    <Text style={styles.goalLabel}>Goal</Text>
                    <Text style={styles.goal}>75 kg</Text>
                </View>

            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Update Weight</Text>
            </TouchableOpacity>

        </View>
    );
}


export default WeightCard;
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#121212',
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    icon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#6D28D9',
        marginRight: 12,
    },

    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    subtitle: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },

    left: {},

    weightRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    weight: {
        color: '#fff',
        fontSize: 48,
        fontWeight: 'bold',
    },

    unit: {
        color: '#aaa',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 4,
        marginBottom: 6,
    },

    change: {
        color: '#10B981',
        marginTop: 6,
        fontSize: 14,
    },

    right: {
        alignItems: 'flex-end',
    },

    goalLabel: {
        color: '#888',
        fontSize: 12,
    },

    goal: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 4,
    },

    button: {
        backgroundColor: '#4ADE80',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },

    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
});
