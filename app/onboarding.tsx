import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
  Animated as RNAnimated,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Radius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import MapScene from '@/components/onboarding/MapScene';
import ScanScene from '@/components/onboarding/ScanScene';
import PayScene from '@/components/onboarding/PayScene';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  gradient: [string, string, string];
  subtitle: string;
  title: string;
  description: string;
  scene: 'map' | 'scan' | 'pay';
}

const slides: Slide[] = [
  {
    id: '1',
    gradient: ['#4169E1', '#3358C8', '#2847AF'],
    subtitle: 'DISCOVER',
    title: 'Stations\nEverywhere',
    description: 'Hundreds of RainCheck stations across the city.\nReal-time availability at your fingertips.',
    scene: 'map',
  },
  {
    id: '2',
    gradient: ['#6B46C1', '#553C9A', '#44337A'],
    subtitle: 'INSTANT',
    title: 'Scan.\nGrab. Go.',
    description: 'One scan to unlock. No keys, no hassle.\nYour umbrella is ready in seconds.',
    scene: 'scan',
  },
  {
    id: '3',
    gradient: ['#059669', '#047857', '#065F46'],
    subtitle: 'FAIR',
    title: 'Pay Only\nWhat You Use',
    description: 'Return at any station. Charged by the minute.\nNo subscriptions, no surprises.',
    scene: 'pay',
  },
];

function SceneRenderer({ scene, isActive }: { scene: string; isActive: boolean }) {
  switch (scene) {
    case 'map': return <MapScene isActive={isActive} />;
    case 'scan': return <ScanScene isActive={isActive} />;
    case 'pay': return <PayScene isActive={isActive} />;
    default: return null;
  }
}

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const setHasSeenOnboarding = useAppStore((s) => s.setHasSeenOnboarding);
  const scrollX = useRef(new RNAnimated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleContinue = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      finish();
    }
  };

  const finish = () => {
    setHasSeenOnboarding(true);
    router.replace('/auth');
  };

  const currentSlide = slides[activeIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentSlide.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* RainCheck logo */}
      <View style={[styles.logoRow, { top: insets.top + 16 }]}>
        <Ionicons name="umbrella" size={18} color="rgba(255,255,255,0.6)" />
        <Text style={styles.logoText}>RainCheck</Text>
      </View>

      {/* Skip */}
      {activeIndex < slides.length - 1 && (
        <TouchableOpacity
          style={[styles.skipBtn, { top: insets.top + 16 }]}
          onPress={finish}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward-outline" size={14} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.slide, { paddingTop: insets.top + 70 }]}>
            {/* SVG Scene */}
            <View style={styles.sceneContainer}>
              <SceneRenderer scene={item.scene} isActive={index === activeIndex} />
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <View style={styles.subtitlePill}>
                <Text style={styles.subtitleText}>{item.subtitle}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            });
            return (
              <RNAnimated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: currentSlide.gradient[0] }]}>
            {activeIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <View style={[styles.ctaIconCircle, { backgroundColor: currentSlide.gradient[0] }]}>
            <Ionicons
              name={activeIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        {/* Page counter */}
        <Text style={styles.pageCounter}>
          {activeIndex + 1} of {slides.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoRow: {
    position: 'absolute',
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  skipBtn: {
    position: 'absolute',
    right: 24,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: FontWeight.medium,
  },
  slide: {
    width,
    flex: 1,
  },
  sceneContainer: {
    height: height * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 32,
    flex: 1,
    paddingTop: 16,
  },
  subtitlePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 3,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 46,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  ctaBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingLeft: 24,
    paddingRight: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  ctaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageCounter: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    fontWeight: '500',
  },
});
