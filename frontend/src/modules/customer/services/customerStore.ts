import seed from "../data/dataCustomer.json";
import type { CustomerData } from "../types/customer.types";

const STORAGE_KEY = "mego.customer.data.v1";
const seedData = seed as unknown as CustomerData;

const isCustomerData = (value: unknown): value is CustomerData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<CustomerData>;
  return Boolean(data.customer && Array.isArray(data.bookings) && Array.isArray(data.wishlist)
    && Array.isArray(data.promoCodes) && Array.isArray(data.savedPaymentMethods)
    && Array.isArray(data.vouchers) && data.loyalty && data.bankTransferInfo);
};

const persist = (data: CustomerData): void => {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Storage may be disabled. */ }
};

export const loadCustomerData = (): CustomerData => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isCustomerData(parsed)) return parsed;
    }
  } catch { /* Corrupt local data falls back to the seed. */ }
  const initial = structuredClone(seedData);
  persist(initial);
  return initial;
};

let state = loadCustomerData();

export const readCustomerData = (): CustomerData => structuredClone(state);
export const updateCustomerData = <T,>(mutate: (data: CustomerData) => T): T => {
  const draft = structuredClone(state);
  const result = mutate(draft);
  state = draft;
  persist(state);
  return structuredClone(result);
};
export const resetCustomerData = (): CustomerData => {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be disabled. */ }
  state = structuredClone(seedData);
  persist(state);
  return structuredClone(state);
};
export const importCustomerData = (value: unknown): CustomerData => {
  if (!isCustomerData(value)) throw new Error("Tệp JSON không đúng cấu trúc dữ liệu MeGo.");
  state = structuredClone(value);
  persist(state);
  return structuredClone(state);
};
export const exportCustomerData = (): string => JSON.stringify(state, null, 2);
