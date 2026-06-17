import React, {useCallback, useState} from 'react';
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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '@/contexts/AuthContext';
import {MealPlan, Profile} from '@/types/home';
import {
  CARD,
  ERROR,
  formatLastUpdated,
  formatWeight,
  getGreeting,
  goalWeight,
  GREEN,
  INNER,
  MUTED,
  TEXT,
  workoutLabel,
} from '@/utils/homeHelpers';
import {fetchMealPlan, fetchProfile, updateWeight} from '@/utils/homeApi';


export default function HomeScreen() {
  const {user} = useAuth();
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [deltaKg, setDeltaKg] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isTrainingDay, setIsTrainingDay] = useState(true);

  useFocusEffect(useCallback(() => {
    loadAll()
  }, []));

  const loadAll = async () => {
    try {
      const [profileData, planData] = await Promise.all([fetchProfile(), fetchMealPlan()]);
      if (profileData) {
        setProfile(profileData);
        setCurrentWeight(profileData.weight_kg);

        const weightUpdatedAt = await AsyncStorage.getItem('weightUpdatedAt');
        weightUpdatedAt && setLastUpdated(formatLastUpdated(weightUpdatedAt));

        const storedDelta = await AsyncStorage.getItem('weightDelta');
        storedDelta && setDeltaKg(parseFloat(storedDelta));
      }

      if (planData) setMealPlan(planData);
    } catch (_) {
      // silently degrade
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWeight = async () => {
    const weightAsText = weightInput.replace(',', '.');
    const newWeight = Math.round(parseFloat(weightAsText) * 100) / 100;
    const isValidWeight = !isNaN(newWeight) && newWeight >= 30 && newWeight <= 200;

    // The user cannot adjust the weight lower than 30KG or higher than 200KG
    // or a value that is not a number. This is to prevent accidental inputs and ensure data integrity.
    if (!isValidWeight) {
      setSaveError('Enter a valid weight between 30 and 200 kg');
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const result = await updateWeight(newWeight);

      if ('error' in result) {
        setSaveError(result.error);
        return;
      }

      setCurrentWeight(newWeight);
      setDeltaKg(result.delta_kg);

      const weightUpdatedAt = new Date().toISOString();
      await AsyncStorage.setItem('weightUpdatedAt', weightUpdatedAt);

      if (result.delta_kg !== null) {
        await AsyncStorage.setItem('weightDelta', String(result.delta_kg));
      }

      setLastUpdated('just now');
      setShowModal(false);
      setWeightInput('');
    } catch (_) {
      setSaveError('Could not connect to server');
    } finally {
      setSaving(false);
    }
  };

  const selectedDayType = isTrainingDay ? 'training' : 'rest';
  const todayType = mealPlan?.day_types.find(dayType => dayType.type === selectedDayType);
  const todayCalories = todayType?.calories ?? 0;
  const firstTwoMeals = todayType?.meals.slice(0, 2) ?? [];

  const goal = profile ? goalWeight(profile) : 0;

  return (
    <View style={styles.root}>
      <SafeAreaView style={{flex: 1}}>

        <View style={styles.header}>
          <View style={styles.headerCenter}>
            <Text
              style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'}</Text>
            <Text style={styles.greetingSub}>Ready for today?</Text>
          </View>

          <View style={styles.bell}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#888"/>
          </View>
        </View>

        {!loading && profile && mealPlan && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 20, paddingBottom: 24}}
          >

            {/* Today's Progress */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Today's Progress</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBox}>
                  <Text style={styles.progressLabel}>Calories</Text>
                  <Text style={styles.progressValue}>0</Text>
                  <Text style={styles.progressSub}>kcal burned</Text>
                </View>
                <View style={styles.progressBox}>
                  <Text style={styles.progressLabel}>Workouts</Text>
                  <Text
                    style={styles.progressValue}>{profile.training_days}/wk</Text>
                  <Text style={styles.progressSub}>planned</Text>
                </View>
              </View>
            </View>

            {/* Your Weight */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Your Weight</Text>
              <Text style={styles.cardSectionSub}>Last updated {lastUpdated}</Text>
              <View style={styles.weightRow}>
                <Text style={styles.weightNumber}>{formatWeight(currentWeight)}
                  <Text style={styles.weightUnit}>kg</Text>
                </Text>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.goalLabel}>Goal</Text>
                  <Text style={styles.goalValue}>{formatWeight(goal)} kg</Text>
                </View>
              </View>

              {deltaKg !== null && (
                <View style={styles.deltaRow}>
                  <Text style={[styles.deltaText, {color: deltaKg <= 0 ? GREEN : ERROR}]}>
                    {deltaKg > 0 ? '+' : ''}{deltaKg.toFixed(1)} kg since last update
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.greenButton} onPress={() => {
                setWeightInput(String(currentWeight).replace('.', ','));
                setShowModal(true);
              }}>
                <Text style={styles.greenButtonText}>Update Weight</Text>
              </TouchableOpacity>
            </View>

            {/* Today's Workout */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Today's Workout</Text>
              <Text style={styles.cardSectionSub}>{workoutLabel(profile)}</Text>
              <TouchableOpacity
                style={styles.greenButton}
                onPress={() => navigation.navigate('Workout')}>
                <Text style={styles.greenButtonText}>View</Text>
              </TouchableOpacity>
            </View>

            {/* Today's Meals */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Today's Meals</Text>

              <View style={styles.dayToggle}>
                <TouchableOpacity
                  style={[styles.dayToggleButton, isTrainingDay && styles.dayToggleButtonActive]}
                  onPress={() => setIsTrainingDay(true)}
                >
                  <Text style={[styles.dayToggleText, isTrainingDay && styles.dayToggleTextActive]}>
                    Training
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.dayToggleButton, !isTrainingDay && styles.dayToggleButtonActive]}
                  onPress={() => setIsTrainingDay(false)}
                >
                  <Text
                    style={[styles.dayToggleText, !isTrainingDay && styles.dayToggleTextActive]}>
                    Rest
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardSectionSub}>{todayCalories} kcal today</Text>

              {firstTwoMeals.map((meal, index) => (
                <View key={index} style={styles.mealPreviewRow}>
                  <Text style={styles.mealPreviewName}>{meal.meal_name}</Text>
                  <Text style={styles.mealPreviewCalories}>{meal.calories} kcal</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.greenButton}
                                onPress={() => navigation.navigate('Meal')}>
                <Text style={styles.greenButtonText}>View Meals</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        )}

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator
              color={GREEN}
              size="large"/>
          </View>
        )}
      </SafeAreaView>

      {/* ── Weight Update Modal */}
      <Modal visible={showModal} transparent animationType="slide"
             onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={styles.modalCard} onPress={event => event.stopPropagation()}>
              <Text style={styles.modalTitle}>Update Weight</Text>
              <Text style={styles.modalSub}>Enter your current weight in kg</Text>

              {saveError && (
                <Text style={styles.modalError}>{saveError}</Text>
              )}

              <TextInput
                style={styles.modalInput}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
                placeholder="e.g. 78.5"
                placeholderTextColor="#666"
                autoFocus
                selectTextOnFocus
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.greenButton, {flex: 1}, saving && {opacity: 0.5}]}
                  onPress={handleUpdateWeight}
                  disabled={saving}
                >
                  <Text style={styles.greenButtonText}>{saving ? 'Saving…' : 'Save'}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

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
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  greeting: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '700'
  },
  greetingSub: {
    color: MUTED,
    fontSize: 13,
    marginTop: 2
  },

  // Cards
  card: {backgroundColor: CARD, borderRadius: 16, padding: 16, gap: 12},
  cardSectionTitle: {color: TEXT, fontSize: 15, fontWeight: '600'},
  cardSectionSub: {color: MUTED, fontSize: 12, marginTop: 2},

  // Day toggle
  dayToggle: {flexDirection: 'row', backgroundColor: INNER, borderRadius: 10, padding: 4, gap: 4},
  dayToggleButton: {flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center'},
  dayToggleButtonActive: {backgroundColor: GREEN},
  dayToggleText: {color: MUTED, fontWeight: '600', fontSize: 13},
  dayToggleTextActive: {color: '#111'},

  // Meal preview
  mealPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: INNER
  },
  mealPreviewName: {color: TEXT, fontSize: 13, fontWeight: '500'},
  mealPreviewCalories: {color: MUTED, fontSize: 13},

  // Progress
  progressRow: {flexDirection: 'row', gap: 12},
  progressBox: {
    flex: 1,
    backgroundColor: INNER,
    borderRadius: 12,
    padding: 14,
    gap: 4
  },
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
  deltaRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  deltaText: {fontSize: 13, fontWeight: '500'},

  // Buttons
  greenButton: {
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  greenButtonText: {
    color: '#111',
    fontWeight: '700',
    fontSize: 15
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
  modalError: {color: '#F87171', fontSize: 13, textAlign: 'center'},
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalCancel: {
    flex: 1,
    backgroundColor: INNER,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  modalCancelText: {color: MUTED, fontWeight: '600'},
});
