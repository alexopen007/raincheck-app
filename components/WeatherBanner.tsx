import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/lib/theme';

type Props = {
  condition: string;
  temp: string;
  alert: string;
  alertLevel: 'info' | 'warning' | 'danger';
  onAction?: () => void;
  actionLabel?: string;
};

const levelColors = {
  info: { bg: '#EFF6FF', border: '#BFDBFE', icon: Colors.primary },
  warning: { bg: Colors.warningLight, border: '#FDE68A', icon: Colors.warning },
  danger: { bg: Colors.errorLight, border: '#FCA5A5', icon: Colors.error },
};

export default function WeatherBanner({ condition, temp, alert, alertLevel, onAction, actionLabel }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const colors = levelColors[alertLevel];
  const iconName = alertLevel === 'info' ? 'rainy-outline' : 'warning-outline';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={styles.left}>
        <Ionicons name={iconName} size={18} color={colors.icon} />
        <View style={styles.textWrap}>
          <Text style={styles.condition}>
            {condition} · {temp}
          </Text>
          <Text style={styles.alert}>{alert}</Text>
          {onAction && actionLabel && (
            <TouchableOpacity onPress={onAction} style={styles.actionBtn} activeOpacity={0.7}>
              <Text style={[styles.actionText, { color: colors.icon }]}>{actionLabel}</Text>
              <Ionicons name="arrow-forward-outline" size={12} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => setDismissed(true)} hitSlop={12}>
        <Ionicons name="close-outline" size={16} color={Colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  condition: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  alert: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  actionText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
