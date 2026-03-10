import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { mockTransactions } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function WalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);
  const paymentMethods = useAppStore((s) => s.paymentMethods);
  const defaultPaymentMethodId = useAppStore((s) => s.defaultPaymentMethodId);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Wallet</Text>

      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Balance card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(user.balance)}</Text>
              <TouchableOpacity style={styles.topUpBtn} activeOpacity={0.8}>
                <Ionicons name="add-outline" size={16} color="#FFFFFF"  />
                <Text style={styles.topUpText}>Top Up</Text>
              </TouchableOpacity>
            </View>

            {/* Payment methods */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment Methods</Text>
                <TouchableOpacity onPress={() => router.push('/wallet/add')}>
                  <Ionicons name="add-outline" size={20} color={Colors.primary}  />
                </TouchableOpacity>
              </View>
              {paymentMethods.map((pm) => (
                <View key={pm.id} style={styles.pmItem}>
                  {pm.type === 'card' ? (
                    <Ionicons name="card-outline" size={20} color={Colors.textSecondary} />
                  ) : (
                    <Ionicons name="phone-portrait-outline" size={20} color={Colors.textSecondary} />
                  )}
                  <View style={styles.pmInfo}>
                    <Text style={styles.pmLabel}>{pm.label}</Text>
                    {pm.id === defaultPaymentMethodId && (
                      <Text style={styles.pmDefault}>Default</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Transactions</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <View style={[styles.txIcon, { backgroundColor: item.type === 'credit' ? Colors.successLight : Colors.surfaceSecondary }]}>
              {item.type === 'credit' ? (
                <Ionicons name="arrow-down-outline" size={16} color={Colors.success} />
              ) : (
                <Ionicons name="arrow-up-outline" size={16} color={Colors.textSecondary} />
              )}
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDesc}>{item.description}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txAmount, item.amount > 0 && { color: Colors.success }]}>
              {item.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(item.amount))}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  pmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 12,
    marginBottom: 8,
    ...Shadow.sm,
  },
  pmInfo: {
    flex: 1,
  },
  pmLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  pmDefault: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  txDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
});
