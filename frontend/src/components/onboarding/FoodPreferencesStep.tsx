import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FitnessPalette, FitnessSpacing} from '@/constants/fitness-design-tokens';

interface FoodPreferencesStepProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const CATEGORIES: Array<{title: string; options: string[]}> = [
  {
    title: 'Proteins',
    options: [
      'Chicken', 'Beef', 'Turkey', 'Fish', 'Salmon',
      'Tuna', 'Shrimp', 'Eggs', 'Tofu', 'Tempeh',
    ],
  },
  {
    title: 'Carbs',
    options: [
      'Rice', 'Pasta', 'Potatoes', 'Sweet Potato',
      'Oatmeal', 'Quinoa', 'Bread', 'Whole Wheat Wraps',
    ],
  },
  {
    title: 'Vegetables',
    options: [
      'Broccoli', 'Bell Pepper', 'Spinach',
      'Zucchini', 'Carrot', 'Cauliflower',
    ],
  },
  {
    title: 'Fats',
    options: [
      'Avocado', 'Almonds', 'Walnuts', 'Cashews',
      'Peanut Butter', 'Olive Oil', 'Chia Seeds',
      'Flaxseeds', 'Pumpkin Seeds', 'Macadamia Nuts',
    ],
  },
];

const ALL_STANDARD = CATEGORIES.flatMap((c) => c.options);

export default function FoodPreferencesStep({value, onChange}: FoodPreferencesStepProps) {
  const [customInput, setCustomInput] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);

  const isDuplicate = (tag: string) =>
    value.some((item) => item.toLowerCase() === tag.toLowerCase());

  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const addCustomTag = () => {
    const tag = customInput.trim();
    if (!tag) return;
    if (isDuplicate(tag)) {
      setDuplicateError(true);
      return;
    }
    setDuplicateError(false);
    onChange([...value, tag]);
    setCustomInput('');
  };

  const removeItem = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleInputChange = (text: string) => {
    setCustomInput(text);
    if (duplicateError) setDuplicateError(false);
  };

  // Custom tags = selected items that are not in any standard category
  const customTags = value.filter((item) => !ALL_STANDARD.includes(item));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are your food preferences?</Text>
      <Text style={styles.subtitle}>Select at least one</Text>

      {/* Selected items overview */}
      {value.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected ({value.length})</Text>
          <View style={styles.chipRow}>
            {value.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => removeItem(item)}
                style={styles.selectedChip}
              >
                <Text style={styles.selectedChipText}>{item} ×</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Custom tag input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add your own</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.textInput, duplicateError && styles.textInputError]}
            value={customInput}
            onChangeText={handleInputChange}
            onSubmitEditing={addCustomTag}
            placeholder="e.g. Greek Yogurt, Avocado, Skyr..."
            placeholderTextColor={FitnessPalette.text.secondary}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={addCustomTag}
            style={[styles.addButton, !customInput.trim() && styles.addButtonDisabled]}
            disabled={!customInput.trim()}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {duplicateError && (
          <Text style={styles.errorText}>Already added</Text>
        )}
        {customTags.length > 0 && (
          <Text style={styles.customCount}>
            {customTags.length} custom tag{customTags.length !== 1 ? 's' : ''} added
          </Text>
        )}
      </View>

      {/* Standard categories */}
      {CATEGORIES.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.chipRow}>
            {section.options.map((option) => {
              const selected = value.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => toggle(option)}
                  style={[styles.chip, selected && styles.chipActive]}
                >
                  <View style={styles.chipContent}>
                    {selected && <Ionicons name="checkmark" size={12} color="#4ADE80"/>}
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {value.length === 0 && (
        <Text style={styles.validationHint}>
          Select from the categories above or add your own
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: FitnessSpacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: FitnessPalette.text.secondary,
    marginBottom: FitnessSpacing.lg,
  },
  section: {
    marginBottom: FitnessSpacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: FitnessPalette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: FitnessSpacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: FitnessPalette.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: FitnessPalette.border,
  },
  chipActive: {
    backgroundColor: FitnessPalette.primary,
    borderColor: FitnessPalette.primary,
  },
  chipContent: {flexDirection: 'row', alignItems: 'center', gap: 4},
  chipText: {
    fontSize: 13,
    color: FitnessPalette.text.primary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  selectedChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: FitnessPalette.primaryDark,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: FitnessPalette.primary,
  },
  selectedChipText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    gap: FitnessSpacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: FitnessPalette.cardBg,
    borderWidth: 1.5,
    borderColor: FitnessPalette.border,
    borderRadius: 10,
    paddingHorizontal: FitnessSpacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: FitnessPalette.text.primary,
  },
  textInputError: {
    borderColor: FitnessPalette.error,
  },
  addButton: {
    backgroundColor: FitnessPalette.primary,
    paddingHorizontal: FitnessSpacing.md,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.35,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: FitnessPalette.error,
  },
  customCount: {
    marginTop: 6,
    fontSize: 12,
    color: FitnessPalette.text.secondary,
  },
  validationHint: {
    fontSize: 13,
    color: FitnessPalette.text.secondary,
    fontStyle: 'italic',
    marginTop: FitnessSpacing.sm,
  },
});
