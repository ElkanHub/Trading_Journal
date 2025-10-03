export interface Trade {
  id: string;
  pair: string;
  direction: 'long' | 'short';
  entryPrice: number;
  entryTime: string;
  exitTime: string;
  strategy: string;
  emotionalState: string;
  confidence: number;
  notes: string;
  tags: string[];
  outcome: 'win' | 'loss' | 'breakeven';
  profit?: number;
  loss?: number;
  netProfit: number;
}

export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfitLoss: number;
  avgRiskReward: number;
  bestTrade: number;
  worstTrade: number;
  avgWin: number;
  avgLoss: number;
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
