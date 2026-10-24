export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);
