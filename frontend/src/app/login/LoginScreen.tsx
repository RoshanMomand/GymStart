import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {FitnessPalette, FitnessSpacing, FitnessTypography} from '@/constants/fitness-design-tokens';
import {SafeAreaView} from "react-native-safe-area-context";

interface LoginScreenProps {
  onNavigateToRegister?: () => void;
}

export default function LoginScreen({onNavigateToRegister}: LoginScreenProps) {
  const {signIn} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);

    } catch (error: any) {
      Alert.alert('LoginScreen Failed', error.message || 'Something went wrong');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
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
            secureTextEntry={!showPassword}
          />
        </View>

        {/* LoginScreen Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={[styles.footerText, styles.linkText]}>Sign Up</Text>
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
