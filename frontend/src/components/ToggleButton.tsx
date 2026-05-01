import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type ToggleButtonProps = {
    mode: 'training' | 'rest';
    setMode: (value: 'training' | 'rest') => void;
};

export default function ToggleButton({mode, setMode}: ToggleButtonProps) {
    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={[styles.tab, mode === 'training' && styles.active]}
                onPress={() => setMode('training')}
            >
                <Text style={[styles.text, mode === 'training' && styles.activeText]}>
                    Training Day
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, mode === 'rest' && styles.active]}
                onPress={() => setMode('rest')}
            >
                <Text style={[styles.text, mode === 'rest' && styles.activeText]}>
                    Rest Day
                </Text>
            </TouchableOpacity>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 4,
        marginBottom: 8,
    },

    tab: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal:38,
        borderRadius: 12,
        alignItems: 'center',
    },

    active: {
        backgroundColor: '#4ADE80',
    },

    text: {
        color: '#888',
        fontWeight: '500',
    },

    activeText: {
        color: '#000',
        fontWeight: '600',
    },
});
