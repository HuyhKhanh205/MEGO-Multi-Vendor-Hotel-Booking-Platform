export interface PasswordChecks { length: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean; }
export const getPasswordChecks = (value: string): PasswordChecks => ({ length: value.length >= 8, upper: /[A-Z]/.test(value), lower: /[a-z]/.test(value), number: /\d/.test(value), special: /[^A-Za-z0-9]/.test(value) });
