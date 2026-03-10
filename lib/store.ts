import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  type Rental,
  type User,
  type PaymentMethod,
  mockUser,
  mockPaymentMethods,
  mockRentals,
} from './mock-data';

export type ActiveRental = {
  id: string;
  umbrellaId: string;
  stationFrom: string;
  stationFromId: string;
  slot: number;
  startTime: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  icon: string;
  time: string;
  read: boolean;
};

export type DamageReport = {
  rentalId: string;
  issueType: string;
  notes?: string;
};

type AppStore = {
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  user: User;
  activeRental: ActiveRental | null;
  rentalHistory: Rental[];
  paymentMethods: PaymentMethod[];
  defaultPaymentMethodId: string;
  scannedStationId: string | null;
  returnStationId: string | null;
  favoriteStationIds: string[];
  notifications: Notification[];
  damageReports: DamageReport[];
  pendingRating: boolean;

  setAuthenticated: (v: boolean) => void;
  setHasSeenOnboarding: (v: boolean) => void;
  setUser: (u: User) => void;
  startRental: (rental: ActiveRental) => void;
  endRental: (stationTo: string, cost: number) => void;
  setScannedStationId: (id: string | null) => void;
  setReturnStationId: (id: string | null) => void;
  addPaymentMethod: (pm: PaymentMethod) => void;
  setDefaultPaymentMethod: (id: string) => void;
  removePaymentMethod: (id: string) => void;
  toggleFavoriteStation: (id: string) => void;
  markNotificationRead: (id: string) => void;
  addDamageReport: (report: DamageReport) => void;
  rateRental: (rentalId: string, rating: number) => void;
  setPendingRating: (v: boolean) => void;
};

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'Rental Duration Alert',
    body: 'Your rental is about to exceed 2 hours. Return soon to save!',
    icon: 'time-outline',
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 'n2',
    title: 'Rain Alert ☔',
    body: 'Heavy rain expected in your area — grab an umbrella!',
    icon: 'rainy-outline',
    time: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: 'n3',
    title: 'New Station Nearby',
    body: 'A new RainCheck station opened near you at Metro Bus Terminal!',
    icon: 'location-outline',
    time: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: 'n4',
    title: 'Promo Credit Added',
    body: 'You received ₹10 promo credit. Happy renting!',
    icon: 'gift-outline',
    time: new Date(Date.now() - 172800000).toISOString(),
    read: true,
  },
];

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasSeenOnboarding: false,
      user: mockUser,
      activeRental: null,
      rentalHistory: mockRentals,
      paymentMethods: mockPaymentMethods,
      defaultPaymentMethodId: 'pm1',
      scannedStationId: null,
      returnStationId: null,
      favoriteStationIds: [],
      notifications: mockNotifications,
      damageReports: [],
      pendingRating: false,

      setAuthenticated: (v) => set({ isAuthenticated: v }),
      setHasSeenOnboarding: (v) => set({ hasSeenOnboarding: v }),
      setUser: (u) => set({ user: u }),

      startRental: (rental) => set({ activeRental: rental }),

      endRental: (stationTo, cost) => {
        const { activeRental, rentalHistory } = get();
        if (!activeRental) return;

        const durationMs = Date.now() - activeRental.startTime;
        const hours = Math.floor(durationMs / 3600000);
        const mins = Math.floor((durationMs % 3600000) / 60000);
        const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        const completedRental: Rental = {
          id: activeRental.id,
          umbrellaId: activeRental.umbrellaId,
          stationFrom: activeRental.stationFrom,
          stationTo,
          startTime: new Date(activeRental.startTime).toISOString(),
          endTime: new Date().toISOString(),
          duration,
          cost,
          status: 'completed',
          slot: activeRental.slot,
        };

        set({
          activeRental: null,
          rentalHistory: [completedRental, ...rentalHistory],
          pendingRating: true,
        });
      },

      setScannedStationId: (id) => set({ scannedStationId: id }),
      setReturnStationId: (id) => set({ returnStationId: id }),

      addPaymentMethod: (pm) =>
        set((state) => ({ paymentMethods: [...state.paymentMethods, pm] })),

      setDefaultPaymentMethod: (id) => set({ defaultPaymentMethodId: id }),

      removePaymentMethod: (id) =>
        set((state) => ({
          paymentMethods: state.paymentMethods.filter((pm) => pm.id !== id),
        })),

      toggleFavoriteStation: (id) =>
        set((state) => ({
          favoriteStationIds: state.favoriteStationIds.includes(id)
            ? state.favoriteStationIds.filter((fid) => fid !== id)
            : [...state.favoriteStationIds, id],
        })),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      addDamageReport: (report) =>
        set((state) => ({ damageReports: [...state.damageReports, report] })),

      rateRental: (rentalId, rating) =>
        set((state) => ({
          rentalHistory: state.rentalHistory.map((r) =>
            r.id === rentalId ? { ...r, rating } : r
          ),
          pendingRating: false,
        })),

      setPendingRating: (v) => set({ pendingRating: v }),
    }),
    {
      name: 'umbrella-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasSeenOnboarding: state.hasSeenOnboarding,
        user: state.user,
        activeRental: state.activeRental,
        rentalHistory: state.rentalHistory,
        paymentMethods: state.paymentMethods,
        defaultPaymentMethodId: state.defaultPaymentMethodId,
        favoriteStationIds: state.favoriteStationIds,
      }),
    }
  )
);
