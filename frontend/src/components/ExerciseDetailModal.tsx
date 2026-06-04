import React from 'react';
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export interface ExerciseDetail {
    id: string;
    name: string;
    body_part: string;
    equipment: string;
    target: string;
    difficulty: string;
    category?: string;
    description?: string;
    secondary_muscles?: string[];
    gif_url: string | null;
    video_url: string | null;
    instructions: string[];
    sets: number;
    reps: string;
}

interface Props {
    exercise: ExerciseDetail | null;
    onClose: () => void;
}

const DIFFICULTY_COLOR: Record<string, string> = {
    beginner:     '#4ADE80',
    intermediate: '#FACC15',
    advanced:     '#F87171',
};

// "leverage machine" → "Machine", "smith machine" → "Machine", "dumbbell" → "Dumbbell"
// "leverage machine" → "Machine", "ez barbell" → "Barbell", "stationary bike" → "Bike"
function formatEquipment(eq: string): string {
    const last = eq.split(' ').at(-1) ?? eq;
    return last.charAt(0).toUpperCase() + last.slice(1);
}

const EQUIPMENT_PREFIXES: Record<string, string[]> = {
    'leverage machine': ['lever'],
    // 'smith machine':    ['smith'],
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

export default function ExerciseDetailModal({exercise, onClose}: Props) {
    if (!exercise) return null;

    const difficultyColor = DIFFICULTY_COLOR[exercise.difficulty] ?? '#888';

    return (
        <Modal
            visible={!!exercise}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <Pressable style={styles.backdrop} onPress={onClose}/>

            {/* Sheet */}
            <View style={styles.sheet}>
                {/* Handle */}
                <View style={styles.handle}/>

                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    {/* GIF */}
                    {exercise.gif_url ? (
                        <Image
                            source={{uri: exercise.gif_url}}
                            style={styles.gif}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.gifPlaceholder}>
                            <Text style={styles.gifPlaceholderText}>No preview available</Text>
                        </View>
                    )}

                    <View style={styles.body}>
                        {/* Name */}
                        <Text style={styles.name}>{formatExerciseName(exercise.name, exercise.equipment)}</Text>

                        {/* Badges */}
                        <View style={styles.badges}>
                            <Badge label={exercise.target} color="#2563EB"/>
                            <Badge label={formatEquipment(exercise.equipment)} color="#374151"/>
                            <Badge
                                label={exercise.difficulty}
                                color={difficultyColor}
                                dark={exercise.difficulty !== 'advanced'}
                            />
                        </View>

                        {/* Sets × reps */}
                        <View style={styles.setsRow}>
                            <View style={styles.setsBox}>
                                <Text style={styles.setsNumber}>{exercise.sets}</Text>
                                <Text style={styles.setsLabel}>sets</Text>
                            </View>
                            <View style={styles.setsDivider}/>
                            <View style={styles.setsBox}>
                                <Text style={styles.setsNumber}>{exercise.reps}</Text>
                                <Text style={styles.setsLabel}>reps</Text>
                            </View>
                        </View>

                        {/* Muscle targets */}
                        <Section title="Muscles">
                            <Text style={styles.muscleLabel}>Primary</Text>
                            <View style={styles.badges}>
                                <Badge label={exercise.target} color="#4ADE80" dark/>
                            </View>
                            {exercise.secondary_muscles?.length ? (
                                <>
                                    <Text style={[styles.muscleLabel, {marginTop: 10}]}>Secondary</Text>
                                    <View style={styles.badges}>
                                        {exercise.secondary_muscles.map((m) => (
                                            <Badge key={m} label={m} color="#1F2937"/>
                                        ))}
                                    </View>
                                </>
                            ) : null}
                        </Section>

                        {/* Instructions */}
                        {exercise.instructions?.length ? (
                            <Section title="Instructions">
                                {exercise.instructions.map((step, i) => (
                                    <View key={i} style={styles.step}>
                                        <View style={styles.stepNumber}>
                                            <Text style={styles.stepNumberText}>{i + 1}</Text>
                                        </View>
                                        <Text style={styles.stepText}>{step}</Text>
                                    </View>
                                ))}
                            </Section>
                        ) : null}

                        {/* Video — placeholder for future API */}
                        <Section title="Video">
                            <View style={styles.videoPlaceholder}>
                                <Text style={styles.videoIcon}>▶</Text>
                                <Text style={styles.videoLabel}>
                                    {exercise.video_url
                                        ? 'Video beschikbaar'
                                        : 'Video komt binnenkort beschikbaar'}
                                </Text>
                            </View>
                        </Section>

                        <View style={styles.bottomSpacer}/>
                    </View>
                </ScrollView>

                {/* Close button */}
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeText}>Sluiten</Text>
                </Pressable>
            </View>
        </Modal>
    );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
}

function Badge({label, color, dark}: {label: string; color: string; dark?: boolean}) {
    return (
        <View style={[styles.badge, {backgroundColor: color + '33', borderColor: color + '55'}]}>
            <Text style={[styles.badgeText, {color: dark ? color : '#ccc'}]}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: '#111',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '88%',
        paddingBottom: 0,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 4,
    },
    gif: {
        width: '100%',
        height: 220,
        backgroundColor: '#1A1A1A',
    },
    gifPlaceholder: {
        height: 160,
        backgroundColor: '#1A1A1A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gifPlaceholderText: {
        color: '#444',
        fontSize: 13,
    },
    body: {
        padding: 20,
    },
    name: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        textTransform: 'capitalize',
        marginBottom: 12,
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    setsRow: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    setsBox: {
        alignItems: 'center',
        flex: 1,
    },
    setsNumber: {
        color: '#4ADE80',
        fontSize: 28,
        fontWeight: '700',
    },
    setsLabel: {
        color: '#666',
        fontSize: 12,
        marginTop: 2,
    },
    setsDivider: {
        width: 1,
        height: 36,
        backgroundColor: '#2A2A2A',
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    muscleLabel: {
        color: '#555',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4ADE8022',
        borderWidth: 1,
        borderColor: '#4ADE8055',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        marginTop: 1,
    },
    stepNumberText: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: '700',
    },
    stepText: {
        color: '#aaa',
        fontSize: 14,
        lineHeight: 22,
        flex: 1,
    },
    videoPlaceholder: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    videoIcon: {
        color: '#4ADE80',
        fontSize: 20,
    },
    videoLabel: {
        color: '#666',
        fontSize: 14,
    },
    closeButton: {
        margin: 16,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 8,
    },
});
