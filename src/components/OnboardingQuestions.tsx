"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  Loader,
  User,
  TrendingUp,
  Target,
  Brain,
  Settings,
  Bot,
  Palette,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/hooks/useAuth";
import { realtimeDb as database} from "@/lib/firebase";
import { ref, set } from "firebase/database";
import { cn } from "@/lib/utils";

const onboardingQuestions = [
  {
    section: "Trading Identity",
    key: "tradingExperience",
    icon: User,
    question: "How would you describe your trading experience?",
    type: "multiple-choice",
    options: ["Beginner", "Intermediate", "Advanced", "Professional"],
  },
  {
    section: "Trading Identity",
    key: "markets",
    icon: Briefcase,
    question: "What markets do you trade most often?",
    type: "multiple-choice-multi",
    options: ["Forex", "Stocks", "Crypto", "Indices", "Commodities"],
  },
  {
    section: "Trading Identity",
    key: "platforms",
    icon: Palette,
    question: "Which platform(s) do you currently use to trade?",
    type: "text",
    placeholder: "e.g., MetaTrader, TradingView, Binance",
  },
  {
    section: "Trading Identity",
    key: "tradingDuration",
    icon: User,
    question: "How long have you been trading?",
    type: "multiple-choice",
    options: ["Less than 6 months", "1–2 years", "3–5 years", "5+ years"],
  },
  {
    section: "Goals and Motivation",
    key: "mainGoal",
    icon: Target,
    question: "What's your main goal with this trading journal?",
    type: "multiple-choice-multi",
    options: [
      "Track my performance",
      "Improve discipline",
      "Find my best setups",
      "Stay consistent",
      "Record ideas",
    ],
  },
  {
    section: "Goals and Motivation",
    key: "journalFrequency",
    icon: TrendingUp,
    question: "How often do you plan to journal your trades?",
    type: "multiple-choice",
    options: ["Every trade", "Daily", "Weekly", "Only on review days"],
  },
  {
    section: "Goals and Motivation",
    key: "hasStrategy",
    icon: TrendingUp,
    question: "Do you currently follow a trading strategy or system?",
    type: "multiple-choice",
    options: [
      "Yes, structured strategy",
      "Still testing ideas",
      "No, I trade intuitively",
    ],
  },
  {
    section: "Trading Mindset",
    key: "biggestStruggle",
    icon: Brain,
    question: "What's your biggest struggle as a trader right now?",
    type: "multiple-choice-multi",
    options: [
      "Patience",
      "Overtrading",
      "Risk management",
      "Consistency",
      "Fear of loss",
      "Lack of clarity",
    ],
  },
  {
    section: "Trading Mindset",
    key: "confidenceLevel",
    icon: Brain,
    question: "How confident do you feel in your trading process?",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    section: "Trading Mindset",
    key: "postLossFeeling",
    icon: Brain,
    question: "How do you usually feel after a losing trade?",
    type: "multiple-choice",
    options: [
      "Motivated to learn",
      "Frustrated",
      "Indifferent",
      "I stop trading for a while",
    ],
  },
  {
    section: "Personalization",
    key: "mainAssets",
    icon: Settings,
    question: "Which currency pairs or assets do you trade most?",
    type: "text",
    placeholder: "e.g., EUR/USD, BTC/USD, AAPL",
  },
  {
    section: "Personalization",
    key: "traderType",
    icon: Settings,
    question: "What kind of trader are you?",
    type: "multiple-choice",
    options: [
      "Scalper",
      "Day trader",
      "Swing trader",
      "Position trader",
      "Investor",
    ],
  },
  {
    section: "Personalization",
    key: "weeklySummary",
    icon: Settings,
    question: "Would you like to receive weekly performance summaries?",
    type: "multiple-choice",
    options: ["Yes", "No"],
  },
];

const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="w-full max-w-4xl text-center"
  >
    <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
      <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-white">
        Welcome to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          ForexPencil
        </span>
      </h1>
      <h2 className="text-3xl md:text-4xl font-light text-white/90">
        Hey {useAuth().user?.displayName || "there"} 👋
      </h2>
      <p className="text-xl md:text-2xl text-white/70 max-w-2xl">
        Let's get to know your trading style. This will take less than a minute
        and helps us personalize your experience.
      </p>
      <Button
        onClick={onComplete}
        size="lg"
        className="mt-8 px-10 py-6 text-xl font-medium bg-white text-slate-900 hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl"
      >
        Let's Start
        <ChevronRight className="ml-2 h-6 w-6" />
      </Button>
    </div>
  </motion.div>
);

