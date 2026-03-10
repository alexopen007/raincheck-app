import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { mockStations } from '@/lib/mock-data';

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const setScannedStationId = useAppStore((s) => s.setScannedStationId);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    const station = mockStations.find((s) => s.id === data);
    if (station) {
      setScannedStationId(station.id);
      router.replace('/rent/confirm');
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.permText}>Camera access is needed to scan QR codes</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Overlay */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close-outline" size={24} color="#FFFFFF"  />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={() => setTorch(!torch)} hitSlop={12}>
          {torch ? <Ionicons name="flash-off-outline" size={22} color="#FFFFFF" /> : <Ionicons name="flash-outline" size={22} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {/* Scan frame */}
      <View style={styles.frameContainer}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
        <Text style={styles.instruction}>Point at station QR code</Text>
      </View>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.manualBtn}
          onPress={() => router.push('/scan/manual')}
          activeOpacity={0.8}
        >
          <Ionicons name="keypad-outline" size={18} color="#FFFFFF" />
          <Text style={styles.manualText}>Enter code manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permText: {
    fontSize: FontSize.md,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  permBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  permBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 12,
    zIndex: 10,
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFFFFF',
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  instruction: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.md,
    marginTop: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  manualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  manualText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
