'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Loader, User, TrendingUp, Target, Brain, Settings, Bot, Palette, Briefcase } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/hooks/useAuth';
import { database } from '@/lib/firebase';
import { ref, set } from 'firebase/database';
import { cn } from '@/lib/utils';

const onboardingQuestions = [
    {
        section: 'Trading Identity',
        key: 'tradingExperience',
        icon: User,
        question: 'How would you describe your trading experience?',
        type: 'multiple-choice',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    },
    {
        section: 'Trading Identity',
        key: 'markets',
        icon: Briefcase,
        question: 'What markets do you trade most often?',
        type: 'multiple-choice-multi',
        options: ['Forex', 'Stocks', 'Crypto', 'Indices', 'Commodities'],
    },
    {
        section: 'Trading Identity',
        key: 'platforms',
        icon: Palette,
        question: 'Which platform(s) do you currently use to trade?',
        type: 'text',
        placeholder: 'e.g., MetaTrader, TradingView, Binance',
    },
    {
        section: 'Trading Identity',
        key: 'tradingDuration',
        icon: User,
        question: 'How long have you been trading?',
        type: 'multiple-choice',
        options: ['Less than 6 months', '1–2 years', '3–5 years', '5+ years'],
    },
    {
        section: 'Goals and Motivation',
        key: 'mainGoal',
        icon: Target,
        question: 'What’s your main goal with this trading journal?',
        type: 'multiple-choice-multi',
        options: ['Track my performance', 'Improve discipline', 'Find my best setups', 'Stay consistent', 'Record ideas'],
    },
    {
        section: 'Goals and Motivation',
        key: 'journalFrequency',
        icon: TrendingUp,
        question: 'How often do you plan to journal your trades?',
        type: 'multiple-choice',
        options: ['Every trade', 'Daily', 'Weekly', 'Only on review days'],
    },
    {
        section: 'Goals and Motivation',
        key: 'hasStrategy',
        icon: TrendingUp,
        question: 'Do you currently follow a trading strategy or system?',
        type: 'multiple-choice',
        options: ['Yes, structured strategy', 'Still testing ideas', 'No, I trade intuitively'],
    },
    {
        section: 'Trading Mindset',
        key: 'biggestStruggle',
        icon: Brain,
        question: 'What’s your biggest struggle as a trader right now?',
        type: 'multiple-choice-multi',
        options: ['Patience', 'Overtrading', 'Risk management', 'Consistency', 'Fear of loss', 'Lack of clarity'],
    },
    {
        section: 'Trading Mindset',
        key: 'confidenceLevel',
        icon: Brain,
        question: 'How confident do you feel in your trading process?',
        type: 'slider',
        min: 1,
        max: 10,
    },
    {
        section: 'Trading Mindset',
        key: 'postLossFeeling',
        icon: Brain,
        question: 'How do you usually feel after a losing trade?',
        type: 'multiple-choice',
        options: ['Motivated to learn', 'Frustrated', 'Indifferent', 'I stop trading for a while'],
    },
    {
        section: 'Personalization',
        key: 'mainAssets',
        icon: Settings,
        question: 'Which currency pairs or assets do you trade most?',
        type: 'text',
        placeholder: 'e.g., EUR/USD, BTC/USD, AAPL',
    },
    {
        section: 'Personalization',
        key: 'traderType',
        icon: Settings,
        question: 'What kind of trader are you?',
        type: 'multiple-choice',
        options: ['Scalper', 'Day trader', 'Swing trader', 'Position trader', 'Investor'],
    },
    {
        section: 'Personalization',
        key: 'weeklySummary',
        icon: Settings,
        question: 'Would you like to receive weekly performance summaries?',
        type: 'multiple-choice',
        options: ['Yes', 'No'],
    },
];

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl text-center"
    >
        <h1 className="text-4xl font-bold tracking-tight">
            Hey {useAuth().user?.displayName || 'there'} 👋, let’s get to know your trading style.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">This will take less than a minute and helps us personalize your experience.</p>
        <Button onClick={onComplete} size="lg" className="mt-8">
            Let's Start
            <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
    </motion.div>
);

