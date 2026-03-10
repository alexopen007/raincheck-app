import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

export default function RentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const activeRental = useAppStore((s) => s.activeRental);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}>
          <Ionicons name="checkmark-outline" size={40} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.title}> Unlocked</Text>
        <Text style={styles.subtitle}>Your rental has started</Text>

        {activeRental && (
          <Animated.View style={[styles.card, { opacity }]}>
            <View style={styles.row}>
              <Ionicons name="umbrella-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.label}></Text>
              <Text style={styles.value}>{activeRental.umbrellaId}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>Station</Text>
              <Text style={styles.value}>{activeRental.stationFrom}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="pricetag-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>Slot</Text>
              <Text style={styles.value}>#{activeRental.slot}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.label}>Started</Text>
              <Text style={styles.value}>Just now</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.replace('/activity')}
          activeOpacity={0.8}
        >
          <Text style={styles.viewBtnText}>View Rental</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => router.replace('/map')}
          activeOpacity={0.7}
        >
          <Text style={styles.mapBtnText}>Back to Map</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    width: '100%',
    ...Shadow.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 16,
    gap: 10,
  },
  viewBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  mapBtn: {
    paddingVertical: 14,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
});
