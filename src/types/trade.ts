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
