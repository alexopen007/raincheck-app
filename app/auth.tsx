import { useState, useRef, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    otpRefs.current[0]?.focus();
  };

  const submitOtp = useCallback(() => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setAuthenticated(true);
      router.replace('/map');
    }, 800);
  }, [setAuthenticated, router]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (value && newOtp.every((d) => d !== '')) {
      setTimeout(() => submitOtp(), 300);
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {step === 'otp' && (
        <TouchableOpacity style={styles.backBtn} onPress={() => { setStep('phone'); setLoading(false); }}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="phone-portrait-outline" size={32} color={Colors.primary} />
        </View>

        <Text style={styles.title}>
          {step === 'phone' ? 'Enter your phone number' : 'Verify your number'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? "We'll send you a verification code"
            : `Code sent to +91 ${phone}`}
        </Text>

        {step === 'phone' ? (
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>
        ) : (
          <View style={styles.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => { otpRefs.current[i] = ref; }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(v) => handleOtpChange(v, i)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                editable={!loading}
              />
            ))}
          </View>
        )}

        {loading && (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginBottom: 16 }} />
        )}

        {step === 'phone' && (
          <TouchableOpacity
            style={[styles.button, phone.length < 10 && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={phone.length < 10}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        )}

        {step === 'otp' && !loading && (
          <TouchableOpacity style={styles.resendBtn} onPress={handleResend} disabled={resendTimer > 0}>
            <Text style={[styles.resendText, resendTimer > 0 && { color: Colors.textTertiary }]}>
              {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  countryCode: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  resendBtn: {
    alignSelf: 'center',
  },
  resendText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  terms: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingBottom: 16,
    lineHeight: 16,
  },
});
