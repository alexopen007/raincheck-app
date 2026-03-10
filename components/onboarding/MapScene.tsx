import { useEffect } from 'react';
import Svg, { Circle, Path, Rect, G, Line, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function MapScene({ isActive }: { isActive: boolean }) {
  // Pin drops
  const pin1Y = useSharedValue(-30);
  const pin2Y = useSharedValue(-30);
  const pin3Y = useSharedValue(-30);
  const pin1Opacity = useSharedValue(0);
  const pin2Opacity = useSharedValue(0);
  const pin3Opacity = useSharedValue(0);

  // Radar pulse
  const radarScale = useSharedValue(0.3);
  const radarOpacity = useSharedValue(0.6);

  // User dot pulse
  const userPulseScale = useSharedValue(1);
  const userPulseOpacity = useSharedValue(0.4);

  // Route line
  const routeDash = useSharedValue(200);

  useEffect(() => {
    if (isActive) {
      // Pin drops with stagger
      pin1Y.value = withDelay(300, withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1.5)) }));
      pin1Opacity.value = withDelay(300, withTiming(1, { duration: 300 }));

      pin2Y.value = withDelay(550, withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1.5)) }));
      pin2Opacity.value = withDelay(550, withTiming(1, { duration: 300 }));

      pin3Y.value = withDelay(800, withTiming(0, { duration: 500, easing: Easing.out(Easing.back(1.5)) }));
      pin3Opacity.value = withDelay(800, withTiming(1, { duration: 300 }));

      // Radar pulse repeating
      radarScale.value = withDelay(400, withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(0.3, { duration: 0 }),
        ), -1
      ));
      radarOpacity.value = withDelay(400, withRepeat(
        withSequence(
          withTiming(0, { duration: 1500 }),
          withTiming(0.5, { duration: 0 }),
        ), -1
      ));

      // User pulse
      userPulseScale.value = withRepeat(
        withSequence(
          withTiming(2.5, { duration: 1200 }),
          withTiming(1, { duration: 0 }),
        ), -1
      );
      userPulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1200 }),
          withTiming(0.3, { duration: 0 }),
        ), -1
      );

      // Route dash animation
      routeDash.value = withDelay(1000, withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }));
    } else {
      pin1Y.value = -30; pin2Y.value = -30; pin3Y.value = -30;
      pin1Opacity.value = 0; pin2Opacity.value = 0; pin3Opacity.value = 0;
      routeDash.value = 200;
    }
  }, [isActive]);

  const pin1Props = useAnimatedProps(() => ({
    translateY: pin1Y.value,
    opacity: pin1Opacity.value,
  }));
  const pin2Props = useAnimatedProps(() => ({
    translateY: pin2Y.value,
    opacity: pin2Opacity.value,
  }));
  const pin3Props = useAnimatedProps(() => ({
    translateY: pin3Y.value,
    opacity: pin3Opacity.value,
  }));

  const radarProps = useAnimatedProps(() => ({
    r: 20 * radarScale.value,
    opacity: radarOpacity.value,
  }));

  const userPulseProps = useAnimatedProps(() => ({
    rx: 8 * userPulseScale.value,
    ry: 8 * userPulseScale.value,
    opacity: userPulseOpacity.value,
  }));

  const routeProps = useAnimatedProps(() => ({
    strokeDashoffset: routeDash.value,
  }));

  return (
    <Svg width={280} height={240} viewBox="0 0 280 240">
      {/* Map grid lines */}
      <G opacity={0.15}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Line key={`h${i}`} x1={0} y1={i * 48} x2={280} y2={i * 48} stroke="#fff" strokeWidth={0.5} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <Line key={`v${i}`} x1={i * 47} y1={0} x2={i * 47} y2={240} stroke="#fff" strokeWidth={0.5} />
        ))}
      </G>

      {/* Roads */}
      <Rect x={0} y={108} width={280} height={24} rx={2} fill="rgba(255,255,255,0.08)" />
      <Rect x={120} y={0} width={20} height={240} rx={2} fill="rgba(255,255,255,0.06)" />
      <Path d="M0 60 Q140 80 280 50" stroke="rgba(255,255,255,0.06)" strokeWidth={16} fill="none" />

      {/* Park area */}
      <Rect x={20} y={150} width={70} height={60} rx={12} fill="rgba(16,185,129,0.15)" />
      <Circle cx={45} cy={175} r={6} fill="rgba(16,185,129,0.25)" />
      <Circle cx={65} cy={185} r={5} fill="rgba(16,185,129,0.2)" />

      {/* Buildings */}
      <Rect x={180} y={20} width={50} height={35} rx={4} fill="rgba(255,255,255,0.08)" />
      <Rect x={200} y={160} width={60} height={50} rx={4} fill="rgba(255,255,255,0.06)" />
      <Rect x={20} y={30} width={40} height={25} rx={4} fill="rgba(255,255,255,0.07)" />

      {/* Dashed route line */}
      <AnimatedPath
        d="M140 120 Q160 90 195 78"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={2}
        strokeDasharray="6 4"
        strokeDashoffset={0}
        fill="none"
        animatedProps={routeProps}
      />

      {/* User location - center */}
      <AnimatedEllipse cx={140} cy={120} fill="rgba(255,255,255,0.3)" animatedProps={userPulseProps} />
      <Circle cx={140} cy={120} r={7} fill="#FFFFFF" />
      <Circle cx={140} cy={120} r={4} fill="#4169E1" />

      {/* Radar pulse from user */}
      <AnimatedCircle cx={140} cy={120} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} animatedProps={radarProps} />

      {/* Station Pin 1 - top right */}
      <AnimatedG animatedProps={pin1Props}>
        <G>
          <Ellipse cx={195} cy={82} rx={8} ry={3} fill="rgba(0,0,0,0.15)" />
          <Path d="M195 44 C195 34 185 26 185 26 L195 20 L205 26 C205 26 195 34 195 44 Z" fill="#10B981" />
          <Circle cx={195} cy={32} r={5} fill="#FFFFFF" />
          <Path d="M193 32 L195 29 L197 32 M195 29 L195 35" stroke="#10B981" strokeWidth={1.2} fill="none" strokeLinecap="round" />
          {/* Count badge */}
          <Circle cx={205} cy={24} r={8} fill="#FFFFFF" />
          <Svg x={201} y={19}>
            <G>
              {/* "8" text approximated */}
            </G>
          </Svg>
        </G>
      </AnimatedG>

      {/* Station Pin 2 - left */}
      <AnimatedG animatedProps={pin2Props}>
        <G>
          <Ellipse cx={65} cy={110} rx={8} ry={3} fill="rgba(0,0,0,0.15)" />
          <Path d="M65 72 C65 62 55 54 55 54 L65 48 L75 54 C75 54 65 62 65 72 Z" fill="#F59E0B" />
          <Circle cx={65} cy={60} r={5} fill="#FFFFFF" />
          <Path d="M63 60 L65 57 L67 60 M65 57 L65 63" stroke="#F59E0B" strokeWidth={1.2} fill="none" strokeLinecap="round" />
          <Circle cx={75} cy={52} r={8} fill="#FFFFFF" />
        </G>
      </AnimatedG>

      {/* Station Pin 3 - bottom right */}
      <AnimatedG animatedProps={pin3Props}>
        <G>
          <Ellipse cx={220} cy={190} rx={8} ry={3} fill="rgba(0,0,0,0.15)" />
          <Path d="M220 152 C220 142 210 134 210 134 L220 128 L230 134 C230 134 220 142 220 152 Z" fill="#10B981" />
          <Circle cx={220} cy={140} r={5} fill="#FFFFFF" />
          <Path d="M218 140 L220 137 L222 140 M220 137 L220 143" stroke="#10B981" strokeWidth={1.2} fill="none" strokeLinecap="round" />
          <Circle cx={230} cy={132} r={8} fill="#FFFFFF" />
        </G>
      </AnimatedG>
    </Svg>
  );
}
