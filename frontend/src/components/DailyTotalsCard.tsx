import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CARD, MUTED, TEXT} from '@/utils/homeHelpers';

interface Props {
  calories: number;
  protein:  number;
  carbs:    number;
  fats:     number;
}

export default function DailyTotalsCard({calories, protein, carbs, fats}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Total Daily Calories</Text>
          <View style={styles.numberRow}>
            <Text style={styles.number}>{calories.toLocaleString()}</Text>
            <Text style={styles.unit}>kcal</Text>
          </View>
        </View>
        <View style={styles.flameBadge}>
          <Ionicons name="flame-outline" size={22} color="#F97316"/>
        </View>
      </View>

      <View style={styles.macroRow}>
        <Text style={styles.macroText}>Protein: {protein}g</Text>
        <Text style={styles.macroText}>Carbs: {carbs}g</Text>
        <Text style={styles.macroText}>Fats: {fats}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:       {backgroundColor: CARD, borderRadius: 16, padding: 16, marginBottom: 4},
  row:        {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  label:      {color: MUTED, fontSize: 13},
  numberRow:  {flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 4},
  number:     {color: TEXT, fontSize: 40, fontWeight: '800'},
  unit:       {color: MUTED, fontSize: 18, paddingBottom: 6},
  flameBadge: {width: 48, height: 48, borderRadius: 24, backgroundColor: '#052E16', alignItems: 'center', justifyContent: 'center'},
  macroRow:   {flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, borderTopWidth: 1, borderColor: '#2A2A2A', paddingTop: 12},
  macroText:  {color: MUTED, fontSize: 13},
});
