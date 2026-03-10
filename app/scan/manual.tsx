import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { mockStations } from '@/lib/mock-data';

export default function ManualCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setScannedStationId = useAppStore((s) => s.setScannedStationId);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const refs = useRef<(TextInput | null)[]>([]);
  const [error, setError] = useState('');

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    // Mock: accept any 6-digit code and map to first station
    if (fullCode.length === 6) {
      const station = mockStations[0];
      setScannedStationId(station.id);
      router.replace('/rent/confirm');
    } else {
      setError('Please enter a valid 6-digit code');
    }
  };

  const isComplete = code.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Code</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Enter the 6-digit code printed on the station above the QR code
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { refs.current[i] = ref; }}
              style={[styles.codeInput, digit && styles.codeInputFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.verifyBtn, !isComplete && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyBtnText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 40,
  },
  instruction: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  codeInput: {
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
  codeInputFilled: {
    borderColor: Colors.primary,
  },
  error: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
});
