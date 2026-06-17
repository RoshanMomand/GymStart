import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '@/contexts/AuthContext';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

import EditProfileModal from '@/components/profile/EditProfileModal';
import WorkoutModal from '@/components/profile/WorkoutModal';
import NutritionModal from '@/components/profile/NutritionModal';
import NotificationsModal from '@/components/profile/NotificationsModal';
import PrivacyModal from '@/components/profile/PrivacyModal';
import WeightChart from '@/components/WeightChart';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProfileData {
  gender: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  weight_kg: number;
  fitness_goal: 'lose_weight' | 'build_muscle' | 'maintain';
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  training_days: number;
  workout_preference: 'gym' | 'home' | 'outdoor';
  food_preferences: string[];
  dietary_preferences: string[];
  allergies: string[];
  food_dislikes: string[];
}

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// ── Design constants ──────────────────────────────────────────────────────────

const API = 'http://127.0.0.1:8000/api';
const BG = '#0D0D0D';
const CARD = '#1A1A1A';
const INNER = '#252525';
const GREEN = '#4ADE80';
const PURPLE = '#7C3AED';
const MUTED = '#9CA3AF';
const WHITE = '#FFFFFF';
const BORDER = '#2A2A2A';

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Weight Loss',
  build_muscle: 'Muscle Gain',
  maintain: 'Maintenance',
};

const GOAL_ICONS: Record<string, IoniconsName> = {
  lose_weight: 'flame-outline',
  build_muscle: 'barbell-outline',
  maintain: 'scale-outline',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Active',
  very_active: 'Very Active',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const WORKOUT_LABELS: Record<string, string> = {
  gym: 'Gym Workout',
  home: 'Home Workout',
  outdoor: 'Outdoor Training',
};

// ── Module-level styles ───────────────────────────────────────────────────────

const avatarStyles = StyleSheet.create({
  inner: {
    position: 'absolute',
    top: 6, left: 6, right: 6, bottom: 6,
    borderRadius: 44,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {color: WHITE, fontSize: 32, fontWeight: '700', letterSpacing: 1},
});

const chipStyles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: INNER,
    borderWidth: 1,
    borderColor: BORDER
  },
  text: {color: MUTED, fontSize: 12, fontWeight: '500'},
  accent: {backgroundColor: '#052E16', borderColor: '#166534'},
  accentText: {color: GREEN},
  allergy: {backgroundColor: '#3B1515', borderColor: '#7F1D1D'},
  allergyText: {color: '#EF4444'},
});

const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: INNER,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 3
  },
  value: {color: WHITE, fontSize: 20, fontWeight: '700'},
  unit: {color: MUTED, fontSize: 11},
  label: {color: MUTED, fontSize: 11},
});

const sectionHeaderStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14},
  icon: {fontSize: 16},
  title: {color: WHITE, fontSize: 16, fontWeight: '600'},
});

const settingsRowStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12},
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: INNER,
    alignItems: 'center',
    justifyContent: 'center'
  },
  destructiveBox: {backgroundColor: '#2D1515'},
  label: {flex: 1, color: WHITE, fontSize: 15, fontWeight: '500'},
  destructive: {color: '#EF4444'},
  chevron: {color: '#555', fontSize: 22, lineHeight: 26},
});

const macroRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: BORDER
  },
  rowLast: {borderBottomWidth: 0},
  dot: {width: 8, height: 8, borderRadius: 4},
  label: {flex: 1, color: MUTED, fontSize: 14},
  value: {color: WHITE, fontSize: 14, fontWeight: '600'},
});

// ── Sub-components ────────────────────────────────────────────────────────────

function AvatarRing({name}: {
  name: string
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View style={{width: 100, height: 100}}>
      <Svg width={100} height={100} style={{position: 'absolute'}}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={PURPLE} stopOpacity="1"/>
            <Stop offset="100%" stopColor={GREEN} stopOpacity="1"/>
          </LinearGradient>
        </Defs>
        <Circle cx={50} cy={50} r={47} stroke="url(#ringGrad)" strokeWidth={6} fill="none"/>
      </Svg>
      <View style={avatarStyles.inner}>
        <Text style={avatarStyles.initials}>{initials}</Text>
      </View>
    </View>
  );
}

