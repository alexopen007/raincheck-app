import { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const rental = useAppStore((s) => s.rentalHistory.find((r) => r.id === id));
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const defaultPaymentMethodId = useAppStore((s) => s.defaultPaymentMethodId);
  const receiptRef = useRef<View>(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const defaultPM = paymentMethods.find((p) => p.id === defaultPaymentMethodId);

  if (!rental) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rental Details</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.notFound}>Rental not found</Text>
        </View>
      </View>
    );
  }

  // Calculate cost breakdown
  const durationStr = rental.duration ?? '0m';
  const totalCost = rental.cost ?? 0;

  const captureReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });
      return uri;
    } catch {
      return null;
    }
  };

  const handleDownload = async () => {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library access to save receipts.');
        setSaving(false);
        return;
      }
      const uri = await captureReceipt();
      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Saved!', 'Receipt saved to your photo library.');
      }
    } catch {
      Alert.alert('Error', 'Could not save receipt.');
    }
    setSaving(false);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await captureReceipt();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share Receipt' });
      }
    } catch {
      Alert.alert('Error', 'Could not share receipt.');
    }
    setSharing(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rental Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Receipt Card - capturable */}
        <View ref={receiptRef} style={styles.receiptCard} collapsable={false}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Ionicons name="umbrella" size={28} color={Colors.primary} />
            <Text style={styles.receiptBrand}>RainCheck</Text>
            <Text style={styles.receiptSubtitle}>Umbrella Rental Receipt</Text>
          </View>

          <Text style={styles.receiptId}>#{rental.id.toUpperCase()}</Text>

          <View style={styles.receiptDivider} />

          {/* Route */}
          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.routeLabel}>FROM</Text>
                <Text style={styles.routeStation}>{rental.stationFrom}</Text>
              </View>
            </View>
            <View style={styles.routeArrow}>
              <Ionicons name="arrow-down-outline" size={16} color={Colors.textTertiary} />
            </View>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: Colors.success }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.routeLabel}>TO</Text>
                <Text style={styles.routeStation}>{rental.stationTo ?? '—'}</Text>
              </View>
            </View>
          </View>

          {/* Date & Duration */}
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Date</Text>
            <Text style={styles.receiptRowValue}>
              {formatDate(rental.startTime)}
            </Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Time</Text>
            <Text style={styles.receiptRowValue}>
              {formatTime(rental.startTime)} — {rental.endTime ? formatTime(rental.endTime) : '—'}
            </Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Duration</Text>
            <Text style={styles.receiptRowValue}>{durationStr}</Text>
          </View>

          {/* Dotted separator */}
          <View style={styles.dottedLine} />

          {/* Cost breakdown */}
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Base rate</Text>
            <Text style={styles.receiptRowValue}>₹10/hr</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Rental duration</Text>
            <Text style={styles.receiptRowValue}>{durationStr}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptRowLabel}>Subtotal</Text>
            <Text style={styles.receiptRowValue}>{formatCurrency(totalCost)}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
          </View>

          {/* Payment method */}
          <View style={[styles.receiptRow, { marginTop: 12 }]}>
            <Text style={styles.receiptRowLabel}>Payment</Text>
            <Text style={styles.receiptRowValue}>{defaultPM?.label ?? 'Wallet'}</Text>
          </View>

          {/* Rating */}
          {rental.rating != null && (
            <View style={[styles.receiptRow, { marginTop: 4 }]}>
              <Text style={styles.receiptRowLabel}>Rating</Text>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= rental.rating! ? 'star' : 'star-outline'}
                    size={14}
                    color={s <= rental.rating! ? '#F59E0B' : Colors.textTertiary}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.receiptFooter}>
            <Text style={styles.footerThank}>Thank you for using RainCheck!</Text>
            {/* Barcode placeholder */}
            <View style={styles.barcode}>
              {Array.from({ length: 30 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeLine,
                    { width: Math.random() > 0.5 ? 2 : 1, opacity: Math.random() > 0.3 ? 1 : 0.4 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.receiptTimestamp}>
              Generated {new Date().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.7} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="download-outline" size={18} color={Colors.primary} />
            )}
            <Text style={styles.downloadText}>Save Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7} disabled={sharing}>
            {sharing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="share-outline" size={18} color="#FFFFFF" />
            )}
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  notFound: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
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
    paddingBottom: 40,
    gap: 16,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Shadow.md,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptBrand: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 6,
    letterSpacing: -0.5,
  },
  receiptSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  receiptId: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginBottom: 8,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  routeSection: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  routeStation: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  routeArrow: {
    paddingLeft: 0,
    alignItems: 'center',
    width: 10,
    marginVertical: 4,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  receiptRowLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  receiptRowValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  dottedLine: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  receiptFooter: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  footerThank: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  barcode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
    height: 28,
  },
  barcodeLine: {
    height: '100%',
    backgroundColor: Colors.textPrimary,
    borderRadius: 0.5,
  },
  receiptTimestamp: {
    fontSize: 9,
    color: Colors.textTertiary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  downloadText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
  },
  shareText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: '#FFFFFF',
  },
});
