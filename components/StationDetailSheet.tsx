import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import type { Station } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { forwardRef, useMemo } from 'react';

type Props = {
  station: Station | null;
  onRent: (station: Station) => void;
  onClose: () => void;
};

const statusLabels = {
  available: 'Available',
  low: 'Low Stock',
  empty: 'No Stock',
};

const statusColors = {
  available: Colors.success,
  low: Colors.warning,
  empty: Colors.error,
};

const StationDetailSheet = forwardRef<BottomSheet, Props>(
  ({ station, onRent, onClose }, ref) => {
    const snapPoints = useMemo(() => ['40%'], []);
    const favoriteStationIds = useAppStore((s) => s.favoriteStationIds);
    const toggleFavorite = useAppStore((s) => s.toggleFavoriteStation);

    if (!station) return null;

    const isFavorite = favoriteStationIds.includes(station.id);
    const capacityPct = (station.available / station.total) * 100;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        index={0}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.name}>{station.name}</Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textTertiary} />
                <Text style={styles.address}>{station.address}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => toggleFavorite(station.id)}
                hitSlop={12}
                style={styles.iconBtn}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? Colors.error : Colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.iconBtn}>
                <Ionicons name="close-outline" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusBadgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[station.status] + '18' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColors[station.status] }]} />
              <Text style={[styles.statusText, { color: statusColors[station.status] }]}>
                {statusLabels[station.status]}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="umbrella-outline" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{station.available}/{station.total}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{station.distance}</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
              <Text style={styles.statValue}>{station.walkTime}</Text>
              <Text style={styles.statLabel}>Walk</Text>
            </View>
          </View>

          <View style={styles.capacityBar}>
            <View style={[styles.capacityFill, { width: `${capacityPct}%`, backgroundColor: statusColors[station.status] }]} />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.directionsBtn} activeOpacity={0.7}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
              <Text style={styles.directionsBtnText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rentBtn, station.status === 'empty' && styles.rentBtnDisabled]}
              onPress={() => onRent(station)}
              disabled={station.status === 'empty'}
              activeOpacity={0.8}
            >
              <Text style={styles.rentBtnText}>Rent Here</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

StationDetailSheet.displayName = 'StationDetailSheet';
export default StationDetailSheet;

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: Colors.surface, borderRadius: Radius.xxl },
  handle: { backgroundColor: Colors.border, width: 36 },
  content: { padding: Spacing.xl, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1, marginRight: 12 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceSecondary, justifyContent: 'center', alignItems: 'center',
  },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  address: { fontSize: FontSize.sm, color: Colors.textTertiary },
  statusBadgeRow: { flexDirection: 'row' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full, gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary, borderRadius: Radius.lg, paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textTertiary },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  capacityBar: { height: 4, borderRadius: 2, backgroundColor: Colors.surfaceSecondary, overflow: 'hidden' },
  capacityFill: { height: '100%', borderRadius: 2 },
  actions: { flexDirection: 'row', gap: 12 },
  directionsBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 14, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  directionsBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.primary },
  rentBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: Radius.lg, backgroundColor: Colors.primary,
  },
  rentBtnDisabled: { opacity: 0.4 },
  rentBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: '#FFFFFF' },
});
