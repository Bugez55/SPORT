import { useEffect, useState } from "react";
import { Plus, Scale, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useStore } from "../store";
import { Card, ProgressBar, StatCard } from "./ui";
import { WeightChart } from "./WeightChart";
import { GOAL_WEIGHT } from "../data/program";
import type { WeightEntry } from "../types";
import { kg, shortDateFr, todayISO, weightStats } from "../lib/utils";

function num(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}

export function WeightTracker() {
  const { weightEntries, startWeight, upsertWeight, removeWeight } = useStore();
  const ws = weightStats(weightEntries, startWeight, GOAL_WEIGHT);

  const [form, setForm] = useState({
    date: todayISO(),
    weight: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: "",
  });

  useEffect(() => {
    const existing = weightEntries.find((e) => e.date === form.date);
    if (existing) {
      setForm((f) => ({
        ...f,
        weight: String(existing.weight),
        waist: existing.waist?.toString() ?? "",
        chest: existing.chest?.toString() ?? "",
        arm: existing.arm?.toString() ?? "",
        thigh: existing.thigh?.toString() ?? "",
      }));
    } else {
      setForm((f) => ({
        ...f,
        weight: "",
        waist: "",
        chest: "",
        arm: "",
        thigh: "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, weightEntries]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const weight = parseFloat(form.weight);
    if (!weight || weight <= 0) return;
    const entry: WeightEntry = {
      date: form.date,
      weight,
      waist: num(form.waist),
      chest: num(form.chest),
      arm: num(form.arm),
      thigh: num(form.thigh),
    };
    upsertWeight(entry);
  }

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Scale}
          label="Départ"
          value={kg(ws.start)}
          sub="1ère pesée"
          accent="from-slate-400/20 to-transparent"
          iconColor="text-slate-300"
        />
        <StatCard
          icon={ws.lost >= 0 ? TrendingDown : TrendingUp}
          label="Perdu"
          value={kg(Math.abs(ws.lost))}
          sub={ws.lost >= 0 ? "depuis le départ" : "prise de poids"}
          accent="from-emerald-400/25 to-transparent"
          iconColor={ws.lost >= 0 ? "text-emerald-300" : "text-red-300"}
        />
        <StatCard
          icon={Scale}
          label="Actuel"
          value={ws.hasData ? kg(ws.current) : "—"}
          sub={ws.hasData ? "dernière pesée" : "à peser"}
          accent="from-cyan-400/25 to-transparent"
          iconColor="text-cyan-300"
        />
        <StatCard
          icon={TrendingDown}
          label="Restant"
          value={kg(Math.max(0, ws.remaining))}
          sub={`avant ${GOAL_WEIGHT} kg`}
          accent="from-amber-400/25 to-transparent"
          iconColor="text-amber-300"
        />
      </div>

      {/* Progress */}
      <Card className="p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-white">Progression vers l'objectif</span>
          <span className="text-slate-400">
            {Math.round(ws.pct)}% · {kg(ws.totalToLose)} à perdre au total
          </span>
        </div>
        <ProgressBar value={ws.pct} />
      </Card>

      {/* Chart */}
      <Card className="p-5">
        <h3 className="mb-3 font-semibold text-white">Courbe de poids</h3>
        <WeightChart entries={weightEntries} height={300} />
      </Card>

      {/* Form */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <Plus className="h-5 w-5 text-emerald-300" /> Ajouter / Modifier une pesée
        </h3>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <label className="col-span-2 sm:col-span-1">
            <span className="mb-1 block text-xs text-slate-400">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white [color-scheme:dark] focus:border-emerald-400/40 focus:outline-none"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Poids (kg)*</span>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="ex: 152"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/40 focus:outline-none"
            />
          </label>
          {(
            [
              ["waist", "Taille"],
              ["chest", "Poitrine"],
              ["arm", "Bras"],
              ["thigh", "Cuisse"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              <span className="mb-1 block text-xs text-slate-400">{label} (cm)</span>
              <input
                type="number"
                inputMode="decimal"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder="—"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/40 focus:outline-none"
              />
            </label>
          ))}
          <div className="col-span-2 flex items-end sm:col-span-3 lg:col-span-6">
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 active:scale-[0.99]"
            >
              Enregistrer la pesée
            </button>
          </div>
        </form>
      </Card>

      {/* History */}
      <Card className="p-5">
        <h3 className="mb-3 font-semibold text-white">
          Historique ({weightEntries.length})
        </h3>
        {weightEntries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-8 text-center text-sm text-slate-500">
            Aucune pesée enregistrée. Pèse-toi 1×/semaine (vendredi matin à jeun).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-3">Date</th>
                  <th className="px-3 py-2">Poids</th>
                  <th className="px-3 py-2">Taille</th>
                  <th className="px-3 py-2">Poitrine</th>
                  <th className="px-3 py-2">Bras</th>
                  <th className="px-3 py-2">Cuisse</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {[...weightEntries]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => (
                    <tr
                      key={e.date}
                      className="border-b border-white/5 text-slate-200 last:border-0"
                    >
                      <td className="py-2 pr-3 font-medium">{shortDateFr(e.date)}</td>
                      <td className="px-3 py-2 font-bold text-emerald-300">
                        {kg(e.weight)}
                      </td>
                      <td className="px-3 py-2 text-slate-400">{e.waist ?? "—"}</td>
                      <td className="px-3 py-2 text-slate-400">{e.chest ?? "—"}</td>
                      <td className="px-3 py-2 text-slate-400">{e.arm ?? "—"}</td>
                      <td className="px-3 py-2 text-slate-400">{e.thigh ?? "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => removeWeight(e.date)}
                          className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
