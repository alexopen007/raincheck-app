import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Rental } from '@/lib/mock-data';

type Props = {
  rental: Rental;
  onPress?: () => void;
};

export default function RentalCard({ rental, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.idRow}>
          <Ionicons name="umbrella-outline" size={16} color={Colors.primary} />
          <Text style={styles.umbrellaId}>{rental.umbrellaId}</Text>
        </View>
        {rental.cost != null && (
          <Text style={styles.cost}>{formatCurrency(rental.cost)}</Text>
        )}
      </View>

      <View style={styles.route}>
        <Text style={styles.station} numberOfLines={1}>{rental.stationFrom}</Text>
        <Ionicons name="arrow-forward-outline" size={14} color={Colors.textTertiary}  />
        <Text style={styles.station} numberOfLines={1}>{rental.stationTo ?? '—'}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.footerText}>{rental.duration ?? '—'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {rental.rating != null && (
            <View style={{ flexDirection: 'row', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= rental.rating! ? 'star' : 'star-outline'}
                  size={10}
                  color={s <= rental.rating! ? '#F59E0B' : Colors.textTertiary}
                />
              ))}
            </View>
          )}
          <Text style={styles.date}>{formatDate(rental.startTime)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  umbrellaId: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  cost: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  station: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});
