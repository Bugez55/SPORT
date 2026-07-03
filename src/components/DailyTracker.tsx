import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Languages,
  Minus,
  MoonStar,
  NotebookPen,
  Plus,
  StickyNote,
  Sun,
  Sunrise,
} from "lucide-react";
import { useStore } from "../store";
import { Card, Checkbox, Pill, ProgressBar, ProgressRing } from "./ui";
import {
  CATEGORY_META,
  ENGLISH_WORDS_DAILY,
  TASKS,
  WATER_TARGET,
  WEEK_PLAN,
} from "../data/program";
import type { Task } from "../types";
import {
  addDays,
  completionPct,
  computeStreak,
  formatDateFr,
  getDayLog,
  parseISO,
  todayISO,
} from "../lib/utils";
import { cn } from "../utils/cn";

const MOODS = ["😞", "😕", "😐", "🙂", "😄"];

function TaskRow({
  task,
  done,
  onToggle,
}: {
  task: Task;
  done: boolean;
  onToggle: () => void;
}) {
  const meta = CATEGORY_META[task.category];
  const Icon = task.icon;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200",
        done
          ? "border-emerald-400/30 bg-emerald-400/[0.06]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
      )}
    >
      <Checkbox checked={done} onClick={onToggle} />
      <span
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          meta.bg,
          meta.text
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-500">{task.time}</span>
          <Pill className={cn(meta.bg, meta.text)}>{meta.label}</Pill>
        </div>
        <p
          className={cn(
            "mt-0.5 font-medium leading-snug",
            done ? "text-slate-400 line-through" : "text-white"
          )}
        >
          {task.title}
        </p>
        {task.desc && (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{task.desc}</p>
        )}
      </div>
    </button>
  );
}

