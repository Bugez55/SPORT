import {
  ArrowRight,
  CalendarCheck,
  Droplets,
  Flame,
  Languages,
  ListChecks,
  Scale,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { useStore } from "../store";
import { Card, ProgressBar, ProgressRing, StatCard } from "./ui";
import { WeightChart } from "./WeightChart";
import {
  GOAL_WEIGHT,
  QUOTES,
  TASKS,
  WATER_TARGET,
} from "../data/program";
import {
  completionPct,
  computeStreak,
  daysLoggedCount,
  getDayLog,
  kg,
  todayISO,
  totalEnglishWords,
  weightStats,
  yearProgressPct,
} from "../lib/utils";

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { dayLogs, weightEntries, monthGoals, startDate, startWeight } = useStore();

  const today = todayISO();
  const todayLog = getDayLog(dayLogs, today);
  const todayPct = completionPct(todayLog);
  const streak = computeStreak(dayLogs);
  const daysLogged = daysLoggedCount(dayLogs);
  const ws = weightStats(weightEntries, startWeight, GOAL_WEIGHT);
  const yearPct = yearProgressPct(startDate);
  const words = totalEnglishWords(dayLogs);

  const quote = QUOTES[Math.floor(Date.now() / 86_400_000) % QUOTES.length];

  const daysElapsed = Math.floor(
    (Date.now() - new Date(startDate + "T00:00:00").getTime()) / 86_400_000
  );
  const currentMonthIdx = Math.max(
    0,
    Math.min(11, Math.floor(daysElapsed / 30))
  );
  const currentGoal = monthGoals[currentMonthIdx];
  const goalsDoneCount = monthGoals.reduce(
    (n, g) => n + (Object.values(g.done).filter(Boolean).length as number),
    0
  );

  return (
    <div className="space-y-6">
      {/* Motivation banner */}
      <Card className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent blur-2xl" />
        <div className="relative flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 shrink-0 text-amber-300" />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-300/80">
              Programme · 1 an · Algérie
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">
              “{quote}”
            </p>
            <p className="mt-2 text-sm text-slate-400">
              24 ans · Départ {startWeight} kg · Objectif {GOAL_WEIGHT} kg
            </p>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Scale}
          label="Poids actuel"
          value={ws.hasData ? kg(ws.current) : `${startWeight} kg`}
          sub={
            ws.hasData
              ? ws.lost >= 0
                ? `${kg(ws.lost)} perdu`
                : `+${kg(Math.abs(ws.lost))}`
              : "À peser (vendredi à jeun)"
          }
          accent="from-emerald-400/25 to-emerald-400/0"
          iconColor="text-emerald-300"
        />
        <StatCard
          icon={Flame}
          label="Série en cours"
          value={`${streak} j`}
          sub={streak > 0 ? "Garde le cap 🔥" : "Commence aujourd'hui"}
          accent="from-orange-400/25 to-orange-400/0"
          iconColor="text-orange-300"
        />
        <StatCard
          icon={CalendarCheck}
          label="Jours suivis"
          value={daysLogged}
          sub={`sur ${Math.max(1, daysElapsed + 1)} depuis le début`}
          accent="from-sky-400/25 to-sky-400/0"
          iconColor="text-sky-300"
        />
        <StatCard
          icon={Languages}
          label="Mots d'anglais"
          value={words}
          sub={`~${(words / 7).toFixed(0)}/sem en moyenne`}
          accent="from-violet-400/25 to-violet-400/0"
          iconColor="text-violet-300"
        />
      </div>

      {/* Rings */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-center gap-3 p-5">
          <ProgressRing value={ws.pct} color="#34d399">
            <span className="text-2xl font-bold text-white">{Math.round(ws.pct)}%</span>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              perte de poids
            </span>
          </ProgressRing>
          <div className="text-center text-sm text-slate-300">
            <span className="font-semibold text-emerald-300">{ws.hasData ? kg(ws.lost) : "0 kg"}</span>{" "}
            / {kg(ws.totalToLose)} · reste {ws.hasData ? kg(ws.remaining) : kg(startWeight - GOAL_WEIGHT)}
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-3 p-5">
          <ProgressRing value={yearPct} color="#38bdf8">
            <span className="text-2xl font-bold text-white">{Math.round(yearPct)}%</span>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              année écoulée
            </span>
          </ProgressRing>
          <div className="text-center text-sm text-slate-300">
            <span className="font-semibold text-sky-300">Mois {currentMonthIdx + 1}</span> ·{" "}
            {currentGoal?.title}
          </div>
        </Card>

        <Card className="flex flex-col items-center gap-3 p-5">
          <ProgressRing value={todayPct} color="#fbbf24">
            <span className="text-2xl font-bold text-white">{todayPct}%</span>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              complétion du jour
            </span>
          </ProgressRing>
          <button
            onClick={() => onNavigate("daily")}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-400/15 px-3 py-1.5 text-sm font-medium text-amber-200 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25"
          >
            <ListChecks className="h-4 w-4" /> Suivi du jour <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Card>
      </div>

      {/* Chart + today summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Évolution du poids</h3>
            <button
              onClick={() => onNavigate("weight")}
              className="text-sm text-emerald-300 hover:text-emerald-200"
            >
              Gérer →
            </button>
          </div>
          <WeightChart entries={weightEntries} />
        </Card>

        <Card className="flex flex-col p-5">
          <h3 className="mb-3 font-semibold text-white">Programme du jour</h3>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
              <span>Tâches accomplies</span>
              <span className="font-semibold text-white">
                {TASKS.filter((t) => todayLog.tasks[t.id]).length}/{TASKS.length}
              </span>
            </div>
            <ProgressBar value={todayPct} />
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-2 text-sm ring-1 ring-cyan-400/20">
            <Droplets className="h-4 w-4 text-cyan-300" />
            <span className="text-cyan-100">
              Eau : <strong>{todayLog.water.toFixed(1)} L</strong> / {WATER_TARGET} L
            </span>
          </div>
          <ul className="flex-1 space-y-1.5 text-sm">
            {TASKS.slice(0, 6).map((t) => (
              <li
                key={t.id}
                className={`flex items-center gap-2 ${
                  todayLog.tasks[t.id] ? "text-slate-400 line-through" : "text-slate-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    todayLog.tasks[t.id] ? "bg-emerald-400" : "bg-white/25"
                  }`}
                />
                <span className="font-mono text-xs text-slate-500">{t.time}</span>
                <span className="truncate">{t.title.split("—")[0].trim()}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Monthly goals */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Trophy className="h-5 w-5 text-amber-300" /> Objectifs annuels
          </h3>
          <button
            onClick={() => onNavigate("goals")}
            className="text-sm text-emerald-300 hover:text-emerald-200"
          >
            Tout voir →
          </button>
        </div>
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm text-slate-400">
            <span>{goalsDoneCount}/36 objectifs atteints</span>
            <span>{Math.round((goalsDoneCount / 36) * 100)}%</span>
          </div>
          <ProgressBar value={(goalsDoneCount / 36) * 100} barClassName="from-amber-400 to-orange-500" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {monthGoals.slice(currentMonthIdx, currentMonthIdx + 3).map((g) => {
            const done = Object.values(g.done).filter(Boolean).length;
            return (
              <div
                key={g.month}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 text-sm font-bold text-amber-300">
                    {g.month}
                  </span>
                  <span className="text-sm font-medium text-white">{g.title}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  <Target className="mr-1 inline h-3 w-3" />
                  {g.weightGoal} · {g.englishGoal}
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={(done / 3) * 100}
                    className="h-1.5"
                    barClassName="from-amber-400 to-orange-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
