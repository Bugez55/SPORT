import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GOAL_WEIGHT } from "../data/program";
import { shortDateFr } from "../lib/utils";
import type { WeightEntry } from "../types";

export function WeightChart({
  entries,
  height = 260,
}: {
  entries: WeightEntry[];
  height?: number;
}) {
  if (!entries.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-slate-500"
        style={{ height }}
      >
        <span className="text-3xl">📈</span>
        <p className="text-sm">Ajoute ton 1er poids pour voir le graphique</p>
      </div>
    );
  }

  const data = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ label: shortDateFr(e.date), weight: e.weight }));

  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights, GOAL_WEIGHT);
  const max = Math.max(...weights);
  const pad = Math.max(2, Math.round((max - min) * 0.2));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="wline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          stroke="rgba(255,255,255,0.1)"
          minTickGap={18}
        />
        <YAxis
          domain={[Math.floor(min - pad), Math.ceil(max + pad)]}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          stroke="rgba(255,255,255,0.1)"
          width={42}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            color: "#fff",
          }}
          formatter={(v) => [`${v} kg`, "Poids"]}
        />
        <ReferenceLine
          y={GOAL_WEIGHT}
          stroke="#f59e0b"
          strokeDasharray="6 5"
          label={{
            value: `Objectif ${GOAL_WEIGHT} kg`,
            fill: "#f59e0b",
            fontSize: 11,
            position: "insideTopRight",
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="url(#wline)"
          strokeWidth={3}
          dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#34d399", stroke: "#0a0e17", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
