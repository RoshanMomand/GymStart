import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
  onClose: () => void;
}

export default function PrivacyModal({visible, onClose}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={e => e.stopPropagation()}>
          <View style={s.handle} />
          <Text style={s.title}>Privacy & Security</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{maxHeight: 360}}>
            <Section icon="💾" title="Data We Store">
              Your profile includes body metrics, fitness goals, and food preferences. This data is stored
              securely on our servers and only used to personalise your experience.
            </Section>

            <Section icon="🔍" title="How We Use It">
              Your data powers your personalised meal plans and workout suggestions. We never sell or share
              your personal data with third parties.
            </Section>

            <Section icon="🛡️" title="Your Rights">
              You can update or delete your data at any time from this profile screen. Logging out removes
              your active session. Deleting your account permanently removes all stored data.
            </Section>

            <Section icon="🔒" title="Security">
              All data is transmitted over HTTPS. Passwords are hashed and never stored in plain text.
              Authentication tokens expire automatically after inactivity.
            </Section>
          </ScrollView>

          <TouchableOpacity style={s.closeBtn} onPress={onClose}>
            <Text style={s.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Section({icon, title, children}: {icon: string; title: string; children: React.ReactNode}) {
  return (
    <View style={p.section}>
      <View style={p.header}>
        <View style={p.iconBox}>
          <Text style={{fontSize: 16}}>{icon}</Text>
        </View>
        <Text style={p.title}>{title}</Text>
      </View>
      <Text style={p.body}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  overlay:      {flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'},
  sheet:        {backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36, gap: 14},
  handle:       {width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center'},
  title:        {color: WHITE, fontSize: 20, fontWeight: '700'},
  closeBtn:     {backgroundColor: INNER, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: BORDER},
  closeBtnText: {color: MUTED, fontWeight: '600', fontSize: 15},
});

const p = StyleSheet.create({
  section: {marginBottom: 18},
  header:  {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8},
  iconBox: {width: 32, height: 32, borderRadius: 8, backgroundColor: INNER, alignItems: 'center', justifyContent: 'center'},
  title:   {color: WHITE, fontSize: 15, fontWeight: '600'},
  body:    {color: MUTED, fontSize: 13, lineHeight: 20},
});
