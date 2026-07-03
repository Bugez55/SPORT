import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useLocalStorage } from "./lib/useLocalStorage";
import {
  DEFAULT_MONTH_GOALS,
  START_WEIGHT,
} from "./data/program";
import type {
  DayLog,
  GoalKey,
  MonthGoal,
  WeightEntry,
} from "./types";
import { emptyDayLog, todayISO } from "./lib/utils";

interface StoreValue {
  dayLogs: Record<string, DayLog>;
  weightEntries: WeightEntry[];
  monthGoals: MonthGoal[];
  startDate: string;
  startWeight: number;

  toggleTask: (date: string, taskId: string) => void;
  setWater: (date: string, liters: number) => void;
  setEnglishWords: (date: string, n: number) => void;
  setMood: (date: string, n: number) => void;
  setNotes: (date: string, text: string) => void;
  upsertWeight: (entry: WeightEntry) => void;
  removeWeight: (date: string) => void;
  toggleMonthGoal: (month: number, key: GoalKey) => void;
  setStartDate: (iso: string) => void;
  setStartWeight: (n: number) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [dayLogs, setDayLogs] = useLocalStorage<Record<string, DayLog>>(
    "tp_dayLogs_v1",
    {}
  );
  const [weightEntries, setWeightEntries] = useLocalStorage<WeightEntry[]>(
    "tp_weight_v1",
    []
  );
  const [monthGoals, setMonthGoals] = useLocalStorage<MonthGoal[]>(
    "tp_goals_v1",
    DEFAULT_MONTH_GOALS
  );
  const [startDate, setStartDate] = useLocalStorage<string>(
    "tp_startDate_v1",
    todayISO()
  );
  const [startWeight, setStartWeight] = useLocalStorage<number>(
    "tp_startWeight_v1",
    START_WEIGHT
  );

  const ensureDay = useCallback(
    (date: string, prev: Record<string, DayLog>): Record<string, DayLog> => {
      if (prev[date]) return prev;
      return { ...prev, [date]: emptyDayLog(date) };
    },
    []
  );

  const toggleTask = useCallback(
    (date: string, taskId: string) => {
      setDayLogs((prev) => {
        const base = ensureDay(date, prev);
        const log = base[date];
        return {
          ...base,
          [date]: { ...log, tasks: { ...log.tasks, [taskId]: !log.tasks[taskId] } },
        };
      });
    },
    [ensureDay, setDayLogs]
  );

  const setWater = useCallback(
    (date: string, liters: number) => {
      setDayLogs((prev) => {
        const base = ensureDay(date, prev);
        const log = base[date];
        return { ...base, [date]: { ...log, water: Math.max(0, liters) } };
      });
    },
    [ensureDay, setDayLogs]
  );

  const setEnglishWords = useCallback(
    (date: string, n: number) => {
      setDayLogs((prev) => {
        const base = ensureDay(date, prev);
        const log = base[date];
        return { ...base, [date]: { ...log, englishWords: Math.max(0, n) } };
      });
    },
    [ensureDay, setDayLogs]
  );

  const setMood = useCallback(
    (date: string, n: number) => {
      setDayLogs((prev) => {
        const base = ensureDay(date, prev);
        const log = base[date];
        return { ...base, [date]: { ...log, mood: n } };
      });
    },
    [ensureDay, setDayLogs]
  );

  const setNotes = useCallback(
    (date: string, text: string) => {
      setDayLogs((prev) => {
        const base = ensureDay(date, prev);
        const log = base[date];
        return { ...base, [date]: { ...log, notes: text } };
      });
    },
    [ensureDay, setDayLogs]
  );

  const upsertWeight = useCallback(
    (entry: WeightEntry) => {
      setWeightEntries((prev) => {
        const others = prev.filter((e) => e.date !== entry.date);
        return [...others, entry].sort((a, b) => a.date.localeCompare(b.date));
      });
    },
    [setWeightEntries]
  );

  const removeWeight = useCallback(
    (date: string) => {
      setWeightEntries((prev) => prev.filter((e) => e.date !== date));
    },
    [setWeightEntries]
  );

  const toggleMonthGoal = useCallback(
    (month: number, key: GoalKey) => {
      setMonthGoals((prev) =>
        prev.map((g) =>
          g.month === month
            ? { ...g, done: { ...g.done, [key]: !g.done[key] } }
            : g
        )
      );
    },
    [setMonthGoals]
  );

  const resetAll = useCallback(() => {
    if (
      !confirm(
        "Effacer TOUTES les données (suivi, poids, objectifs) ? Cette action est irréversible."
      )
    )
      return;
    setDayLogs({});
    setWeightEntries([]);
    setMonthGoals(DEFAULT_MONTH_GOALS);
    setStartDate(todayISO());
    setStartWeight(START_WEIGHT);
  }, [setDayLogs, setWeightEntries, setMonthGoals, setStartDate, setStartWeight]);

  const value = useMemo<StoreValue>(
    () => ({
      dayLogs,
      weightEntries,
      monthGoals,
      startDate,
      startWeight,
      toggleTask,
      setWater,
      setEnglishWords,
      setMood,
      setNotes,
      upsertWeight,
      removeWeight,
      toggleMonthGoal,
      setStartDate,
      setStartWeight,
      resetAll,
    }),
    [
      dayLogs,
      weightEntries,
      monthGoals,
      startDate,
      startWeight,
      toggleTask,
      setWater,
      setEnglishWords,
      setMood,
      setNotes,
      upsertWeight,
      removeWeight,
      toggleMonthGoal,
      setStartDate,
      setStartWeight,
      resetAll,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
