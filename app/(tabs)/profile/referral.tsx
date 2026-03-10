import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { useState } from 'react';

export default function ReferralScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);
  const [copied, setCopied] = useState(false);

  const referralCode = 'RAIN' + user.id.toUpperCase().slice(0, 4) + '50';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join RainCheck and get ₹50 credit! Use my referral code: ${referralCode}\n\nDownload the app: https://raincheck.app`,
      });
    } catch {}
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationCircle}>
          <Ionicons name="gift-outline" size={48} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Earn ₹50 each!</Text>
        <Text style={styles.subtitle}>
          Invite friends to RainCheck. You both get ₹50 credit when they complete their first rental.
        </Text>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your Referral Code</Text>
          <Text style={styles.codeValue}>{referralCode}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
            <Ionicons name={copied ? 'checkmark-outline' : 'copy-outline'} size={16} color={Colors.primary} />
            <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
          <Text style={styles.shareBtnText}>Share with Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: 40 },
  illustrationCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.primary + '12', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: {
    fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 16,
  },
  codeCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 24,
    alignItems: 'center', width: '100%', marginBottom: 24, ...Shadow.md,
  },
  codeLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1 },
  codeValue: {
    fontSize: 28, fontWeight: FontWeight.bold, color: Colors.primary,
    letterSpacing: 3, marginVertical: 12,
  },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  copyText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.primary },
  shareBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.lg, width: '100%',
  },
  shareBtnText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: '#FFFFFF' },
});
