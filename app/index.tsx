import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, hasSeenOnboarding } = useAppStore();

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/map');
      } else if (hasSeenOnboarding) {
        router.replace('/auth');
      } else {
        router.replace('/onboarding');
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, hasSeenOnboarding, router, opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <View style={styles.iconWrap}>
          <Ionicons name="umbrella-outline" size={64} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>RainCheck</Text>
        <Text style={styles.subtitle}>Never get caught without cover</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
});
