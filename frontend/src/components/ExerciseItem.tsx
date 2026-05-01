import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {
    title: string;
    subtitle: string;
    completed?: boolean;
};

export default function ExerciseItem({title, subtitle, completed}: Props) {
    return (
        <View style={styles.container}>

            <View style={styles.left}>
                <View style={styles.icon}/>

                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>


            <View style={[styles.circle, completed && styles.completed]}/>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#123D2F',
        marginRight: 12,
    },

    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    subtitle: {
        color: '#888',
        marginTop: 2,
    },

    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#555',
    },

    completed: {
        backgroundColor: '#4ADE80',
        borderColor: '#4ADE80',
    },
});
