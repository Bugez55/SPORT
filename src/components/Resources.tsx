import {
  AlertTriangle,
  Apple,
  BookOpen,
  CalendarDays,
  Check,
  Dumbbell,
  Heart,
  Lightbulb,
  Soup,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Card, Pill, SectionTitle } from "./ui";
import {
  CATEGORY_META,
  DO_RULES,
  DONT_RULES,
  MEAL_EXAMPLES,
  RESOURCES,
  STRENGTH_PROGRAM,
  TASKS,
  TIPS,
  WARNINGS,
  WEEK_PLAN,
} from "../data/program";
import { cn } from "../utils/cn";

const MEAL_ICONS = [Utensils, UtensilsCrossed, Apple, Soup];

export function Resources() {
  return (
    <div className="space-y-6">
      {/* Warnings */}
      <Card className="border-red-400/20 bg-red-500/[0.06] p-5">
        <SectionTitle
          icon={AlertTriangle}
          title="Avant de commencer (très important)"
          subtitle="Sécurité d'abord"
          accent="text-red-300"
        />
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {WARNINGS.map((w) => (
            <li key={w} className="flex items-start gap-2 text-sm text-red-100/90">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              {w}
            </li>
          ))}
        </ul>
      </Card>

      {/* Daily timeline */}
      <Card className="p-5">
        <SectionTitle
          icon={CalendarDays}
          title="Emploi du temps quotidien"
          subtitle="Lundi à samedi · 05h30 → 22h30"
        />
        <ol className="relative space-y-1 border-l border-white/10 pl-4">
          {TASKS.map((t) => {
            const meta = CATEGORY_META[t.category];
            const Icon = t.icon;
            return (
              <li key={t.id} className="relative py-2">
                <span
                  className={cn(
                    "absolute -left-[1.4rem] top-3 h-2.5 w-2.5 rounded-full ring-4 ring-[#0a0e17]",
                    meta.dot
                  )}
                />
                <div className="flex items-start gap-3">
                  <div className="flex w-16 shrink-0 items-center gap-1">
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {t.time}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Icon className={cn("h-4 w-4", meta.text)} />
                      <span className="font-medium text-white">{t.title}</span>
                      <Pill className={cn(meta.bg, meta.text)}>{meta.label}</Pill>
                    </div>
                    {t.desc && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {t.desc}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      {/* Strength program */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["A", "B"] as const).map((key) => {
          const prog = STRENGTH_PROGRAM[key];
          return (
            <Card key={key} className="p-5">
              <SectionTitle
                icon={Dumbbell}
                title={prog.title}
                accent={key === "A" ? "text-emerald-300" : "text-sky-300"}
              />
              <ul className="space-y-2">
                {prog.exercises.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm text-slate-200">
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                        key === "A"
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-sky-400/15 text-sky-300"
                      )}
                    >
                      {key}
                    </span>
                    {ex}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      {/* Weekly planning */}
      <Card className="p-5">
        <SectionTitle
          icon={CalendarDays}
          title="Planning hebdomadaire"
          subtitle="Dimanche = repos actif"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Jour</th>
                <th className="px-3 py-2">Cardio matin</th>
                <th className="px-3 py-2">Sport soir</th>
                <th className="px-3 py-2">Focus</th>
              </tr>
            </thead>
            <tbody>
              {WEEK_PLAN.map((d) => (
                <tr
                  key={d.getDay}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="py-2 pr-3 font-medium text-white">{d.name}</td>
                  <td className="px-3 py-2 text-slate-300">{d.cardio}</td>
                  <td className="px-3 py-2 text-slate-300">{d.strength}</td>
                  <td className="px-3 py-2 text-slate-400">{d.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Meals */}
      <Card className="p-5">
        <SectionTitle
          icon={Utensils}
          title="Exemples de repas"
          subtitle="Base saine et accessible en Algérie"
          accent="text-orange-300"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MEAL_EXAMPLES.map((m, i) => {
            const Icon = MEAL_ICONS[i] ?? Utensils;
            return (
              <div
                key={m.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400/10 text-orange-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-white">{m.title}</span>
                  <span className="ml-auto font-mono text-xs text-slate-500">
                    {m.time}
                  </span>
                </div>
                <ul className="space-y-1">
                  {m.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rules */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-emerald-400/15 p-5">
          <SectionTitle icon={Check} title="Règles d'or ✅" accent="text-emerald-300" />
          <ul className="space-y-2">
            {DO_RULES.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-slate-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-red-400/15 p-5">
          <SectionTitle icon={X} title="À éviter ❌" accent="text-red-300" />
          <ul className="space-y-2">
            {DONT_RULES.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-slate-200">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Resources + Tips */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-5">
          <SectionTitle icon={BookOpen} title="Ressources gratuites" accent="text-sky-300" />
          <div className="space-y-3">
            {RESOURCES.map((r) => (
              <div key={r.category}>
                <p className={cn("text-sm font-semibold", r.color)}>{r.category}</p>
                <p className="text-sm text-slate-300">{r.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={Lightbulb} title="Conseils bonus" accent="text-amber-300" />
          <ul className="space-y-2">
            {TIPS.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-slate-200">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Closing */}
      <Card className="relative overflow-hidden p-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-amber-500/10" />
        <p className="relative text-lg font-bold text-white sm:text-xl">
          🌟 Tu as 24 ans, tout est possible.
        </p>
        <p className="relative mt-1 text-sm text-slate-400">
          Ta transformation commence AUJOURD'HUI, pas demain.
        </p>
      </Card>
    </div>
  );
}