function TaskGroup({
  title,
  icon: Icon,
  accent,
  tasks,
  doneIds,
  onToggle,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  tasks: Task[];
  doneIds: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const done = tasks.filter((t) => doneIds[t.id]).length;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-white">
          <Icon className={cn("h-5 w-5", accent)} />
          {title}
        </h3>
        <span className="text-xs font-medium text-slate-400">
          {done}/{tasks.length}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            done={!!doneIds[t.id]}
            onToggle={() => onToggle(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Stepper({
  value,
  onDec,
  onInc,
  format,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  format: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDec}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-16 text-center font-bold text-white">{format(value)}</span>
      <button
        onClick={onInc}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DailyTracker() {
  const {
    dayLogs,
    toggleTask,
    setWater,
    setEnglishWords,
    setMood,
    setNotes,
  } = useStore();

  const [date, setDate] = useState(todayISO());
  const log = getDayLog(dayLogs, date);
  const pct = completionPct(log);
  const streak = computeStreak(dayLogs);
  const isToday = date === todayISO();

  const dow = parseISO(date).getDay();
  const plan = WEEK_PLAN.find((w) => w.getDay === dow) ?? WEEK_PLAN[0];

  const morning = TASKS.filter((t) => t.time < "12:00");
  const afternoon = TASKS.filter((t) => t.time >= "12:00" && t.time < "17:00");
  const evening = TASKS.filter((t) => t.time >= "17:00");

  const dayTypeStyle =
    plan.dayType === "A"
      ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
      : plan.dayType === "B"
        ? "bg-sky-400/15 text-sky-300 ring-sky-400/30"
        : "bg-slate-400/15 text-slate-300 ring-slate-400/30";

  return (
    <div className="space-y-5">
      {/* Date navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setDate(addDays(date, -1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">{formatDateFr(date)}</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => e.target.value && setDate(e.target.value)}
                className="bg-transparent text-xs text-slate-400 [color-scheme:dark]"
              />
              {!isToday && (
                <button
                  onClick={() => setDate(todayISO())}
                  className="rounded-md bg-emerald-400/15 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30"
                >
                  Aujourd'hui
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setDate(addDays(date, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Focus + completion */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <CalendarDays className="h-4 w-4" /> Focus du jour
          </div>
          <p className="text-lg font-semibold text-white">{plan.name}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={cn("rounded-full px-2.5 py-1 ring-1", dayTypeStyle)}>
              Renforcement {plan.dayType}
            </span>
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-300 ring-1 ring-white/10">
              {plan.cardio}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">🎯 {plan.focus}</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <ProgressRing value={pct} size={104} color="#34d399">
            <span className="text-xl font-bold text-white">{pct}%</span>
          </ProgressRing>
          <p className="mt-1 text-xs text-slate-400">
            {TASKS.filter((t) => log.tasks[t.id]).length}/{TASKS.length} tâches
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <span className="text-4xl font-black text-orange-300">{streak}</span>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
            jours de série 🔥
          </p>
          <p className="mt-1 text-center text-[11px] text-slate-500">
            {pct >= 50
              ? "Journée comptabilisée"
              : "Atteins 50% pour valider la série"}
          </p>
        </Card>
      </div>

      {/* Tasks */}
      <div className="space-y-5">
        <TaskGroup
          title="Matin"
          icon={Sunrise}
          accent="text-amber-300"
          tasks={morning}
          doneIds={log.tasks}
          onToggle={(id) => toggleTask(date, id)}
        />
        <TaskGroup
          title="Midi & Après-midi"
          icon={Sun}
          accent="text-orange-300"
          tasks={afternoon}
          doneIds={log.tasks}
          onToggle={(id) => toggleTask(date, id)}
        />
        <TaskGroup
          title="Soir & Nuit"
          icon={MoonStar}
          accent="text-indigo-300"
          tasks={evening}
          doneIds={log.tasks}
          onToggle={(id) => toggleTask(date, id)}
        />
      </div>

      {/* Trackers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Droplets className="h-5 w-5 text-cyan-300" /> Hydratation
            </h3>
            <span className="text-sm font-bold text-cyan-300">
              {log.water.toFixed(2)} L
            </span>
          </div>
          <ProgressBar
            value={(log.water / WATER_TARGET) * 100}
            barClassName="from-cyan-400 to-sky-500"
          />
          <div className="mt-3 flex items-center justify-between">
            <Stepper
              value={log.water}
              onDec={() => setWater(date, log.water - 0.25)}
              onInc={() => setWater(date, log.water + 0.25)}
              format={(v) => `${v.toFixed(2)}`}
            />
            <span className="text-xs text-slate-400">Objectif {WATER_TARGET} L</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Languages className="h-5 w-5 text-violet-300" /> Mots d'anglais
            </h3>
            <span className="text-sm font-bold text-violet-300">{log.englishWords}</span>
          </div>
          <ProgressBar
            value={(log.englishWords / ENGLISH_WORDS_DAILY) * 100}
            barClassName="from-violet-400 to-fuchsia-500"
          />
          <div className="mt-3 flex items-center justify-between">
            <Stepper
              value={log.englishWords}
              onDec={() => setEnglishWords(date, log.englishWords - 1)}
              onInc={() => setEnglishWords(date, log.englishWords + 1)}
              format={(v) => `${v}`}
            />
            <span className="text-xs text-slate-400">Objectif {ENGLISH_WORDS_DAILY}/jour</span>
          </div>
        </Card>
      </div>

      {/* Mood + notes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-3 font-semibold text-white">Humeur du jour</h3>
          <div className="flex justify-between">
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setMood(date, log.mood === i + 1 ? 0 : i + 1)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all duration-150",
                  log.mood === i + 1
                    ? "scale-110 bg-white/15 ring-2 ring-white/40"
                    : "bg-white/[0.03] opacity-60 hover:opacity-100"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <NotebookPen className="h-5 w-5 text-pink-300" /> Bilan & gratitudes
          </h3>
          <textarea
            value={log.notes}
            onChange={(e) => setNotes(date, e.target.value)}
            rows={3}
            placeholder="Repas, sport, progrès business, 3 choses positives de la journée..."
            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-pink-400/40 focus:outline-none focus:ring-1 focus:ring-pink-400/30"
          />
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <StickyNote className="h-3 w-3" /> Sauvegardé automatiquement
          </p>
        </Card>
      </div>
    </div>
  );
}