const ThankYouScreen = ({ onComplete }: { onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full max-w-4xl"
  >
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-50"></div>
      <div className="relative p-10 md:p-16">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 mb-8">
          <Bot className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            ForexPencil
          </span>
        </h2>

        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          The journal built for traders who mean business.
        </p>

        <div className="space-y-6 text-white/70">
          <p className="text-lg leading-relaxed">
            Around here, we believe{" "}
            <span className="text-white font-semibold">
              focus and precision
            </span>{" "}
            beat <span className="text-sky-400/80 italic">hype and noise</span>.
            That's why we've stripped everything down to what truly matters —
            tracking your trades, seeing your progress clearly, and helping you
            stay locked in on the goal:{" "}
            <span className="text-white font-semibold">
              consistency and profit.
            </span>
          </p>

          <p className="text-lg leading-relaxed">
            You won't find flashy dashboards or distracting metrics here. Just{" "}
            <span className="text-white font-semibold">
              clean data, honest insights,
            </span>{" "}
            and tools that grow with you.
          </p>

          <div className="border-t border-white/10 pt-6 mt-8">
            <p className="text-lg leading-relaxed">
              Our team's already working on a few powerful additions —
              personalized chat support, direct connections to your trading
              platform, and our AI analyst,{" "}
              <span className="text-sky-400 font-semibold">Graphite</span>,
              built to help you sharpen your edge without losing focus.
            </p>

            <p className="text-lg font-medium text-white mt-6">
              Every click, every feature, every update — all built around one
              idea:
            </p>

            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mt-4">
              Make trading simpler, smarter, and distraction-free.
            </p>
          </div>

          <p className="text-base text-white/50 mt-8">
            Thanks for joining us early.
          </p>
        </div>

        <Button
          onClick={onComplete}
          size="lg"
          className="mt-10 px-8 py-4 text-lg font-medium bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          Let's build your edge — one focused trade at a time.
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  </motion.div>
);

export default function OnboardingQuestions() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const totalQuestions = onboardingQuestions.length;
  const progress =
    currentStep >= 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

  const handleNext = () => {
    if (currentStep < totalQuestions) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAnswer = (key: string, value: any, advance: boolean = false) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (advance) {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleMultiChoiceMultiAnswer = (key: string, value: string) => {
    const currentValues = answers[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setAnswers((prev) => ({ ...prev, [key]: newValues }));
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
      router.replace("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding data:", error);
      setIsSaving(false);
      // Optionally: show an error toast to the user
    }
  };

  const currentQuestion =
    currentStep >= 0 && currentStep < totalQuestions
      ? onboardingQuestions[currentStep]
      : null;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 w-full p-4 sm:p-8">
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
              className="w-full max-w-3xl mx-auto"
            >
              <div className="mb-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300">
                    <currentQuestion.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-lg font-medium text-sky-400">
                    {currentQuestion.section}
                  </p>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="min-h-[200px]">
                {currentQuestion.type === "multiple-choice" && (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleAnswer(currentQuestion.key, value, true)
                    }
                    className="space-y-3"
                  >
                    {currentQuestion.options?.map((option) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 * currentQuestion.options.indexOf(option),
                        }}
                      >
                        <RadioGroupItem
                          value={option}
                          id={option}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={option}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-lg text-white/80 transition-all hover:border-sky-500/50 hover:bg-white/10 cursor-pointer [&:has([data-state=checked])]:border-sky-500 [&:has([data-state=checked])]:bg-white/10 [&:has([data-state=checked])]:text-white"
                        >
                          {option}
                          <CheckCircle className="h-6 w-6 text-sky-400 opacity-0 transition-opacity [&:has([data-state=checked])_+_&]:opacity-100" />
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === "multiple-choice-multi" && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 * currentQuestion.options.indexOf(option),
                        }}
                      >
                        <Button
                          variant={
                            answers[currentQuestion.key]?.includes(option)
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleMultiChoiceMultiAnswer(
                              currentQuestion.key,
                              option
                            )
                          }
                          className={cn(
                            "w-full justify-start text-lg p-5 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all",
                            answers[currentQuestion.key]?.includes(option) &&
                              "border-sky-500 bg-white/10 text-white"
                          )}
                        >
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "text" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                  >
                    <Input
                      type="text"
                      placeholder={currentQuestion.placeholder}
                      onChange={(e) =>
                        handleAnswer(currentQuestion.key, e.target.value)
                      }
                      className="h-14 text-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-sky-500 focus:ring-sky-500 text-white placeholder:text-white/40 rounded-xl"
                      autoFocus
                    />
                  </form>
                )}

                {currentQuestion.type === "slider" && (
                  <div className="pt-4">
                    <Slider
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      step={1}
                      defaultValue={[5]}
                      onValueChange={(value) =>
                        handleAnswer(currentQuestion.key, value[0])
                      }
                      className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-sky-500"
                    />
                    <div className="mt-4 flex justify-between text-lg font-semibold text-white">
                      <span>{currentQuestion.min}</span>
                      <span className="text-2xl text-sky-400">
                        {answers[currentQuestion.key] || 5}
                      </span>
                      <span>{currentQuestion.max}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 flex items-center justify-end">
                {currentQuestion.type !== "multiple-choice" && (
                  <Button
                    onClick={handleNext}
                    size="lg"
                    disabled={!answers[currentQuestion.key]}
                    className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                  className="flex items-center gap-2 text-white/60"
                >
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              )}
            </AnimatePresence>
            {currentStep >= 0 && currentStep < totalQuestions && (
              <div className="w-full flex items-center gap-4">
                <span className="text-lg font-semibold text-white/80">
                  {currentStep + 1} / {totalQuestions}
                </span>
                <Progress
                  value={progress}
                  className="w-full h-3 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-sky-500 [&>*]:to-cyan-400"
                />
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
