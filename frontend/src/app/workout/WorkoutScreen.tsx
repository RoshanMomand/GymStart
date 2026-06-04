import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseItem from '@/components/ExerciseItem';
import ExerciseDetailModal, {ExerciseDetail} from '@/components/ExerciseDetailModal';
import ExerciseLogModal, {LoggedSet, isValidSet} from '@/components/ExerciseLogModal';
import ToggleButton from '@/components/ToggleButton';
import {ThemedView} from '@/components/themed-view';

const API = 'http://127.0.0.1:8000/api';
const DRAFT_KEY = '@gymstart/workout_draft';

// "leverage machine" → "Machine", "stationary bike" → "Bike"
function formatEquipment(eq: string): string {
    const last = eq.split(' ').at(-1) ?? eq;
    return last.charAt(0).toUpperCase() + last.slice(1);
}

const EQUIPMENT_PREFIXES: Record<string, string[]> = {
    'leverage machine': ['lever'],
    'olympic barbell':  ['olympic barbell', 'barbell'],
};

function formatExerciseName(name: string, equipment: string): string {
    const prefixes = EQUIPMENT_PREFIXES[equipment] ?? [];
    const lower = name.toLowerCase();
    for (const prefix of prefixes) {
        if (lower.startsWith(prefix + ' ')) {
            const stripped = name.slice(prefix.length + 1);
            return stripped.charAt(0).toUpperCase() + stripped.slice(1);
        }
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

interface Exercise {
    id: string;
    name: string;
    body_part: string;
    equipment: string;
    target: string;
    difficulty: string;
    gif_url: string | null;
    video_url: string | null;
    instructions: string[];
    sets: number;
    reps: string;
}

interface RestExercise {
    id: string;
    name: string;
    equipment: string;
    gif_url: string | null;
    video_url: string | null;
    duration: string;
}

interface WorkoutDay {
    day_number: number;
    label: string;
    exercises: Exercise[];
}

// Sets per dag: dayIndex → exerciseId → LoggedSet[]
type DaySets = Record<string, LoggedSet[]>;
type AllDaySets = Record<number, DaySets>;

export default function WorkoutScreen() {
    const [mode, setMode] = useState<'training' | 'rest'>('training');
    const [schedule, setSchedule] = useState<WorkoutDay[]>([]);
    const [restDayExercises, setRestDayExercises] = useState<RestExercise[]>([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedCardio, setSelectedCardio] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDetail | null>(null);
    const [logTarget, setLogTarget] = useState<Exercise | null>(null);

    // Data per dag — wisselen van dag reset NIETS
    const [allDaySets, setAllDaySets] = useState<AllDaySets>({});
    const draftLoaded = useRef(false);

    const [finishing, setFinishing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Persistence ───────────────────────────────────────────────────────────

    // Laad lokale draft bij opstart
    useEffect(() => {
        AsyncStorage.getItem(DRAFT_KEY).then(raw => {
            if (raw) {
                try {
                    setAllDaySets(JSON.parse(raw));
                } catch {}
            }
            draftLoaded.current = true;
        });
    }, []);

    // Sla op bij elke wijziging (alleen nadat draft geladen is)
    useEffect(() => {
        if (!draftLoaded.current) return;
        AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(allDaySets));
    }, [allDaySets]);

    // ── Data ──────────────────────────────────────────────────────────────────

    const fetchWorkoutPlan = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${API}/workout-plans`, {
                headers: {Authorization: `Bearer ${token}`, Accept: 'application/json'},
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.message ?? 'Failed to load workout plan');
            }

            const json = await res.json();
            setSchedule(json.data?.schedule ?? []);
            setRestDayExercises(json.data?.rest_day_exercises ?? []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkoutPlan();
    }, [fetchWorkoutPlan]);

    // ── Derived state ─────────────────────────────────────────────────────────

    const currentDay = schedule[selectedDay];
    const currentDaySets: DaySets = allDaySets[selectedDay] ?? {};

    function validCountForExercise(exerciseId: string): number {
        return (currentDaySets[exerciseId] ?? []).filter(isValidSet).length;
    }

    const completedCount = currentDay?.exercises.filter(
        ex => validCountForExercise(ex.id) >= ex.sets
    ).length ?? 0;

    const totalCount = currentDay?.exercises.length ?? 0;
    const allDone = totalCount > 0 && completedCount === totalCount;
    const anyLogged = Object.values(currentDaySets).some(sets => sets.some(isValidSet));

    // ── Finish ────────────────────────────────────────────────────────────────

    async function doFinishWorkout() {
        setFinishing(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            const headers = {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            const sessionRes = await fetch(`${API}/workout-sessions`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    day_name: schedule[selectedDay]?.label,
                    trained_at: new Date().toISOString(),
                }),
            });

            if (!sessionRes.ok) throw new Error('Sessie aanmaken mislukt');
            const {data: session} = await sessionRes.json();

            // Alleen daadwerkelijk ingevulde sets (reps > 0) opslaan
            const allSets = Object.values(currentDaySets).flat().filter(isValidSet);

            const payload = allSets.map(s => ({
                external_id: s.external_id,
                set_number: s.set_number,
                reps_completed: parseInt(s.reps_completed, 10),
                weight_kg: s.weight_kg ? parseFloat(s.weight_kg) : null,
            }));

            const setsRes = await fetch(`${API}/workout-sessions/${session.id}/sets`, {
                method: 'POST',
                headers,
                body: JSON.stringify({sets: payload}),
            });

            if (!setsRes.ok) throw new Error('Sets opslaan mislukt');

            // Wis alleen de huidige dag uit de draft
            setAllDaySets(prev => {
                const next = {...prev};
                delete next[selectedDay];
                return next;
            });

            const loggedExercises = Object.keys(currentDaySets).length;
            Alert.alert(
                'Training opgeslagen',
                `${loggedExercises} oefening${loggedExercises !== 1 ? 'en' : ''} · ${allSets.length} sets gelogd`,
                [{text: 'OK'}]
            );
        } catch (e: any) {
            Alert.alert('Fout', e.message);
        } finally {
            setFinishing(false);
        }
    }

    function handleFinishWorkout() {
        if (!anyLogged) return;

        if (!allDone) {
            const remaining = totalCount - completedCount;
            Alert.alert(
                'Niet alle sets zijn gelogd',
                `${remaining} oefening${remaining !== 1 ? 'en' : ''} nog niet volledig ingevuld. Wil je je training toch afronden?`,
                [
                    {text: 'Terug naar training', style: 'cancel'},
                    {text: 'Training afronden', onPress: doFinishWorkout},
                ]
            );
        } else {
            doFinishWorkout();
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator color="#4ADE80" size="large"/>
                <Text style={styles.loadingText}>Workout plan laden...</Text>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchWorkoutPlan}>
                    <Text style={styles.retryText}>Opnieuw proberen</Text>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    if (!schedule.length) {
        return (
            <ThemedView style={styles.center}>
                <Text style={styles.errorText}>Geen workout plan gevonden.</Text>
                <Text style={styles.hintText}>Voltooi onboarding om je plan te genereren.</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={{flex: 1}}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Workout Plan</Text>
                        <Text style={styles.subtitle}>Your daily exercises</Text>
                    </View>
                </View>

                <ToggleButton mode={mode} setMode={setMode}/>

                {mode === 'training' ? (
                    <>
                        {/* Dag tabs — wisselen bewaart data */}
                        <View style={styles.tabsContainer}>
                            {schedule.map((day, index) => (
                                <TouchableOpacity
                                    key={day.day_number}
                                    style={[styles.tab, selectedDay === index && styles.tabActive]}
                                    onPress={() => setSelectedDay(index)}
                                >
                                    <Text style={[styles.tabText, selectedDay === index && styles.tabTextActive]}>
                                        Day {day.day_number}
                                    </Text>
                                    <Text style={[styles.tabLabel, selectedDay === index && styles.tabTextActive]}>
                                        {day.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Dag card met progress */}
                        {currentDay && (
                            <View style={styles.card}>
                                <View style={styles.cardRow}>
                                    <Text style={styles.dayTitle}>{currentDay.label}</Text>
                                    <Text style={styles.progressText}>
                                        {completedCount}/{totalCount} voltooid
                                    </Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            {width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%'},
                                        ]}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Oefening lijst */}
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                            {currentDay?.exercises.map((exercise, idx) => (
                                <ExerciseItem
                                    key={`${exercise.id}-${idx}`}
                                    title={formatExerciseName(exercise.name, exercise.equipment)}
                                    subtitle={`${exercise.sets} sets x ${exercise.reps} reps · ${formatEquipment(exercise.equipment)}`}
                                    validSetCount={validCountForExercise(exercise.id)}
                                    plannedSets={exercise.sets}
                                    onInfo={() => setSelectedExercise(exercise)}
                                    onLog={() => setLogTarget(exercise)}
                                />
                            ))}
                            <View style={{height: 16}}/>
                        </ScrollView>

                        {/* Sticky footer — zichtbaar zodra iets gelogd is */}
                        {anyLogged && (
                            <View style={styles.stickyFooter}>
                                {!allDone && (
                                    <Text style={styles.incompleteHint}>
                                        {totalCount - completedCount} oefening{totalCount - completedCount !== 1 ? 'en' : ''} nog niet volledig ingevuld
                                    </Text>
                                )}
                                <TouchableOpacity
                                    style={[
                                        styles.finishButton,
                                        !allDone && styles.finishButtonPartial,
                                        finishing && styles.finishButtonDisabled,
                                    ]}
                                    onPress={handleFinishWorkout}
                                    disabled={finishing}
                                >
                                    {finishing
                                        ? <ActivityIndicator color={allDone ? '#000' : '#4ADE80'} size="small"/>
                                        : <Text style={[styles.finishButtonText, !allDone && styles.finishButtonTextPartial]}>
                                            Finish Workout
                                          </Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ) : (
                    <>
                        <View style={styles.restCard}>
                            <Text style={styles.restTitle}>Active Recovery</Text>
                            <Text style={styles.restSubtitle}>
                                Kies een cardio oefening voor vandaag
                            </Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                            {restDayExercises.map((exercise) => {
                                const isSelected = selectedCardio === exercise.id;
                                return (
                                    <TouchableOpacity
                                        key={exercise.id}
                                        onPress={() => setSelectedCardio(isSelected ? null : exercise.id)}
                                        style={[styles.cardioCard, isSelected && styles.cardioCardSelected]}
                                        activeOpacity={0.5}
                                    >
                                        <View style={styles.cardioLeft}>
                                            <View style={[styles.cardioIcon, isSelected && styles.cardioIconSelected]}/>
                                            <View>
                                                <Text style={[styles.cardioName, isSelected && styles.cardioNameSelected]}>
                                                    {exercise.name}
                                                </Text>
                                                <Text style={styles.cardioMeta}>
                                                    {exercise.duration} · {exercise.equipment}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[styles.selectCircle, isSelected && styles.selectCircleActive]}>
                                            {isSelected && <View style={styles.selectDot}/>}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}

                            {selectedCardio && (
                                <TouchableOpacity style={styles.startButton}>
                                    <Text style={styles.startButtonText}>Start cardio</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </>
                )}
            </SafeAreaView>

            <ExerciseDetailModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
            />

            <ExerciseLogModal
                visible={logTarget !== null}
                exercise={logTarget}
                existingSets={logTarget ? (currentDaySets[logTarget.id] ?? []) : []}
                onClose={() => setLogTarget(null)}
                onSave={(sets) => {
                    if (!logTarget) return;
                    setAllDaySets(prev => ({
                        ...prev,
                        [selectedDay]: {
                            ...(prev[selectedDay] ?? {}),
                            [logTarget.id]: sets,
                        },
                    }));
                    setLogTarget(null);
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0B0B',
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    center: {
        flex: 1,
        backgroundColor: '#0B0B0B',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
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
    loadingText: {
        color: '#888',
        marginTop: 12,
    },
    errorText: {
        color: '#FF6B6B',
        textAlign: 'center',
        marginBottom: 8,
    },
    hintText: {
        color: '#555',
        textAlign: 'center',
        fontSize: 13,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#4ADE80',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
    },
    retryText: {
        color: '#000',
        fontWeight: '600',
    },
    tabsContainer: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    tab: {
        backgroundColor: '#151515',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#4ADE80',
        borderColor: '#4ADE80',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    tabLabel: {
        color: '#555',
        fontSize: 11,
        marginTop: 2,
    },
    card: {
        backgroundColor: '#151515',
        borderRadius: 20,
        padding: 16,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    dayTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    progressText: {
        color: '#4ADE80',
        fontSize: 13,
        fontWeight: '500',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#2A2A2A',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 4,
        backgroundColor: '#4ADE80',
        borderRadius: 2,
    },
    list: {
        flex: 1,
    },
    stickyFooter: {
        paddingTop: 12,
        paddingBottom: 8,
        borderTopWidth: 1,
        borderTopColor: '#1E1E1E',
        gap: 8,
    },
    incompleteHint: {
        color: '#555',
        fontSize: 13,
        textAlign: 'center',
    },
    finishButton: {
        backgroundColor: '#4ADE80',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
    },
    finishButtonPartial: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    finishButtonDisabled: {
        opacity: 0.5,
    },
    finishButtonText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    },
    finishButtonTextPartial: {
        color: '#555',
    },
    restCard: {
        backgroundColor: '#151515',
        borderRadius: 20,
        padding: 16,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    restTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    restSubtitle: {
        color: '#888',
        fontSize: 13,
        lineHeight: 18,
    },
    cardioCard: {
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardioCardSelected: {
        borderColor: '#4ADE80',
        backgroundColor: '#0D2016',
    },
    cardioLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cardioIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        marginRight: 12,
    },
    cardioIconSelected: {
        backgroundColor: '#14532D',
    },
    cardioName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    cardioNameSelected: {
        color: '#4ADE80',
    },
    cardioMeta: {
        color: '#666',
        fontSize: 12,
        marginTop: 3,
        textTransform: 'capitalize',
    },
    selectCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectCircleActive: {
        borderColor: '#4ADE80',
    },
    selectDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
    },
    startButton: {
        backgroundColor: '#4ADE80',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    startButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});
