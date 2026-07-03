import { TASKS, GOAL_WEIGHT, START_WEIGHT } from "../data/program";
import type { DayLog, WeightEntry } from "../types";

/* ───────────────  DATES  ─────────────── */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function formatDateFr(iso: string): string {
  const d = parseISO(iso);
  return `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

export function shortDateFr(iso: string): string {
  const d = parseISO(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* ───────────────  EMPTY DAY  ─────────────── */
export function emptyDayLog(date: string): DayLog {
  return { date, tasks: {}, water: 0, englishWords: 0, mood: 0, notes: "" };
}

export function getDayLog(logs: Record<string, DayLog>, date: string): DayLog {
  return logs[date] ?? emptyDayLog(date);
}

/* ───────────────  COMPLETION  ─────────────── */
export function doneTaskCount(log?: DayLog): number {
  if (!log) return 0;
  return TASKS.filter((t) => log.tasks[t.id]).length;
}

export function completionRate(log?: DayLog): number {
  if (!log) return 0;
  return TASKS.length ? doneTaskCount(log) / TASKS.length : 0;
}

export function completionPct(log?: DayLog): number {
  return Math.round(completionRate(log) * 100);
}

/* ───────────────  STREAK  ─────────────── */
export function computeStreak(logs: Record<string, DayLog>): number {
  let streak = 0;
  let cursor = new Date();

  const today = todayISO();
  const todayDone = completionRate(logs[today]) >= 0.5;
  if (!todayDone) cursor.setDate(cursor.getDate() - 1);

  // safety cap to avoid infinite loops on bad data
  for (let i = 0; i < 400; i++) {
    const iso = toISODate(cursor);
    if (logs[iso] && completionRate(logs[iso]) >= 0.5) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export function daysLoggedCount(logs: Record<string, DayLog>): number {
  return Object.values(logs).filter((l) => doneTaskCount(l) > 0).length;
}

/* ───────────────  WATER & WORDS  ─────────────── */
export function totalWaterWeek(logs: Record<string, DayLog>, fromISO: string): number {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    total += getDayLog(logs, addDays(fromISO, i)).water;
  }
  return total;
}

export function totalEnglishWords(logs: Record<string, DayLog>): number {
  return Object.values(logs).reduce((sum, l) => sum + (l.englishWords || 0), 0);
}

/* ───────────────  WEIGHT STATS  ─────────────── */
export interface WeightStats {
  start: number;
  current: number;
  lowest: number;
  lost: number;
  remaining: number;
  totalToLose: number;
  pct: number;
  hasData: boolean;
}

export function weightStats(
  entries: WeightEntry[],
  startWeight = START_WEIGHT,
  goalWeight = GOAL_WEIGHT
): WeightStats {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) {
    return {
      start: startWeight,
      current: startWeight,
      lowest: startWeight,
      lost: 0,
      remaining: startWeight - goalWeight,
      totalToLose: startWeight - goalWeight,
      pct: 0,
      hasData: false,
    };
  }
  const start = sorted[0].weight;
  const current = sorted[sorted.length - 1].weight;
  const lowest = sorted.reduce((min, e) => Math.min(min, e.weight), start);
  const lost = start - current;
  const totalToLose = start - goalWeight;
  const pct = totalToLose > 0 ? clamp(((start - current) / totalToLose) * 100, 0, 100) : 0;
  return {
    start,
    current,
    lowest,
    lost,
    remaining: current - goalWeight,
    totalToLose,
    pct,
    hasData: true,
  };
}

/* ───────────────  YEAR PROGRESS  ─────────────── */
export function yearProgressPct(startDate: string): number {
  const start = parseISO(startDate);
  const now = new Date();
  const days = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return clamp((days / 365) * 100, 0, 100);
}

/* ───────────────  HELPERS  ─────────────── */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function kg(n: number): string {
  return `${n.toFixed(n % 1 === 0 ? 0 : 1)} kg`;
}
