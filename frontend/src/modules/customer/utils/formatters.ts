export const formatVnd = (amount: number): string => `${new Intl.NumberFormat("vi-VN").format(amount)} ₫`;
export const formatDate = (value: string): string => value ? new Intl.DateTimeFormat("vi-VN").format(new Date(`${value.slice(0, 10)}T00:00:00`)) : "—";
