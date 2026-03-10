import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { mockStations } from '@/lib/mock-data';
import { formatDuration, formatCurrency, calculateCost } from '@/lib/utils';

const DAMAGE_TYPES = [
  'Broken spoke',
  'Torn fabric',
  'Handle loose',
  'Mechanism jammed',
  'Other',
];

export default function ReturnConfirmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeRental = useAppStore((s) => s.activeRental);
  const returnStationId = useAppStore((s) => s.returnStationId);
  const endRental = useAppStore((s) => s.endRental);
  const addDamageReport = useAppStore((s) => s.addDamageReport);
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const defaultPaymentMethodId = useAppStore((s) => s.defaultPaymentMethodId);
  const [loading, setLoading] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState<string | null>(null);
  const [damageNotes, setDamageNotes] = useState('');

  const returnStation = mockStations.find((s) => s.id === returnStationId);
  const defaultPM = paymentMethods.find((p) => p.id === defaultPaymentMethodId);

  if (!activeRental || !returnStation) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.errorText}>No active rental or return station</Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => router.replace('/map')}>
            <Text style={styles.goBackBtnText}>Back to Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const duration = formatDuration(Date.now() - activeRental.startTime);
  const cost = calculateCost(activeRental.startTime);

  const handleConfirm = () => {
    setLoading(true);
    if (selectedDamage && activeRental) {
      addDamageReport({
        rentalId: activeRental.id,
        issueType: selectedDamage,
        notes: damageNotes || undefined,
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      endRental(returnStation.name, cost);
      router.replace('/return/success');
    }, 600);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Return</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.stationRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View>
              <Text style={styles.label}>Return Station</Text>
              <Text style={styles.stationName}>{returnStation.name}</Text>
              <Text style={styles.stationAddr}>{returnStation.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="umbrella-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Umbrella</Text>
            </View>
            <Text style={styles.detailValue}>{activeRental.umbrellaId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
            <Text style={styles.detailValue}>{duration}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Rental cost</Text>
            <Text style={styles.detailValue}>{formatCurrency(cost)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { fontWeight: FontWeight.semibold }]}>Total</Text>
            <Text style={[styles.detailValue, { fontWeight: FontWeight.bold, color: Colors.primary }]}>
              {formatCurrency(cost)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="card-outline" size={16} color={Colors.textTertiary} />
              <Text style={styles.detailLabel}>Payment</Text>
            </View>
            <Text style={styles.detailValue}>{defaultPM?.label ?? 'None'}</Text>
          </View>
        </View>

        {/* Damage Report */}
        <TouchableOpacity
          style={[styles.card, styles.damageCard]}
          onPress={() => setShowDamage(true)}
          activeOpacity={0.7}
        >
          <View style={styles.detailLeft}>
            <Ionicons name="warning-outline" size={18} color={Colors.warning} />
            <Text style={styles.damageText}>
              {selectedDamage ? `Reported: ${selectedDamage}` : 'Report damage (optional)'}
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Return</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Damage Report Modal */}
      <Modal visible={showDamage} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Damage</Text>
              <TouchableOpacity onPress={() => setShowDamage(false)} hitSlop={12}>
                <Ionicons name="close-outline" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Select issue type</Text>

            {DAMAGE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.damageOption, selectedDamage === type && styles.damageOptionSelected]}
                onPress={() => setSelectedDamage(type)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={selectedDamage === type ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                  size={20}
                  color={selectedDamage === type ? Colors.primary : Colors.textTertiary}
                />
                <Text style={[styles.damageOptionText, selectedDamage === type && { color: Colors.primary }]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.notesInput}
              placeholder="Additional notes (optional)"
              placeholderTextColor={Colors.textTertiary}
              value={damageNotes}
              onChangeText={setDamageNotes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setShowDamage(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDoneBtnText}>
                {selectedDamage ? 'Save Report' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  errorText: { fontSize: FontSize.md, color: Colors.textTertiary, textAlign: 'center', marginTop: 16 },
  goBackBtn: {
    marginTop: 16, backgroundColor: Colors.primary, paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: Radius.lg,
  },
  goBackBtnText: { color: '#FFFFFF', fontWeight: FontWeight.semibold, fontSize: FontSize.md },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: 120, gap: 12 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm },
  stationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  label: { fontSize: FontSize.xs, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  stationName: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginTop: 2 },
  stationAddr: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  detailValue: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  divider: { height: 0.5, backgroundColor: Colors.borderLight, marginVertical: 12 },
  damageCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.warning + '40', backgroundColor: Colors.warningLight + '50',
  },
  damageText: { fontSize: FontSize.md, color: Colors.textSecondary },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.xl, paddingTop: 12,
    backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.border,
  },
  confirmBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.lg, alignItems: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  modalSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 12 },
  damageOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight,
  },
  damageOptionSelected: {},
  damageOptionText: { fontSize: FontSize.md, color: Colors.textPrimary },
  notesInput: {
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.md,
    padding: Spacing.lg, marginTop: 16, fontSize: FontSize.md,
    color: Colors.textPrimary, textAlignVertical: 'top', minHeight: 80,
  },
  modalDoneBtn: {
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.lg,
    alignItems: 'center', marginTop: 16,
  },
  modalDoneBtnText: { color: '#FFFFFF', fontSize: FontSize.md, fontWeight: FontWeight.semibold },
});
