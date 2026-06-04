import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '@/contexts/AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Profile {
  weight_kg: number;
  fitness_goal: 'lose_weight' | 'build_muscle' | 'maintain';
  training_days: number;
  workout_preference: string;
}

interface MealFood {
  name: string;
  calories: number;
}

interface MealSlot {
  meal_name: string;
  calories: number;
  foods: MealFood[];
}

interface MealPlan {
  goal: string;
  day_types: Array<{
    type: string;
    meals: MealSlot[]
  }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const API = 'http://127.0.0.1:8000/api';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function goalWeight(profile: Profile): number {
  const w = profile.weight_kg;
  if (profile.fitness_goal === 'lose_weight') return Math.round((w - 5) * 10) / 10;
  if (profile.fitness_goal === 'build_muscle') return Math.round((w + 5) * 10) / 10;
  return w;
}

function formatWeight(n: number): string {
  return n.toString().replace('.', ',');
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const {user} = useAuth();
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const authHeaders = async () => {
    const token = await AsyncStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  };

  const loadAll = async () => {
    try {
      const headers = await authHeaders();

      const [profileRes, planRes] = await Promise.all([
        fetch(`${API}/onboarding/profile`, {headers}),
        fetch(`${API}/mealplans`, {headers}),
      ]);

      if (profileRes.ok) {
        const json = await profileRes.json();
        const data = json.data as Profile;
        setProfile(data);
        setCurrentWeight(data.weight_kg);

        // Restore locally overridden weight if the user updated it
        const stored = await AsyncStorage.getItem('currentWeight');
        if (stored) setCurrentWeight(parseFloat(stored));

        const ts = await AsyncStorage.getItem('weightUpdatedAt');
        setLastUpdated(ts ? formatLastUpdated(ts) : 'from onboarding');
      }

      if (planRes.ok) {
        const json = await planRes.json();
        setMealPlan(json.data);
      }
    } catch (_) {
      // silently degrade
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWeight = async () => {
    const value = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(value) || value < 30 || value > 500) return;

    setSaving(true);
    try {
      const headers = await authHeaders();
      await fetch(`${API}/profile/weight`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({weight_kg: value}),
      });

      setCurrentWeight(value);
      const now = new Date().toISOString();
      await AsyncStorage.setItem('currentWeight', String(value));
      await AsyncStorage.setItem('weightUpdatedAt', now);
      setLastUpdated('just now');
      setShowModal(false);
      setWeightInput('');
    } catch (_) {
      // still update local state
      setCurrentWeight(value);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  // Today's meals: use training day if available
  const todayType = mealPlan?.day_types.find(d => d.type === 'training') ?? mealPlan?.day_types[0];
  const breakfast = todayType?.meals.find(m => m.meal_name === 'Breakfast');
  const lunch = todayType?.meals.find(m => m.meal_name === 'Lunch');

  const mealFoodLabel = (meal?: MealSlot) =>
    meal?.foods.slice(0, 2).map(f => f.name).join(' & ') ?? '';

  const goal = profile ? goalWeight(profile) : 0;
  const goalDiff = profile ? Math.abs(currentWeight - goal) : 0;
  const isLosing = profile?.fitness_goal === 'lose_weight';

  const workoutLabel = profile?.workout_preference
    ? profile.workout_preference.charAt(0).toUpperCase() + profile.workout_preference.slice(1) + ' Workout'
    : 'Training Day';

  return (
    <View style={s.root}>
      <SafeAreaView style={{flex: 1}}>

        <View style={s.header}>
          <View style={s.headerCenter}>
            <Text
              style={s.greeting}>{getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'}</Text>
            <Text style={s.greetingSub}>Ready for today?</Text>
          </View>

          <View style={s.bell}><Ionicons name="notifications-outline" size={22}
                                         color="#888"/></View>
        </View>

        {loading ? (
          <View style={s.center}>
            <ActivityIndicator color="#4ADE80" size="large"/>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}
                      contentContainerStyle={{gap: 12, paddingBottom: 24}}>

            {/* ── Today's Progress ─────────────────────────────── */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Today's Progress</Text>
              <View style={s.progressRow}>
                <View style={s.progressBox}>
                  <Ionicons name="flame-outline" size={24} color="#F97316"/>
                  <Text style={s.progressLabel}>Calories</Text>
                  <Text style={s.progressValue}>0</Text>
                  <Text style={s.progressSub}>kcal burned</Text>
                </View>
                <View style={s.progressBox}>
                  <Ionicons name="barbell-outline" size={24} color="#4ADE80"/>
                  <Text style={s.progressLabel}>Workouts</Text>
                  <Text
                    style={s.progressValue}>{profile?.training_days ?? 0}/wk</Text>
                  <Text style={s.progressSub}>planned</Text>
                </View>
              </View>
            </View>

            {/* ── Your Weight ──────────────────────────────────── */}
            <View style={s.card}>
              <View style={s.cardRow}>
                <View style={[s.iconCircle, {backgroundColor: '#6D28D9'}]}>
                  <Ionicons name="scale-outline" size={20} color="#fff"/>
                </View>
                <View style={{flex: 1}}>
                  <Text style={s.cardSectionTitle}>Your Weight</Text>
                  <Text style={s.cardSectionSub}>Last
                    updated {lastUpdated || 'from onboarding'}</Text>
                </View>
              </View>

              <View style={s.weightRow}>
                <Text style={s.weightNumber}>
                  {formatWeight(currentWeight)}
                  <Text style={s.weightUnit}>kg</Text>
                </Text>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={s.goalLabel}>Goal</Text>
                  <Text style={s.goalValue}>{formatWeight(goal)} kg</Text>
                </View>
              </View>

              <Text style={s.weeklyChange}>
                {isLosing ? '↓' : '↑'} {formatWeight(Math.abs(Math.min(goalDiff, 1)))} kg
                this week
              </Text>

              <TouchableOpacity style={s.greenBtn} onPress={() => {
                setWeightInput(String(currentWeight).replace('.', ','));
                setShowModal(true);
              }}>
                <Text style={s.greenBtnText}>Update Weight</Text>
              </TouchableOpacity>
            </View>

            {/* ── Today's Workout ──────────────────────────────── */}
            <View style={s.card}>
              <View style={s.cardRow}>
                <View style={[s.iconCircle, {backgroundColor: '#1D4ED8'}]}>
                  <Ionicons name="barbell-outline" size={20} color="#fff"/>
                </View>
                <View style={{flex: 1}}>
                  <Text style={s.cardSectionTitle}>Today's Workout</Text>
                  <Text style={s.cardSectionSub}>{workoutLabel}</Text>
                </View>
              </View>
              <TouchableOpacity style={s.greenBtn}
                                onPress={() => navigation.navigate('Workout')}>
                <Text style={s.greenBtnText}>View</Text>
              </TouchableOpacity>
            </View>

            {/* ── Today's Meals ─────────────────────────────────── */}
            <View style={s.card}>
              <View style={s.cardRow}>
                <View style={[s.iconCircle, {backgroundColor: '#92400E'}]}>
                  <Ionicons name="restaurant-outline" size={20} color="#fff"/>
                </View>
                <View style={{flex: 1}}>
                  <Text style={s.cardSectionTitle}>Today's Meals</Text>
                  <Text style={s.cardSectionSub}>
                    {todayType ? `${todayType.meals.length} meals planned` : 'No plan yet'}
                  </Text>
                </View>
              </View>

              {breakfast && (
                <View style={s.mealRow}>
                  <View style={[s.mealIconBox, {backgroundColor: '#F97316'}]}>
                    <Ionicons name="cafe-outline" size={16} color="#fff"/>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={s.mealName}>Breakfast</Text>
                    <Text style={s.mealDesc}>{mealFoodLabel(breakfast)}</Text>
                  </View>
                  <Text style={s.mealCal}>{breakfast.calories} cal</Text>
                </View>
              )}

              {lunch && (
                <View style={s.mealRow}>
                  <View style={[s.mealIconBox, {backgroundColor: '#16A34A'}]}>
                    <Ionicons name="leaf-outline" size={16} color="#fff"/>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={s.mealName}>Lunch</Text>
                    <Text style={s.mealDesc}>{mealFoodLabel(lunch)}</Text>
                  </View>
                  <Text style={s.mealCal}>{lunch.calories} cal</Text>
                </View>
              )}

              {!breakfast && !lunch && (
                <Text style={s.emptyText}>Complete onboarding to see your
                  meals</Text>
              )}

              <TouchableOpacity style={s.greenBtn}
                                onPress={() => navigation.navigate('Meal')}>
                <Text style={s.greenBtnText}>View All Meals</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        )}
      </SafeAreaView>

      {/* ── Weight Update Modal ──────────────────────────────────── */}
      <Modal visible={showModal} transparent animationType="slide"
             onRequestClose={() => setShowModal(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setShowModal(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={s.modalCard} onPress={e => e.stopPropagation()}>
              <Text style={s.modalTitle}>Update Weight</Text>
              <Text style={s.modalSub}>Enter your current weight in kg</Text>

              <TextInput
                style={s.modalInput}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
                placeholder="e.g. 78.5"
                placeholderTextColor="#666"
                autoFocus
                selectTextOnFocus
              />

              <View style={s.modalBtns}>
                <TouchableOpacity style={s.modalCancel}
                                  onPress={() => setShowModal(false)}>
                  <Text style={s.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.modalSave, saving && {opacity: 0.5}]}
                  onPress={handleUpdateWeight}
                  disabled={saving}
                >
                  <Text
                    style={s.modalSaveText}>{saving ? 'Saving…' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatLastUpdated(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return 'today';
  const days = Math.floor(diff / 86400);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const GREEN = '#4ADE80';
const CARD = '#1A1A1A';
const INNER = '#252525';
const TEXT = '#FFFFFF';
const MUTED = '#9CA3AF';

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#0D0D0D', paddingHorizontal: 16},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bellIcon: {fontSize: 18},
  headerCenter: {flex: 1, alignItems: 'center'},
  greeting: {color: TEXT, fontSize: 20, fontWeight: '700'},
  greetingSub: {color: MUTED, fontSize: 13, marginTop: 2},

  // Cards
  card: {backgroundColor: CARD, borderRadius: 16, padding: 16, gap: 12},
  cardTitle: {color: TEXT, fontSize: 16, fontWeight: '600'},
  cardRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  cardSectionTitle: {color: TEXT, fontSize: 15, fontWeight: '600'},
  cardSectionSub: {color: MUTED, fontSize: 12, marginTop: 2},
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {fontSize: 20},

  // Progress
  progressRow: {flexDirection: 'row', gap: 12},
  progressBox: {
    flex: 1,
    backgroundColor: INNER,
    borderRadius: 12,
    padding: 14,
    gap: 4
  },
  progressIcon: {fontSize: 20},
  progressLabel: {color: MUTED, fontSize: 12},
  progressValue: {color: TEXT, fontSize: 26, fontWeight: '700'},
  progressSub: {color: MUTED, fontSize: 11},

  // Weight
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  weightNumber: {color: TEXT, fontSize: 48, fontWeight: '800', lineHeight: 56},
  weightUnit: {fontSize: 22, fontWeight: '400', color: MUTED},
  goalLabel: {color: MUTED, fontSize: 12},
  goalValue: {color: TEXT, fontSize: 18, fontWeight: '600'},
  weeklyChange: {color: GREEN, fontSize: 13, fontWeight: '500'},

  // Buttons
  greenBtn: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  greenBtnText: {color: '#111', fontWeight: '700', fontSize: 15},

  // Meals
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: INNER,
    borderRadius: 12,
    padding: 12
  },
  mealIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mealIconText: {fontSize: 18},
  mealName: {color: TEXT, fontWeight: '600', fontSize: 14},
  mealDesc: {color: MUTED, fontSize: 12, marginTop: 2},
  mealCal: {color: MUTED, fontSize: 12},
  emptyText: {
    color: MUTED,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  modalCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    gap: 16
  },
  modalTitle: {color: TEXT, fontSize: 20, fontWeight: '700'},
  modalSub: {color: MUTED, fontSize: 14, marginTop: -8},
  modalInput: {
    backgroundColor: INNER,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: GREEN,
  },
  modalBtns: {flexDirection: 'row', gap: 12},
  modalCancel: {
    flex: 1,
    backgroundColor: INNER,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  modalCancelText: {color: MUTED, fontWeight: '600'},
  modalSave: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  modalSaveText: {color: '#111', fontWeight: '700'},
});
