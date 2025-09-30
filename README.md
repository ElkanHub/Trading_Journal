# Forex Trading Journal

A professional-grade web application for Forex traders to track, analyze, and improve their trading performance. Built with React, TypeScript, and Tailwind CSS with a modern dark theme optimized for trading professionals.

## 🚀 Features

### Core Functionality
- **Comprehensive Trade Logging**: Track all essential trade details including pair, direction, entry/exit prices, lot size, stop loss, take profit, timestamps, and more
- **Performance Analytics**: Real-time statistics showing win rate, total P/L, average risk/reward ratio, and performance breakdowns
- **Advanced Filtering**: Filter trades by currency pair, strategy, outcome, and date range
- **Psychology Tracking**: Record emotional state and confidence levels to identify behavioral patterns
- **Strategy Analysis**: Compare performance across different trading strategies
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### Dashboard Views
1. **Dashboard**: Overview with key statistics and recent trades
2. **All Trades**: Complete trade history with filtering and sorting
3. **Analytics**: Detailed performance breakdowns and insights

### UI/UX Highlights
- Dark mode interface with emerald green (profits) and red (losses) color coding
- Smooth animations and hover effects
- Intuitive navigation and modal-based forms
- Professional trading platform aesthetic

## 🔧 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **State Management**: React Hooks (useState)
- **Routing**: React Router DOM
- **Database Ready**: Prepared for Firebase/Supabase integration

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔥 Firebase Integration Guide

The application is architected with database integration in mind. Here's how to connect Firebase:

### Step 1: Install Firebase
```bash
npm install firebase
```

### Step 2: Create Firebase Config
Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Step 3: Create Firebase Hooks
Create `src/hooks/useTrades.ts`:
```typescript
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trade } from '@/types/trade';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = async () => {
    const querySnapshot = await getDocs(collection(db, 'trades'));
    const tradesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Trade[];
    setTrades(tradesData);
    setLoading(false);
  };

  const addTrade = async (trade: Omit<Trade, 'id'>) => {
    const docRef = await addDoc(collection(db, 'trades'), trade);
    setTrades([{ ...trade, id: docRef.id }, ...trades]);
  };

  const deleteTrade = async (id: string) => {
    await deleteDoc(doc(db, 'trades', id));
    setTrades(trades.filter(t => t.id !== id));
  };

  return { trades, loading, addTrade, deleteTrade };
};
```

### Step 4: Update AppLayout.tsx
Replace the useState line with:
```typescript
const { trades, loading, addTrade, deleteTrade } = useTrades();
```

## 📊 Data Structure

### Trade Interface
```typescript
interface Trade {
  id: string;
  pair: string;              // e.g., "EUR/USD"
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  entryTime: string;
  exitTime: string;
  profitLoss: number;        // in currency
  profitLossPips: number;    // in pips
  strategy: string;
  emotionalState: string;
  confidence: number;        // 1-10
  notes: string;
  tags: string[];
  riskRewardRatio: number;
  outcome: 'win' | 'loss' | 'breakeven';
}
```

## 🎨 Customization

### Colors
The app uses Tailwind's color system. Key colors:
- **Profits**: `emerald-500`, `emerald-600`
- **Losses**: `red-500`, `red-600`
- **Background**: `slate-900`, `slate-800`
- **Text**: `white`, `slate-300`, `slate-400`

### Adding New Currency Pairs
Edit `src/components/AddTradeForm.tsx` and add to the select options:
```typescript
<option>YOUR/PAIR</option>
```

## 📱 Mobile Optimization

The app is fully responsive with:
- Collapsible navigation on mobile
- Touch-optimized buttons and inputs
- Responsive grid layouts
- Mobile-friendly tables with horizontal scroll

## 🔒 Security Considerations

When integrating Firebase:
1. Enable Firebase Authentication for user-specific data
2. Set up Firestore security rules
3. Use environment variables for API keys
4. Implement user authentication before accessing trades

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Chart screenshot uploads
- [ ] Export to CSV/PDF
- [ ] Advanced charting with equity curves
- [ ] Trade journaling with rich text editor
- [ ] Performance comparison tools
- [ ] Mobile app version
- [ ] Real-time price data integration

## 📄 License

MIT License - feel free to use this for your trading journey!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Forex traders who take their craft seriously.