const ThankYouScreen = ({ onComplete }: { onComplete: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl text-left bg-gradient-to-br from-background to-slate-900/50 p-8 rounded-2xl border border-slate-800"
    >
        <Bot className="w-12 h-12 mb-6 text-sky-400" />
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
            Welcome to ForexPencil — the journal built for traders who mean business.
        </h2>
        <p className="mt-6 text-lg text-slate-400">
            Around here, we believe <strong className="text-slate-200">focus and precision</strong> beat <i className="text-sky-400/80">hype and noise</i>. That’s why we’ve stripped everything down to what truly matters — tracking your trades, seeing your progress clearly, and helping you stay locked in on the goal: <strong className="text-slate-200">consistency and profit.</strong>
        </p>
        <p className="mt-4 text-lg text-slate-400">
            You won’t find flashy dashboards or distracting metrics here. Just <strong className="text-slate-200">clean data, honest insights,</strong> and tools that grow with you.
        </p>
        <div className="mt-6 border-t border-slate-800 pt-6">
            <p className="text-md text-slate-500">
                Our team’s already working on a few powerful additions — personalized chat support, direct connections to your trading platform, and our AI analyst, <b className="text-sky-400">Graphite</b>, built to help you sharpen your edge without losing focus.
            </p>
            <p className="mt-4 font-semibold text-slate-300">
                Every click, every feature, every update — all built around one idea:
                <br />
                <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">make trading simpler, smarter, and distraction-free.</span>
            </p>
        </div>
        <p className="mt-6 text-sm text-slate-500">Thanks for joining us early.</p>
        <Button onClick={onComplete} size="lg" className="mt-8 w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white">
            Let’s build your edge — one focused trade at a time.
            <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
    </motion.div>
);


export default function OnboardingQuestions() {
    const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const totalQuestions = onboardingQuestions.length;
    const progress = currentStep >= 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

    const handleNext = () => {
        if (currentStep < totalQuestions) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleAnswer = (key: string, value: any, advance: boolean = false) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
        if (advance) {
            setTimeout(() => handleNext(), 300);
        }
    };

    const handleMultiChoiceMultiAnswer = (key: string, value: string) => {
        const currentValues = answers[key] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v: string) => v !== value)
            : [...currentValues, value];
        setAnswers(prev => ({ ...prev, [key]: newValues }));
    };

    const handleFinish = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const onboardingRef = ref(database, `users/${user.uid}/onboarding`);
            await set(onboardingRef, {
                ...answers,
                completedAt: new Date().toISOString(),
            });
            router.replace('/dashboard');
        } catch (error) {
            console.error("Failed to save onboarding data:", error);
            setIsSaving(false);
            // Optionally: show an error toast to the user
        }
    };

    const currentQuestion = currentStep >= 0 && currentStep < totalQuestions ? onboardingQuestions[currentStep] : null;

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-sky-950 via-slate-900 to-black p-4 sm:p-8">
            <AnimatePresence mode="wait">
                {currentStep === -1 && (
                    <WelcomeScreen key="welcome" onComplete={() => setCurrentStep(0)} />
                )}

                {currentQuestion && (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full max-w-2xl"
                    >
                        <div className="mb-8 text-left">
                            <div className="flex items-center gap-3">
                                <currentQuestion.icon className="h-6 w-6 text-sky-400" />
                                <p className="text-lg font-medium text-sky-400">{currentQuestion.section}</p>
                            </div>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        <div className="min-h-[200px]">
                            {currentQuestion.type === 'multiple-choice' && (
                                <RadioGroup
                                    onValueChange={(value) => handleAnswer(currentQuestion.key, value, true)}
                                    className="space-y-3"
                                >
                                    {currentQuestion.options.map((option) => (
                                        <motion.div
                                            key={option}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * currentQuestion.options.indexOf(option) }}
                                        >
                                            <RadioGroupItem value={option} id={option} className="sr-only" />
                                            <Label
                                                htmlFor={option}
                                                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-lg text-slate-200 transition-all hover:border-sky-500 hover:bg-slate-800 cursor-pointer [&:has([data-state=checked])]:border-sky-500 [&:has([data-state=checked])]:ring-2 [&:has([data-state=checked])]:ring-sky-500/50"
                                            >
                                                {option}
                                                <CheckCircle className="h-6 w-6 text-sky-500 opacity-0 transition-opacity [&:has([data-state=checked])_+_&]:opacity-100" />
                                            </Label>
                                        </motion.div>
                                    ))}
                                </RadioGroup>
                            )}

                            {currentQuestion.type === 'multiple-choice-multi' && (
                                <div className="space-y-3">
                                    {currentQuestion.options.map((option) => (
                                        <motion.div
                                            key={option}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * currentQuestion.options.indexOf(option) }}
                                        >
                                            <Button
                                                variant={answers[currentQuestion.key]?.includes(option) ? 'default' : 'outline'}
                                                onClick={() => handleMultiChoiceMultiAnswer(currentQuestion.key, option)}
                                                className={cn(
                                                    "w-full justify-start text-lg p-6 border-slate-700 bg-slate-800/50 hover:bg-slate-800",
                                                    answers[currentQuestion.key]?.includes(option) && "border-sky-500 ring-2 ring-sky-500/50 bg-slate-800"
                                                )}
                                            >
                                                {option}
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === 'text' && (
                                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                                    <Input
                                        type="text"
                                        placeholder={currentQuestion.placeholder}
                                        onChange={(e) => handleAnswer(currentQuestion.key, e.target.value)}
                                        className="h-14 text-xl bg-slate-800 border-slate-700 focus:border-sky-500 focus:ring-sky-500"
                                        autoFocus
                                    />
                                </form>
                            )}

                            {currentQuestion.type === 'slider' && (
                                <div className="pt-4">
                                    <Slider
                                        min={currentQuestion.min}
                                        max={currentQuestion.max}
                                        step={1}
                                        defaultValue={[5]}
                                        onValueChange={(value) => handleAnswer(currentQuestion.key, value[0])}
                                        className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                                    />
                                    <div className="mt-4 flex justify-between text-lg font-semibold text-slate-300">
                                        <span>{currentQuestion.min}</span>
                                        <span className="text-2xl text-sky-400">{answers[currentQuestion.key] || 5}</span>
                                        <span>{currentQuestion.max}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex items-center justify-end">
                            {currentQuestion.type !== 'multiple-choice' && (
                                <Button onClick={handleNext} size="lg" disabled={!answers[currentQuestion.key]}>
                                    OK <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}

                {currentStep === totalQuestions && (
                    <ThankYouScreen key="thankyou" onComplete={handleFinish} />
                )}
            </AnimatePresence>

            <footer className="absolute bottom-0 left-0 w-full p-8">
                <div className="flex items-center justify-between">
                    <AnimatePresence>
                        {isSaving && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-slate-400"
                            >
                                <Loader className="h-5 w-5 animate-spin" />
                                <span>Saving...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {currentStep >= 0 && currentStep < totalQuestions && (
                        <div className="w-full flex items-center gap-4">
                            <span className="text-lg font-semibold text-slate-300">{currentStep + 1} / {totalQuestions}</span>
                            <Progress value={progress} className="w-full h-3 [&>*]:bg-sky-500" />
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}
