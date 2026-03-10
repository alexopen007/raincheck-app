import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { formatDuration, formatCurrency, getLiveElapsed } from '@/lib/utils';
import RentalCard from '@/components/RentalCard';
import { useState, useEffect } from 'react';

export default function ActivityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeRental = useAppStore((s) => s.activeRental);
  const rentalHistory = useAppStore((s) => s.rentalHistory);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!activeRental) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeRental]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity onPress={() => router.push('/activity/notifications')} hitSlop={8}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rentalHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          activeRental ? (
            <TouchableOpacity
              style={styles.activeCard}
              onPress={() => router.push('/return/scan')}
              activeOpacity={0.85}
            >
              <View style={styles.activeHeader}>
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
                <Text style={styles.activeTimer}>{getLiveElapsed(activeRental.startTime)}</Text>
              </View>
              <View style={styles.activeBody}>
                <Ionicons name="umbrella-outline" size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.activeId}>{activeRental.umbrellaId}</Text>
                  <Text style={styles.activeStation}>{activeRental.stationFrom}</Text>
                </View>
              </View>
              <View style={styles.activeFooter}>
                <Text style={styles.activeFooterText}>Tap to return</Text>
              </View>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <RentalCard
            rental={item}
            onPress={() => router.push(`/activity/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          !activeRental ? (
            <View style={styles.empty}>
              <Ionicons name="umbrella-outline" size={72} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>No rentals yet</Text>
              <Text style={styles.emptyText}>Your rental history will appear here</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
    gap: 0,
  },
  activeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadow.sm,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  activeBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.success,
  },
  activeTimer: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  activeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  activeId: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  activeStation: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activeFooter: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingTop: 10,
    alignItems: 'center',
  },
  activeFooterText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
});
