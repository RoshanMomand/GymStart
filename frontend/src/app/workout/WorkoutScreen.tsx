import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ToggleButton from "@/components/ToggleButton";
import ProgressBar from "@/components/ProgressBar";
import ExerciseItem from "@/components/ExerciseItem";
import {ThemedView} from "@/components/themed-view";
import {SafeAreaView} from "react-native-safe-area-context";


export default function Workout() {
    const [mode, setMode] = useState<'training' | 'rest'>('training');


    return (
        <ThemedView style={styles.container}>
            <SafeAreaView>

                {/* Header */}
                <Text style={styles.title}>Workout Plan</Text>
                <Text style={styles.subtitle}>Your daily exercises</Text>

                {/* Toggle */}
                <ToggleButton mode={mode} setMode={setMode}/>

                {/* Card */}
                <View style={styles.card}>

                    <View style={styles.rowBetween}>
                        <Text style={styles.dayTitle}>Monday – Upper Body</Text>
                        <Text style={styles.progressText}>1/6 completed</Text>
                    </View>

                    <ProgressBar progress={0.2}/>
                </View>
                <ScrollView>
                    {/* TODO:: Fetch the exercises linked to the user */}
                    {/* Exercises */}
                    <ExerciseItem title="Push-ups" subtitle="3 sets × 12 reps" completed/>
                    <ExerciseItem title="Bench Press" subtitle="4 sets × 8 reps" completed/>
                    <ExerciseItem title="Pull-ups" subtitle="3 sets × 6 reps" completed/>
                    <ExerciseItem title="Shoulder Press" subtitle="3 sets × 10 reps" />
                    {/* Footer */}
                    <Text style={styles.link}>Can’t Finish workout →</Text>

                    <TouchableOpacity style={styles.finishButton}>
                        <Text style={styles.finishText}>Finish Workout</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0B',
        padding: 16,
    },

    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '700',
    },

    subtitle: {
        color: '#888',
        marginBottom: 16,
    },

    card: {
        backgroundColor: '#151515',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    dayTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

    progressText: {
        color: '#aaa',
    },

    link: {
        color: '#888',
        textAlign: 'center',
        marginVertical: 16,
    },

    finishButton: {
        backgroundColor: '#2A2A2A',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },

    finishText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
