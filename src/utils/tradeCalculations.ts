import { Trade, TradeStats } from "@/types/trade";

export function calculateStats(trades: Trade[]): TradeStats {
  const winningTrades = trades.filter((trade) => trade.outcome === "win");
  const losingTrades = trades.filter((trade) => trade.outcome === "loss");
  const totalTrades = trades.length;

  const winRate =
    totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;

  const totalProfit = winningTrades.reduce(
    (acc, trade) => acc + trade.netProfit,
    0
  );
  // note: losses are stored negative in netProfit, so take absolute
  const totalLoss = losingTrades.reduce(
    (acc, trade) => acc + Math.abs(trade.netProfit),
    0
  );

  const netProfitLoss = totalProfit - totalLoss;

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
    avgRiskReward: 0, // Removed for now
    bestTrade: 0, // Removed for now
    worstTrade: 0, // Removed for now
    avgWin,
    avgLoss,
  };
}
