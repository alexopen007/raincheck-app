# Umbrella App — React Native (Expo) Rebuild

## Overview
Rebuild the existing Next.js "Umbrella" app as a React Native app using Expo + expo-router. The app lets users rent umbrellas from stations, scan QR codes, and return them anywhere in the network.

## Tech Stack
- **Expo SDK 53** (latest stable) with expo-router for file-based navigation
- **React Native** with TypeScript
- **Zustand** for state management (with MMKV or AsyncStorage persistence)
- **React Native Reanimated** for animations
- **Expo Camera** for QR scanning
- **React Native Maps** (or expo MapView) for the map screen
- **Lucide React Native** or **@expo/vector-icons** for icons — NO EMOJIS as UI elements
- **Expo Haptics** for tactile feedback on key actions
- **Expo Linear Gradient** for gradients

## Design Direction: PREMIUM
The current web app looks "vibe coded" — too many emojis, bouncy animations, playful feel. The rebuild should feel like a **premium fintech/mobility app** (think Uber, Revolut, Citymapper):

### Design Principles
1. **No emojis as icons.** Use proper vector icons (Lucide, SF Symbols via expo icons). Emojis are okay ONLY in content text (e.g., chat), never as UI elements.
2. **Refined color palette:**
   - Primary: `#0A84FF` (iOS system blue) or a deep teal like `#0D9488`
   - Background: `#FAFAFA` light / `#09090B` dark
   - Cards: White with subtle shadows, no colored backgrounds
   - Accent: Use sparingly — one accent color, not rainbow
