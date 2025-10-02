import { Trade, TradeStats } from "@/types/trade";

export function calculateStats(trades: Trade[]): TradeStats {
  const winningTrades = trades.filter((trade) => trade.outcome === "win");
  const losingTrades = trades.filter((trade) => trade.outcome === "loss");
  const totalTrades = trades.length;

  const winRate =
    totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const totalProfit = winningTrades.reduce(
    (acc, trade) => acc + trade.profitLoss,
    0
  );
  // note: losses are stored negative in profitLoss, so take absolute
  const totalLoss = losingTrades.reduce(
    (acc, trade) => acc + Math.abs(trade.profitLoss),
    0
  );

  const netProfitLoss = totalProfit - totalLoss;

  const avgRiskReward =
    trades.length > 0
      ? trades.reduce((sum, t) => sum + (t.riskRewardRatio || 0), 0) /
        trades.length
      : 0;

  const bestTrade =
    trades.length > 0 ? Math.max(...trades.map((t) => t.profitLoss)) : 0;
  const worstTrade =
    trades.length > 0 ? Math.min(...trades.map((t) => t.profitLoss)) : 0;

  const avgWin =
    winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
  const avgLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;

  return {
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    totalProfit,
    totalLoss,
    netProfitLoss,
    avgRiskReward,
    bestTrade,
    worstTrade,
    avgWin,
    avgLoss,
  };
}
