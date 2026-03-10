export type Station = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  available: number;
  total: number;
  distance: string;
  walkTime: string;
  status: 'available' | 'low' | 'empty';
  slots: number;
};

export type Rental = {
  id: string;
  umbrellaId: string;
  stationFrom: string;
  stationTo?: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  cost?: number;
  status: 'active' | 'completed';
  slot?: number;
  rating?: number;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  label: string;
  last4?: string;
  isDefault: boolean;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  balance: number;
};

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Chen',
  phone: '+1 (555) 234-5678',
  email: 'alex.chen@example.com',
  balance: 25.5,
};

export const mockStations: Station[] = [
  {
    id: 's1',
    name: 'Central Station Hub',
    address: '123 Main St, Downtown',
    lat: 40.7128,
    lng: -74.006,
    available: 8,
    total: 12,
    distance: '0.1 km',
    walkTime: '2 min',
    status: 'available',
    slots: 12,
  },
  {
    id: 's2',
    name: 'City Park Entrance',
    address: '456 Park Ave, Midtown',
    lat: 40.7138,
    lng: -74.007,
    available: 2,
    total: 10,
    distance: '0.3 km',
    walkTime: '4 min',
    status: 'low',
    slots: 10,
  },
  {
    id: 's3',
    name: 'Riverside Mall',
    address: '789 River Rd, Westside',
    lat: 40.7118,
    lng: -74.005,
    available: 0,
    total: 8,
    distance: '0.5 km',
    walkTime: '7 min',
    status: 'empty',
    slots: 8,
  },
  {
    id: 's4',
    name: 'Tech Campus East',
    address: '321 Innovation Blvd',
    lat: 40.7148,
    lng: -74.008,
    available: 6,
    total: 8,
    distance: '0.7 km',
    walkTime: '9 min',
    status: 'available',
    slots: 8,
  },
  {
    id: 's5',
    name: 'Grand Plaza',
    address: '555 Grand Blvd, Financial District',
    lat: 40.7108,
    lng: -74.009,
    available: 4,
    total: 10,
    distance: '0.9 km',
    walkTime: '12 min',
    status: 'available',
    slots: 10,
  },
  {
    id: 's6',
    name: 'Metro Bus Terminal',
    address: '88 Transit Way',
    lat: 40.7158,
    lng: -74.004,
    available: 1,
    total: 6,
    distance: '1.2 km',
    walkTime: '15 min',
    status: 'low',
    slots: 6,
  },
];

export const mockRentals: Rental[] = [
  {
    id: 'r1',
    umbrellaId: 'UMB-4821',
    stationFrom: 'Central Station Hub',
    stationTo: 'City Park Entrance',
    startTime: '2024-01-15T09:30:00Z',
    endTime: '2024-01-15T11:45:00Z',
    duration: '2h 15m',
    cost: 22.5,
    status: 'completed',
    slot: 3,
  },
  {
    id: 'r2',
    umbrellaId: 'UMB-7734',
    stationFrom: 'Grand Plaza',
    stationTo: 'Tech Campus East',
    startTime: '2024-01-12T14:00:00Z',
    endTime: '2024-01-12T15:30:00Z',
    duration: '1h 30m',
    cost: 15.0,
    status: 'completed',
    slot: 7,
  },
  {
    id: 'r3',
    umbrellaId: 'UMB-2290',
    stationFrom: 'Riverside Mall',
    stationTo: 'Metro Bus Terminal',
    startTime: '2024-01-08T16:20:00Z',
    endTime: '2024-01-08T17:50:00Z',
    duration: '1h 30m',
    cost: 15.0,
    status: 'completed',
    slot: 2,
  },
  {
    id: 'r4',
    umbrellaId: 'UMB-5519',
    stationFrom: 'City Park Entrance',
    stationTo: 'Grand Plaza',
    startTime: '2023-12-28T11:00:00Z',
    endTime: '2023-12-28T12:10:00Z',
    duration: '1h 10m',
    cost: 10.0,
    status: 'completed',
    slot: 5,
  },
  {
    id: 'r5',
    umbrellaId: 'UMB-3301',
    stationFrom: 'Tech Campus East',
    stationTo: 'Central Station Hub',
    startTime: '2023-12-20T08:45:00Z',
    endTime: '2023-12-20T10:15:00Z',
    duration: '1h 30m',
    cost: 15.0,
    status: 'completed',
    slot: 1,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'card',
    label: 'Visa ending in 4242',
    last4: '4242',
    isDefault: true,
  },
  {
    id: 'pm2',
    type: 'card',
    label: 'Mastercard ending in 8888',
    last4: '8888',
    isDefault: false,
  },
  {
    id: 'pm3',
    type: 'upi',
    label: 'alex@upi',
    isDefault: false,
  },
];

export const mockTransactions = [
  { id: 't1', date: 'Jan 15', description: 'Rental #r1', amount: -22.5, type: 'charge' },
  { id: 't2', date: 'Jan 12', description: 'Rental #r2', amount: -15.0, type: 'charge' },
  { id: 't3', date: 'Jan 10', description: 'Top Up', amount: 50.0, type: 'credit' },
  { id: 't4', date: 'Jan 8', description: 'Rental #r3', amount: -15.0, type: 'charge' },
  { id: 't5', date: 'Dec 28', description: 'Rental #r4', amount: -10.0, type: 'charge' },
  { id: 't6', date: 'Dec 20', description: 'Promo Credit', amount: 10.0, type: 'credit' },
];

export const mockWeather = {
  condition: 'Rainy',
  temp: '18°C',
  alert: 'Heavy rain expected in 20 min',
  alertLevel: 'warning' as 'info' | 'warning' | 'danger',
};

export const mockFAQs = [
  {
    id: 'f1',
    question: 'How do I rent an umbrella?',
    answer:
      'Find a nearby station on the map, tap "Rent from Here", scan the QR code on the station, and confirm your rental. The slot will open automatically.',
  },
  {
    id: 'f2',
    question: 'How much does it cost?',
    answer:
      'Rentals are priced at ₹10/hour with a maximum of ₹80/day. You are only charged for the time you use the umbrella.',
  },
  {
    id: 'f3',
    question: 'Where can I return the umbrella?',
    answer:
      'You can return the umbrella to any station in our network, not just where you rented from. The app will show you the nearest available return stations.',
  },
  {
    id: 'f4',
    question: 'What if a station is full and I cannot return?',
    answer:
      'If a station is full, you will not be charged while waiting. The app will find the next closest station with available slots.',
  },
  {
    id: 'f5',
    question: 'What if the QR code does not scan?',
    answer:
      "Tap 'Enter code manually' on the scanner screen. You will find the 6-digit code printed on the station above the QR code.",
  },
  {
    id: 'f6',
    question: 'What if I lose the umbrella?',
    answer:
      'If an umbrella is not returned within 24 hours, a replacement fee of ₹800 will be charged to your default payment method.',
  },
  {
    id: 'f7',
    question: 'How do I add a payment method?',
    answer:
      'Go to Wallet tab → Add Payment Method. We support credit/debit cards, UPI, and digital wallets.',
  },
];
