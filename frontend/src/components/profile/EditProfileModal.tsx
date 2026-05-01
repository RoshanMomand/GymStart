import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const GREEN = '#4ADE80';
const MUTED  = '#9CA3AF';
const WHITE  = '#FFFFFF';
const INNER  = '#252525';
const BORDER = '#2A2A2A';

interface Props {
  visible: boolean;
  initialName: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function EditProfileModal({visible, initialName, onSave, onClose}: Props) {
  const [name,   setName]   = useState(initialName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    setSaving(true);
    try {
      await onSave(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const disabled = saving || name.trim().length < 2;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
            <View style={s.handle} />
            <Text style={s.title}>Edit Profile</Text>
            <Text style={s.sub}>Update your display name</Text>

            <Text style={s.label}>Full Name</Text>
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#555"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <View style={s.btns}>
              <TouchableOpacity style={s.cancel} onPress={onClose}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.save, disabled && {opacity: 0.4}]}
                onPress={handleSave}
                disabled={disabled}
              >
                <Text style={s.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:    {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:      {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 14},
  handle:     {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center'},
  title:      {color: WHITE, fontSize: 20, fontWeight: '700'},
  sub:        {color: MUTED, fontSize: 13, marginTop: -6},
  label:      {color: MUTED, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5},
  input:      {backgroundColor: INNER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: WHITE, borderWidth: 1, borderColor: BORDER},
  btns:       {flexDirection: 'row', gap: 10, marginTop: 4},
  cancel:     {flex: 1, backgroundColor: INNER, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  cancelText: {color: MUTED, fontWeight: '600'},
  save:       {flex: 1, backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  saveText:   {color: '#111', fontWeight: '700'},
});
