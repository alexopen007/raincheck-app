import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { generateId } from '@/lib/utils';

type Tab = 'card' | 'upi';

export default function AddPaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addPaymentMethod = useAppStore((s) => s.addPaymentMethod);

  const [tab, setTab] = useState<Tab>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');

  const handleAdd = () => {
    if (tab === 'card') {
      const last4 = cardNumber.replace(/\s/g, '').slice(-4);
      addPaymentMethod({
        id: generateId(),
        type: 'card',
        label: `Card ending in ${last4}`,
        last4,
        isDefault: false,
      });
    } else {
      addPaymentMethod({
        id: generateId(),
        type: 'upi',
        label: upiId,
        isDefault: false,
      });
    }
    router.back();
  };

  const isValid = tab === 'card'
    ? cardNumber.length >= 16 && expiry.length >= 4 && cvv.length >= 3
    : upiId.includes('@');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back-outline" size={24} color={Colors.textPrimary}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'card' && styles.tabActive]}
          onPress={() => setTab('card')}
        >
          <Ionicons name="card-outline" size={16} color={tab === 'card' ? Colors.primary : Colors.textTertiary}  />
          <Text style={[styles.tabText, tab === 'card' && styles.tabTextActive]}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'upi' && styles.tabActive]}
          onPress={() => setTab('upi')}
        >
          <Ionicons name="phone-portrait-outline" size={16} color={Colors.textTertiary} />
          <Text style={[styles.tabText, tab === 'upi' && styles.tabTextActive]}>UPI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {tab === 'card' ? (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={setCardNumber}
                maxLength={19}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="number-pad"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                  maxLength={4}
                />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>
          </>
        ) : (
          <View style={styles.field}>
            <Text style={styles.label}>UPI ID</Text>
            <TextInput
              style={styles.input}
              placeholder="yourname@upi"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={upiId}
              onChangeText={setUpiId}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.addBtn, !isValid && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.surface,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: Spacing.xl,
    gap: 16,
  },
  field: {},
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnDisabled: {
    opacity: 0.5,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
});
