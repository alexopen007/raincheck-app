import { useEffect } from 'react';
import Svg, { Rect, Path, G, Line, Circle, Ellipse, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function PayScene({ isActive }: { isActive: boolean }) {
  // Card entrance
  const cardX = useSharedValue(40);
  const cardOpacity = useSharedValue(0);
  const cardRotate = useSharedValue(-5);

  // Receipt slides up
  const receiptY = useSharedValue(30);
  const receiptOpacity = useSharedValue(0);

  // Coins
  const coin1Y = useSharedValue(-20);
  const coin1Opacity = useSharedValue(0);
  const coin2Y = useSharedValue(-20);
  const coin2Opacity = useSharedValue(0);
  const coin3Y = useSharedValue(-20);
  const coin3Opacity = useSharedValue(0);

  // Check mark
  const checkScale = useSharedValue(0);

  // Amount counter
  const amountOpacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Card slides in
      cardX.value = withDelay(200, withSpring(0, { damping: 14, stiffness: 90 }));
      cardOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      cardRotate.value = withDelay(200, withSpring(0, { damping: 12 }));

      // Receipt
      receiptY.value = withDelay(700, withSpring(0, { damping: 14, stiffness: 90 }));
      receiptOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));

      // Coins cascade
      coin1Y.value = withDelay(1100, withSequence(
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(1.3)) }),
        withTiming(-3, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ));
      coin1Opacity.value = withDelay(1100, withTiming(1, { duration: 300 }));

      coin2Y.value = withDelay(1300, withSequence(
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(1.3)) }),
        withTiming(-3, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ));
      coin2Opacity.value = withDelay(1300, withTiming(1, { duration: 300 }));

      coin3Y.value = withDelay(1500, withSequence(
        withTiming(0, { duration: 400, easing: Easing.out(Easing.back(1.3)) }),
        withTiming(-3, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ));
      coin3Opacity.value = withDelay(1500, withTiming(1, { duration: 300 }));

      // Check
      checkScale.value = withDelay(1800, withSpring(1, { damping: 10, stiffness: 120 }));

      // Amount
      amountOpacity.value = withDelay(2000, withTiming(1, { duration: 400 }));
    } else {
      cardX.value = 40; cardOpacity.value = 0; cardRotate.value = -5;
      receiptY.value = 30; receiptOpacity.value = 0;
      coin1Y.value = -20; coin1Opacity.value = 0;
      coin2Y.value = -20; coin2Opacity.value = 0;
      coin3Y.value = -20; coin3Opacity.value = 0;
      checkScale.value = 0; amountOpacity.value = 0;
    }
  }, [isActive]);

  const cardProps = useAnimatedProps(() => ({
    translateX: cardX.value,
    opacity: cardOpacity.value,
  }));

  const receiptProps = useAnimatedProps(() => ({
    translateY: receiptY.value,
    opacity: receiptOpacity.value,
  }));

  const coin1Props = useAnimatedProps(() => ({
    translateY: coin1Y.value,
    opacity: coin1Opacity.value,
  }));
  const coin2Props = useAnimatedProps(() => ({
    translateY: coin2Y.value,
    opacity: coin2Opacity.value,
  }));
  const coin3Props = useAnimatedProps(() => ({
    translateY: coin3Y.value,
    opacity: coin3Opacity.value,
  }));

  const checkProps = useAnimatedProps(() => ({
    scale: checkScale.value,
  }));

  const amountProps = useAnimatedProps(() => ({
    opacity: amountOpacity.value,
  }));

  return (
    <Svg width={280} height={240} viewBox="0 0 280 240">
      {/* Credit card */}
      <AnimatedG animatedProps={cardProps}>
        <G>
          {/* Card body */}
          <Rect x={30} y={30} width={160} height={100} rx={12} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />

          {/* Card shine */}
          <Path d="M30 55 Q80 45 190 55" stroke="rgba(255,255,255,0.08)" strokeWidth={30} fill="none" />

          {/* Chip */}
          <Rect x={50} y={55} width={24} height={18} rx={3} fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} />
          <Line x1={50} y1={62} x2={74} y2={62} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
          <Line x1={50} y1={67} x2={74} y2={67} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
          <Line x1={62} y1={55} x2={62} y2={73} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />

          {/* Card number dots */}
          {[0, 1, 2, 3].map(g => (
            <G key={g}>
              {[0, 1, 2, 3].map(d => (
                <Circle key={`${g}-${d}`} cx={52 + g * 34 + d * 7} cy={90} r={2} fill="rgba(255,255,255,0.35)" />
              ))}
            </G>
          ))}

          {/* Card name */}
          <Rect x={50} y={104} width={60} height={6} rx={3} fill="rgba(255,255,255,0.2)" />

          {/* Contactless icon */}
          <G transform="translate(155, 50)">
            <Path d="M0 10 Q4 6 4 0" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} fill="none" />
            <Path d="M4 10 Q8 6 8 0" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} fill="none" />
            <Path d="M8 10 Q12 6 12 0" stroke="rgba(255,255,255,0.4)" strokeWidth={1.2} fill="none" />
          </G>
        </G>
      </AnimatedG>

      {/* Receipt */}
      <AnimatedG animatedProps={receiptProps}>
        <G>
          {/* Receipt body with torn edge */}
          <Path d="M155 60 L255 60 L255 195 L252 192 L249 195 L246 192 L243 195 L240 192 L237 195 L234 192 L231 195 L228 192 L225 195 L222 192 L219 195 L216 192 L213 195 L210 192 L207 195 L204 192 L201 195 L198 192 L195 195 L192 192 L189 195 L186 192 L183 195 L180 192 L177 195 L174 192 L171 195 L168 192 L165 195 L162 192 L159 195 L156 192 L155 195 Z" fill="rgba(255,255,255,0.95)" />

          {/* Receipt header */}
          <Rect x={180} y={72} width={50} height={8} rx={4} fill="rgba(65,105,225,0.3)" />

          {/* Divider */}
          <Line x1={165} y1={90} x2={245} y2={90} stroke="rgba(0,0,0,0.08)" strokeWidth={1} strokeDasharray="3 2" />

          {/* Line items */}
          <Rect x={165} y={100} width={45} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
          <Rect x={230} y={100} width={15} height={5} rx={2.5} fill="rgba(0,0,0,0.08)" />

          <Rect x={165} y={114} width={55} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
          <Rect x={230} y={114} width={15} height={5} rx={2.5} fill="rgba(0,0,0,0.08)" />

          <Rect x={165} y={128} width={35} height={5} rx={2.5} fill="rgba(0,0,0,0.12)" />
          <Rect x={225} y={128} width={20} height={5} rx={2.5} fill="rgba(0,0,0,0.08)" />

          {/* Divider */}
          <Line x1={165} y1={142} x2={245} y2={142} stroke="rgba(0,0,0,0.08)" strokeWidth={1} />

          {/* Total */}
          <AnimatedG animatedProps={amountProps}>
            <Rect x={165} y={152} width={30} height={7} rx={3.5} fill="rgba(0,0,0,0.15)" />
            <Rect x={218} y={150} width={28} height={10} rx={4} fill="rgba(65,105,225,0.25)" />
          </AnimatedG>

          {/* Barcode */}
          {[0, 4, 7, 9, 12, 14, 17, 20, 22, 25, 27, 30, 33, 35, 38, 40, 43, 46, 48].map((x, i) => (
            <Rect key={i} x={170 + x} y={170} width={i % 3 === 0 ? 2 : 1} height={14} fill={`rgba(0,0,0,${0.15 + (i % 3) * 0.05})`} />
          ))}
        </G>
      </AnimatedG>

      {/* Floating coins */}
      <AnimatedG animatedProps={coin1Props}>
        <Circle cx={50} cy={165} r={14} fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth={1.5} />
        <SvgText x={50} y={170} fill="rgba(245,158,11,0.8)" fontSize={12} fontWeight="bold" textAnchor="middle">₹</SvgText>
      </AnimatedG>

      <AnimatedG animatedProps={coin2Props}>
        <Circle cx={80} cy={180} r={12} fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.4)" strokeWidth={1.5} />
        <SvgText x={80} y={184} fill="rgba(245,158,11,0.7)" fontSize={10} fontWeight="bold" textAnchor="middle">₹</SvgText>
      </AnimatedG>

      <AnimatedG animatedProps={coin3Props}>
        <Circle cx={110} cy={195} r={10} fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.35)" strokeWidth={1.5} />
        <SvgText x={110} y={199} fill="rgba(245,158,11,0.6)" fontSize={8} fontWeight="bold" textAnchor="middle">₹</SvgText>
      </AnimatedG>

      {/* Success check */}
      <AnimatedG animatedProps={checkProps}>
        <Circle cx={140} cy={15} r={16} fill="#10B981" />
        <Path d="M132 15 L137 20 L148 10" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </AnimatedG>
    </Svg>
  );
}
