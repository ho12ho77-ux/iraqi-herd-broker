import { useSyncExternalStore } from "react";

/** حالة محفوظة على هذا الجهاز فقط (نسخة المعاينة، قبل تفعيل الحسابات الحقيقية) */
function createLocalStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
  };
  const get = () => {
    load();
    return state;
  };
  const set = (next: T) => {
    state = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  };
  const useValue = () => useSyncExternalStore(subscribe, get, () => initial);
  return { get, set, useValue };
}

/* السلة: رقم الإعلان ← العدد المطلوب */
const cart = createLocalStore<Record<string, number>>("alwa.cart", {});
export const useCart = cart.useValue;
export function setCartItem(id: string, count: number) {
  cart.set({ ...cart.get(), [id]: Math.max(1, count) });
}
export function removeCartItem(id: string) {
  const next = { ...cart.get() };
  delete next[id];
  cart.set(next);
}

/* البائعون المتابَعون */
const follows = createLocalStore<string[]>("alwa.follows", []);
export const useFollows = follows.useValue;
export function toggleFollow(sellerId: string) {
  const cur = follows.get();
  follows.set(cur.includes(sellerId) ? cur.filter((x) => x !== sellerId) : [...cur, sellerId]);
}

/* تقييماتي للصفقات المكتملة */
export type MyRating = { stars: number; text: string };
const ratings = createLocalStore<Record<string, MyRating>>("alwa.ratings", {});
export const useMyRatings = ratings.useValue;
export function saveRating(dealId: string, r: MyRating) {
  ratings.set({ ...ratings.get(), [dealId]: r });
}
