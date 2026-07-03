import type { LucideIcon } from "lucide-react";

export type TaskCategory =
  | "matin"
  | "sport"
  | "repas"
  | "apprentissage"
  | "business"
  | "pause"
  | "bilan"
  | "nuit";

export interface Task {
  id: string;
  time: string;
  title: string;
  desc?: string;
  category: TaskCategory;
  icon: LucideIcon;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  tasks: Record<string, boolean>;
  water: number; // liters
  englishWords: number;
  mood: number; // 1-5
  notes: string;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
  waist?: number; // cm
  chest?: number; // cm
  arm?: number; // cm
  thigh?: number; // cm
}

export type GoalKey = "weight" | "english" | "business";

export interface MonthGoal {
  month: number; // 1-12
  title: string;
  weightTarget: number;
  weightGoal: string;
  englishGoal: string;
  businessGoal: string;
  done: Record<GoalKey, boolean>;
}
