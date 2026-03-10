import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/lib/theme';
import type { Station } from '@/lib/mock-data';

type Props = {
  station: Station;
};

const markerColors = {
  available: Colors.markerAvailable,
  low: Colors.markerLow,
  empty: Colors.markerEmpty,
};

export default function StationMarker({ station }: Props) {
  const color = markerColors[station.status];

  return (
    <View style={styles.container}>
      <View style={[styles.marker, { backgroundColor: color }]}>
        <Text style={styles.count}>{station.available}</Text>
      </View>
      <View style={[styles.arrow, { borderTopColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  count: {
    color: '#FFFFFF',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
