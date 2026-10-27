export const formatINR = (amount: number, showDecimals: boolean = true): string => {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = absAmount.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
};
