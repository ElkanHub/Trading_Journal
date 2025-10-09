import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="/">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Forex<span className="text-emerald-400">Pencil</span>
              </h3>
            </a>
            <p className="text-slate-400 text-sm">
              Professional trading journal for serious Forex traders. Track,
              analyze, and improve your trading performance.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Trade Tracking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Performance Reports
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Data Export
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Trading Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 flex justify-between items-center text-slate-400 text-sm">
          <p>
            © 2025 ForexPencil.Secure Journals. Built for traders, by traders.
          </p>
          <ThemeToggleButton />
        </div>
      </div>
    </footer>
  );
};

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
