import {
  Apple,
  Briefcase,
  Clapperboard,
  Clock,
  Dumbbell,
  Footprints,
  GraduationCap,
  HandHeart,
  Languages,
  Moon,
  NotebookPen,
  ShowerHead,
  Soup,
  Sunrise,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import type { MonthGoal, Task, TaskCategory } from "../types";

/* ─────────────────────────  PROFIL  ───────────────────────── */
export const START_WEIGHT = 154;
export const GOAL_WEIGHT = 100;
export const WATER_TARGET = 3.5; // litres / jour
export const ENGLISH_WORDS_DAILY = 15;

export const CATEGORY_META: Record<
  TaskCategory,
  { label: string; text: string; bg: string; dot: string }
> = {
  matin: { label: "Réveil", text: "text-amber-300", bg: "bg-amber-400/10", dot: "bg-amber-400" },
  sport: { label: "Sport", text: "text-emerald-300", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  repas: { label: "Repas", text: "text-orange-300", bg: "bg-orange-400/10", dot: "bg-orange-400" },
  apprentissage: {
    label: "Apprentissage",
    text: "text-sky-300",
    bg: "bg-sky-400/10",
    dot: "bg-sky-400",
  },
  business: { label: "Business", text: "text-violet-300", bg: "bg-violet-400/10", dot: "bg-violet-400" },
  pause: { label: "Pause / Prière", text: "text-teal-300", bg: "bg-teal-400/10", dot: "bg-teal-400" },
  bilan: { label: "Bilan", text: "text-pink-300", bg: "bg-pink-400/10", dot: "bg-pink-400" },
  nuit: { label: "Nuit", text: "text-indigo-300", bg: "bg-indigo-400/10", dot: "bg-indigo-400" },
};

/* ─────────────────────  EMPLOI DU TEMPS QUOTIDIEN  ───────────────────── */
export const TASKS: Task[] = [
  {
    id: "wake",
    time: "05:30",
    title: "Réveil — Eau tiède citronnée + étirements",
    desc: "500 ml d'eau tiède + citron, toilette, prière du Fajr, 5 min d'étirements doux.",
    category: "matin",
    icon: Sunrise,
  },
  {
    id: "cardio",
    time: "06:00",
    title: "Cardio matin — Marche rapide 40-45 min",
    desc: "Semaine 1-2 : marche normale. Semaine 3-4 : marche rapide + petites côtes. Évite la course au début.",
    category: "sport",
    icon: Footprints,
  },
  {
    id: "breakfast",
    time: "07:00",
    title: "Petit-déjeuner sain",
    desc: "2 œufs durs/brouillés sans huile, 1 tranche pain complet, tomate + concombre, thé vert sans sucre, 10 amandes.",
    category: "repas",
    icon: Utensils,
  },
  {
    id: "english",
    time: "07:30",
    title: "Anglais intensif (2h)",
    desc: "30 min app · 30 min vidéo · 30 min vocab business · 30 min écrire + parler à voix haute.",
    category: "apprentissage",
    icon: Languages,
  },
  {
    id: "business",
    time: "09:30",
    title: "E-commerce / Business (2h30)",
    desc: "Formation, étude de marché (Ouedkniss, Jumia), choix de niche, création de boutique selon la semaine.",
    category: "business",
    icon: Briefcase,
  },
  {
    id: "dohr",
    time: "12:00",
    title: "Pause + Prière Dohr",
    desc: "Boire 500 ml d'eau + marche courte de 10 min.",
    category: "pause",
    icon: Clock,
  },
  {
    id: "lunch",
    time: "12:30",
    title: "Déjeuner (repas principal)",
    desc: "150g poulet/poisson/viande maigre + grande assiette de légumes + 4-5 c. riz complet/quinoa/lentilles + huile d'olive + 1 fruit.",
    category: "repas",
    icon: UtensilsCrossed,
  },
  {
    id: "learning",
    time: "14:30",
    title: "Apprentissage / Skills (2h)",
    desc: "Lun / Mer / Ven : Marketing digital (Facebook Ads, Insta). Mar / Jeu / Sam : Copywriting, Canva, montage vidéo.",
    category: "apprentissage",
    icon: GraduationCap,
  },
  {
    id: "snack",
    time: "16:30",
    title: "Collation saine",
    desc: "Yaourt nature 0% + 1 fruit, OU 30g fromage blanc + noix.",
    category: "repas",
    icon: Apple,
  },
  {
    id: "strength",
    time: "17:00",
    title: "Renforcement / Sport soir",
    desc: "Jour A : squats chaise, pompes mur, gainage, bouteilles d'eau. Jour B : vélo/marche, fentes, rowing, crunchs.",
    category: "sport",
    icon: Dumbbell,
  },
  {
    id: "maghreb",
    time: "18:00",
    title: "Douche + Prière Maghreb",
    desc: "Douche récupération, moment de calme.",
    category: "pause",
    icon: ShowerHead,
  },
  {
    id: "dinner",
    time: "18:30",
    title: "Dîner LÉGER",
    desc: "Chorba légère sans pâtes + 100g protéines (thon, œufs, poulet) + salade verte. PAS de pain le soir.",
    category: "repas",
    icon: Soup,
  },
  {
    id: "freetime",
    time: "19:30",
    title: "Temps libre / Famille / Révision anglais",
    desc: "Série en anglais sous-titres : Friends, Peaky Blinders, Suits.",
    category: "apprentissage",
    icon: Clapperboard,
  },
  {
    id: "icha",
    time: "21:00",
    title: "Prière Icha + Lecture Coran",
    desc: "Apaisement, recentrage spirituel.",
    category: "pause",
    icon: HandHeart,
  },
  {
    id: "bilan",
    time: "21:30",
    title: "Bilan de la journée",
    desc: "Note : repas, sport, 5 mots d'anglais, progrès business, 3 gratitudes.",
    category: "bilan",
    icon: NotebookPen,
  },
  {
    id: "sleep",
    time: "22:00",
    title: "Coucher tôt (objectif 7h)",
    desc: "Pas d'écran 30 min avant, chambre fraîche et sombre.",
    category: "nuit",
    icon: Moon,
  },
];

/* ─────────────────────  PLANNING HEBDOMADAIRE  ───────────────────── */
export interface WeekDay {
  name: string;
  getDay: number; // JS getDay() value
  cardio: string;
  strength: string;
  focus: string;
  dayType: "A" | "B" | "Repos";
}

export const WEEK_PLAN: WeekDay[] = [
  { name: "Lundi", getDay: 1, cardio: "Marche 45 min", strength: "Renforcement A", focus: "Anglais + E-com", dayType: "A" },
  { name: "Mardi", getDay: 2, cardio: "Marche 45 min", strength: "Cardio B", focus: "Anglais + Marketing", dayType: "B" },
  { name: "Mercredi", getDay: 3, cardio: "Marche 45 min", strength: "Renforcement A", focus: "Anglais + E-com", dayType: "A" },
  { name: "Jeudi", getDay: 4, cardio: "Marche 45 min", strength: "Cardio B", focus: "Anglais + Design", dayType: "B" },
  { name: "Vendredi", getDay: 5, cardio: "Marche + Jumu'a", strength: "Renforcement A", focus: "Business planning", dayType: "A" },
  { name: "Samedi", getDay: 6, cardio: "Marche 60 min", strength: "Cardio B", focus: "Révisions semaine", dayType: "B" },
  { name: "Dimanche", getDay: 0, cardio: "Repos actif (marche famille)", strength: "Repos", focus: "Détente + planification", dayType: "Repos" },
];

export const STRENGTH_PROGRAM: Record<
  "A" | "B",
  { title: string; exercises: string[] }
> = {
  A: {
    title: "Jour A — Renforcement (Lun / Mer / Ven)",
    exercises: [
      "Marche sur place genoux hauts : 3 × 1 min",
      "Squats sur chaise (s'asseoir / se lever) : 3 × 10",
      "Pompes contre le mur : 3 × 10",
      "Gainage genoux au sol : 3 × 20 sec",
      "Élévations bras avec bouteilles d'eau : 3 × 12",
    ],
  },
  B: {
    title: "Jour B — Cardio / Mobilité (Mar / Jeu / Sam)",
    exercises: [
      "Vélo appartement ou marche : 30 min",
      "Fentes assistées : 3 × 8 par jambe",
      "Rowing avec bouteilles d'eau : 3 × 12",
      "Crunchs légers : 3 × 10",
    ],
  },
};

/* ─────────────────────  EXEMPLES DE REPAS  ───────────────────── */
export const MEAL_EXAMPLES: { time: string; title: string; icon: typeof Utensils; items: string[] }[] = [
  {
    time: "07:00",
    title: "Petit-déjeuner",
    icon: Utensils,
    items: [
      "2 œufs durs ou brouillés (sans huile)",
      "1 tranche de pain complet (khobz dar complet)",
      "1 tomate + concombre",
      "Thé vert ou café sans sucre",
      "1 poignée d'amandes (10 max)",
    ],
  },
  {
    time: "12:30",
    title: "Déjeuner (principal)",
    icon: UtensilsCrossed,
    items: [
      "150g poulet grillé OU poisson OU viande maigre",
      "Grande assiette de légumes (courgettes, haricots, salade)",
      "4-5 c. de riz complet OU quinoa OU lentilles",
      "1 cuillère d'huile d'olive",
      "1 fruit (pomme, orange)",
    ],
  },
  {
    time: "16:30",
    title: "Collation",
    icon: Apple,
    items: [
      "1 yaourt nature 0%",
      "1 fruit",
      "OU 30g fromage blanc + noix",
    ],
  },
  {
    time: "18:30",
    title: "Dîner léger",
    icon: Soup,
    items: [
      "Soupe de légumes (chorba légère sans pâtes)",
      "100g de protéines (thon, œufs, poulet)",
      "Salade verte",
      "PAS de pain le soir",
    ],
  },
];

export const DO_RULES: string[] = [
  "Boire 3 à 4 litres d'eau / jour",
  "Manger lentement (20 min minimum par repas)",
  "Des légumes à chaque repas",
  "Des protéines à chaque repas",
  "Cuisiner soi-même",
];

export const DONT_RULES: string[] = [
  "Sodas, jus industriels (Hamoud, Coca...)",
  "Fritures (frites, beignets, bourek frit)",
  "Pâtisseries, gâteaux algériens sucrés",
  "Pain blanc en excès",
  "Fast-food (pizza, chawarma...)",
  "Grignotage devant écran",
];

/* ─────────────────────  RESSOURCES GRATUITES  ───────────────────── */
export const RESOURCES: { category: string; color: string; items: string[] }[] = [
  {
    category: "Anglais",
    color: "text-sky-300",
    items: ["Duolingo", "BBC Learning English", "EnglishAddict with Mr Duncan (YouTube)"],
  },
  {
    category: "Sport",
    color: "text-emerald-300",
    items: ["Chloe Ting (débutant) — YouTube", "Al Kavadlo — YouTube"],
  },
  {
    category: "E-commerce",
    color: "text-violet-300",
    items: ["Ecom King — YouTube", "Kevin David — YouTube", "Cours Google Digital Garage"],
  },
  {
    category: "Nutrition",
    color: "text-orange-300",
    items: ["Application Yazio", "Application MyFitnessPal"],
  },
];

export const TIPS: string[] = [
  "Prends des photos chaque semaine (face, profil, dos)",
  "Pèse-toi 1x/semaine seulement (vendredi matin à jeun)",
  "Trouve un partenaire (frère, ami) pour te motiver",
  "Rejoins des groupes Facebook algériens de perte de poids",
  "Récompense-toi SANS nourriture (livre, sortie...)",
  "Sois patient : ton corps a mis des années à grossir",
];

export const WARNINGS: string[] = [
  "Consulte un médecin avant tout effort (bilan cardiaque, sanguin, articulations)",
  "Vois un nutritionniste si possible (Alger, Oran, Constantine)",
  "Perte réaliste : 4 à 8 kg le 1er mois, puis 1,5-2 kg/semaine",
  "Ne saute pas de repas au début : le corps doit s'adapter",
];

/* ─────────────────────  OBJECTIFS SUR 12 MOIS  ───────────────────── */
export const DEFAULT_MONTH_GOALS: MonthGoal[] = [
  { month: 1, title: "Les fondations", weightTarget: 148, weightGoal: "−5 à −8 kg", englishGoal: "Niveau A1 solide", businessGoal: "Boutique en ligne créée", done: { weight: false, english: false, business: false } },
  { month: 2, title: "Mise en mouvement", weightTarget: 142, weightGoal: "−4 à −6 kg", englishGoal: "Niveau A2 atteint", businessGoal: "Premières ventes", done: { weight: false, english: false, business: false } },
  { month: 3, title: "L'habitude", weightTarget: 137, weightGoal: "−4 à −6 kg", englishGoal: "Conversations simples", businessGoal: "Business optimisé", done: { weight: false, english: false, business: false } },
  { month: 4, title: "Accélération", weightTarget: 132, weightGoal: "−5 kg", englishGoal: "Lire des articles courts", businessGoal: "10 ventes / mois", done: { weight: false, english: false, business: false } },
  { month: 5, title: "Capacité", weightTarget: 128, weightGoal: "−4 kg", englishGoal: "Début niveau B1", businessGoal: "Scaling publicité", done: { weight: false, english: false, business: false } },
  { month: 6, title: "Mi-parcours", weightTarget: 124, weightGoal: "−4 kg", englishGoal: "Écrire des emails pro", businessGoal: "1ère gamme personnalisée", done: { weight: false, english: false, business: false } },
  { month: 7, title: "Endurance", weightTarget: 120, weightGoal: "−4 kg", englishGoal: "Tenir une conversation fluide", businessGoal: "Multi-canal (Insta + site)", done: { weight: false, english: false, business: false } },
  { month: 8, title: "Confiance", weightTarget: 116, weightGoal: "−4 kg", englishGoal: "Niveau B1+", businessGoal: "50 ventes / mois", done: { weight: false, english: false, business: false } },
  { month: 9, title: "Maîtrise", weightTarget: 113, weightGoal: "−3 kg", englishGoal: "Séries sans sous-titres FR", businessGoal: "Optimisation des marges", done: { weight: false, english: false, business: false } },
  { month: 10, title: "Agrandissement", weightTarget: 110, weightGoal: "−3 kg", englishGoal: "Début niveau B2", businessGoal: "100 ventes / mois", done: { weight: false, english: false, business: false } },
  { month: 11, title: "Affinage", weightTarget: 107, weightGoal: "−3 kg", englishGoal: "Présenter son business en anglais", businessGoal: "Automatisation des process", done: { weight: false, english: false, business: false } },
  { month: 12, title: "La transformation", weightTarget: 104, weightGoal: "−3 kg", englishGoal: "Niveau B2 fluide", businessGoal: "Business rentable & stable", done: { weight: false, english: false, business: false } },
];

export const QUOTES: string[] = [
  "Ta transformation commence AUJOURD'HUI, pas demain.",
  "Tu as 24 ans. Tout est possible.",
  "La discipline, c'est de choisir ce que tu veux le plus plutôt que ce que tu veux maintenant.",
  "Petits efforts répétés chaque jour = grands résultats.",
  "Un corps sain porte un esprit sain.",
  "Ne compare qu'avec toi-même d'hier.",
  "L'échec d'un jour n'efface pas les victoires de la semaine.",
  "Bois ton eau. Fais ta marche. Apprends ton anglais. Point.",
];
