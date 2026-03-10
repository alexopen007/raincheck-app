import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function ReturnSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const rentalHistory = useAppStore((s) => s.rentalHistory);
  const rateRental = useAppStore((s) => s.rateRental);
  const lastRental = rentalHistory[0];
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  const handleRate = (stars: number) => {
    setRating(stars);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmitRating = () => {
    if (lastRental && rating > 0) {
      rateRental(lastRental.id, rating);
      setRated(true);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark-outline" size={40} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.title}>Return Complete</Text>
        <Text style={styles.subtitle}>Thank you for using RainCheck</Text>

        {lastRental && (
          <Animated.View style={[styles.card, { opacity }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Receipt</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.value}>{lastRental.stationFrom}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.value}>{lastRental.stationTo ?? '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{lastRental.duration ?? '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Total</Text>
              <Text style={[styles.value, styles.totalValue]}>
                {lastRental.cost != null ? formatCurrency(lastRental.cost) : '—'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Rating */}
        {!rated && (
          <Animated.View style={[styles.ratingCard, { opacity }]}>
            <Text style={styles.ratingTitle}>Rate your experience</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => handleRate(s)} activeOpacity={0.7}>
                  <Ionicons
                    name={s <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color={s <= rating ? '#F59E0B' : Colors.textTertiary}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <TouchableOpacity style={styles.submitRating} onPress={handleSubmitRating} activeOpacity={0.8}>
                <Text style={styles.submitRatingText}>Submit Rating</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {rated && (
          <View style={styles.ratedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.ratedText}>Thanks for your feedback!</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.replace('/map')}
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  checkCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 24 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.xl, width: '100%', ...Shadow.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: FontSize.md, color: Colors.textSecondary },
  value: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  totalValue: { fontWeight: FontWeight.bold, color: Colors.primary },
  divider: { height: 0.5, backgroundColor: Colors.borderLight, marginVertical: 12 },
  ratingCard: {
    width: '100%', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.xl, marginTop: 16, ...Shadow.sm,
  },
  ratingTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary, marginBottom: 12 },
  stars: { flexDirection: 'row', gap: 8 },
  submitRating: {
    marginTop: 16, backgroundColor: Colors.primary,
    paddingHorizontal: 24, paddingVertical: 10, borderRadius: Radius.lg,
  },
  submitRatingText: { color: '#FFFFFF', fontWeight: FontWeight.semibold, fontSize: FontSize.sm },
  ratedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16,
    backgroundColor: Colors.successLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full,
  },
  ratedText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.success },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: 16 },
  doneBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: Radius.lg, alignItems: 'center' },
  doneBtnText: { color: '#FFFFFF', fontSize: FontSize.lg, fontWeight: FontWeight.semibold },
});
