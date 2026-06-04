import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';
import ToggleButton from '@/components/ToggleButton';

// ── Types mirror the API response which is built from the DB relations:
// MealPlan → MealPlanType → Meal → MealItem → Food

interface FoodItem {
  name: string;
  grams: number;     // meal_items.grams
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealSlot {
  slot: number;       // meals.order_index from DB
  meal_name: string;  // derived by backend from order_index (1→Breakfast etc.)
  type: string;       // meals.type from DB: 'standard' | 'pre_workout' | 'post_workout'
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: FoodItem[];
}

interface DayType {
  type: 'training' | 'rest';  // meal_plan_types.type from DB
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: MealSlot[];
}

interface MealPlan {
  goal: string;
  daily_targets: { calories: number; protein: number; carbs: number; fats: number };
  day_types: DayType[];
}

// ── Visual config keyed on meals.order_index (= slot) from DB ────────────────
// meal_name is now "Meal 1"–"Meal N", "Pre-Workout", or "Post-Workout"
// derived by the backend from meals.type + meals.order_index.

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const SLOT_CONFIG: Record<number, {icon: IoniconsName; iconBg: string}> = {
  1: {icon: 'sunny-outline',       iconBg: '#1C2A1C'},
  2: {icon: 'restaurant-outline',  iconBg: '#1A2A25'},
  3: {icon: 'moon-outline',        iconBg: '#1F1C2A'},
  4: {icon: 'nutrition-outline',   iconBg: '#2A1C1C'},
  5: {icon: 'fast-food-outline',   iconBg: '#1C1C2A'},
};

const WORKOUT_MEAL_CONFIG: Record<string, {icon: IoniconsName; iconBg: string}> = {
  pre_workout:  {icon: 'flash-outline',   iconBg: '#1A2200'},
  post_workout: {icon: 'barbell-outline', iconBg: '#001A1A'},
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function MealsScreen() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'training' | 'rest'>('training');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [infoMeal, setInfoMeal] = useState<MealSlot | null>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const res = await fetch('http://127.0.0.1:8000/api/mealplans', {
        headers: {Authorization: `Bearer ${token}`, Accept: 'application/json'},
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.message ?? 'Failed to load');
        return;
      }
      const json = await res.json();
      setPlan(json.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (key: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Active day comes from meal_plan_types.type (training | rest) from DB
  const activeDay = plan?.day_types.find(d => d.type === mode) ?? plan?.day_types[0];

  // Sort by meals.order_index (= slot) ascending — this is the DB sort key
  const sortedMeals = activeDay
    ? [...activeDay.meals].sort((a, b) => a.slot - b.slot)
    : [];

  return (
    <View style={s.root}>
      <SafeAreaView style={{flex: 1}}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Meal Plan</Text>
          <Text style={s.subtitle}>Your daily nutrition</Text>
        </View>

        {/* Toggle — switches between meal_plan_types.type: training | rest */}
        <ToggleButton mode={mode} setMode={setMode}/>

        {loading && (
          <View style={s.center}>
            <ActivityIndicator color="#4ADE80" size="large"/>
          </View>
        )}

        {!loading && error && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && plan && activeDay && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

            {/* ── Daily totals from meal_plan_types row ───────────── */}
            <View style={s.caloriesCard}>
              <View style={s.caloriesRow}>
                <View>
                  <Text style={s.caloriesLabel}>Total Daily Calories</Text>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4}}>
                    <Text style={s.caloriesNumber}>{activeDay.calories.toLocaleString()}</Text>
                    <Text style={s.caloriesUnit}>kcal</Text>
                  </View>
                </View>
                <View style={s.flameBadge}>
                  <Ionicons name="flame-outline" size={22} color="#F97316"/>
                </View>
              </View>

              <View style={s.macroRow}>
                <Text style={s.macroText}>Protein: {activeDay.protein}g</Text>
                <Text style={s.macroText}>Carbs: {activeDay.carbs}g</Text>
                <Text style={s.macroText}>Fats: {activeDay.fats}g</Text>
              </View>
            </View>

            {/* ── Meal cards — one per meals row in DB ────────────── */}
            {sortedMeals.map((meal) => {
              const key     = `${mode}_slot_${meal.slot}`;
              const isDone  = completed.has(key);
              // meals.type drives icon — pre/post workout get distinct look
              const cfg     = WORKOUT_MEAL_CONFIG[meal.type] ?? SLOT_CONFIG[meal.slot] ?? SLOT_CONFIG[1];
              const preview = meal.foods.slice(0, 2).map(f => f.name).join(' & ');
              const foodNames = meal.foods.map(f => f.name).join(', ');

              return (
                <View key={key} style={s.mealCard}>
                  <View style={s.mealHeader}>
                    <View style={[s.mealIcon, {backgroundColor: cfg.iconBg}]}>
                      <Ionicons name={cfg.icon} size={20} color="#4ADE80"/>
                    </View>

                    <View style={s.mealTitleBlock}>
                      <View style={s.mealTitleRow}>
                        {/* meal_name = "Meal N" | "Pre-Workout" | "Post-Workout" from backend */}
                        <Text style={s.mealName}>{meal.meal_name}</Text>

                        <View style={s.kcalBadge}>
                          <Text style={s.kcalText}>{meal.calories} kcal</Text>
                        </View>

                        <TouchableOpacity style={s.infoBtn} onPress={() => setInfoMeal(meal)}>
                          <Ionicons name="information-circle-outline" size={20} color="#888"/>
                        </TouchableOpacity>
                      </View>

                      <Text style={s.mealFoodTitle}>{preview}</Text>
                      <Text style={s.mealIngredients} numberOfLines={1}>{foodNames}</Text>
                    </View>
                  </View>

                  {/* Macros summed from meal_items × food nutritional values */}
                  <Text style={s.mealMacros}>
                    P: {meal.protein}g{'  '}|{'  '}C: {meal.carbs}g{'  '}|{'  '}F: {meal.fats}g
                  </Text>

                  <TouchableOpacity
                    style={[s.completeBtn, isDone && s.completeBtnDone]}
                    onPress={() => toggleComplete(key)}
                  >
                    <Text style={[s.completeBtnText, isDone && s.completeBtnTextDone]}>
                      {isDone ? 'Meal Completed' : 'Complete meal'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}

        {!loading && !error && !plan && (
          <View style={s.center}>
            <Text style={s.emptyText}>No meal plan yet. Complete onboarding to generate one.</Text>
          </View>
        )}
      </SafeAreaView>

      {/* ── Info Modal ──────────────────────────────────────────────── */}
      <Modal
        visible={!!infoMeal}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoMeal(null)}
      >
        <Pressable style={s.overlay} onPress={() => setInfoMeal(null)}>
          <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
            {infoMeal && <InfoSheet meal={infoMeal} onClose={() => setInfoMeal(null)}/>}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Info Sheet — shows all food records linked via meal_items ─────────────────

function InfoSheet({meal, onClose}: {meal: MealSlot; onClose: () => void}) {
  const cfg = WORKOUT_MEAL_CONFIG[meal.type] ?? SLOT_CONFIG[meal.slot] ?? SLOT_CONFIG[1];

  return (
    <>
      <View style={s.handleBar}/>

      <View style={s.sheetHeader}>
        <View style={[s.mealIcon, {backgroundColor: cfg.iconBg}]}>
          <Ionicons name={cfg.icon} size={20} color="#4ADE80"/>
        </View>
        <View style={{flex: 1}}>
          <Text style={s.sheetTitle}>{meal.meal_name}</Text>
          <Text style={s.sheetSub}>
            {meal.calories} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g
          </Text>
        </View>
      </View>

      <View style={s.divider}/>

      {/* Each row = one meal_items record joined with foods */}
      <ScrollView style={{maxHeight: 340}} showsVerticalScrollIndicator={false}>
        {meal.foods.map((food, i) => (
          <View key={i} style={s.foodRow}>
            <View style={{flex: 1}}>
              <Text style={s.foodName}>{food.name}</Text>
              <Text style={s.foodGrams}>{food.grams}g</Text>
            </View>
            <View style={s.foodMacros}>
              <Text style={s.foodMacroText}>{food.calories} kcal</Text>
              <Text style={s.foodMacroMuted}>P {food.protein}g</Text>
              <Text style={s.foodMacroMuted}>C {food.carbs}g</Text>
              <Text style={s.foodMacroMuted}>F {food.fats}g</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={s.closeBtn} onPress={onClose}>
        <Text style={s.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const BG    = '#0B0B0B';
const CARD  = '#1A1A1A';
const INNER = '#252525';
const GREEN = '#4ADE80';
const MUTED = '#9CA3AF';
const WHITE = '#FFFFFF';

const s = StyleSheet.create({
  root:    {flex: 1, backgroundColor: BG, paddingHorizontal: 16},
  center:  {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40},
  scroll:  {gap: 12, paddingBottom: 32},
  header:  {paddingTop: 8, paddingBottom: 12},
  title:   {color: WHITE, fontSize: 28, fontWeight: '800'},
  subtitle:{color: MUTED, fontSize: 14, marginTop: 2},

  errorBox: {margin: 16, padding: 16, backgroundColor: '#7F1D1D', borderRadius: 12},
  errorText:{color: WHITE, fontSize: 14},
  emptyText:{color: MUTED, textAlign: 'center', paddingHorizontal: 24},

  // Calories card
  caloriesCard:  {backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 4},
  caloriesRow:   {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  caloriesLabel: {color: MUTED, fontSize: 13},
  caloriesNumber:{color: WHITE, fontSize: 40, fontWeight: '800'},
  caloriesUnit:  {color: MUTED, fontSize: 18, paddingBottom: 6},
  flameBadge:    {width: 48, height: 48, borderRadius: 24, backgroundColor: '#052E16', alignItems: 'center', justifyContent: 'center'},
  macroRow:      {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderColor: '#2A2A2A', paddingTop: 12},
  macroText:     {color: MUTED, fontSize: 13},

  // Meal card
  mealCard:      {backgroundColor: CARD, borderRadius: 16, padding: 14, gap: 10},
  mealHeader:    {flexDirection: 'row', gap: 12},
  mealIcon:      {width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  mealIconEmoji: {fontSize: 26},
  mealTitleBlock:{flex: 1, gap: 3},
  mealTitleRow:  {flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap'},
  mealName:      {color: WHITE, fontSize: 16, fontWeight: '700'},
  typeBadge:     {backgroundColor: '#1E3A5F', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20},
  typeBadgeText: {color: '#60A5FA', fontSize: 10, fontWeight: '700'},
  kcalBadge:     {backgroundColor: '#14532D', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20},
  kcalText:      {color: GREEN, fontSize: 12, fontWeight: '600'},
  infoBtn:       {width: 22, height: 22, borderRadius: 11, backgroundColor: INNER, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto'},
  infoBtnText:   {color: MUTED, fontSize: 12, fontWeight: '700'},
  mealFoodTitle: {color: WHITE, fontSize: 14, fontWeight: '600'},
  mealIngredients:{color: MUTED, fontSize: 12},
  mealMacros:    {color: MUTED, fontSize: 12, textAlign: 'right'},

  // Complete button
  completeBtn:        {backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  completeBtnDone:    {backgroundColor: INNER},
  completeBtnText:    {color: '#111', fontWeight: '700', fontSize: 14},
  completeBtnTextDone:{color: MUTED},

  // Info modal
  overlay:    {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:      {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 12},
  handleBar:  {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 4},
  sheetHeader:{flexDirection: 'row', gap: 12, alignItems: 'center'},
  sheetTitle: {color: WHITE, fontSize: 20, fontWeight: '700'},
  sheetSub:   {color: MUTED, fontSize: 13, marginTop: 2},
  divider:    {height: 1, backgroundColor: '#2A2A2A'},

  // Food rows — each row = one meal_items record joined with foods table
  foodRow:       {flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#2A2A2A'},
  foodName:      {color: WHITE, fontSize: 14, fontWeight: '600'},
  foodGrams:     {color: MUTED, fontSize: 12, marginTop: 2},
  foodMacros:    {alignItems: 'flex-end', gap: 2},
  foodMacroText: {color: GREEN, fontSize: 13, fontWeight: '600'},
  foodMacroMuted:{color: MUTED, fontSize: 11},

  // Close button
  closeBtn:     {backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4},
  closeBtnText: {color: '#111', fontWeight: '700', fontSize: 15},
});
