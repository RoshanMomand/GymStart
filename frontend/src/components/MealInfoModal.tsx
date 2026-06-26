import React from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MealSlot} from '@/types/meals';
import {GREEN, MUTED, TEXT} from '@/utils/homeHelpers';

interface Props {
  meal:    MealSlot | null;
  onClose: () => void;
}

export default function MealInfoModal({meal, onClose}: Props) {
  return (
    <Modal visible={!!meal} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={pressEvent => pressEvent.stopPropagation()}>
          {meal && <SheetContent meal={meal} onClose={onClose}/>}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SheetContent({meal, onClose}: {meal: MealSlot; onClose: () => void}) {
  return (
    <>
      <View style={styles.handleBar}/>

      <View style={styles.sheetHeader}>
        <View style={styles.mealIcon}/>
        <View style={{flex: 1}}>
          <Text style={styles.sheetTitle}>{meal.meal_name}</Text>
          <Text style={styles.sheetSub}>
            {meal.calories} kcal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fats}g
          </Text>
        </View>
      </View>

      <View style={styles.divider}/>

      <ScrollView style={{maxHeight: 340}} showsVerticalScrollIndicator={false}>
        {meal.foods.map((food, foodIndex) => (
          <View key={foodIndex} style={styles.foodRow}>
            <View style={{flex: 1}}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodGrams}>{food.grams}g</Text>
            </View>
            <View style={styles.foodMacros}>
              <Text style={styles.foodMacroText}>{food.calories} kcal</Text>
              <Text style={styles.foodMacroMuted}>P {food.protein}g</Text>
              <Text style={styles.foodMacroMuted}>C {food.carbs}g</Text>
              <Text style={styles.foodMacroMuted}>F {food.fats}g</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  overlay:       {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:         {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 12},
  handleBar:     {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 4},
  sheetHeader:   {flexDirection: 'row', gap: 12, alignItems: 'center'},
  mealIcon:      {width: 56, height: 56, borderRadius: 14},
  sheetTitle:    {color: TEXT, fontSize: 20, fontWeight: '700'},
  sheetSub:      {color: MUTED, fontSize: 13, marginTop: 2},
  divider:       {height: 1, backgroundColor: '#2A2A2A'},
  foodRow:       {flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#2A2A2A'},
  foodName:      {color: TEXT, fontSize: 14, fontWeight: '600'},
  foodGrams:     {color: MUTED, fontSize: 12, marginTop: 2},
  foodMacros:    {alignItems: 'flex-end', gap: 2},
  foodMacroText: {color: GREEN, fontSize: 13, fontWeight: '600'},
  foodMacroMuted:{color: MUTED, fontSize: 11},
  closeBtn:      {backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4},
  closeBtnText:  {color: '#111', fontWeight: '700', fontSize: 15},
});
