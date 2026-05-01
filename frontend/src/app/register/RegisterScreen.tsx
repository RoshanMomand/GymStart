import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {FitnessPalette, FitnessSpacing, FitnessTypography} from '@/constants/fitness-design-tokens';
import {SafeAreaView} from "react-native-safe-area-context";

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
}

export default function RegisterScreen({onNavigateToLogin}: RegisterScreenProps) {
  const {signUp} = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  // Laravel already handles the fields?
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await signUp(name, email, password);
      // On success, AuthContext will automatically redirect to onboarding
    } catch (error: Error | any) {
      console.error('Registration failed:', error);
    Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your fitness journey</Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={FitnessPalette.text.tertiary}
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={FitnessPalette.text.tertiary}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={FitnessPalette.text.tertiary}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            secureTextEntry
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* LoginScreen Link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={[styles.footerText, styles.linkText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FitnessPalette.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: FitnessSpacing.lg,
    paddingVertical: FitnessSpacing.xl,
  },
  titleContainer: {
    marginBottom: FitnessSpacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FitnessTypography.h1.fontSize,
    fontWeight: FitnessTypography.h1.fontWeight as any,
    color: FitnessPalette.text.primary,
    marginBottom: FitnessSpacing.md,
  },
  subtitle: {
    fontSize: FitnessTypography.bodySmall.fontSize,
    color: FitnessPalette.text.secondary,
  },
  inputContainer: {
    marginBottom: FitnessSpacing.lg,
  },
  label: {
    fontSize: FitnessTypography.bodySmall.fontSize,
    color: FitnessPalette.text.secondary,
    marginBottom: FitnessSpacing.sm,
    fontWeight: '500',
  },
  input: {
    backgroundColor: FitnessPalette.cardBg,
    borderWidth: 1,
    borderColor: FitnessPalette.border,
    borderRadius: 12,
    paddingHorizontal: FitnessSpacing.md,
    paddingVertical: FitnessSpacing.md,
    color: FitnessPalette.text.primary,
    fontSize: FitnessTypography.body.fontSize,
  },
  button: {
    backgroundColor: FitnessPalette.primary,
    paddingVertical: FitnessSpacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: FitnessSpacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FitnessTypography.subtitle.fontSize,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: FitnessSpacing.xl,
    gap: FitnessSpacing.sm,
  },
  footerText: {
    fontSize: FitnessTypography.bodySmall.fontSize,
    color: FitnessPalette.text.secondary,
  },
  linkText: {
    color: FitnessPalette.primary,
    fontWeight: '600',
  },
});
