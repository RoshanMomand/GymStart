import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Food data ─────────────────────────────────────────────────────────────────

const FOOD_CATEGORIES = [
  {
    title: 'Proteins',
    options: ['Chicken', 'Beef', 'Turkey', 'Fish', 'Salmon', 'Tuna', 'Shrimp', 'Eggs', 'Tofu', 'Tempeh'],
  },
  {
    title: 'Carbs',
    options: ['Rice', 'Pasta', 'Potatoes', 'Sweet Potato', 'Oatmeal', 'Quinoa', 'Bread', 'Whole Wheat Wraps'],
  },
  {
    title: 'Vegetables',
    options: ['Broccoli', 'Bell Pepper', 'Spinach', 'Zucchini', 'Carrot', 'Cauliflower'],
  },
  {
    title: 'Fats',
    options: ['Avocado', 'Almonds', 'Walnuts', 'Cashews', 'Peanut Butter', 'Olive Oil', 'Chia Seeds', 'Flaxseeds', 'Pumpkin Seeds', 'Macadamia Nuts'],
  },
];

const ALL_STANDARD    = FOOD_CATEGORIES.flatMap(c => c.options);
const DIETARY_OPTIONS = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
const ALLERGY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Nut-free', 'Egg-free', 'Shellfish-free', 'Soy-free'];

// ── Design ────────────────────────────────────────────────────────────────────

const GREEN  = '#4ADE80';
const PURPLE = '#7C3AED';
const MUTED  = '#9CA3AF';
const WHITE  = '#FFFFFF';
const INNER  = '#252525';
const BORDER = '#2A2A2A';

type Tab = 'preferences' | 'dietary' | 'allergies' | 'dislikes';

