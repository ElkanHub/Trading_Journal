import { Trade, TradeStats } from '@/types/trade';

export const calculateStats = (trades: Trade[]): TradeStats => {
  const winningTrades = trades.filter(t => t.outcome === 'win');
  const losingTrades = trades.filter(t => t.outcome === 'loss');
  
  const totalProfit = winningTrades.reduce((sum, t) => sum + t.profitLoss, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0));
  
  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    totalProfit,
    totalLoss,
    netProfitLoss: totalProfit - totalLoss,
    avgRiskReward: trades.length > 0 ? trades.reduce((sum, t) => sum + t.riskRewardRatio, 0) / trades.length : 0,
    bestTrade: trades.length > 0 ? Math.max(...trades.map(t => t.profitLoss)) : 0,
    worstTrade: trades.length > 0 ? Math.min(...trades.map(t => t.profitLoss)) : 0,
    avgWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
    avgLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
  };
};
