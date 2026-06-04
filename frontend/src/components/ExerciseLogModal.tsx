import React, {useEffect, useState} from 'react';
import {
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
import {Ionicons} from '@expo/vector-icons';

export interface LoggedSet {
    external_id: string;
    set_number: number;
    reps_completed: string;
    weight_kg: string;
}

export function isValidSet(s: LoggedSet): boolean {
    const reps = parseInt(s.reps_completed, 10);
    return !isNaN(reps) && reps > 0;
}

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
}

interface Props {
    visible: boolean;
    exercise: Exercise | null;
    existingSets: LoggedSet[];
    onClose: () => void;
    onSave: (sets: LoggedSet[]) => void;
}

export default function ExerciseLogModal({visible, exercise, existingSets, onClose, onSave}: Props) {
    const [sets, setSets] = useState<LoggedSet[]>([]);

    useEffect(() => {
        if (!exercise || !visible) return;
        if (existingSets.length > 0) {
            setSets(existingSets);
        } else {
            // Start leeg — gebruiker moet zelf invullen wat hij daadwerkelijk gedaan heeft
            setSets(
                Array.from({length: exercise.sets}, (_, i) => ({
                    external_id: exercise.id,
                    set_number: i + 1,
                    reps_completed: '',
                    weight_kg: '',
                }))
            );
        }
    }, [visible, exercise]);

    function addSet() {
        if (!exercise) return;
        setSets(prev => [
            ...prev,
            {
                external_id: exercise.id,
                set_number: prev.length + 1,
                reps_completed: '',
                weight_kg: '',
            },
        ]);
    }

    function removeSet(index: number) {
        setSets(prev =>
            prev
                .filter((_, i) => i !== index)
                .map((s, i) => ({...s, set_number: i + 1}))
        );
    }

    function updateField(index: number, field: 'reps_completed' | 'weight_kg', value: string) {
        setSets(prev => {
            const updated = [...prev];
            updated[index] = {...updated[index], [field]: value};
            return updated;
        });
    }

    function handleSave() {
        // Sla alleen sets op die daadwerkelijk zijn ingevuld (reps > 0)
        onSave(sets.filter(isValidSet));
        onClose();
    }

    if (!exercise) return null;

    const validCount = sets.filter(isValidSet).length;
    const remaining = exercise.sets - validCount;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                        <Ionicons name="close" size={18} color="#888"/>
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.title} numberOfLines={1}>{exercise.name}</Text>
                        <Text style={styles.subtitle}>Gepland: {exercise.sets} sets x {exercise.reps} reps</Text>
                    </View>
                    <View style={{width: 36}}/>
                </View>

                {/* Status banner */}
                {sets.length > 0 && (
                    <View style={[
                        styles.statusBanner,
                        remaining <= 0 ? styles.statusBannerDone : styles.statusBannerPending,
                    ]}>
                        <Text style={[
                            styles.statusText,
                            remaining <= 0 ? styles.statusTextDone : styles.statusTextPending,
                        ]}>
                            {remaining <= 0
                                ? 'Alle sets ingevuld'
                                : `Nog ${remaining} set${remaining !== 1 ? 's' : ''} te loggen`
                            }
                        </Text>
                    </View>
                )}

                <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Column labels */}
                    <View style={styles.labelRow}>
                        <Text style={[styles.label, styles.labelSet]}>Set</Text>
                        <Text style={[styles.label, styles.labelInput]}>Reps</Text>
                        <Text style={[styles.label, styles.labelInput]}>Gewicht (kg)</Text>
                        <View style={styles.labelDel}/>
                    </View>

                    {sets.map((s, idx) => {
                        const filled = isValidSet(s);
                        return (
                            <View key={idx} style={[styles.setRow, filled && styles.setRowFilled]}>
                                <View style={[styles.setNumBadge, filled && styles.setNumBadgeFilled]}>
                                    <Text style={[styles.setNum, filled && styles.setNumFilled]}>
                                        {s.set_number}
                                    </Text>
                                </View>

                                <TextInput
                                    style={[styles.input, filled && styles.inputFilled]}
                                    value={s.reps_completed}
                                    onChangeText={v => updateField(idx, 'reps_completed', v)}
                                    keyboardType="number-pad"
                                    placeholder="reps"
                                    placeholderTextColor="#444"
                                />

                                <TextInput
                                    style={[styles.input, s.weight_kg !== '' && styles.inputFilled]}
                                    value={s.weight_kg}
                                    onChangeText={v => updateField(idx, 'weight_kg', v)}
                                    keyboardType="decimal-pad"
                                    placeholder="kg"
                                    placeholderTextColor="#444"
                                />

                                <TouchableOpacity
                                    onPress={() => removeSet(idx)}
                                    style={styles.delBtn}
                                    hitSlop={8}
                                >
                                    <Ionicons name="remove" size={18} color="#FF6B6B"/>
                                </TouchableOpacity>
                            </View>
                        );
                    })}

                    <TouchableOpacity onPress={addSet} style={styles.addBtn}>
                        <Text style={styles.addBtnText}>+ Set toevoegen</Text>
                    </TouchableOpacity>

                    <View style={{height: 40}}/>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveBtn, validCount === 0 && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={validCount === 0}
                    >
                        <Text style={styles.saveBtnText}>
                            {validCount === 0
                                ? 'Vul minstens 1 set in'
                                : `Opslaan  ${validCount} van ${exercise.sets} sets`
                            }
                        </Text>
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
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
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
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'capitalize',
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    statusBanner: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    statusBannerDone: {
        backgroundColor: '#0D2016',
        borderWidth: 1,
        borderColor: '#1A3D28',
    },
    statusBannerPending: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    statusTextDone: {
        color: '#4ADE80',
    },
    statusTextPending: {
        color: '#888',
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    label: {
        color: '#555',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    labelSet: {
        width: 36,
    },
    labelInput: {
        flex: 1,
    },
    labelDel: {
        width: 32,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        opacity: 0.7,
    },
    setRowFilled: {
        opacity: 1,
    },
    setNumBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    setNumBadgeFilled: {
        backgroundColor: '#14532D',
        borderColor: '#4ADE80',
    },
    setNum: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    setNumFilled: {
        color: '#4ADE80',
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        textAlign: 'center',
    },
    inputFilled: {
        borderColor: '#2A4A35',
        backgroundColor: '#0F1F15',
    },
    delBtn: {
        width: 32,
        height: 32,
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtn: {
        marginTop: 6,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    addBtnText: {
        color: '#4ADE80',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#1E1E1E',
    },
    saveBtn: {
        backgroundColor: '#4ADE80',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    saveBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
