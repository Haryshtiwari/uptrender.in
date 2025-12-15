export const normalizeTradeType = (val) => {
  if (!val) return val;
  const s = String(val).toLowerCase();
  if (s === 'buy' || s === 'b') return 'Buy';
  if (s === 'sell' || s === 's') return 'Sell';
  // Fallback: titlecase
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
};

export const isBuy = (tradeOrType) => {
  const value = tradeOrType?.type || tradeOrType;
  return String(value).toLowerCase() === 'buy';
};

export const isSell = (tradeOrType) => {
  const value = tradeOrType?.type || tradeOrType;
  return String(value).toLowerCase() === 'sell';
};

export const formatTradeLabel = (trade) => {
  if (!trade) return '';
  const type = normalizeTradeType(trade.type || trade.tradeType);
  return type;
};

export default { normalizeTradeType, isBuy, isSell, formatTradeLabel };