const TABS: Array<{key: Tab; label: string}> = [
  {key: 'preferences', label: 'Food'},
  {key: 'dietary',     label: 'Diet'},
  {key: 'allergies',   label: 'Allergies'},
  {key: 'dislikes',    label: 'Dislikes'},
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  visible: boolean;
  initialFoodPrefs:  string[];
  initialDietary:    string[];
  initialAllergies:  string[];
  initialDislikes:   string[];
  onSave: (
    foodPrefs: string[],
    dietary:   string[],
    allergies: string[],
    dislikes:  string[],
  ) => Promise<void>;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NutritionModal({
  visible,
  initialFoodPrefs,
  initialDietary,
  initialAllergies,
  initialDislikes,
  onSave,
  onClose,
}: Props) {
  const [tab,         setTab]         = useState<Tab>('preferences');
  const [foodPrefs,   setFoodPrefs]   = useState<string[]>([]);
  const [dietary,     setDietary]     = useState<string[]>([]);
  const [allergies,   setAllergies]   = useState<string[]>([]);
  const [dislikes,    setDislikes]    = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    if (!visible) return;
    setFoodPrefs([...initialFoodPrefs]);
    setDietary([...initialDietary]);
    setAllergies([...initialAllergies]);
    setDislikes([...initialDislikes]);
    setTab('preferences');
    setCustomInput('');
  }, [visible]);

  // ── Toggle helpers ────────────────────────────────────────────────────────

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) =>
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const addCustom = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const t = customInput.trim();
    if (!t || list.map(i => i.toLowerCase()).includes(t.toLowerCase())) return;
    setter(prev => [...prev, t]);
    setCustomInput('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(foodPrefs, dietary, allergies, dislikes);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const customFoodPrefs = foodPrefs.filter(i => !ALL_STANDARD.includes(i));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
          <View style={s.handle} />
          <Text style={s.title}>Nutrition Preferences</Text>

          {/* ── Tab bar ─────────────────────────────────────────────────────── */}
          <View style={s.tabBar}>
            {TABS.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[s.tabBtn, tab === t.key && s.tabBtnActive]}
                onPress={() => { setTab(t.key); setCustomInput(''); }}
              >
                <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Tab content ─────────────────────────────────────────────────── */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{maxHeight: 320}}
            keyboardShouldPersistTaps="handled"
          >

            {/* Food preferences */}
            {tab === 'preferences' && (
              <View style={{gap: 16, paddingBottom: 4}}>
                {FOOD_CATEGORIES.map(cat => (
                  <View key={cat.title}>
                    <Text style={s.catLabel}>{cat.title}</Text>
                    <View style={s.chipRow}>
                      {cat.options.map(opt => {
                        const sel = foodPrefs.includes(opt);
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[s.chip, sel && s.chipActive]}
                            onPress={() => toggle(setFoodPrefs, opt)}
                          >
                            <Text style={[s.chipText, sel && s.chipTextActive]}>
                              {sel ? '✓ ' : ''}{opt}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}

                {customFoodPrefs.length > 0 && (
                  <View>
                    <Text style={s.catLabel}>Your Custom</Text>
                    <View style={s.chipRow}>
                      {customFoodPrefs.map(p => (
                        <TouchableOpacity
                          key={p}
                          style={s.chipActive}
                          onPress={() => toggle(setFoodPrefs, p)}
                        >
                          <Text style={s.chipTextActive}>✓ {p} ×</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={s.inputRow}>
                  <TextInput
                    style={s.input}
                    value={customInput}
                    onChangeText={setCustomInput}
                    onSubmitEditing={() => addCustom(foodPrefs, setFoodPrefs)}
                    placeholder="Add custom food…"
                    placeholderTextColor="#555"
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={[s.addBtn, !customInput.trim() && {opacity: 0.35}]}
                    onPress={() => addCustom(foodPrefs, setFoodPrefs)}
                    disabled={!customInput.trim()}
                  >
                    <Text style={s.addBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Dietary */}
            {tab === 'dietary' && (
              <View style={s.chipRow}>
                {DIETARY_OPTIONS.map(opt => {
                  const sel = dietary.includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[s.chip, sel && s.chipActive]}
                      onPress={() => toggle(setDietary, opt)}
                    >
                      <Text style={[s.chipText, sel && s.chipTextActive]}>
                        {sel ? '✓ ' : ''}{opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Allergies */}
            {tab === 'allergies' && (
              <View style={s.chipRow}>
                {ALLERGY_OPTIONS.map(opt => {
                  const sel = allergies.includes(opt);
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[s.chip, sel && s.chipAllergyActive]}
                      onPress={() => toggle(setAllergies, opt)}
                    >
                      <Text style={[s.chipText, sel && s.chipAllergyText]}>
                        {sel ? '⚠️ ' : ''}{opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Dislikes */}
            {tab === 'dislikes' && (
              <View style={{gap: 12, paddingBottom: 4}}>
                {dislikes.length === 0 && (
                  <Text style={s.emptyHint}>No dislikes added yet</Text>
                )}
                {dislikes.length > 0 && (
                  <View style={s.chipRow}>
                    {dislikes.map(d => (
                      <TouchableOpacity
                        key={d}
                        style={s.dislikeChip}
                        onPress={() => setDislikes(prev => prev.filter(i => i !== d))}
                      >
                        <Text style={s.dislikeText}>{d} ×</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <View style={s.inputRow}>
                  <TextInput
                    style={s.input}
                    value={customInput}
                    onChangeText={setCustomInput}
                    onSubmitEditing={() => addCustom(dislikes, setDislikes)}
                    placeholder="Add food you dislike…"
                    placeholderTextColor="#555"
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={[s.addBtn, !customInput.trim() && {opacity: 0.35}]}
                    onPress={() => addCustom(dislikes, setDislikes)}
                    disabled={!customInput.trim()}
                  >
                    <Text style={s.addBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </ScrollView>

          <TouchableOpacity
            style={[s.saveBtn, saving && {opacity: 0.5}]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={s.saveBtnText}>{saving ? 'Saving…' : 'Save Preferences'}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  overlay: {flex: 2, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:   {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 14},
  handle:  {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center'},
  title:   {color: WHITE, fontSize: 20, fontWeight: '700'},

  // Tab bar
  tabBar:       {flexDirection: 'row', backgroundColor: '#151515', borderRadius: 12, padding: 3, gap: 2},
  tabBtn:       {flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center'},
  tabBtnActive: {backgroundColor: GREEN},
  tabText:      {color: '#666', fontSize: 12, fontWeight: '600'},
  tabTextActive:{color: '#000', fontWeight: '700'},

  // Category label
  catLabel: {color: MUTED, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8},

  // Chips
  chipRow:         {flexDirection: 'row', flexWrap: 'wrap', gap: 7},
  chip:            {paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: INNER, borderWidth: 1.5, borderColor: BORDER},
  chipActive:      {paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: PURPLE, borderWidth: 1.5, borderColor: PURPLE},
  chipText:        {color: MUTED, fontSize: 12, fontWeight: '500'},
  chipTextActive:  {color: WHITE, fontSize: 12, fontWeight: '600'},
  chipAllergyActive:{paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#3B1515', borderWidth: 1.5, borderColor: '#7F1D1D'},
  chipAllergyText: {color: '#EF4444', fontSize: 12, fontWeight: '600'},

  // Dislikes
  dislikeChip: {paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#2A1A1A', borderWidth: 1.5, borderColor: '#4A2A2A'},
  dislikeText: {color: '#F87171', fontSize: 12, fontWeight: '500'},
  emptyHint:   {color: MUTED, fontSize: 13, fontStyle: 'italic', paddingVertical: 8},

  // Custom input
  inputRow: {flexDirection: 'row', gap: 8, marginTop: 4},
  input:    {flex: 1, backgroundColor: INNER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: WHITE, borderWidth: 1, borderColor: BORDER},
  addBtn:   {backgroundColor: PURPLE, paddingHorizontal: 16, paddingVertical: 11, borderRadius: 10, justifyContent: 'center'},
  addBtnText:{color: WHITE, fontWeight: '600', fontSize: 14},

  // Save
  saveBtn:    {backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4},
  saveBtnText:{color: '#111', fontWeight: '700', fontSize: 15},
});
