import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type WorkoutPref = 'gym' | 'home' | 'outdoor';

const GREEN  = '#4ADE80';
const MUTED  = '#9CA3AF';
const WHITE  = '#FFFFFF';
const INNER  = '#252525';
const BORDER = '#2A2A2A';

const OPTIONS: Array<{value: WorkoutPref; label: string; icon: string}> = [
  {value: 'gym',     label: 'Gym Workout',      icon: '🏋️'},
  {value: 'home',    label: 'Home Workout',      icon: '🏠'},
  {value: 'outdoor', label: 'Outdoor Training',  icon: '🌲'},
];

interface Props {
  visible: boolean;
  initialPref: WorkoutPref;
  initialDays: number;
  onSave: (pref: WorkoutPref, days: number) => Promise<void>;
  onClose: () => void;
}

export default function WorkoutModal({visible, initialPref, initialDays, onSave, onClose}: Props) {
  const [pref,   setPref]   = useState<WorkoutPref>(initialPref);
  const [days,   setDays]   = useState(initialDays);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setPref(initialPref);
      setDays(initialDays);
    }
  }, [visible, initialPref, initialDays]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(pref, days);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
          <View style={s.handle} />
          <Text style={s.title}>Workout Preferences</Text>
          <Text style={s.sub}>How and how often do you train?</Text>

          <Text style={s.label}>Workout Type</Text>
          {OPTIONS.map(opt => {
            const active = pref === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[s.option, active && s.optionActive]}
                onPress={() => setPref(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={{fontSize: 20}}>{opt.icon}</Text>
                <Text style={[s.optionText, active && {color: WHITE}]}>{opt.label}</Text>
                {active && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            );
          })}

          <Text style={[s.label, {marginTop: 4}]}>Training Days per Week</Text>
          <View style={s.stepper}>
            <TouchableOpacity
              style={[s.stepBtn, days <= 1 && {opacity: 0.3}]}
              onPress={() => setDays(d => Math.max(1, d - 1))}
              disabled={days <= 1}
            >
              <Text style={s.stepSymbol}>−</Text>
            </TouchableOpacity>
            <View style={s.stepValueBox}>
              <Text style={s.stepValue}>{days}</Text>
              <Text style={s.stepUnit}>days</Text>
            </View>
            <TouchableOpacity
              style={[s.stepBtn, days >= 7 && {opacity: 0.3}]}
              onPress={() => setDays(d => Math.min(7, d + 1))}
              disabled={days >= 7}
            >
              <Text style={s.stepSymbol}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={s.btns}>
            <TouchableOpacity style={s.cancel} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.save, saving && {opacity: 0.5}]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={s.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:     {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:       {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 12},
  handle:      {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center'},
  title:       {color: WHITE, fontSize: 20, fontWeight: '700'},
  sub:         {color: MUTED, fontSize: 13, marginTop: -4},
  label:       {color: MUTED, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5},
  option:      {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: INNER, borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: BORDER},
  optionActive:{borderColor: GREEN, backgroundColor: '#0A2A1A'},
  optionText:  {flex: 1, color: MUTED, fontSize: 15, fontWeight: '500'},
  check:       {color: GREEN, fontSize: 15, fontWeight: '700'},
  stepper:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, paddingVertical: 6},
  stepBtn:     {width: 46, height: 46, borderRadius: 23, backgroundColor: INNER, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: BORDER},
  stepSymbol:  {color: WHITE, fontSize: 24, fontWeight: '300', lineHeight: 28},
  stepValueBox:{alignItems: 'center', minWidth: 52},
  stepValue:   {color: WHITE, fontSize: 34, fontWeight: '700'},
  stepUnit:    {color: MUTED, fontSize: 11, marginTop: -2},
  btns:        {flexDirection: 'row', gap: 10, marginTop: 4},
  cancel:      {flex: 1, backgroundColor: INNER, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  cancelText:  {color: MUTED, fontWeight: '600'},
  save:        {flex: 2, backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  saveText:    {color: '#111', fontWeight: '700'},
});
