import { Trade, TradeStats } from "@/types/trade";

export function calculateStats(trades: Trade[]): TradeStats {
  const winningTrades = trades.filter((trade) => trade.outcome === "win");
  const losingTrades = trades.filter((trade) => trade.outcome === "loss");
  const totalTrades = trades.length;

  const winRate =
    totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const totalProfit = winningTrades.reduce(
    (acc, trade) => acc + (trade.profit || 0),
    0
  );
  const totalLoss = losingTrades.reduce(
    (acc, trade) => acc + (trade.loss || 0),
    0
  );

  const netProfitLoss = totalProfit - totalLoss;

  const bestTrade =
    winningTrades.length > 0 ? Math.max(...winningTrades.map((t) => t.profit || 0)) : 0;
  const worstTrade =
    losingTrades.length > 0 ? Math.max(...losingTrades.map((t) => t.loss || 0)) : 0;

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
    avgRiskReward: 0, // No longer used
    bestTrade,
    worstTrade,
    avgWin,
    avgLoss,
  };
}
