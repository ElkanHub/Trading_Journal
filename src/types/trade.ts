export interface Trade {
  id: string;
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  entryTime: string;
  exitTime: string;
  profitLoss: number;
  profitLossPips: number;
  strategy: string;
  emotionalState: string;
  confidence: number;
  notes: string;
  tags: string[];
  riskRewardRatio: number;
  outcome: 'win' | 'loss' | 'breakeven';
}

export const initialTradeStats: TradeStats = {
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
  winRate: 0,
  totalProfit: 0,
  totalLoss: 0,
  netProfitLoss: 0,
  avgRiskReward: 0,
  bestTrade: 0,
  worstTrade: 0,
  avgWin: 0,
  avgLoss: 0,
};
