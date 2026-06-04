import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const GREEN = '#4ADE80';
const MUTED  = '#9CA3AF';
const WHITE  = '#FFFFFF';
const INNER  = '#252525';
const BORDER = '#2A2A2A';

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface NotifRow {
  key: string;
  icon: IoniconsName;
  label: string;
  sub: string;
  value: boolean;
  toggle: () => void;
}

export default function NotificationsModal({visible, onClose}: Props) {
  const [workout,  setWorkout]  = useState(false);
  const [meal,     setMeal]     = useState(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      setWorkout((await  AsyncStorage.getItem('notif_workout'))  === 'true');
      setMeal((await     AsyncStorage.getItem('notif_meal'))     === 'true');
      setProgress((await AsyncStorage.getItem('notif_progress')) === 'true');
    })();
  }, [visible]);

  const handleDone = async () => {
    await AsyncStorage.multiSet([
      ['notif_workout',  String(workout)],
      ['notif_meal',     String(meal)],
      ['notif_progress', String(progress)],
    ]);
    onClose();
  };

  const rows: NotifRow[] = [
    {key: 'workout',  icon: 'barbell-outline' as IoniconsName,       label: 'Workout Reminders',  sub: 'Daily workout motivation',     value: workout,  toggle: () => setWorkout(v => !v)},
    {key: 'meal',     icon: 'restaurant-outline' as IoniconsName,    label: 'Meal Reminders',      sub: "Don't forget your meals",       value: meal,     toggle: () => setMeal(v => !v)},
    {key: 'progress', icon: 'stats-chart-outline' as IoniconsName,   label: 'Weekly Progress',     sub: 'Your weekly summary report',    value: progress, toggle: () => setProgress(v => !v)},
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
          <View style={s.handle} />
          <Text style={s.title}>Notifications</Text>
          <Text style={s.sub}>Choose what you want to be reminded of</Text>

          {rows.map((row, i) => (
            <View key={row.key}>
              {i > 0 && <View style={s.divider} />}
              <View style={s.row}>
                <View style={s.iconBox}>
                  <Ionicons name={row.icon} size={20} color="#888"/>
                </View>
                <View style={{flex: 1}}>
                  <Text style={s.rowLabel}>{row.label}</Text>
                  <Text style={s.rowSub}>{row.sub}</Text>
                </View>
                <Switch
                  value={row.value}
                  onValueChange={row.toggle}
                  trackColor={{false: INNER, true: '#166534'}}
                  thumbColor={row.value ? GREEN : '#555'}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={s.doneBtn} onPress={handleDone}>
            <Text style={s.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:    {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:      {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 12},
  handle:     {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center'},
  title:      {color: WHITE, fontSize: 20, fontWeight: '700'},
  sub:        {color: MUTED, fontSize: 13, marginTop: -4},
  divider:    {height: 1, backgroundColor: BORDER, marginHorizontal: -4},
  row:        {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4},
  iconBox:    {width: 40, height: 40, borderRadius: 10, backgroundColor: INNER, alignItems: 'center', justifyContent: 'center'},
  rowLabel:   {color: WHITE, fontSize: 15, fontWeight: '500'},
  rowSub:     {color: MUTED, fontSize: 12, marginTop: 1},
  doneBtn:    {backgroundColor: '#4ADE80', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4},
  doneBtnText:{color: '#111', fontWeight: '700', fontSize: 15},
});