function Chip({label, variant = 'default'}: {
  label: string;
  variant?: 'default' | 'green' | 'red'
}) {
  if (variant === 'green') {
    return (
      <View style={[chipStyles.base, chipStyles.accent]}>
        <Text style={[chipStyles.text, chipStyles.accentText]}>{label}</Text>
      </View>
    );
  }
  if (variant === 'red') {
    return (
      <View style={[chipStyles.base, chipStyles.allergy]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <Ionicons name="alert-circle-outline" size={12} color="#EF4444"/>
          <Text style={[chipStyles.text, chipStyles.allergyText]}>{label}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={chipStyles.base}>
      <Text style={chipStyles.text}>{label}</Text>
    </View>
  );
}

function StatBox({label, value, unit}: {
  label: string;
  value: string;
  unit?: string
}) {
  return (
    <View style={statStyles.box}>
      <Text style={statStyles.value}>
        {value}{unit ? <Text style={statStyles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function SectionHeader({icon, title}: {
  icon: IoniconsName;
  title: string
}) {
  return (
    <View style={sectionHeaderStyles.row}>
      <Ionicons name={icon} size={16} color="#888"/>
      <Text style={sectionHeaderStyles.title}>{title}</Text>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  onPress,
  destructive = false,
}: {
  icon: IoniconsName;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={settingsRowStyles.row} onPress={onPress} activeOpacity={0.55}>
      <View style={[settingsRowStyles.iconBox, destructive && settingsRowStyles.destructiveBox]}>
        <Ionicons name={icon} size={18} color={destructive ? '#EF4444' : '#888'}/>
      </View>
      <Text style={[settingsRowStyles.label, destructive && settingsRowStyles.destructive]}>
        {label}
      </Text>
      {!destructive && <Ionicons name="chevron-forward" size={18} color="#555"/>}
    </TouchableOpacity>
  );
}

function MacroRow({label, value, unit, color, isLast = false}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <View style={[macroRowStyles.row, isLast && macroRowStyles.rowLast]}>
      <View style={[macroRowStyles.dot, {backgroundColor: color}]}/>
      <Text style={macroRowStyles.label}>{label}</Text>
      <Text style={macroRowStyles.value}>{value}{unit}</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

type ActiveModal = 'editProfile' | 'workout' | 'nutrition' | 'notifications' | 'privacy' | null;

export default function ProfileScreen() {
  const {user, signOut, updateUser} = useAuth();
  const {width: screenWidth} = useWindowDimensions();

  // ── Data state ──────────────────────────────────────────────────────────────
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [nutrition, setNutrition] = useState<NutritionTargets | null>(null);
  const [weightHistory, setWeightHistory] = useState<{
    id: number;
    weight_kg: number;
    logged_at: string
  }[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // ── Load data ───────────────────────────────────────────────────────────────

  useEffect(() => {
    loadData();
  }, []);

  const authHeaders = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  };

  const loadData = async () => {
    try {
      const headers = await authHeaders();
      const [profileRes, planRes, weightRes] = await Promise.all([
        fetch(`${API}/onboarding/profile`, {headers}),
        fetch(`${API}/mealplans`, {headers}),
        fetch(`${API}/profile/weight-history`, {headers}),
      ]);

      if (profileRes.ok) {
        const json = await profileRes.json();
        setProfileData(json.data as ProfileData);
      }

      if (planRes.ok) {
        const json = await planRes.json();
        const targets = json.data?.daily_targets as NutritionTargets | undefined;
        if (targets) setNutrition(targets);
      }

      if (weightRes.ok) {
        const json = await weightRes.json();
        setWeightHistory(json.data ?? []);
      }
    } catch (_) {
      // degrade silently
    } finally {
      Animated.timing(fadeAnim, {toValue: 1, duration: 380, useNativeDriver: true}).start();
    }
  };

  // ── Save handlers ────────────────────────────────────────────────────────────

  const saveName = async (newName: string) => {
    const headers = await authHeaders();
    const res = await fetch(`${API}/profile/name`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({name: newName}),
    });
    if (res.ok) {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        u.name = newName;
        await AsyncStorage.setItem('user', JSON.stringify(u));
      }
      updateUser({name: newName});
    }
  };

  const saveWorkout = async (pref: ProfileData['workout_preference'], days: number) => {
    const headers = await authHeaders();
    const res = await fetch(`${API}/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({workout_preference: pref, training_days: days}),
    });
    if (res.ok) {
      setProfileData(prev =>
        prev ? {...prev, workout_preference: pref, training_days: days} : prev,
      );
    }
  };

  const saveNutrition = async (
    foodPrefs: string[],
    dietary: string[],
    allergies: string[],
    dislikes: string[],
  ) => {
    const headers = await authHeaders();
    const res = await fetch(`${API}/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        food_preferences: foodPrefs,
        dietary_preferences: dietary,
        allergies,
        food_dislikes: dislikes,
      }),
    });
    if (res.ok) {
      setProfileData(prev =>
        prev
          ? {
            ...prev,
            food_preferences: foodPrefs,
            dietary_preferences: dietary,
            allergies,
            food_dislikes: dislikes,
          }
          : prev,
      );
    }
  };

  // ── Derived values ───────────────────────────────────────────────────────────

  const goalWeight = (): number => {
    if (!profileData) return 0;
    const w = profileData.weight_kg;
    if (profileData.fitness_goal === 'lose_weight') return Math.round((w - 5) * 10) / 10;
    if (profileData.fitness_goal === 'build_muscle') return Math.round((w + 5) * 10) / 10;
    return w;
  };

  const name = user?.name ?? 'Athlete';
  const email = user?.email ?? '';

  const hasPreferences =
    (profileData?.food_preferences?.length ?? 0) > 0 ||
    (profileData?.dietary_preferences?.length ?? 0) > 0 ||
    (profileData?.allergies?.length ?? 0) > 0 ||
    (profileData?.food_dislikes?.length ?? 0) > 0;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <View style={s.root}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          <Animated.View style={[s.sections, {opacity: fadeAnim}]}>

            {/* ── Hero ────────────────────────────────────────────────────────── */}
            <View style={s.hero}>
              <AvatarRing name={name}/>
              <View style={s.heroMeta}>
                <Text style={s.heroName}>{name}</Text>
                {email ? <Text style={s.heroEmail}>{email}</Text> : null}
              </View>
              {profileData?.fitness_goal ? (
                <View style={s.goalBadge}>
                  <Ionicons name={GOAL_ICONS[profileData.fitness_goal] ?? 'barbell-outline'}
                            size={16} color="#4ADE80"/>
                  <Text style={s.goalBadgeText}>{GOAL_LABELS[profileData.fitness_goal]}</Text>
                </View>
              ) : null}
            </View>

            {/* ── Quick stats ──────────────────────────────────────────────────── */}
            {profileData ? (
              <View style={s.statsRow}>
                <StatBox label="Weight" value={String(profileData.weight_kg)} unit="kg"/>
                <StatBox label="Goal" value={String(goalWeight())} unit="kg"/>
                <StatBox label="Training" value={String(profileData.training_days)} unit="/ wk"/>
              </View>
            ) : null}

            {/* ── Body stats card ──────────────────────────────────────────────── */}
            {profileData ? (
              <View style={s.card}>
                <SectionHeader icon="stats-chart-outline" title="Body Stats"/>
                <View style={s.bodyRow}>
                  <View style={s.bodyItem}>
                    <Text style={s.bodyValue}>{profileData.height_cm}</Text>
                    <Text style={s.bodyUnit}>cm</Text>
                    <Text style={s.bodyLabel}>Height</Text>
                  </View>
                  <View style={s.bodyDivider}/>
                  <View style={s.bodyItem}>
                    <Text style={s.bodyValue}>{profileData.age}</Text>
                    <Text style={s.bodyUnit}>yr</Text>
                    <Text style={s.bodyLabel}>Age</Text>
                  </View>
                  <View style={s.bodyDivider}/>
                  <View style={s.bodyItem}>
                    <Text style={[s.bodyValue, {fontSize: 15}]}>
                      {EXPERIENCE_LABELS[profileData.experience_level] ?? '—'}
                    </Text>
                    <Text style={s.bodyLabel}>Level</Text>
                  </View>
                </View>
                <View style={s.activityBadge}>
                  <Ionicons name="flash-outline" size={14} color="#888"/>
                  <Text style={s.activityBadgeText}>
                    {ACTIVITY_LABELS[profileData.activity_level] ?? '—'}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* ── Weight history card ─────────────────────────────────────────── */}
            {weightHistory.length > 0 ? (
              <View style={s.card}>
                <SectionHeader icon="trending-down-outline" title="Weight History"/>

                {weightHistory.length >= 2 && (
                  <WeightChart
                    data={weightHistory}
                    width={screenWidth - 64}
                  />
                )}

                <View style={s.weightLogDivider}/>

                {weightHistory.slice(0, 8).map((entry, i) => {
                  const prev = weightHistory[i + 1];
                  const delta = prev ? Math.round((entry.weight_kg - prev.weight_kg) * 10) / 10 : null;
                  const date = new Date(entry.logged_at).toLocaleDateString('nl-NL', {
                    day: 'numeric', month: 'short',
                  });
                  return (
                    <View key={entry.id} style={[s.weightLogRow, i === 0 && {borderTopWidth: 0}]}>
                      <Text style={s.weightLogDate}>{date}</Text>
                      <Text style={s.weightLogValue}>{entry.weight_kg} kg</Text>
                      {delta !== null ? (
                        <Text
                          style={[s.weightLogDelta, {color: delta <= 0 ? '#4ADE80' : '#F87171'}]}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)} kg
                        </Text>
                      ) : (
                        <Text style={s.weightLogDelta}/>
                      )}
                    </View>
                  );
                })}
              </View>
            ) : null}

            {/* ── Nutrition targets card ───────────────────────────────────────── */}
            {nutrition ? (
              <View style={s.card}>
                <SectionHeader icon="flame-outline" title="Nutrition Targets"/>
                <View style={s.calorieRow}>
                  <Text style={s.calorieBig}>{nutrition.calories.toLocaleString()}</Text>
                  <Text style={s.calorieUnit}>kcal / day</Text>
                </View>
                <MacroRow label="Protein" value={nutrition.protein} unit="g" color={GREEN}/>
                <MacroRow label="Carbohydrates" value={nutrition.carbs} unit="g" color="#60A5FA"/>
                <MacroRow label="Fats" value={nutrition.fats} unit="g" color="#FBBF24" isLast/>
              </View>
            ) : null}

            {/* ── Workout card ─────────────────────────────────────────────────── */}
            {profileData ? (
              <View style={s.card}>
                <SectionHeader icon="barbell-outline" title="Workout"/>
                <View style={s.workoutRow}>
                  <View style={s.workoutBadge}>
                    <Text style={s.workoutBadgeText}>
                      {WORKOUT_LABELS[profileData.workout_preference] ?? '—'}
                    </Text>
                  </View>
                  <Text style={s.workoutFreq}>{profileData.training_days}× per week</Text>
                </View>
              </View>
            ) : null}

            {/* ── Food preferences card ────────────────────────────────────────── */}
            {profileData && hasPreferences ? (
              <View style={s.card}>
                <SectionHeader icon="leaf-outline" title="Food Preferences"/>

                {(profileData.food_preferences?.length ?? 0) > 0 && (
                  <View style={s.chipSection}>
                    <Text style={s.chipGroupLabel}>Preferences</Text>
                    <View style={s.chipRow}>
                      {profileData.food_preferences.map(p => <Chip key={p} label={p}
                                                                   variant="green"/>)}
                    </View>
                  </View>
                )}

                {(profileData.dietary_preferences?.length ?? 0) > 0 && (
                  <View style={s.chipSection}>
                    <Text style={s.chipGroupLabel}>Diet</Text>
                    <View style={s.chipRow}>
                      {profileData.dietary_preferences.map(p => <Chip key={p} label={p}/>)}
                    </View>
                  </View>
                )}

                {(profileData.allergies?.length ?? 0) > 0 && (
                  <View style={s.chipSection}>
                    <Text style={s.chipGroupLabel}>Allergies</Text>
                    <View style={s.chipRow}>
                      {profileData.allergies.map(a => <Chip key={a} label={a} variant="red"/>)}
                    </View>
                  </View>
                )}

                {(profileData.food_dislikes?.length ?? 0) > 0 && (
                  <View style={s.chipSection}>
                    <Text style={s.chipGroupLabel}>Dislikes</Text>
                    <View style={s.chipRow}>
                      {profileData.food_dislikes.map(d => <Chip key={d} label={d}/>)}
                    </View>
                  </View>
                )}
              </View>
            ) : null}

            {/* ── Settings card ────────────────────────────────────────────────── */}
            <View style={s.card}>
              <SectionHeader icon="settings-outline" title="Settings"/>
              <SettingsRow icon="person-outline" label="Edit Profile"
                           onPress={() => setActiveModal('editProfile')}/>
              <SettingsRow icon="barbell-outline" label="Workout Preferences"
                           onPress={() => profileData && setActiveModal('workout')}/>
              <SettingsRow icon="nutrition-outline" label="Nutrition Preferences"
                           onPress={() => profileData && setActiveModal('nutrition')}/>
              <SettingsRow icon="notifications-outline" label="Notifications"
                           onPress={() => setActiveModal('notifications')}/>
              <SettingsRow icon="lock-closed-outline" label="Privacy & Security"
                           onPress={() => setActiveModal('privacy')}/>
              <View style={s.settingsDivider}/>
              <SettingsRow icon="log-out-outline" label="Log Out" destructive onPress={signOut}/>
            </View>

            <Text style={s.versionText}>GymStart · v1.0.0</Text>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}

      <EditProfileModal
        visible={activeModal === 'editProfile'}
        initialName={name}
        onSave={saveName}
        onClose={() => setActiveModal(null)}
      />

      <WorkoutModal
        visible={activeModal === 'workout'}
        initialPref={profileData?.workout_preference ?? 'gym'}
        initialDays={profileData?.training_days ?? 3}
        onSave={saveWorkout}
        onClose={() => setActiveModal(null)}
      />

      <NutritionModal
        visible={activeModal === 'nutrition'}
        initialFoodPrefs={profileData?.food_preferences ?? []}
        initialDietary={profileData?.dietary_preferences ?? []}
        initialAllergies={profileData?.allergies ?? []}
        initialDislikes={profileData?.food_dislikes ?? []}
        onSave={saveNutrition}
        onClose={() => setActiveModal(null)}
      />

      <NotificationsModal
        visible={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
      />

      <PrivacyModal
        visible={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: BG},
  scrollContent: {paddingHorizontal: 16, paddingBottom: 40},
  sections: {gap: 12, paddingTop: 8},

  // Hero
  hero: {alignItems: 'center', paddingVertical: 8, gap: 10},
  heroMeta: {alignItems: 'center', gap: 3},
  heroName: {color: WHITE, fontSize: 24, fontWeight: '700'},
  heroEmail: {color: MUTED, fontSize: 13},
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#052E16',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#166534'
  },
  goalBadgeIcon: {fontSize: 13},
  goalBadgeText: {color: GREEN, fontSize: 13, fontWeight: '600'},

  // Stats
  statsRow: {flexDirection: 'row', gap: 10},

  // Card
  card: {backgroundColor: CARD, borderRadius: 16, padding: 16},

  // Body stats
  bodyRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  bodyItem: {flex: 1, alignItems: 'center', paddingVertical: 8, gap: 2},
  bodyValue: {color: WHITE, fontSize: 22, fontWeight: '700'},
  bodyUnit: {color: MUTED, fontSize: 11},
  bodyLabel: {color: MUTED, fontSize: 11, marginTop: 3},
  bodyDivider: {width: 1, height: 44, backgroundColor: BORDER},
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2D2D5E'
  },
  activityBadgeText: {color: '#A78BFA', fontSize: 13, fontWeight: '500'},
  weightLogDivider: {height: 1, backgroundColor: '#2A2A2A', marginVertical: 8},
  weightLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderColor: '#1E1E1E'
  },
  weightLogDate: {flex: 1, color: '#9CA3AF', fontSize: 13},
  weightLogValue: {color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginRight: 8},
  weightLogDelta: {fontSize: 13, fontWeight: '500', minWidth: 52, textAlign: 'right'},

  // Nutrition
  calorieRow: {flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 12},
  calorieBig: {color: WHITE, fontSize: 42, fontWeight: '800', lineHeight: 46},
  calorieUnit: {color: MUTED, fontSize: 14, paddingBottom: 6},

  // Workout
  workoutRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  workoutBadge: {
    backgroundColor: '#1A2A1E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#166534'
  },
  workoutBadgeText: {color: GREEN, fontSize: 14, fontWeight: '600'},
  workoutFreq: {color: MUTED, fontSize: 13, fontWeight: '500'},

  // Chips
  chipSection: {marginBottom: 8},
  chipGroupLabel: {color: MUTED, fontSize: 12, fontWeight: '500', marginBottom: 6},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},

  // Settings
  settingsDivider: {height: 1, backgroundColor: BORDER, marginVertical: 2},

  // Footer
  versionText: {color: '#3A3A3A', fontSize: 11, textAlign: 'center', marginTop: 8},
});