3. **Typography:** Clean hierarchy. Use system fonts (San Francisco on iOS, Roboto on Android). Bold for headings, regular for body, medium for labels.
4. **Animations:** Subtle and purposeful. Spring animations for sheets, fade for transitions. No bouncing logos, no pulsing dots, no rain effects.
5. **Spacing:** Generous whitespace. Don't cram elements.
6. **Shadows:** Subtle, realistic. No heavy colored shadows like `shadow-[#00b3ff]/40`.
7. **Icons:** Consistent stroke width, consistent size within context.
8. **Status colors:** Green (#10B981), Amber (#F59E0B), Red (#EF4444) — used minimally.

## Screens to Build

### 1. Splash Screen (`/`)
- Clean logo (umbrella icon from Lucide, not emoji) centered on solid primary color bg
- App name "Umbrella" in clean white text
- Subtle fade-in, auto-navigates after 1.5s
- No rain animation, no pulsing dots

### 2. Onboarding (`/onboarding`)
- 3 slides with illustrations (use clean SVG/icon compositions, not emoji collages)
- Slide 1: Find nearby stations (map icon + location)
- Slide 2: Scan & unlock (QR code icon)
- Slide 3: Pay per use (wallet/receipt icon)
- Dot indicators, skip button, continue/get started button
- Smooth horizontal swipe between slides

### 3. Auth (`/auth`)
- Phone number input with country code
- OTP verification (6-digit code input with auto-focus)
- Clean, minimal layout
- "By continuing, you agree to our Terms & Privacy Policy" at bottom

### 4. Map — Main Screen (`/(tabs)/map`)
- **Tab navigator** at bottom: Map, Activity, Wallet, Profile
- Full-screen MapView with station markers
- Station markers: small circles with availability count, color-coded (green/amber/gray)
- Search bar at top (floating over map)
- Weather alert banner (dismissible, clean — no rain drops animation)
- Bottom sheet with nearby stations list (draggable)
- FAB for QR scan (bottom right, above tab bar)
- Tapping a marker opens station detail bottom sheet
- Active rental banner (if rental in progress)

### 5. Station Detail (Bottom Sheet)
- Station name, address, status badge
- Mini map preview
- Stats row: Available count, Distance, Walk time
- Capacity progress bar
- "Get Directions" and "Rent Here" buttons
- "Notify me" option if empty

### 6. QR Scanner (`/scan`)
- Full-screen camera view with scan overlay
- Corner brackets overlay (not a full frame)
- "Point at station QR code" instruction text
- "Enter code manually" link at bottom
- Flashlight toggle
- Back button

### 7. Manual Code Entry (`/scan/manual`)
- 6-digit code input
- Clean numeric keypad or use device keyboard
- Verify button

### 8. Rent Confirmation (`/rent/confirm`)
- Station name & details
- Umbrella ID assignment
- Slot number
- Pricing info (₹10/hr, max ₹80/day)
- Selected payment method
- "Confirm Rental" button with haptic feedback

### 9. Rent Success (`/rent/success`)
- Checkmark animation (Lottie or Reanimated)
- "Umbrella unlocked!" message
- Rental details card (umbrella ID, station, slot, time)
- "View Rental" and "Back to Map" buttons

### 10. Return Scanner (`/return/scan`)
- Same as rent scanner but with "Return" context
- Shows which umbrella is being returned

### 11. Return Confirmation (`/return/confirm`)
- Return station details
- Duration & cost breakdown
- Payment summary
- "Confirm Return" button

### 12. Return Success (`/return/success`)
- Checkmark animation
- Receipt summary (duration, cost, stations)
- "Done" button

### 13. Activity (`/(tabs)/activity`)
- Active rental card at top (if exists) with live timer
- Rental history list
- Each item: umbrella ID, from → to stations, duration, cost, date
- Tap to see detail

### 14. Activity Detail (`/activity/[id]`)
- Full rental receipt view
- From/To stations with map
- Timeline visualization
- Duration, cost, payment method
- "Download Receipt" option

### 15. Wallet (`/(tabs)/wallet`)
- Balance card at top
- Payment methods list (cards, UPI)
- Add payment method button
- Transaction history
- Top up button

### 16. Add Payment (`/wallet/add`)
- Card / UPI / Wallet tabs
- Card form: number, expiry, CVV, name
- Clean form validation

### 17. Profile (`/(tabs)/profile`)
- Avatar area (initials or photo)
- Name, phone, email (editable)
- Settings section: Notifications, Dark Mode toggle, Language
- Support section: Help/FAQ, Contact, About
- Sign Out button
- App version at bottom

### 18. Help/FAQ (`/profile/help`)
- Accordion-style FAQ list
- Search FAQ
- Contact support link

## State Management (Zustand Store)
Port the existing store from the web app:
- Auth state (isAuthenticated, hasSeenOnboarding)
- User data
- Active rental
- Rental history
- Payment methods
- Scanned station ID (ephemeral)
- Persist to AsyncStorage/MMKV

## Mock Data
Port all mock data from the web app:
- 6 stations with coords, availability, status
- 5 completed rentals
- 3 payment methods
- Weather data
- FAQ data
- User data

## File Structure
```
app/
  _layout.tsx          # Root layout
  index.tsx            # Splash
  onboarding.tsx       # Onboarding
  auth.tsx             # Auth
  (tabs)/
    _layout.tsx        # Tab navigator
    map.tsx            # Map screen
    activity/
      index.tsx        # Activity list
      [id].tsx         # Activity detail
    wallet/
      index.tsx        # Wallet
      add.tsx          # Add payment
    profile/
      index.tsx        # Profile
      help.tsx         # Help/FAQ
  scan/
    index.tsx          # QR scanner
    manual.tsx         # Manual code
  rent/
    confirm.tsx        # Rent confirmation
    success.tsx        # Rent success
  return/
    scan.tsx           # Return scanner
    confirm.tsx        # Return confirmation
    success.tsx        # Return success
components/
  StationDetailSheet.tsx
  WeatherBanner.tsx
  RentalCard.tsx
  StationMarker.tsx
  ... (reusable components)
lib/
  store.ts
  mock-data.ts
  theme.ts            # Color tokens, spacing, typography
  utils.ts
```

## Key Interactions
- Haptic feedback on: confirm rental, confirm return, scan success, tab switch
- Pull-to-refresh on activity list
- Smooth bottom sheet (react-native-bottom-sheet or similar)
- Map camera animates to selected station
- Swipeable onboarding slides

## What NOT to do
- No emoji icons (☂️ 📍 💳 📱 etc.) in UI elements
- No rainbow color schemes
- No bouncy/playful animations
- No "Unlocked! 🔓" type text
- No colored shadows
- No rain drop animations
- No pulsing/breathing animations on static elements
- Keep it clean, professional, premium

## Reference
The original Next.js source is at `/Users/bot/Projects/umbrella-app/` — reference it for business logic and flow, but redesign the visuals completely.
