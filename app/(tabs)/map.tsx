import { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
let MapView: any = View;
let Marker: any = View;
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
}
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Colors, FontSize, FontWeight, Spacing, Radius, Shadow } from '@/lib/theme';
import { mockStations, mockWeather, type Station } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import StationMarker from '@/components/StationMarker';
import StationDetailSheet from '@/components/StationDetailSheet';
import WeatherBanner from '@/components/WeatherBanner';

const INITIAL_REGION: Region = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);
  const listSheetRef = useRef<BottomSheet>(null);
  const detailSheetRef = useRef<BottomSheet>(null);

  const activeRental = useAppStore((s) => s.activeRental);
  const setScannedStationId = useAppStore((s) => s.setScannedStationId);
  const favoriteStationIds = useAppStore((s) => s.favoriteStationIds);
  const notifications = useAppStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = mockStations.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteStations = mockStations.filter((s) => favoriteStationIds.includes(s.id));

  const handleMarkerPress = (station: Station) => {
    setSelectedStation(station);
    mapRef.current?.animateToRegion(
      { latitude: station.lat, longitude: station.lng, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      400
    );
  };

  const handleDismissDetail = () => {
    setSelectedStation(null);
  };

  const handleRent = (station: Station) => {
    setScannedStationId(station.id);
    router.push('/scan');
  };

  const handleScan = () => {
    if (activeRental) {
      router.push('/return/scan');
    } else {
      router.push('/scan');
    }
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} showsUserLocation>
        {mockStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            onPress={() => handleMarkerPress(station)}
          >
            <StationMarker station={station} />
          </Marker>
        ))}
      </MapView>

      {/* Search bar + notification bell */}
      <View style={[styles.searchContainer, { top: insets.top + 8 }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stations..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => router.push('/activity/notifications')} hitSlop={8}>
            <View>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather banner - enhanced */}
      <View style={{ position: 'absolute', top: insets.top + 60, left: 0, right: 0 }}>
        <WeatherBanner
          condition={mockWeather.condition}
          temp={mockWeather.temp}
          alert="Chance of rain in next 2 hours: 80%"
          alertLevel={mockWeather.alertLevel}
          onAction={() => {
            // Open nearest available station
            const nearest = mockStations.find((s) => s.status === 'available');
            if (nearest) handleMarkerPress(nearest);
          }}
          actionLabel="Grab an umbrella now!"
        />
      </View>

      {/* Active rental banner */}
      {activeRental && (
        <TouchableOpacity
          style={[styles.rentalBanner, { bottom: 180 }]}
          onPress={() => router.push('/activity')}
          activeOpacity={0.85}
        >
          <View style={styles.rentalBannerLeft}>
            <Ionicons name="umbrella-outline" size={20} color="#FFFFFF" />
            <View>
              <Text style={styles.rentalBannerTitle}>{activeRental.umbrellaId}</Text>
              <LiveTimer startTime={activeRental.startTime} />
            </View>
          </View>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.push('/return/scan')}>
            <Text style={styles.returnBtnText}>Return</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 180 + (activeRental ? 70 : 0) }]}
        onPress={handleScan}
        activeOpacity={0.85}
      >
        <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Nearby stations sheet */}
      {!selectedStation && (
        <BottomSheet
          ref={listSheetRef}
          snapPoints={['18%', '55%']}
          index={0}
          backgroundStyle={styles.sheetBg}
          handleIndicatorStyle={styles.handle}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Nearby Stations</Text>
          </View>
          <BottomSheetFlatList
            data={filteredStations}
            keyExtractor={(item: Station) => item.id}
            contentContainerStyle={styles.stationList}
            ListHeaderComponent={
              favoriteStations.length > 0 ? (
                <View style={styles.favSection}>
                  <Text style={styles.favSectionTitle}>
                    <Ionicons name="heart" size={12} color={Colors.error} /> Favorites
                  </Text>
                  {favoriteStations.map((item: Station) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.stationItem}
                      onPress={() => handleMarkerPress(item)}
                    >
                      <View style={[styles.stationDot, { backgroundColor: item.status === 'available' ? Colors.success : item.status === 'low' ? Colors.warning : Colors.textTertiary }]} />
                      <View style={styles.stationInfo}>
                        <Text style={styles.stationName}>{item.name}</Text>
                        <Text style={styles.stationAddr}>{item.address}</Text>
                      </View>
                      <View style={styles.stationMeta}>
                        <Text style={styles.stationAvail}>{item.available}/{item.total}</Text>
                        <Text style={styles.stationDist}>{item.distance}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <Text style={styles.allSectionTitle}>All Stations</Text>
                </View>
              ) : null
            }
            renderItem={({ item }: { item: Station }) => (
              <TouchableOpacity style={styles.stationItem} onPress={() => handleMarkerPress(item)}>
                <View style={[styles.stationDot, { backgroundColor: item.status === 'available' ? Colors.success : item.status === 'low' ? Colors.warning : Colors.textTertiary }]} />
                <View style={styles.stationInfo}>
                  <Text style={styles.stationName}>{item.name}</Text>
                  <Text style={styles.stationAddr}>{item.address}</Text>
                </View>
                <View style={styles.stationMeta}>
                  <Text style={styles.stationAvail}>{item.available}/{item.total}</Text>
                  <Text style={styles.stationDist}>{item.distance}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      )}

      {/* Station detail sheet */}
      {selectedStation && (
        <StationDetailSheet
          ref={detailSheetRef}
          station={selectedStation}
          onRent={handleRent}
          onClose={handleDismissDetail}
        />
      )}
    </View>
  );
}

function LiveTimer({ startTime }: { startTime: number }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <Text style={styles.rentalBannerSub}>{formatDuration(Date.now() - startTime)}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    gap: 10,
    ...Shadow.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: Colors.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  rentalBanner: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    ...Shadow.md,
  },
  rentalBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rentalBannerTitle: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  rentalBannerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
  },
  returnBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  returnBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.lg,
  },
  sheetBg: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
  },
  handle: {
    backgroundColor: Colors.border,
    width: 36,
  },
  sheetHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  stationList: {
    paddingHorizontal: Spacing.xl,
    gap: 2,
    paddingBottom: 40,
  },
  favSection: {
    marginBottom: 8,
  },
  favSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
    marginBottom: 4,
  },
  allSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textTertiary,
    marginTop: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  stationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  stationAddr: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  stationMeta: {
    alignItems: 'flex-end',
  },
  stationAvail: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  stationDist: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
