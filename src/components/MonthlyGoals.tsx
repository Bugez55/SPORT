import {
  Briefcase,
  CheckCircle2,
  Circle,
  Languages,
  Scale,
  Target,
  Trophy,
} from "lucide-react";
import { useStore } from "../store";
import { Card, ProgressBar } from "./ui";
import type { GoalKey, MonthGoal } from "../types";
import { cn } from "../utils/cn";

function GoalToggle({
  label,
  done,
  onClick,
  icon: Icon,
  color,
}: {
  label: string;
  done: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border p-2.5 text-left text-sm transition-all",
        done
          ? "border-emerald-400/30 bg-emerald-400/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
      <span className={cn("flex-1", done ? "text-slate-400 line-through" : "text-slate-200")}>
        {label}
      </span>
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-slate-600" />
      )}
    </button>
  );
}

export function MonthlyGoals() {
  const { monthGoals, toggleMonthGoal, weightEntries, startWeight } = useStore();
  const goalsDone = monthGoals.reduce(
    (n, g) => n + (Object.values(g.done).filter(Boolean).length as number),
    0
  );
  const currentWeight =
    [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.weight ??
    startWeight;

  return (
    <div className="space-y-5">
      {/* Header progress */}
      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <Trophy className="h-5 w-5 text-amber-300" /> Objectifs sur 12 mois
          </h2>
          <span className="text-sm font-bold text-amber-300">
            {goalsDone}/36
          </span>
        </div>
        <ProgressBar value={(goalsDone / 36) * 100} barClassName="from-amber-400 to-orange-500" />
        <p className="mt-2 text-xs text-slate-400">
          Coche chaque objectif atteint. 3 objectifs par mois : poids · anglais · business.
        </p>
      </Card>

      {/* Month cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {monthGoals.map((g: MonthGoal) => {
          const done = Object.values(g.done).filter(Boolean).length;
          const reached = currentWeight <= g.weightTarget;
          return (
            <Card key={g.month} className="flex flex-col p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-lg font-black text-amber-300 ring-1 ring-amber-400/20">
                  {g.month}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Mois {g.month}
                  </p>
                  <h3 className="truncate font-semibold text-white">{g.title}</h3>
                </div>
                <span className="ml-auto text-xs font-bold text-slate-400">{done}/3</span>
              </div>

              <div className="space-y-2">
                <GoalToggle
                  label={`${g.weightGoal} → cible ${g.weightTarget} kg${
                    weightEntries.length
                      ? reached
                        ? " ✓ atteinte"
                        : ` (${Math.max(0, currentWeight - g.weightTarget).toFixed(0)} kg restants)`
                      : ""
                  }`}
                  done={g.done.weight}
                  onClick={() => toggleMonthGoal(g.month, "weight" as GoalKey)}
                  icon={Scale}
                  color="text-emerald-300"
                />
                <GoalToggle
                  label={g.englishGoal}
                  done={g.done.english}
                  onClick={() => toggleMonthGoal(g.month, "english" as GoalKey)}
                  icon={Languages}
                  color="text-sky-300"
                />
                <GoalToggle
                  label={g.businessGoal}
                  done={g.done.business}
                  onClick={() => toggleMonthGoal(g.month, "business" as GoalKey)}
                  icon={Briefcase}
                  color="text-violet-300"
                />
              </div>

              <div className="mt-3">
                <ProgressBar
                  value={(done / 3) * 100}
                  className="h-1.5"
                  barClassName="from-amber-400 to-orange-500"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer note */}
      <Card className="p-4">
        <p className="flex items-center gap-2 text-sm text-slate-300">
          <Target className="h-4 w-4 text-amber-300" />
          Astuce : ajuste ces objectifs à ton rythme réel. La régularité bat toujours
          la perfection.
        </p>
      </Card>
    </div>
  );
}
