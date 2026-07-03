import * as XLSX from "xlsx";
import { TASKS } from "../data/program";
import type { DayLog, WeightEntry, MonthGoal } from "../types";

export function exportToExcel(
  dayLogs: Record<string, DayLog>,
  weightEntries: WeightEntry[],
  monthGoals: MonthGoal[],
  startWeight: number
) {
  const wb = XLSX.utils.book_new();

  /* Sheet 1 — Suivi quotidien */
  const dailyRows = Object.values(dayLogs)
    .filter((l) => TASKS.some((t) => l.tasks[t.id]))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => {
      const row: Record<string, string | number> = { Date: l.date };
      TASKS.forEach((t) => {
        row[`${t.time} ${t.title}`] = l.tasks[t.id] ? "✓" : "";
      });
      row["Eau (L)"] = l.water;
      row["Mots anglais"] = l.englishWords;
      row["Humeur (1-5)"] = l.mood || "";
      row["Notes"] = l.notes || "";
      return row;
    });
  const wsDaily = XLSX.utils.json_to_sheet(
    dailyRows.length ? dailyRows : [{ Date: "Aucune donnée" }]
  );
  XLSX.utils.book_append_sheet(wb, wsDaily, "Suivi quotidien");

  /* Sheet 2 — Poids & mensurations */
  const weightRows = [...weightEntries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      Date: e.date,
      "Poids (kg)": e.weight,
      "Taille (cm)": e.waist ?? "",
      "Poitrine (cm)": e.chest ?? "",
      "Bras (cm)": e.arm ?? "",
      "Cuisse (cm)": e.thigh ?? "",
    }));
  const wsWeight = XLSX.utils.json_to_sheet(
    weightRows.length ? weightRows : [{ Date: "Aucune donnée" }]
  );
  XLSX.utils.book_append_sheet(wb, wsWeight, "Poids");

  /* Sheet 3 — Objectifs mensuels */
  const goalRows = monthGoals.map((g) => ({
    Mois: g.month,
    Titre: g.title,
    "Cible poids (kg)": g.weightTarget,
    "Objectif poids": g.weightGoal,
    "Objectif anglais": g.englishGoal,
    "Objectif business": g.businessGoal,
    "Poids ✓": g.done.weight ? "✓" : "",
    "Anglais ✓": g.done.english ? "✓" : "",
    "Business ✓": g.done.business ? "✓" : "",
  }));
  const wsGoals = XLSX.utils.json_to_sheet(goalRows);
  XLSX.utils.book_append_sheet(wb, wsGoals, "Objectifs");

  /* Sheet 4 — Récapitulatif */
  const recap = [
    { Indicateur: "Poids de départ (kg)", Valeur: startWeight },
    {
      Indicateur: "Jours suivis",
      Valeur: Object.values(dayLogs).filter((l) =>
        TASKS.some((t) => l.tasks[t.id])
      ).length,
    },
    { Indicateur: "Entrées de poids", Valeur: weightEntries.length },
    {
      Indicateur: "Objectifs atteints",
      Valeur: monthGoals.reduce(
        (n, g) => n + (Object.values(g.done).filter(Boolean).length as number),
        0
      ),
    },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(recap), "Récapitulatif");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `suivi_transformation_${stamp}.xlsx`);
}
