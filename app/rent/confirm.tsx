import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { mockStations } from '@/lib/mock-data';
import { generateId, generateUmbrellaId } from '@/lib/utils';

export default function RentConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scannedStationId = useAppStore((s) => s.scannedStationId);
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const defaultPaymentMethodId = useAppStore((s) => s.defaultPaymentMethodId);
  const startRental = useAppStore((s) => s.startRental);
  const [loading, setLoading] = useState(false);

  const station = mockStations.find((s) => s.id === scannedStationId);
  const defaultPM = paymentMethods.find((p) => p.id === defaultPaymentMethodId);
  const umbrellaIdRef = useRef(generateUmbrellaId());
  const umbrellaId = umbrellaIdRef.current;
  const slotRef = useRef(Math.floor(Math.random() * (station?.slots ?? 10)) + 1);
  const slot = slotRef.current;

  const handleConfirm = () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      startRental({
        id: generateId(),
        umbrellaId,
        stationFrom: station?.name ?? 'Unknown',
        stationFromId: station?.id ?? '',
        slot,
        startTime: Date.now(),
      });
      router.replace('/rent/success');
    }, 600);
  };

  if (!station) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>No station selected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Rental</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.stationRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View>
              <Text style={styles.stationName}>{station.name}</Text>
              <Text style={styles.stationAddr}>{station.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="umbrella-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}></Text>
            </View>
            <Text style={styles.detailValue}>{umbrellaId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="pricetag-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Slot</Text>
            </View>
            <Text style={styles.detailValue}>#{slot}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.pricingTitle}>Pricing</Text>
          <Text style={styles.pricingRate}>₹10/hour</Text>
          <Text style={styles.pricingMax}>Maximum ₹80/day</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="card-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Payment</Text>
            </View>
            <Text style={styles.detailValue}>{defaultPM?.label ?? 'None'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Rental</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 100,
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
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stationName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  stationAddr: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  pricingTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  pricingRate: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  pricingMax: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
});
