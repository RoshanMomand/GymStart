import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type ExerciseStatus = 'not-started' | 'in-progress' | 'completed';

type Props = {
    title: string;
    subtitle: string;
    validSetCount: number;
    plannedSets: number;
    onInfo: () => void;
    onLog: () => void;
};

function getStatus(validSetCount: number, plannedSets: number): ExerciseStatus {
    if (validSetCount <= 0) return 'not-started';
    if (validSetCount >= plannedSets) return 'completed';
    return 'in-progress';
}

export default function ExerciseItem({title, subtitle, validSetCount, plannedSets, onInfo, onLog}: Props) {
    const status = getStatus(validSetCount, plannedSets);
    const remaining = plannedSets - validSetCount;

    return (
        <View style={[
            styles.container,
            status === 'completed' && styles.containerCompleted,
            status === 'in-progress' && styles.containerInProgress,
        ]}>
            <View style={[
                styles.icon,
                status === 'completed' && styles.iconCompleted,
                status === 'in-progress' && styles.iconInProgress,
            ]}/>

            <View style={styles.textBlock}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                {status === 'in-progress' && (
                    <Text style={styles.remainingText}>
                        Nog {remaining} set{remaining !== 1 ? 's' : ''} te loggen
                    </Text>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onInfo} style={styles.infoBtn} hitSlop={8}>
                    <Ionicons name="information-circle-outline" size={18} color="#555"/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onLog}
                    style={[
                        styles.logBtn,
                        status === 'completed' && styles.logBtnCompleted,
                        status === 'in-progress' && styles.logBtnInProgress,
                    ]}
                    hitSlop={8}
                >
                    {status === 'completed' ? (
                        <Ionicons name="checkmark" size={16} color="#4ADE80"/>
                    ) : status === 'in-progress' ? (
                        <Text style={styles.logBtnTextInProgress}>{validSetCount}/{plannedSets}</Text>
                    ) : (
                        <Text style={styles.logBtnText}>Log</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        gap: 12,
    },
    containerCompleted: {
        borderColor: '#1A3D28',
        backgroundColor: '#0D1F16',
    },
    containerInProgress: {
        borderColor: '#2A3520',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#1E1E1E',
        flexShrink: 0,
    },
    iconCompleted: {
        backgroundColor: '#14532D',
    },
    iconInProgress: {
        backgroundColor: '#1E2D1A',
    },
    textBlock: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    subtitle: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    remainingText: {
        color: '#888',
        fontSize: 11,
        marginTop: 4,
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
    },
    infoBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logBtn: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: '#333',
        minWidth: 44,
        alignItems: 'center',
    },
    logBtnCompleted: {
        backgroundColor: '#14532D',
        borderColor: '#4ADE80',
    },
    logBtnInProgress: {
        backgroundColor: '#1A2A1A',
        borderColor: '#2A4A2A',
    },
    logBtnText: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '600',
    },
    logBtnTextCompleted: {
        color: '#4ADE80',
        fontSize: 14,
        fontWeight: '700',
    },
    logBtnTextInProgress: {
        color: '#6DBF8A',
        fontSize: 12,
        fontWeight: '600',
    },
});
