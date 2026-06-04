import React, {useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';

const API = 'http://127.0.0.1:8000/api';

interface Exercise {
    id: string;
    name: string;
    equipment: string;
    sets: number;
    reps: string;
}

interface LoggedSet {
    external_id: string;
    set_number: number;
    reps_completed: string;
    weight_kg: string;
}

interface Props {
    visible: boolean;
    dayName: string;
    exercises: Exercise[];
    onClose: () => void;
    onSaved: () => void;
}

export default function WorkoutLogModal({visible, dayName, exercises, onClose, onSaved}: Props) {
    const [sets, setSets] = useState<Record<string, LoggedSet[]>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function addSet(exercise: Exercise) {
        setSets(prev => {
            const existing = prev[exercise.id] ?? [];
            const nextNumber = existing.length + 1;
            return {
                ...prev,
                [exercise.id]: [
                    ...existing,
                    {
                        external_id: exercise.id,
                        set_number: nextNumber,
                        reps_completed: exercise.reps.split('-')[0],
                        weight_kg: '',
                    },
                ],
            };
        });
    }

    function removeSet(exerciseId: string, setIndex: number) {
        setSets(prev => {
            const updated = (prev[exerciseId] ?? [])
                .filter((_, i) => i !== setIndex)
                .map((s, i) => ({...s, set_number: i + 1}));
            return {...prev, [exerciseId]: updated};
        });
    }

    function updateSet(exerciseId: string, setIndex: number, field: 'reps_completed' | 'weight_kg', value: string) {
        setSets(prev => {
            const updated = [...(prev[exerciseId] ?? [])];
            updated[setIndex] = {...updated[setIndex], [field]: value};
            return {...prev, [exerciseId]: updated};
        });
    }

    function prefillSets() {
        const prefilled: Record<string, LoggedSet[]> = {};
        for (const ex of exercises) {
            prefilled[ex.id] = Array.from({length: ex.sets}, (_, i) => ({
                external_id: ex.id,
                set_number: i + 1,
                reps_completed: ex.reps.split('-')[0],
                weight_kg: '',
            }));
        }
        setSets(prefilled);
    }

    async function saveWorkout() {
        const allSets = Object.values(sets).flat();

        if (allSets.length === 0) {
            setError('Log minstens één set om op te slaan.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('authToken');
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            // 1. Create session
            const sessionRes = await fetch(`${API}/workout-sessions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({day_name: dayName, trained_at: new Date().toISOString()}),
            });

            if (!sessionRes.ok) {
                throw new Error('Kon sessie niet aanmaken');
            }

            const sessionJson = await sessionRes.json();
            const sessionId = sessionJson.data.id;

            // 2. Save all sets
            const payload = allSets.map(s => ({
                external_id: s.external_id,
                set_number: s.set_number,
                reps_completed: parseInt(s.reps_completed, 10) || 0,
                weight_kg: s.weight_kg ? parseFloat(s.weight_kg) : null,
            }));

            const setsRes = await fetch(`${API}/workout-sessions/${sessionId}/sets`, {
                method: 'POST',
                headers,
                body: JSON.stringify({sets: payload}),
            });

            if (!setsRes.ok) {
                throw new Error('Kon sets niet opslaan');
            }

            setSets({});
            onSaved();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    function handleClose() {
        setSets({});
        setError(null);
        onClose();
    }

    const totalSets = Object.values(sets).flat().length;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={18} color="#888"/>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Log Workout</Text>
                        <Text style={styles.subtitle}>{dayName}</Text>
                    </View>
                    <TouchableOpacity onPress={prefillSets} style={styles.prefillBtn}>
                        <Text style={styles.prefillText}>Vul in</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
                    {exercises.map(exercise => {
                        const exerciseSets = sets[exercise.id] ?? [];
                        return (
                            <View key={exercise.id} style={styles.exerciseBlock}>
                                <View style={styles.exerciseHeader}>
                                    <Text style={styles.exerciseName} numberOfLines={1}>
                                        {exercise.name}
                                    </Text>
                                    <Text style={styles.exercisePlan}>
                                        {exercise.sets} × {exercise.reps}
                                    </Text>
                                </View>

                                {/* Column labels */}
                                {exerciseSets.length > 0 && (
                                    <View style={styles.setRow}>
                                        <Text style={[styles.setLabel, {width: 28}]}>Set</Text>
                                        <Text style={[styles.setLabel, {flex: 1}]}>Reps</Text>
                                        <Text style={[styles.setLabel, {flex: 1}]}>Gewicht (kg)</Text>
                                        <View style={{width: 28}}/>
                                    </View>
                                )}

                                {exerciseSets.map((s, idx) => (
                                    <View key={idx} style={styles.setRow}>
                                        <Text style={styles.setNumber}>{s.set_number}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={s.reps_completed}
                                            onChangeText={v => updateSet(exercise.id, idx, 'reps_completed', v)}
                                            keyboardType="number-pad"
                                            placeholder="reps"
                                            placeholderTextColor="#555"
                                        />
                                        <TextInput
                                            style={styles.input}
                                            value={s.weight_kg}
                                            onChangeText={v => updateSet(exercise.id, idx, 'weight_kg', v)}
                                            keyboardType="decimal-pad"
                                            placeholder="—"
                                            placeholderTextColor="#555"
                                        />
                                        <TouchableOpacity
                                            onPress={() => removeSet(exercise.id, idx)}
                                            style={styles.removeBtn}
                                        >
                                            <Ionicons name="remove" size={18} color="#FF6B6B"/>
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity onPress={() => addSet(exercise)} style={styles.addSetBtn}>
                                    <Text style={styles.addSetText}>+ Set toevoegen</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                    <View style={{height: 120}}/>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        onPress={saveWorkout}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#000"/>
                        ) : (
                            <Text style={styles.saveBtnText}>
                                Opslaan{totalSets > 0 ? ` · ${totalSets} sets` : ''}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1E1E1E',
    },
    closeBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#1A1A1A',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#888',
        fontSize: 14,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtitle: {
        color: '#4ADE80',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 2,
    },
    prefillBtn: {
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    prefillText: {
        color: '#888',
        fontSize: 13,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    exerciseBlock: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1E1E1E',
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
        textTransform: 'capitalize',
    },
    exercisePlan: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '500',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    setLabel: {
        color: '#555',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    setNumber: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
        width: 28,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: '#fff',
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        textAlign: 'center',
    },
    removeBtn: {
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
    },
    removeBtnText: {
        color: '#FF6B6B',
        fontSize: 18,
        lineHeight: 20,
    },
    addSetBtn: {
        marginTop: 6,
        padding: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 10,
        borderStyle: 'dashed',
    },
    addSetText: {
        color: '#4ADE80',
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#1E1E1E',
        backgroundColor: '#0B0B0B',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 10,
    },
    saveBtn: {
        backgroundColor: '#4ADE80',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
    saveBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
