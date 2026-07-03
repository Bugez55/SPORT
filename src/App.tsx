import { useState } from "react";
import {
  BookOpen,
  Dumbbell,
  Download,
  LayoutDashboard,
  ListChecks,
  RotateCcw,
  Scale,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { StoreProvider, useStore } from "./store";
import { Dashboard } from "./components/Dashboard";
import { DailyTracker } from "./components/DailyTracker";
import { WeightTracker } from "./components/WeightTracker";
import { MonthlyGoals } from "./components/MonthlyGoals";
import { Resources } from "./components/Resources";
import { exportToExcel } from "./lib/export";
import { cn } from "./utils/cn";

const TABS = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "daily", label: "Suivi quotidien", icon: ListChecks },
  { id: "weight", label: "Poids", icon: Scale },
  { id: "goals", label: "Objectifs", icon: Trophy },
  { id: "program", label: "Programme", icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { startDate, setStartDate, startWeight, setStartWeight } = useStore();
  const [date, setDate] = useState(startDate);
  const [weight, setWeight] = useState(String(startWeight));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1623] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Settings className="h-5 w-5 text-emerald-300" /> Réglages
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">
              Date de début du programme
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-emerald-400/40 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Poids de départ (kg)</span>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-emerald-400/40 focus:outline-none"
            />
          </label>
          <button
            onClick={() => {
              const w = parseFloat(weight);
              setStartDate(date);
              if (w && w > 0) setStartWeight(w);
              onClose();
            }}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const store = useStore();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0e17] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.06),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl px-4 pb-20">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30">
              <Dumbbell className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight text-white sm:text-2xl">
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                  TRANSFORMATION
                </span>{" "}
                <span className="text-white">1 AN</span>
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Santé · Anglais · E-commerce · Algérie 🇩🇿
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10"
              aria-label="Réglages"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => store.resetAll()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition hover:bg-red-500/10 hover:text-red-300"
              aria-label="Réinitialiser"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                exportToExcel(
                  store.dayLogs,
                  store.weightEntries,
                  store.monthGoals,
                  store.startWeight
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-3.5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="sticky top-0 z-30 -mx-4 mb-5 flex gap-1.5 overflow-x-auto bg-[#0a0e17]/80 px-4 py-3 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <main>
          {tab === "dashboard" && <Dashboard onNavigate={(id) => setTab(id as TabId)} />}
          {tab === "daily" && <DailyTracker />}
          {tab === "weight" && <WeightTracker />}
          {tab === "goals" && <MonthlyGoals />}
          {tab === "program" && <Resources />}
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-500">
          Tes données sont sauvegardées automatiquement sur cet appareil.
          <br />
          Pense à exporter régulièrement ton fichier Excel. 💪
        </footer>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
