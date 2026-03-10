import { useEffect } from 'react';
import Svg, { Rect, Path, G, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ScanScene({ isActive }: { isActive: boolean }) {
  // Scan line moving up and down
  const scanLineY = useSharedValue(65);
  const scanLineOpacity = useSharedValue(0);

  // Phone entrance
  const phoneScale = useSharedValue(0.8);
  const phoneOpacity = useSharedValue(0);

  // QR code grid fade in
  const qrOpacity = useSharedValue(0);

  // Success checkmark
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);

  // Glow effect
  const glowOpacity = useSharedValue(0);

  // Umbrella unlocking
  const umbrellaY = useSharedValue(10);
  const umbrellaOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Phone enters
      phoneScale.value = withDelay(200, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) }));
      phoneOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));

      // QR appears
      qrOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));

      // Scan line sweeps
      scanLineOpacity.value = withDelay(800, withTiming(0.8, { duration: 200 }));
      scanLineY.value = withDelay(800, withRepeat(
        withSequence(
          withTiming(155, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(65, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ), -1
      ));

      // Success after 2.5s
      glowOpacity.value = withDelay(2800, withSequence(
        withTiming(0.4, { duration: 300 }),
        withTiming(0, { duration: 800 }),
      ));
      checkScale.value = withDelay(2800, withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) }));
      checkOpacity.value = withDelay(2800, withTiming(1, { duration: 300 }));

      // Umbrella floats up
      umbrellaY.value = withDelay(3200, withTiming(-5, { duration: 600, easing: Easing.out(Easing.ease) }));
      umbrellaOpacity.value = withDelay(3200, withTiming(1, { duration: 400 }));
    } else {
      phoneScale.value = 0.8; phoneOpacity.value = 0;
      qrOpacity.value = 0; scanLineY.value = 65; scanLineOpacity.value = 0;
      checkScale.value = 0; checkOpacity.value = 0; glowOpacity.value = 0;
      umbrellaY.value = 10; umbrellaOpacity.value = 0;
    }
  }, [isActive]);

  const phoneProps = useAnimatedProps(() => ({
    opacity: phoneOpacity.value,
    scale: phoneScale.value,
  }));

  const qrProps = useAnimatedProps(() => ({
    opacity: qrOpacity.value,
  }));

  const scanProps = useAnimatedProps(() => ({
    y1: scanLineY.value,
    y2: scanLineY.value,
    opacity: scanLineOpacity.value,
  }));

  const checkProps = useAnimatedProps(() => ({
    opacity: checkOpacity.value,
    scale: checkScale.value,
  }));

  const glowProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  const umbrellaProps = useAnimatedProps(() => ({
    translateY: umbrellaY.value,
    opacity: umbrellaOpacity.value,
  }));

  return (
    <Svg width={280} height={240} viewBox="0 0 280 240">
      {/* Glow effect */}
      <AnimatedCircle cx={140} cy={120} r={90} fill="rgba(255,255,255,0.08)" animatedProps={glowProps} />

      {/* Phone body */}
      <AnimatedG animatedProps={phoneProps}>
        <G>
          {/* Phone outline */}
          <Rect x={80} y={20} width={120} height={200} rx={16} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />

          {/* Screen */}
          <Rect x={88} y={40} width={104} height={160} rx={4} fill="rgba(0,0,0,0.3)" />

          {/* Notch */}
          <Rect x={120} y={24} width={40} height={6} rx={3} fill="rgba(255,255,255,0.2)" />

          {/* Home indicator */}
          <Rect x={115} y={208} width={50} height={4} rx={2} fill="rgba(255,255,255,0.15)" />

          {/* Camera viewfinder corners */}
          <Path d="M100 58 L100 48 L110 48" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <Path d="M170 48 L180 48 L180 58" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <Path d="M100 162 L100 172 L110 172" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <Path d="M170 172 L180 172 L180 162" stroke="rgba(255,255,255,0.6)" strokeWidth={2.5} strokeLinecap="round" fill="none" />

          {/* QR Code pattern */}
          <AnimatedG animatedProps={qrProps}>
            {/* QR corners */}
            <Rect x={115} y={72} width={18} height={18} rx={2} stroke="rgba(255,255,255,0.7)" strokeWidth={2} fill="none" />
            <Rect x={119} y={76} width={10} height={10} rx={1} fill="rgba(255,255,255,0.5)" />

            <Rect x={147} y={72} width={18} height={18} rx={2} stroke="rgba(255,255,255,0.7)" strokeWidth={2} fill="none" />
            <Rect x={151} y={76} width={10} height={10} rx={1} fill="rgba(255,255,255,0.5)" />

            <Rect x={115} y={130} width={18} height={18} rx={2} stroke="rgba(255,255,255,0.7)" strokeWidth={2} fill="none" />
            <Rect x={119} y={134} width={10} height={10} rx={1} fill="rgba(255,255,255,0.5)" />

            {/* QR data blocks */}
            {[
              [140, 80], [145, 85], [137, 95], [150, 95], [140, 100],
              [135, 105], [150, 105], [142, 110], [155, 115], [130, 115],
              [140, 120], [148, 125], [135, 130], [155, 135], [145, 140],
              [150, 130], [138, 135], [142, 145],
            ].map(([x, y], i) => (
              <Rect key={i} x={x} y={y} width={4} height={4} rx={0.5} fill={`rgba(255,255,255,${0.3 + Math.random() * 0.4})`} />
            ))}
          </AnimatedG>

          {/* Scan line */}
          <AnimatedLine x1={94} x2={186} stroke="#4169E1" strokeWidth={2} animatedProps={scanProps} />
          <AnimatedLine x1={94} x2={186} stroke="rgba(65,105,225,0.3)" strokeWidth={8} animatedProps={scanProps} />
        </G>
      </AnimatedG>

      {/* Success check badge */}
      <AnimatedG animatedProps={checkProps}>
        <G>
          <Circle cx={200} cy={55} r={18} fill="#10B981" />
          <Path d="M191 55 L197 61 L209 49" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </G>
      </AnimatedG>

      {/* Umbrella floating out */}
      <AnimatedG animatedProps={umbrellaProps}>
        <G>
          <Path d="M55 105 Q55 80 75 80 Q95 80 95 105" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          <Line x1={75} y1={80} x2={75} y2={125} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          <Path d="M75 125 Q75 130 70 130" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </G>
      </AnimatedG>
    </Svg>
  );
}
