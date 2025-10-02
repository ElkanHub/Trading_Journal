import { Trade, TradeStats } from '@/types/trade';

export function calculateStats(trades: Trade[]): TradeStats {
  const winningTrades = trades.filter((trade) => trade.outcome === 'win').length;
  const losingTrades = trades.filter((trade) => trade.outcome === 'loss').length;
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const totalProfit = trades
    .filter((trade) => trade.outcome === 'win')
    .reduce((acc, trade) => acc + trade.profitLoss, 0);

  const totalLoss = trades
    .filter((trade) => trade.outcome === 'loss')
    .reduce((acc, trade) => acc + trade.profitLoss, 0);

  const netProfitLoss = totalProfit - totalLoss;

  return {
    winningTrades,
    losingTrades,
    totalTrades,
    winRate,
    totalProfit,
    totalLoss,
    netProfitLoss,
  };
}