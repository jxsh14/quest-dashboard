import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Home, Utensils, Dumbbell, Bot, Calendar as CalendarIcon, TrendingUp,
  Settings as SettingsIcon, Bell, X, Check, Clock, Plus, Trash2, Pencil,
  Star, Send, RefreshCw, Flame, Award, ChevronLeft, ChevronRight,
  Volume2, VolumeX, Info, Sparkles, CheckCircle2, Circle, AlarmClock,
  BookOpen, Zap, ShieldCheck, PlayCircle
} from "lucide-react";

/* ============================================================
   KONSTANTEN & DATENBASIS
   ============================================================ */

const SLOTS = [
  { key: "fruehstueck", label: "Frühstück", icon: "🍳", defaultTime: "07:30" },
  { key: "snack1", label: "Snack", icon: "🍎", defaultTime: "10:30" },
  { key: "mittagessen", label: "Mittagessen", icon: "🍝", defaultTime: "13:00" },
  { key: "snack2", label: "Snack", icon: "🥪", defaultTime: "16:00" },
  { key: "abendessen", label: "Abendessen", icon: "🍽️", defaultTime: "19:00" },
  { key: "abendsnack", label: "Abend-Snack", icon: "🥛", defaultTime: "21:00" },
];

const POOLS = {
  fruehstueck: ["Haferflocken mit Obst und Nüssen", "Rührei mit Vollkornbrot", "Joghurt mit Beeren und Müsli", "Pfannkuchen mit Obst", "Vollkornbrot mit Frischkäse und Gurke", "Porridge mit Banane und Zimt", "Müsli mit Milch und Apfel"],
  snack1: ["Joghurt mit Obst", "Banane", "Handvoll Nüsse und Trockenobst", "Apfel mit Erdnussbutter", "Karotten mit Hummus", "Vollkorncracker mit Käse", "Obstsalat"],
  mittagessen: ["Nudeln mit Tomatensoße", "Reis mit Hähnchen und Gemüse", "Kartoffeln mit Ei und Salat", "Gemüsepfanne mit Reis", "Vollkornwrap mit Hähnchen und Gemüse", "Linsensuppe mit Brot", "Ofengemüse mit Couscous"],
  snack2: ["Brot mit Käse", "Joghurt mit Honig", "Studentenfutter", "Gurken- und Paprikasticks", "Rosinenbrot", "Quark mit Früchten", "Vollkornkeks mit Obst"],
  abendessen: ["Sandwich mit Käse und Gemüse", "Gebratenes Gemüse mit Tofu", "Suppe mit Brot", "Salat mit Ei und Brot", "Pellkartoffeln mit Quark", "Omelett mit Gemüse", "Vollkornpasta mit Pesto"],
  abendsnack: ["Warme Milch mit Honig", "Joghurt", "Handvoll Nüsse", "Ein Stück Obst", "Vollkornkeks"],
};

const RECIPES = [
  { id: "r1", name: "Nudeln mit Tomatensoße", keywords: ["nudeln", "pasta", "tomatensoße", "tomate"], time: "20 Min", servings: "2 Portionen",
    ingredients: [["Vollkornnudeln", "200 g"], ["Passierte Tomaten", "300 ml"], ["Zwiebel", "1 Stück"], ["Knoblauchzehe", "1 Stück"], ["Olivenöl", "1 EL"], ["Salz & Kräuter", "nach Geschmack"]],
    steps: ["Wasser für die Nudeln aufsetzen und salzen.", "Zwiebel und Knoblauch klein schneiden und in Öl glasig dünsten.", "Passierte Tomaten dazugeben, mit Kräutern würzen und 10 Minuten köcheln lassen.", "Nudeln nach Packungsanweisung kochen und abgießen.", "Nudeln mit der Soße vermengen und servieren."],
    alternatives: ["Statt Vollkornnudeln geht auch normale Pasta oder Reis.", "Für mehr Eiweiß: etwas geriebenen Käse oder Hüttenkäse untermischen."] },
  { id: "r2", name: "Rührei mit Vollkornbrot", keywords: ["ei", "eier", "rührei", "omelett"], time: "10 Min", servings: "1 Portion",
    ingredients: [["Eier", "2 Stück"], ["Milch", "2 EL"], ["Butter", "1 TL"], ["Vollkornbrot", "2 Scheiben"], ["Salz & Pfeffer", "nach Geschmack"]],
    steps: ["Eier mit Milch, Salz und Pfeffer verquirlen.", "Butter in der Pfanne bei mittlerer Hitze schmelzen.", "Eimasse hineingeben und langsam mit einem Holzlöffel stocken lassen.", "Vom Herd nehmen, solange es noch leicht cremig ist.", "Mit Vollkornbrot servieren."],
    alternatives: ["Mit Tomaten, Paprika oder Käse aufpeppen.", "Statt Rührei geht auch ein Omelett mit Gemüsefüllung."] },
  { id: "r3", name: "Vollkornwrap mit Gemüse und Hähnchen", keywords: ["wrap", "hähnchen", "chicken"], time: "15 Min", servings: "1 Portion",
    ingredients: [["Vollkorn-Wrap", "1 Stück"], ["Hähnchenbrust, gegart", "80 g"], ["Salatblätter", "etwas"], ["Paprika", "1/2 Stück"], ["Joghurt-Dip", "2 EL"]],
    steps: ["Hähnchen in Streifen schneiden (oder Reste vom Vortag nutzen).", "Wrap kurz erwärmen, damit er weich bleibt.", "Salat, Paprika und Hähnchen auf den Wrap verteilen.", "Etwas Joghurt-Dip darüber geben.", "Fest einrollen und servieren."],
    alternatives: ["Vegetarisch: Hähnchen durch Kichererbsen oder Halloumi ersetzen."] },
  { id: "r4", name: "Overnight Oats", keywords: ["hafer", "oats", "frühstück"], time: "5 Min + über Nacht", servings: "1 Portion",
    ingredients: [["Haferflocken", "50 g"], ["Milch oder Pflanzendrink", "120 ml"], ["Joghurt", "2 EL"], ["Obst nach Wahl", "eine Handvoll"], ["Honig", "1 TL"]],
    steps: ["Haferflocken, Milch, Joghurt und Honig in ein Glas geben.", "Gut umrühren.", "Über Nacht in den Kühlschrank stellen.", "Am Morgen mit frischem Obst toppen."],
    alternatives: ["Statt Honig geht auch etwas Ahornsirup oder Marmelade."] },
  { id: "r5", name: "Ofenkartoffeln mit Quark", keywords: ["kartoffel", "quark"], time: "35 Min", servings: "2 Portionen",
    ingredients: [["Kartoffeln", "500 g"], ["Olivenöl", "1 EL"], ["Speisequark", "200 g"], ["Schnittlauch", "etwas"], ["Salz & Pfeffer", "nach Geschmack"]],
    steps: ["Ofen auf 200 °C vorheizen.", "Kartoffeln halbieren, mit Öl und Salz vermengen.", "20–25 Minuten im Ofen backen, bis sie goldbraun sind.", "Quark mit Schnittlauch, Salz und Pfeffer verrühren.", "Kartoffeln mit dem Quark servieren."],
    alternatives: ["Mit etwas geriebenem Käse überbacken."] },
  { id: "r6", name: "Bunter Obstsalat", keywords: ["obst", "obstsalat", "snack"], time: "10 Min", servings: "2 Portionen",
    ingredients: [["Apfel", "1 Stück"], ["Banane", "1 Stück"], ["Trauben", "eine Handvoll"], ["Orangensaft", "2 EL"]],
    steps: ["Obst waschen und in mundgerechte Stücke schneiden.", "In einer Schüssel vermengen.", "Mit etwas Orangensaft beträufeln, damit es frisch bleibt."],
    alternatives: ["Mit einem Klecks Joghurt servieren für mehr Sättigung."] },
  { id: "r7", name: "Linsensuppe mit Brot", keywords: ["linsen", "suppe"], time: "30 Min", servings: "3 Portionen",
    ingredients: [["Rote Linsen", "200 g"], ["Karotte", "1 Stück"], ["Zwiebel", "1 Stück"], ["Gemüsebrühe", "800 ml"], ["Brot", "nach Bedarf"]],
    steps: ["Zwiebel und Karotte klein schneiden und andünsten.", "Linsen und Brühe dazugeben.", "20 Minuten köcheln lassen, bis die Linsen weich sind.", "Mit Salz und Kräutern abschmecken.", "Mit frischem Brot servieren."],
    alternatives: ["Ein Schuss Zitronensaft macht die Suppe besonders frisch."] },
  { id: "r8", name: "Vollkorn-Sandwich", keywords: ["sandwich", "brot", "snack"], time: "8 Min", servings: "1 Portion",
    ingredients: [["Vollkornbrot", "2 Scheiben"], ["Käse", "1–2 Scheiben"], ["Gurke/Tomate", "einige Scheiben"], ["Salatblatt", "1 Blatt"]],
    steps: ["Brotscheiben mit Belag deiner Wahl belegen.", "Gemüse und Salat hinzufügen.", "Zusammenklappen und servieren."],
    alternatives: ["Mit Putenbrust oder Hummus statt Käse."] },
];

const EXERCISES = [
  { id: "e1", name: "Liegestütze", keywords: ["liegestütz", "liegestütze", "push up", "pushup"],
    start: "Hände etwas breiter als schulterbreit auf dem Boden, Körper bildet eine gerade Linie von Kopf bis Ferse.",
    movement: "Ellbogen beugen und den Oberkörper kontrolliert absenken, bis die Brust fast den Boden berührt, dann wieder hochdrücken.",
    breathing: "Beim Runtergehen einatmen, beim Hochdrücken ausatmen.",
    mistakes: "Hüfte durchhängen lassen oder den Po zu hoch strecken – der Körper sollte immer eine gerade Linie bilden.",
    tips: "Bauch anspannen, Blick leicht nach vorne unten richten.",
    easier: "Liegestütze auf den Knien statt auf den Zehenspitzen, oder an einer erhöhten Kante (z. B. Tisch) ausführen." },
  { id: "e2", name: "Kniebeugen", keywords: ["kniebeug", "squat"],
    start: "Füße hüftbreit aufstellen, Zehen zeigen leicht nach außen.",
    movement: "Gesäß nach hinten unten schieben, als würdest du dich auf einen Stuhl setzen, bis die Oberschenkel etwa parallel zum Boden sind, dann wieder hochkommen.",
    breathing: "Beim Runtergehen einatmen, beim Hochkommen ausatmen.",
    mistakes: "Knie nach innen fallen lassen oder die Fersen vom Boden abheben.",
    tips: "Knie in Richtung der Zehenspitzen halten, Rücken gerade lassen.",
    easier: "Kniebeugen mit geringerer Tiefe oder mit Halt an einer Stuhllehne." },
  { id: "e3", name: "Ausfallschritte", keywords: ["ausfallschritt", "lunge"],
    start: "Aufrecht stehen, Hände in die Hüften oder locker seitlich.",
    movement: "Einen großen Schritt nach vorne machen und beide Knie beugen, bis das hintere Knie sich fast dem Boden nähert, dann zurück in die Ausgangsposition drücken.",
    breathing: "Beim Absenken einatmen, beim Hochdrücken ausatmen.",
    mistakes: "Das vordere Knie zu weit über die Zehenspitzen schieben.",
    tips: "Oberkörper aufrecht halten, Bewegung langsam und kontrolliert ausführen.",
    easier: "Kleinere Schritte machen und nicht so tief absenken." },
  { id: "e4", name: "Plank (Unterarmstütz)", keywords: ["plank", "unterarmstütz", "bauch"],
    start: "Unterarme und Zehenspitzen auf dem Boden, Ellbogen unter den Schultern.",
    movement: "Körper in einer geraden Linie halten und die Position für eine bestimmte Zeit halten.",
    breathing: "Ruhig und gleichmäßig weiteratmen, nicht die Luft anhalten.",
    mistakes: "Hüfte durchhängen lassen oder zu hoch strecken.",
    tips: "Bauchnabel Richtung Wirbelsäule ziehen, Gesäß leicht anspannen.",
    easier: "Plank auf den Knien statt auf den Zehenspitzen, kürzere Haltezeit." },
  { id: "e5", name: "Klimmzüge", keywords: ["klimmzug", "klimmzüge", "pull up"],
    start: "An einer Stange hängen, Hände etwas breiter als schulterbreit, Handflächen nach vorne.",
    movement: "Körper hochziehen, bis das Kinn über der Stange ist, dann kontrolliert wieder absenken.",
    breathing: "Beim Hochziehen ausatmen, beim Absenken einatmen.",
    mistakes: "Schwung holen (\"Kippen\") statt sauber zu ziehen.",
    tips: "Schulterblätter zuerst nach unten ziehen, dann erst die Arme einsetzen.",
    easier: "Klimmzüge mit Band-Unterstützung oder am Ring/Kasten mit Beinunterstützung üben." },
  { id: "e6", name: "Aufwärmen", keywords: ["aufwärm", "warm up", "warmup"],
    start: "Locker im Stand beginnen.",
    movement: "5 Minuten leichte Bewegung: auf der Stelle laufen, Hampelmänner, Armkreisen und Ausfallschritte ohne Gewicht.",
    breathing: "Normal und entspannt weiteratmen.",
    mistakes: "Das Aufwärmen ganz auslassen oder zu intensiv starten.",
    tips: "Ziel ist, warm zu werden und beweglich zu sein, nicht sich zu verausgaben.",
    easier: "Tempo und Bewegungsumfang jederzeit reduzieren." },
];

const QUICK_QUESTIONS = [
  { icon: "🍝", text: "Was soll ich heute essen?" },
  { icon: "🥚", text: "Mach mir ein Rezept." },
  { icon: "💪", text: "Wie mache ich Liegestütze richtig?" },
  { icon: "🏋️", text: "Was soll ich heute trainieren?" },
  { icon: "🔥", text: "Gib mir ein kurzes Training." },
];

const CATEGORIES = [
  { key: "schule", label: "Schule", icon: "📚", color: "#5AA9FF" },
  { key: "hausaufgaben", label: "Hausaufgaben", icon: "📝", color: "#FFB020" },
  { key: "training", label: "Training", icon: "💪", color: "#00E5A0" },
  { key: "freizeit", label: "Freizeit", icon: "🎮", color: "#FF3D81" },
  { key: "termine", label: "Termine", icon: "📅", color: "#B18CFF" },
  { key: "sonstiges", label: "Sonstiges", icon: "⭐", color: "#8892A6" },
];

const WEEKDAYS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const WEEKDAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS_DE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const GROWTH_NOTE = "Du wächst noch. Wenn du Fragen zu Gewicht, Ernährung oder Training hast, sprich mit deinen Eltern oder einer Ärztin/einem Arzt.";

/* ============================================================
   HILFSFUNKTIONEN
   ============================================================ */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const pad2 = (n) => String(n).padStart(2, "0");
const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const dayIndexMon0 = (d) => (d.getDay() + 6) % 7;
const timeNowStr = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
const timeToMinutes = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

function loadLS(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}
function saveLS(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
}

function buildDefaultMeals(dateObj, mealTimes) {
  const di = dayIndexMon0(dateObj);
  return SLOTS.map((slot, si) => {
    const pool = POOLS[slot.key];
    const name = pool[(di + si) % pool.length];
    return { id: uid(), slot: slot.key, name, time: mealTimes[slot.key] || slot.defaultTime, status: "offen", poolIndex: (di + si) % pool.length, favorite: false };
  });
}

function rotateMeal(meal) {
  const pool = POOLS[meal.slot];
  const nextIndex = (meal.poolIndex + 1) % pool.length;
  return { ...meal, name: pool[nextIndex], poolIndex: nextIndex };
}

function findRecipe(text) {
  const lower = text.toLowerCase();
  return RECIPES.find((r) => r.keywords.some((k) => lower.includes(k)));
}
function findExercise(text) {
  const lower = text.toLowerCase();
  return EXERCISES.find((e) => e.keywords.some((k) => lower.includes(k)));
}

const DIET_TRIGGERS = ["abnehmen", "diät", "kalorien zählen", "kalorienzähl", "weniger essen", "zunehmen schnell", "muskelaufbau schnell", "supplement", "protein pulver", "eiweißpulver", "fasten"];

function generateAIReply(input, ctx) {
  const lower = input.toLowerCase();

  if (DIET_TRIGGERS.some((t) => lower.includes(t))) {
    return { text: `Ich helfe dir total gerne, dich stark und fit zu fühlen 💪 Themen wie Abnehmen, Diäten, Kalorienzählen oder Nahrungsergänzung solltest du aber am besten mit deinen Eltern oder einer Ärztin/einem Arzt besprechen, weil dein Körper gerade noch wächst. Ich kann dir stattdessen gerne bei ausgewogenen, leckeren Mahlzeiten oder einem coolen altersgerechten Training helfen – frag mich einfach!` };
  }

  if (lower.includes("was soll ich heute essen") || (lower.includes("heute") && lower.includes("essen"))) {
    const next = ctx.todayMeals.find((m) => m.status !== "erledigt");
    if (next) {
      const rec = RECIPES.find((r) => r.name === next.name);
      return {
        text: `Auf deinem Plan steht für "${SLOTS.find((s) => s.key === next.slot)?.label}" gerade: ${next.name}. Klingt das gut, oder soll ich dir ein Rezept dazu zeigen?`,
        recipe: rec || null,
      };
    }
    return { text: "Sieht so aus, als hättest du heute schon alle Mahlzeiten erledigt – stark! 🎉 Soll ich dir trotzdem ein Rezept für morgen zeigen?" };
  }

  const recipeMatch = findRecipe(lower);
  if (lower.includes("rezept") || recipeMatch) {
    const rec = recipeMatch || RECIPES[Math.floor(Math.random() * RECIPES.length)];
    return { text: `Hier ist ein einfaches Rezept für ${rec.name}:`, recipe: rec };
  }

  if (lower.includes("snack")) {
    const rec = RECIPES.find((r) => r.keywords.includes("snack")) || RECIPES[5];
    return { text: `Als Snack schmeckt das hier gut:`, recipe: rec };
  }
  if (lower.includes("frühstück")) {
    const rec = RECIPES[0];
    return { text: `Für's Frühstück ein Vorschlag:`, recipe: rec };
  }

  const exMatch = findExercise(lower);
  if (exMatch) {
    return { text: `So machst du ${exMatch.name} richtig:`, exercise: exMatch };
  }

  if (lower.includes("was soll ich heute trainieren") || (lower.includes("heute") && lower.includes("trainier"))) {
    if (ctx.todayWorkout) {
      return { text: `Für heute steht bei dir schon "${ctx.todayWorkout.title}" auf dem Plan. Lust, loszulegen?` };
    }
    return { text: "Du hast heute noch kein Training geplant. Wie wäre es mit einem kurzen Ganzkörper-Workout?", workout: DEFAULT_WORKOUT() };
  }
  if (lower.includes("kurzes training") || lower.includes("training") || lower.includes("workout")) {
    return { text: "Hier ist ein kurzes, altersgerechtes Ganzkörper-Training:", workout: DEFAULT_WORKOUT() };
  }

  return { text: "Das habe ich nicht ganz verstanden 🤔 Frag mich zum Beispiel nach einem Rezept, einer Übung wie Liegestütze oder was du heute essen oder trainieren könntest!" };
}

function DEFAULT_WORKOUT() {
  return {
    title: "Kurzes Ganzkörper-Workout",
    durationMin: 15,
    exercises: [
      { name: "Aufwärmen", sets: 1, reps: "5 Min" },
      { name: "Kniebeugen", sets: 3, reps: "10" },
      { name: "Liegestütze", sets: 3, reps: "8 (auf Knien möglich)" },
      { name: "Ausfallschritte", sets: 3, reps: "10 je Seite" },
      { name: "Plank", sets: 3, reps: "20 Sek." },
    ],
    note: "Saubere Technik ist wichtiger als viele Wiederholungen. Bei Schmerzen sofort aufhören.",
  };
}

/* ============================================================
   STYLES
   ============================================================ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

.qd-root {
  --bg: #0B0E14;
  --surface: #131826;
  --surface-2: #1B2233;
  --surface-3: #232B40;
  --border: #2A3348;
  --text: #E8ECF4;
  --text-muted: #8892A6;
  --accent: #00E5A0;
  --accent-soft: rgba(0,229,160,0.15);
  --accent-2: #FF3D81;
  --accent-2-soft: rgba(255,61,129,0.15);
  --gold: #FFB020;
  --gold-soft: rgba(255,176,32,0.15);
  --danger: #FF5470;
  --radius: 18px;
  --radius-sm: 12px;
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  width: 100%;
  position: relative;
}
.qd-root.light {
  --bg: #F4F6FA;
  --surface: #FFFFFF;
  --surface-2: #F0F2F8;
  --surface-3: #E6E9F2;
  --border: #DDE2EE;
  --text: #141A26;
  --text-muted: #5C6478;
}
.qd-root * { box-sizing: border-box; }
.qd-display { font-family: 'Rajdhani', sans-serif; letter-spacing: 0.01em; }
.qd-mono { font-family: 'JetBrains Mono', monospace; }

.qd-app { display: flex; min-height: 100vh; }

/* Sidebar */
.qd-sidebar {
  width: 232px; flex-shrink: 0; background: var(--surface);
  border-right: 1px solid var(--border); padding: 20px 14px;
  display: flex; flex-direction: column; gap: 4px;
}
.qd-brand { display:flex; align-items:center; gap:10px; padding: 6px 10px 22px; }
.qd-brand-badge { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, var(--accent), var(--accent-2)); display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow: 0 0 20px var(--accent-soft); }
.qd-brand-text { font-size: 18px; font-weight:700; }
.qd-nav-item { display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius: var(--radius-sm); color: var(--text-muted); cursor:pointer; border:none; background:none; width:100%; text-align:left; font-size:14.5px; font-weight:600; transition: all .15s ease; }
.qd-nav-item:hover { background: var(--surface-2); color: var(--text); }
.qd-nav-item.active { background: var(--accent-soft); color: var(--accent); }
.qd-nav-item svg { flex-shrink:0; }

/* Topbar */
.qd-topbar { display:flex; align-items:center; justify-content:space-between; padding: 16px 28px; border-bottom: 1px solid var(--border); background: var(--surface); position: sticky; top:0; z-index: 20;}
.qd-clock { font-family:'JetBrains Mono', monospace; font-size: 20px; font-weight:600; letter-spacing: 0.03em;}
.qd-date { color: var(--text-muted); font-size: 13px; margin-top: 2px;}
.qd-topbar-right { display:flex; align-items:center; gap: 14px; }
.qd-icon-btn { position:relative; width:40px; height:40px; border-radius:12px; background: var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color: var(--text); }
.qd-icon-btn:hover { background: var(--surface-3); }
.qd-badge-dot { position:absolute; top:6px; right:6px; width:8px; height:8px; border-radius:50%; background: var(--accent-2); box-shadow: 0 0 8px var(--accent-2);}

.qd-xp-chip { display:flex; align-items:center; gap:8px; background: var(--surface-2); border:1px solid var(--border); border-radius: 999px; padding: 6px 14px 6px 8px; }
.qd-level-badge { width:26px; height:26px; border-radius:50%; background: linear-gradient(135deg, var(--gold), var(--accent-2)); display:flex; align-items:center; justify-content:center; font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px; color:#101318; }
.qd-xp-bar-track { width:70px; height:6px; border-radius:4px; background: var(--surface-3); overflow:hidden; }
.qd-xp-bar-fill { height:100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); }
.qd-streak { display:flex; align-items:center; gap:4px; font-size:13px; font-weight:700; color: var(--gold); }

.qd-main { flex:1; min-width:0; display:flex; flex-direction:column; }
.qd-content { padding: 26px 28px 100px; max-width: 1160px; width:100%; margin: 0 auto; }

.qd-h1 { font-family:'Rajdhani',sans-serif; font-size: 28px; font-weight:700; margin: 0 0 4px; }
.qd-sub { color: var(--text-muted); font-size: 14px; margin: 0 0 20px; }

.qd-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
.qd-card { background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); padding: 18px; }
.qd-card.done { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent) inset; }

.qd-meal-card { display:flex; flex-direction:column; gap:10px; }
.qd-meal-top { display:flex; align-items:center; justify-content:space-between; }
.qd-meal-icon { font-size: 26px; }
.qd-meal-time { font-family:'JetBrains Mono',monospace; font-size:13px; color: var(--text-muted); }
.qd-meal-name { font-size: 15px; font-weight:600; line-height:1.35; }
.qd-status-pill { font-size:11px; font-weight:700; padding: 3px 9px; border-radius:999px; text-transform:uppercase; letter-spacing:.03em; }
.qd-status-pill.offen { background: var(--surface-3); color: var(--text-muted); }
.qd-status-pill.erledigt { background: var(--accent-soft); color: var(--accent); }
.qd-meal-actions { display:flex; gap:8px; margin-top:4px; }

.qd-btn { display:inline-flex; align-items:center; gap:7px; justify-content:center; border:none; border-radius: var(--radius-sm); padding: 10px 16px; font-weight:700; font-size: 13.5px; cursor:pointer; transition: transform .1s ease, opacity .15s ease; font-family:'Inter',sans-serif;}
.qd-btn:active { transform: scale(0.97); }
.qd-btn-primary { background: linear-gradient(135deg, var(--accent), #00C48C); color:#06251C; }
.qd-btn-secondary { background: var(--surface-3); color: var(--text); }
.qd-btn-danger { background: var(--accent-2-soft); color: var(--accent-2); }
.qd-btn-ghost { background:transparent; color: var(--text-muted); border:1px solid var(--border); }
.qd-btn-sm { padding: 7px 11px; font-size:12.5px; }
.qd-btn:disabled { opacity:.45; cursor:not-allowed; }
.qd-btn-block { width:100%; }
.qd-icon-only { width:36px; height:36px; padding:0; }

.qd-section-title { font-family:'Rajdhani',sans-serif; font-size: 18px; font-weight:700; margin: 28px 0 14px; display:flex; align-items:center; gap:8px;}

.qd-progress-hero { display:flex; gap:18px; flex-wrap:wrap; margin-bottom: 24px; }
.qd-hero-stat { flex:1; min-width:160px; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); padding:18px 20px; }
.qd-hero-stat .num { font-family:'Rajdhani',sans-serif; font-size:30px; font-weight:700; }
.qd-hero-stat .lbl { color: var(--text-muted); font-size:12.5px; margin-top:2px; }

.qd-input, .qd-select, .qd-textarea {
  width:100%; background: var(--surface-2); border:1px solid var(--border); color: var(--text);
  border-radius: var(--radius-sm); padding: 10px 12px; font-size: 14px; font-family:'Inter',sans-serif;
}
.qd-input:focus, .qd-select:focus, .qd-textarea:focus { outline: 2px solid var(--accent); outline-offset:1px; }
.qd-label { font-size:12.5px; color: var(--text-muted); font-weight:600; margin-bottom:6px; display:block; }
.qd-field { margin-bottom: 14px; }

.qd-tabs { display:flex; gap:6px; margin-bottom:18px; flex-wrap:wrap; }
.qd-tab { padding:8px 16px; border-radius:999px; border:1px solid var(--border); background: var(--surface); color: var(--text-muted); font-weight:700; font-size:13px; cursor:pointer; }
.qd-tab.active { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }

.qd-modal-overlay { position:fixed; inset:0; background: rgba(4,6,10,0.6); backdrop-filter: blur(3px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
.qd-modal { background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); padding: 24px; width: 100%; max-width: 460px; max-height: 88vh; overflow-y:auto; }
.qd-modal-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.qd-modal-title { font-family:'Rajdhani',sans-serif; font-size:20px; font-weight:700; }

.qd-notif-panel { position:absolute; top:56px; right:28px; width: 340px; max-height: 420px; overflow-y:auto; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 60; padding: 10px; }
.qd-notif-item { display:flex; gap:10px; padding: 10px; border-radius: var(--radius-sm); }
.qd-notif-item.unread { background: var(--surface-2); }
.qd-notif-item + .qd-notif-item { margin-top:4px; }

.qd-toast-wrap { position:fixed; top:20px; right:20px; z-index: 200; display:flex; flex-direction:column; gap:12px; width: min(360px, 90vw); }
.qd-toast { background: var(--surface); border: 1px solid var(--accent); box-shadow: 0 0 24px var(--accent-soft); border-radius: var(--radius); padding:16px; animation: qd-slide-in .25s ease; }
@keyframes qd-slide-in { from { transform: translateX(30px); opacity:0;} to { transform:none; opacity:1; } }
@media (prefers-reduced-motion: reduce) { .qd-toast { animation:none; } }

/* Chat */
.qd-chat-layout { display:flex; gap:18px; height: calc(100vh - 200px); min-height: 460px; }
.qd-chat-sidebar { width: 220px; flex-shrink:0; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); padding: 12px; display:flex; flex-direction:column; gap:8px; overflow-y:auto;}
.qd-conv-item { padding:9px 10px; border-radius: var(--radius-sm); font-size:13px; cursor:pointer; color: var(--text-muted); display:flex; justify-content:space-between; align-items:center; gap:6px;}
.qd-conv-item.active { background: var(--surface-2); color: var(--text); }
.qd-chat-main { flex:1; display:flex; flex-direction:column; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius); overflow:hidden; }
.qd-chat-messages { flex:1; overflow-y:auto; padding: 20px; display:flex; flex-direction:column; gap:14px; }
.qd-msg { max-width: 78%; padding: 12px 14px; border-radius: 16px; font-size:14px; line-height:1.5; }
.qd-msg.user { align-self:flex-end; background: linear-gradient(135deg, var(--accent), #00C48C); color:#06251C; border-bottom-right-radius:4px; }
.qd-msg.ai { align-self:flex-start; background: var(--surface-2); border-bottom-left-radius:4px; }
.qd-chat-quick { display:flex; gap:8px; flex-wrap:wrap; padding: 0 16px 12px; }
.qd-quick-chip { border:1px solid var(--border); background: var(--surface-2); border-radius:999px; padding:7px 12px; font-size:12.5px; cursor:pointer; color:var(--text); }
.qd-chat-input-row { display:flex; gap:10px; padding: 14px 16px; border-top:1px solid var(--border); }
.qd-recipe-inline { margin-top:10px; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius-sm); padding:12px; }

/* Calendar */
.qd-cal-grid { display:grid; grid-template-columns: repeat(7, 1fr); gap:6px; }
.qd-cal-cell { min-height:92px; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius-sm); padding:6px; cursor:pointer; }
.qd-cal-cell.today { border-color: var(--accent); }
.qd-cal-cell.muted { opacity:.35; }
.qd-cal-daynum { font-family:'Rajdhani',sans-serif; font-weight:700; font-size:13px; }
.qd-cal-event { font-size:10.5px; padding:2px 5px; border-radius:5px; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:600; }

/* Mobile bottom nav */
.qd-bottom-nav { display:none; }
@media (max-width: 860px) {
  .qd-sidebar { display:none; }
  .qd-bottom-nav { display:flex; position:fixed; bottom:0; left:0; right:0; background: var(--surface); border-top:1px solid var(--border); z-index:50; padding: 6px 2px calc(env(safe-area-inset-bottom, 0px) + 4px); }
  .qd-bottom-nav button { flex:1; background:none; border:none; color: var(--text-muted); display:flex; flex-direction:column; align-items:center; gap:2px; font-size:10px; padding:6px 2px; font-weight:600; }
  .qd-bottom-nav button.active { color: var(--accent); }
  .qd-content { padding: 18px 14px 90px; }
  .qd-topbar { padding: 12px 16px; }
  .qd-chat-layout { flex-direction:column; height:auto; }
  .qd-chat-sidebar { width:100%; flex-direction:row; overflow-x:auto; }
  .qd-chat-messages { min-height: 320px; }
  .qd-notif-panel { right: 10px; left:10px; width:auto; }
}

.qd-checkbox-btn { width:30px; height:30px; border-radius:50%; border:2px solid var(--border); display:flex; align-items:center; justify-content:center; background:transparent; cursor:pointer; color: transparent; flex-shrink:0; }
.qd-checkbox-btn.checked { background: var(--accent); border-color: var(--accent); color:#06251C; }

.qd-empty { text-align:center; padding: 40px 20px; color: var(--text-muted); }
.qd-note { display:flex; gap:10px; background: var(--gold-soft); border:1px solid rgba(255,176,32,0.4); color: var(--gold); border-radius: var(--radius-sm); padding: 12px 14px; font-size:13px; align-items:flex-start; }
`;

/* ============================================================
   KLEINE UI-BAUSTEINE
   ============================================================ */

function Modal({ title, onClose, children }) {
  return (
    <div className="qd-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="qd-modal">
        <div className="qd-modal-head">
          <div className="qd-modal-title">{title}</div>
          <button className="qd-icon-btn qd-icon-only" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div className="qd-field"><label className="qd-label">{label}</label>{children}</div>;
}

/* ============================================================
   DASHBOARD
   ============================================================ */

function Dashboard({ now, todayMeals, toggleMeal, xp, level, streak, upcomingEvent, todayWorkout, goTo }) {
  const nextMeal = todayMeals.find((m) => m.status !== "erledigt");
  const doneCount = todayMeals.filter((m) => m.status === "erledigt").length;
  const countdown = useMemo(() => {
    if (!nextMeal) return null;
    const [h, m] = nextMeal.time.split(":").map(Number);
    const target = new Date(now); target.setHours(h, m, 0, 0);
    let diff = target - now;
    if (diff < 0) diff += 24 * 3600 * 1000;
    const hh = Math.floor(diff / 3600000);
    const mm = Math.floor((diff % 3600000) / 60000);
    const ss = Math.floor((diff % 60000) / 1000);
    return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
  }, [nextMeal, now]);

  return (
    <div>
      <h1 className="qd-h1">Hallo 👋</h1>
      <p className="qd-sub">{WEEKDAYS_DE[dayIndexMon0(now)]}, {now.getDate()}. {MONTHS_DE[now.getMonth()]} {now.getFullYear()}</p>

      <div className="qd-progress-hero">
        <div className="qd-hero-stat"><div className="num qd-display">{doneCount}/6</div><div className="lbl">Mahlzeiten heute erledigt</div></div>
        <div className="qd-hero-stat"><div className="num qd-display">{nextMeal ? nextMeal.name : "Alles erledigt 🎉"}</div><div className="lbl">{nextMeal ? `Nächste Mahlzeit · ${countdown}` : "Kein weiterer Punkt heute"}</div></div>
        <div className="qd-hero-stat"><div className="num qd-display">{upcomingEvent ? upcomingEvent.title : "—"}</div><div className="lbl">{upcomingEvent ? `Nächster Termin · ${upcomingEvent.time}` : "Kein Termin heute"}</div></div>
        <div className="qd-hero-stat"><div className="num qd-display">{todayWorkout ? todayWorkout.title : "—"}</div><div className="lbl">Nächstes Training</div></div>
      </div>

      <div className="qd-section-title">🍽️ Heutige Mahlzeiten</div>
      <div className="qd-grid">
        {todayMeals.map((meal) => {
          const slot = SLOTS.find((s) => s.key === meal.slot);
          const done = meal.status === "erledigt";
          return (
            <div key={meal.id} className={`qd-card qd-meal-card ${done ? "done" : ""}`}>
              <div className="qd-meal-top">
                <span className="qd-meal-icon">{slot.icon}</span>
                <button className={`qd-checkbox-btn ${done ? "checked" : ""}`} onClick={() => toggleMeal(meal.id)} aria-label="Mahlzeit erledigt">
                  {done ? <Check size={16} /> : null}
                </button>
              </div>
              <div className="qd-meal-name">{meal.name}</div>
              <div className="qd-meal-top">
                <span className="qd-meal-time"><Clock size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />{meal.time}</span>
                <span className={`qd-status-pill ${done ? "erledigt" : "offen"}`}>{done ? "Erledigt" : "Offen"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="qd-section-title">Schnellzugriff</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="qd-btn qd-btn-primary" onClick={() => goTo("ai")}><Bot size={16} /> KI fragen</button>
        <button className="qd-btn qd-btn-secondary" onClick={() => goTo("training")}><Dumbbell size={16} /> Training öffnen</button>
        <button className="qd-btn qd-btn-secondary" onClick={() => goTo("calendar")}><CalendarIcon size={16} /> Kalender öffnen</button>
      </div>
    </div>
  );
}

/* ============================================================
   ERNÄHRUNG
   ============================================================ */

function Nutrition({ todayMeals, toggleMeal, rotateMealAt, renameMeal, deleteMealName, addCustomMeal, favorites, toggleFavoriteMeal }) {
  const [editing, setEditing] = useState(null);
  const [newMealName, setNewMealName] = useState("");
  const [tab, setTab] = useState("plan");

  return (
    <div>
      <h1 className="qd-h1">🍽️ Ernährung</h1>
      <p className="qd-sub">Regelmäßig essen, abwechslungsreich bleiben — kein Diätdruck.</p>

      <div className="qd-tabs">
        <button className={`qd-tab ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>Heutiger Plan</button>
        <button className={`qd-tab ${tab === "fav" ? "active" : ""}`} onClick={() => setTab("fav")}>⭐ Favoriten</button>
      </div>

      {tab === "plan" && (
        <>
          <div className="qd-grid">
            {todayMeals.map((meal) => {
              const slot = SLOTS.find((s) => s.key === meal.slot);
              const done = meal.status === "erledigt";
              const isFav = favorites.meals.includes(meal.name);
              return (
                <div key={meal.id} className={`qd-card qd-meal-card ${done ? "done" : ""}`}>
                  <div className="qd-meal-top">
                    <span className="qd-meal-icon">{slot.icon}</span>
                    <button className="qd-icon-btn qd-icon-only" style={{ color: isFav ? "var(--gold)" : "var(--text-muted)" }} onClick={() => toggleFavoriteMeal(meal.name)}>
                      <Star size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                  {editing === meal.id ? (
                    <input className="qd-input" autoFocus value={newMealName} onChange={(e) => setNewMealName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { renameMeal(meal.id, newMealName || meal.name); setEditing(null); } }} />
                  ) : (
                    <div className="qd-meal-name">{meal.name}</div>
                  )}
                  <span className="qd-meal-time">{slot.label} · {meal.time}</span>
                  <div className="qd-meal-actions">
                    <button className="qd-btn qd-btn-secondary qd-btn-sm" onClick={() => rotateMealAt(meal.id)}><RefreshCw size={13} /> Andere Mahlzeit</button>
                    {editing === meal.id ? (
                      <button className="qd-btn qd-btn-primary qd-btn-sm" onClick={() => { renameMeal(meal.id, newMealName || meal.name); setEditing(null); }}>Speichern</button>
                    ) : (
                      <button className="qd-btn qd-btn-ghost qd-btn-sm" onClick={() => { setEditing(meal.id); setNewMealName(meal.name); }}><Pencil size={13} /></button>
                    )}
                    <button className={`qd-checkbox-btn ${done ? "checked" : ""}`} onClick={() => toggleMeal(meal.id)}>{done ? <Check size={16} /> : null}</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="qd-section-title">➕ Eigenes Lebensmittel/Mahlzeit hinzufügen</div>
          <div style={{ display: "flex", gap: 10, maxWidth: 420 }}>
            <input className="qd-input" placeholder="z. B. Selbstgemachte Suppe" value={newMealName === "__add__" ? "" : ""} onChange={() => {}} id="qd-new-meal-hidden" style={{ display: "none" }} />
            <AddMealInline onAdd={addCustomMeal} />
          </div>
        </>
      )}

      {tab === "fav" && (
        <>
          <div className="qd-section-title">⭐ Lieblingsgerichte</div>
          {favorites.meals.length === 0 && <div className="qd-empty">Noch keine Lieblingsgerichte gespeichert. Markiere Mahlzeiten mit dem Stern ⭐.</div>}
          <div className="qd-grid">
            {favorites.meals.map((name) => (
              <div key={name} className="qd-card">
                <div className="qd-meal-name">{name}</div>
                <button className="qd-btn qd-btn-danger qd-btn-sm" style={{ marginTop: 10 }} onClick={() => toggleFavoriteMeal(name)}><Trash2 size={13} /> Entfernen</button>
              </div>
            ))}
          </div>
          <div className="qd-section-title">📖 Gespeicherte Rezepte</div>
          {favorites.recipes.length === 0 && <div className="qd-empty">Noch keine Rezepte gespeichert. Speichere Rezepte im KI-Assistenten.</div>}
          <div className="qd-grid">
            {favorites.recipes.map((r) => (
              <div key={r.id} className="qd-card">
                <div className="qd-meal-name">{r.name}</div>
                <div className="qd-sub" style={{ margin: "6px 0" }}>{r.time} · {r.servings}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AddMealInline({ onAdd }) {
  const [val, setVal] = useState("");
  const [slot, setSlot] = useState(SLOTS[0].key);
  return (
    <div className="qd-card" style={{ maxWidth: 480 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select className="qd-select" style={{ maxWidth: 170 }} value={slot} onChange={(e) => setSlot(e.target.value)}>
          {SLOTS.map((s) => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
        </select>
        <input className="qd-input" style={{ flex: 1, minWidth: 160 }} placeholder="Name der Mahlzeit" value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="qd-btn qd-btn-primary" onClick={() => { if (val.trim()) { onAdd(slot, val.trim()); setVal(""); } }}><Plus size={15} /> Hinzufügen</button>
      </div>
    </div>
  );
}

/* ============================================================
   TRAINING
   ============================================================ */

function Training({ trainingPlan, addTraining, toggleTrainingDone, deleteTraining, history, favorites, toggleFavExercise, addFromWorkout }) {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("plan");

  return (
    <div>
      <h1 className="qd-h1">💪 Training</h1>
      <p className="qd-sub">Saubere Technik zählt mehr als schwere Gewichte. Bei Schmerzen sofort aufhören.</p>

      <div className="qd-tabs">
        <button className={`qd-tab ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>Plan</button>
        <button className={`qd-tab ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>Historie</button>
        <button className={`qd-tab ${tab === "fav" ? "active" : ""}`} onClick={() => setTab("fav")}>⭐ Übungen</button>
      </div>

      {tab === "plan" && (
        <>
          <button className="qd-btn qd-btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 18 }}><Plus size={15} /> Trainingstag festlegen</button>
          <div className="qd-grid">
            {trainingPlan.length === 0 && <div className="qd-empty">Noch kein Training geplant.</div>}
            {trainingPlan.map((t) => (
              <div key={t.id} className={`qd-card ${t.done ? "done" : ""}`}>
                <div className="qd-meal-top"><span style={{ fontWeight: 700 }}>{t.title}</span><span className="qd-meal-time">{t.date}</span></div>
                <ul style={{ margin: "10px 0", paddingLeft: 18, fontSize: 13, color: "var(--text-muted)" }}>
                  {t.exercises.map((ex, i) => <li key={i}>{ex.name} — {ex.sets}×{ex.reps}</li>)}
                </ul>
                {t.durationMin && <div className="qd-meal-time">⏱ {t.durationMin} Min</div>}
                <div className="qd-meal-actions">
                  <button className={`qd-btn qd-btn-sm ${t.done ? "qd-btn-secondary" : "qd-btn-primary"}`} onClick={() => toggleTrainingDone(t.id)}>{t.done ? "Erledigt ✓" : "Als erledigt markieren"}</button>
                  <button className="qd-btn qd-btn-danger qd-btn-sm" onClick={() => deleteTraining(t.id)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
          {showForm && <TrainingForm onClose={() => setShowForm(false)} onSave={(t) => { addTraining(t); setShowForm(false); }} />}
        </>
      )}

      {tab === "history" && (
        <div className="qd-grid">
          {history.length === 0 && <div className="qd-empty">Noch keine abgeschlossenen Trainings.</div>}
          {history.map((h) => (
            <div key={h.id} className="qd-card done">
              <div className="qd-meal-top"><span style={{ fontWeight: 700 }}>{h.title}</span><span className="qd-meal-time">{h.date}</span></div>
              <div className="qd-meal-time" style={{ marginTop: 6 }}>{h.exercises.length} Übungen{h.durationMin ? ` · ${h.durationMin} Min` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "fav" && (
        <div className="qd-grid">
          {EXERCISES.map((ex) => {
            const isFav = favorites.exercises.includes(ex.id);
            return (
              <div key={ex.id} className="qd-card">
                <div className="qd-meal-top">
                  <span style={{ fontWeight: 700 }}>{ex.name}</span>
                  <button className="qd-icon-btn qd-icon-only" style={{ color: isFav ? "var(--gold)" : "var(--text-muted)" }} onClick={() => toggleFavExercise(ex.id)}>
                    <Star size={16} fill={isFav ? "currentColor" : "none"} />
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>{ex.start}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrainingForm({ onClose, onSave }) {
  const [title, setTitle] = useState("Ganzkörper-Training");
  const [date, setDate] = useState(dateKey(new Date()));
  const [duration, setDuration] = useState(20);
  const [exercises, setExercises] = useState([{ name: "Kniebeugen", sets: 3, reps: "10" }]);

  const updateEx = (i, field, val) => setExercises((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));

  return (
    <Modal title="Trainingstag festlegen" onClose={onClose}>
      <Field label="Titel"><input className="qd-input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Datum"><input type="date" className="qd-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      <Field label="Dauer (Minuten)"><input type="number" className="qd-input" value={duration} onChange={(e) => setDuration(Number(e.target.value))} /></Field>
      <Field label="Übungen">
        {exercises.map((ex, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select className="qd-select" value={ex.name} onChange={(e) => updateEx(i, "name", e.target.value)}>
              {EXERCISES.map((e2) => <option key={e2.id} value={e2.name}>{e2.name}</option>)}
            </select>
            <input className="qd-input" style={{ width: 60 }} type="number" value={ex.sets} onChange={(e) => updateEx(i, "sets", Number(e.target.value))} />
            <input className="qd-input" style={{ width: 70 }} value={ex.reps} onChange={(e) => updateEx(i, "reps", e.target.value)} />
          </div>
        ))}
        <button className="qd-btn qd-btn-ghost qd-btn-sm" onClick={() => setExercises((p) => [...p, { name: "Liegestütze", sets: 3, reps: "8" }])}><Plus size={13} /> Übung hinzufügen</button>
      </Field>
      <button className="qd-btn qd-btn-primary qd-btn-block" onClick={() => onSave({ id: uid(), title, date, durationMin: duration, exercises, done: false })}>Speichern</button>
    </Modal>
  );
}

/* ============================================================
   KI-ASSISTENT
   ============================================================ */

function AIAssistant({ ctx, addRecipeToPlan, addWorkoutToPlan, favorites, toggleFavRecipe }) {
  const [conversations, setConversations] = useState(ctx.chat.conversations.length ? ctx.chat.conversations : [{ id: uid(), title: "Neue Unterhaltung", messages: [] }]);
  const [currentId, setCurrentId] = useState(ctx.chat.currentId || conversations[0].id);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { ctx.saveChat(conversations, currentId); }, [conversations, currentId]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [conversations, typing]);

  const current = conversations.find((c) => c.id === currentId) || conversations[0];

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: uid(), role: "user", text };
    setConversations((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? text.slice(0, 28) : c.title } : c));
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = generateAIReply(text, ctx);
      const aiMsg = { id: uid(), role: "ai", ...reply };
      setConversations((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: [...c.messages, aiMsg] } : c));
      setTyping(false);
    }, 550);
  };

  const newConversation = () => {
    const c = { id: uid(), title: "Neue Unterhaltung", messages: [] };
    setConversations((prev) => [c, ...prev]);
    setCurrentId(c.id);
  };
  const deleteConversation = (id) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) { const c = { id: uid(), title: "Neue Unterhaltung", messages: [] }; setCurrentId(c.id); return [c]; }
      if (id === currentId) setCurrentId(filtered[0].id);
      return filtered;
    });
  };
  const clearChat = () => setConversations((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: [] } : c));

  return (
    <div>
      <h1 className="qd-h1">🤖 KI-Assistent</h1>
      <p className="qd-sub">Frag mich zu Ernährung, Rezepten oder Training.</p>
      <div className="qd-chat-layout">
        <div className="qd-chat-sidebar">
          <button className="qd-btn qd-btn-primary qd-btn-block qd-btn-sm" onClick={newConversation}><Plus size={13} /> Neue Unterhaltung</button>
          {conversations.map((c) => (
            <div key={c.id} className={`qd-conv-item ${c.id === currentId ? "active" : ""}`} onClick={() => setCurrentId(c.id)}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title || "Unterhaltung"}</span>
              <X size={13} onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} />
            </div>
          ))}
        </div>
        <div className="qd-chat-main">
          <div className="qd-chat-messages" ref={scrollRef}>
            {current.messages.length === 0 && (
              <div className="qd-empty" style={{ margin: "auto" }}>
                <Sparkles size={26} style={{ marginBottom: 8 }} /><div>Stell mir eine Frage oder wähle unten eine Schnellfrage.</div>
              </div>
            )}
            {current.messages.map((m) => (
              <div key={m.id} className={`qd-msg ${m.role}`}>
                {m.text}
                {m.recipe && <RecipeMini recipe={m.recipe} onAdd={() => addRecipeToPlan(m.recipe)} isFav={favorites.recipes.some((r) => r.id === m.recipe.id)} onFav={() => toggleFavRecipe(m.recipe)} />}
                {m.exercise && <ExerciseMini exercise={m.exercise} />}
                {m.workout && <WorkoutMini workout={m.workout} onAdd={() => addWorkoutToPlan(m.workout)} />}
              </div>
            ))}
            {typing && <div className="qd-msg ai qd-mono">…tippt</div>}
          </div>
          <div className="qd-chat-quick">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q.text} className="qd-quick-chip" onClick={() => send(q.text)}>{q.icon} {q.text}</button>
            ))}
            <button className="qd-quick-chip" onClick={clearChat}><Trash2 size={12} style={{ verticalAlign: "-2px" }} /> Chat löschen</button>
          </div>
          <div className="qd-chat-input-row">
            <input className="qd-input" placeholder="Schreib mir eine Nachricht…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(input); }} />
            <button className="qd-btn qd-btn-primary qd-icon-only" onClick={() => send(input)}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeMini({ recipe, onAdd, isFav, onFav }) {
  return (
    <div className="qd-recipe-inline">
      <div className="qd-meal-top"><strong>{recipe.name}</strong>
        <button className="qd-icon-btn qd-icon-only" style={{ color: isFav ? "var(--gold)" : "var(--text-muted)" }} onClick={onFav}><Star size={15} fill={isFav ? "currentColor" : "none"} /></button>
      </div>
      <div className="qd-meal-time">⏱ {recipe.time} · {recipe.servings}</div>
      <div style={{ marginTop: 8, fontSize: 13 }}>
        <strong>Zutaten:</strong>
        <ul style={{ margin: "4px 0", paddingLeft: 18 }}>{recipe.ingredients.map(([n, a], i) => <li key={i}>{n} – {a}</li>)}</ul>
        <strong>Zubereitung:</strong>
        <ol style={{ margin: "4px 0", paddingLeft: 18 }}>{recipe.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        {recipe.alternatives?.length > 0 && <div style={{ color: "var(--text-muted)", marginTop: 6 }}>💡 {recipe.alternatives.join(" ")}</div>}
      </div>
      <button className="qd-btn qd-btn-primary qd-btn-sm" style={{ marginTop: 10 }} onClick={onAdd}><Plus size={13} /> Zum heutigen Essensplan hinzufügen</button>
    </div>
  );
}
function ExerciseMini({ exercise }) {
  return (
    <div className="qd-recipe-inline">
      <strong>{exercise.name}</strong>
      <ol style={{ margin: "8px 0", paddingLeft: 18, fontSize: 13 }}>
        <li><strong>Ausgangsposition:</strong> {exercise.start}</li>
        <li><strong>Bewegung:</strong> {exercise.movement}</li>
        <li><strong>Atmung:</strong> {exercise.breathing}</li>
        <li><strong>Häufige Fehler:</strong> {exercise.mistakes}</li>
        <li><strong>Tipps:</strong> {exercise.tips}</li>
      </ol>
      <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>🟢 Einfachere Variante: {exercise.easier}</div>
    </div>
  );
}
function WorkoutMini({ workout, onAdd }) {
  return (
    <div className="qd-recipe-inline">
      <strong>{workout.title}</strong> <span className="qd-meal-time">⏱ {workout.durationMin} Min</span>
      <ul style={{ margin: "8px 0", paddingLeft: 18, fontSize: 13 }}>
        {workout.exercises.map((e, i) => <li key={i}>{e.name} — {e.sets}×{e.reps}</li>)}
      </ul>
      <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{workout.note}</div>
      <button className="qd-btn qd-btn-primary qd-btn-sm" style={{ marginTop: 10 }} onClick={onAdd}><Plus size={13} /> Zum Trainingsplan hinzufügen</button>
    </div>
  );
}

/* ============================================================
   KALENDER
   ============================================================ */

function Calendar({ events, addEvent, updateEvent, deleteEvent }) {
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(new Date());
  const [showForm, setShowForm] = useState(null);
  const today = new Date();

  const monthMatrix = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = dayIndexMon0(first);
    const start = new Date(first); start.setDate(first.getDate() - startOffset);
    const days = [];
    for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
    return days;
  }, [cursor]);

  const eventsFor = (d) => events.filter((e) => e.date === dateKey(d));

  const shift = (delta) => {
    const c = new Date(cursor);
    if (view === "month") c.setMonth(c.getMonth() + delta);
    else if (view === "week") c.setDate(c.getDate() + delta * 7);
    else c.setDate(c.getDate() + delta);
    setCursor(c);
  };

  return (
    <div>
      <h1 className="qd-h1">📅 Kalender</h1>
      <div className="qd-tabs">
        {["month", "week", "day"].map((v) => (
          <button key={v} className={`qd-tab ${view === v ? "active" : ""}`} onClick={() => setView(v)}>{v === "month" ? "Monat" : v === "week" ? "Woche" : "Tag"}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <button className="qd-icon-btn qd-icon-only" onClick={() => shift(-1)}><ChevronLeft size={16} /></button>
        <div style={{ fontWeight: 700, fontFamily: "'Rajdhani',sans-serif", fontSize: 16 }}>
          {view === "month" ? `${MONTHS_DE[cursor.getMonth()]} ${cursor.getFullYear()}` : `${WEEKDAYS_DE[dayIndexMon0(cursor)]}, ${cursor.getDate()}. ${MONTHS_DE[cursor.getMonth()]}`}
        </div>
        <button className="qd-icon-btn qd-icon-only" onClick={() => shift(1)}><ChevronRight size={16} /></button>
        <button className="qd-btn qd-btn-primary qd-btn-sm" style={{ marginLeft: "auto" }} onClick={() => setShowForm({ date: dateKey(cursor) })}><Plus size={13} /> Termin erstellen</button>
      </div>

      {view === "month" && (
        <>
          <div className="qd-cal-grid" style={{ marginBottom: 4 }}>
            {WEEKDAYS_SHORT.map((w) => <div key={w} style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>{w}</div>)}
          </div>
          <div className="qd-cal-grid">
            {monthMatrix.map((d, i) => {
              const isToday = dateKey(d) === dateKey(today);
              const inMonth = d.getMonth() === cursor.getMonth();
              const evs = eventsFor(d);
              return (
                <div key={i} className={`qd-cal-cell ${isToday ? "today" : ""} ${inMonth ? "" : "muted"}`} onClick={() => setShowForm({ date: dateKey(d) })}>
                  <div className="qd-cal-daynum">{d.getDate()}</div>
                  {evs.slice(0, 3).map((e) => {
                    const cat = CATEGORIES.find((c) => c.key === e.category);
                    return <div key={e.id} className="qd-cal-event" style={{ background: (cat?.color || "#888") + "33", color: cat?.color }}>{cat?.icon} {e.title}</div>;
                  })}
                  {evs.length > 3 && <div className="qd-meal-time" style={{ fontSize: 10 }}>+{evs.length - 3} mehr</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {(view === "week" || view === "day") && (
        <div className="qd-grid">
          {(view === "day" ? [cursor] : Array.from({ length: 7 }, (_, i) => { const s = new Date(cursor); s.setDate(s.getDate() - dayIndexMon0(cursor) + i); return s; })).map((d, i) => {
            const evs = eventsFor(d).sort((a, b) => a.time.localeCompare(b.time));
            return (
              <div key={i} className="qd-card">
                <div className="qd-meal-top"><strong>{WEEKDAYS_DE[dayIndexMon0(d)]}</strong><span className="qd-meal-time">{d.getDate()}.{d.getMonth() + 1}.</span></div>
                {evs.length === 0 && <div className="qd-meal-time" style={{ marginTop: 8 }}>Keine Termine</div>}
                {evs.map((e) => {
                  const cat = CATEGORIES.find((c) => c.key === e.category);
                  return (
                    <div key={e.id} style={{ marginTop: 8, padding: 8, borderRadius: 10, background: "var(--surface-2)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{cat?.icon} {e.title}</div>
                      <div className="qd-meal-time">{e.time}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <button className="qd-btn qd-btn-ghost qd-btn-sm" onClick={() => setShowForm(e)}><Pencil size={12} /></button>
                        <button className="qd-btn qd-btn-danger qd-btn-sm" onClick={() => deleteEvent(e.id)}><Trash2 size={12} /></button>
                      </div>
                    </div>
                  );
                })}
                <button className="qd-btn qd-btn-ghost qd-btn-sm qd-btn-block" style={{ marginTop: 10 }} onClick={() => setShowForm({ date: dateKey(d) })}><Plus size={12} /> Termin</button>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <EventForm
          initial={showForm}
          onClose={() => setShowForm(null)}
          onSave={(ev) => { if (ev.id) updateEvent(ev); else addEvent({ ...ev, id: uid() }); setShowForm(null); }}
        />
      )}
    </div>
  );
}

function EventForm({ initial, onClose, onSave }) {
  const [title, setTitle] = useState(initial.title || "");
  const [date, setDate] = useState(initial.date || dateKey(new Date()));
  const [time, setTime] = useState(initial.time || "09:00");
  const [category, setCategory] = useState(initial.category || "termine");
  const [recurring, setRecurring] = useState(initial.recurring || "none");
  const [reminder, setReminder] = useState(initial.reminder !== undefined ? initial.reminder : true);

  return (
    <Modal title={initial.id ? "Termin bearbeiten" : "Termin erstellen"} onClose={onClose}>
      <Field label="Titel"><input className="qd-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Matheunterricht" /></Field>
      <Field label="Datum"><input type="date" className="qd-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      <Field label="Uhrzeit"><input type="time" className="qd-input" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      <Field label="Kategorie">
        <select className="qd-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.icon} {c.label}</option>)}
        </select>
      </Field>
      <Field label="Wiederholung">
        <select className="qd-select" value={recurring} onChange={(e) => setRecurring(e.target.value)}>
          <option value="none">Einmalig</option><option value="daily">Täglich</option><option value="weekly">Wöchentlich</option>
        </select>
      </Field>
      <Field label="Erinnerung">
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <input type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} /> Vor dem Termin erinnern
        </label>
      </Field>
      <button className="qd-btn qd-btn-primary qd-btn-block" disabled={!title.trim()} onClick={() => onSave({ id: initial.id, title, date, time, category, recurring, reminder })}>Speichern</button>
    </Modal>
  );
}

/* ============================================================
   FORTSCHRITT
   ============================================================ */

function Progress({ mealsByDate, trainingHistory, weightLog, addWeight }) {
  const [weightInput, setWeightInput] = useState("");

  const last14 = useMemo(() => {
    const arr = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const meals = mealsByDate[key];
      const done = meals ? meals.filter((m) => m.status === "erledigt").length : 0;
      arr.push({ label: `${d.getDate()}.${d.getMonth() + 1}.`, done });
    }
    return arr;
  }, [mealsByDate]);

  const workoutsByWeek = useMemo(() => {
    const counts = {};
    trainingHistory.forEach((h) => {
      const d = new Date(h.date);
      const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + dayIndexMon0(new Date(d.getFullYear(), d.getMonth(), 1))) / 7)}`;
      counts[week] = (counts[week] || 0) + 1;
    });
    return Object.entries(counts).slice(-8);
  }, [trainingHistory]);

  const maxMeal = Math.max(1, ...last14.map((d) => d.done));

  return (
    <div>
      <h1 className="qd-h1">📈 Fortschritt</h1>
      <div className="qd-note" style={{ marginBottom: 22 }}><Info size={18} style={{ flexShrink: 0, marginTop: 1 }} /> {GROWTH_NOTE}</div>

      <div className="qd-section-title">🍽️ Erledigte Mahlzeiten (letzte 14 Tage)</div>
      <div className="qd-card" style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140, overflowX: "auto" }}>
        {last14.map((d, i) => (
          <div key={i} style={{ flex: 1, minWidth: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: `${(d.done / 6) * 90}px`, background: "linear-gradient(180deg, var(--accent), #00C48C)", borderRadius: "6px 6px 0 0" }} title={`${d.done}/6`} />
            <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>{d.label}</div>
          </div>
        ))}
      </div>

      <div className="qd-section-title">💪 Trainingshäufigkeit (pro Woche)</div>
      <div className="qd-card" style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
        {workoutsByWeek.length === 0 && <div className="qd-empty">Noch keine abgeschlossenen Trainings.</div>}
        {workoutsByWeek.map(([week, count], i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", height: `${count * 18}px`, background: "linear-gradient(180deg, var(--accent-2), #B8225A)", borderRadius: "6px 6px 0 0" }} />
            <div style={{ fontSize: 9.5, color: "var(--text-muted)" }}>{week.split("-W")[1]}. Woche</div>
          </div>
        ))}
      </div>

      <div className="qd-section-title">⚖️ Körpergewicht (freiwillig)</div>
      <div className="qd-card">
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 0 }}>Das Gewicht wird hier nur angezeigt — ohne Bewertung. Trage nur ein, wenn du möchtest.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input className="qd-input" style={{ maxWidth: 140 }} type="number" placeholder="kg" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} />
          <button className="qd-btn qd-btn-primary" onClick={() => { if (weightInput) { addWeight(Number(weightInput)); setWeightInput(""); } }}><Plus size={14} /> Eintragen</button>
        </div>
        {weightLog.length === 0 ? <div className="qd-empty">Noch keine Einträge.</div> : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
            {weightLog.slice(-14).map((w, i) => {
              const vals = weightLog.slice(-14).map((x) => x.value);
              const min = Math.min(...vals), max = Math.max(...vals);
              const h = max === min ? 50 : 20 + ((w.value - min) / (max - min)) * 70;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", height: `${h}px`, background: "linear-gradient(180deg, var(--gold), #B8790A)", borderRadius: "6px 6px 0 0" }} title={`${w.value} kg`} />
                  <div style={{ fontSize: 9 }}>{w.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   EINSTELLUNGEN
   ============================================================ */

function SettingsPage({ settings, updateSettings, resetAll, notifPermission, requestNotifPermission }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  return (
    <div>
      <h1 className="qd-h1">⚙️ Einstellungen</h1>

      <div className="qd-section-title">🍽️ Mahlzeitenzeiten</div>
      <div className="qd-card">
        <div className="qd-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))" }}>
          {SLOTS.map((s) => (
            <Field key={s.key} label={`${s.icon} ${s.label}`}>
              <input type="time" className="qd-input" value={settings.mealTimes[s.key]} onChange={(e) => updateSettings({ mealTimes: { ...settings.mealTimes, [s.key]: e.target.value } })} />
            </Field>
          ))}
        </div>
      </div>

      <div className="qd-section-title">🔔 Erinnerungen</div>
      <div className="qd-card">
        <ToggleRow label="Erinnerungen aktiv" checked={settings.remindersEnabled} onChange={(v) => updateSettings({ remindersEnabled: v })} />
        <ToggleRow label="Erinnerungston" checked={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} />
        <ToggleRow label="Browser-Benachrichtigungen" checked={settings.browserNotifications} onChange={(v) => { updateSettings({ browserNotifications: v }); if (v) requestNotifPermission(); }} />
        {settings.browserNotifications && notifPermission !== "granted" && <div className="qd-note" style={{ marginTop: 10 }}><Info size={16} /> Bitte erlaube Benachrichtigungen im Browser, damit diese Funktion arbeitet.</div>}
      </div>

      <div className="qd-section-title">🎨 Darstellung</div>
      <div className="qd-card">
        <ToggleRow label="Dark Mode" checked={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} />
      </div>

      <div className="qd-section-title">🗑️ Daten</div>
      <div className="qd-card">
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Löscht alle gespeicherten Daten (Mahlzeiten, Termine, Training, Favoriten, Chats) unwiderruflich aus diesem Browser.</p>
        <button className="qd-btn qd-btn-danger" onClick={() => setConfirmOpen(true)}><Trash2 size={14} /> Alle Daten löschen</button>
      </div>

      {confirmOpen && (
        <Modal title="Wirklich alle Daten löschen?" onClose={() => setConfirmOpen(false)}>
          <p style={{ fontSize: 13.5 }}>Diese Aktion kann nicht rückgängig gemacht werden. Gib zur Bestätigung <strong>LÖSCHEN</strong> ein.</p>
          <input className="qd-input" style={{ margin: "12px 0" }} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          <div style={{ display: "flex", gap: 10 }}>
            <button className="qd-btn qd-btn-secondary qd-btn-block" onClick={() => setConfirmOpen(false)}>Abbrechen</button>
            <button className="qd-btn qd-btn-danger qd-btn-block" disabled={confirmText !== "LÖSCHEN"} onClick={() => { resetAll(); setConfirmOpen(false); }}>Endgültig löschen</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <span onClick={() => onChange(!checked)} style={{ width: 42, height: 24, borderRadius: 999, background: checked ? "var(--accent)" : "var(--surface-3)", position: "relative", transition: "background .15s" }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
      </span>
    </label>
  );
}

/* ============================================================
   HAUPTKOMPONENTE
   ============================================================ */

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "nutrition", label: "Ernährung", icon: Utensils },
  { key: "training", label: "Training", icon: Dumbbell },
  { key: "ai", label: "KI-Assistent", icon: Bot },
  { key: "calendar", label: "Kalender", icon: CalendarIcon },
  { key: "progress", label: "Fortschritt", icon: TrendingUp },
  { key: "settings", label: "Einstellungen", icon: SettingsIcon },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [now, setNow] = useState(new Date());
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");

  const [settings, setSettings] = useState(() => loadLS("qd_settings", {
    mealTimes: Object.fromEntries(SLOTS.map((s) => [s.key, s.defaultTime])),
    remindersEnabled: true, soundEnabled: true, browserNotifications: false, darkMode: true,
  }));
  const [mealsByDate, setMealsByDate] = useState(() => loadLS("qd_meals", {}));
  const [trainingPlan, setTrainingPlan] = useState(() => loadLS("qd_training_plan", []));
  const [trainingHistory, setTrainingHistory] = useState(() => loadLS("qd_training_history", []));
  const [events, setEvents] = useState(() => loadLS("qd_events", []));
  const [favorites, setFavorites] = useState(() => loadLS("qd_favorites", { meals: [], recipes: [], exercises: [] }));
  const [notifications, setNotifications] = useState(() => loadLS("qd_notifications", []));
  const [xp, setXp] = useState(() => loadLS("qd_xp", 0));
  const [weightLog, setWeightLog] = useState(() => loadLS("qd_weight", []));
  const [chatData, setChatData] = useState(() => loadLS("qd_chat", { conversations: [], currentId: null }));
  const notifiedKeysRef = useRef(new Set(loadLS("qd_notified_keys", [])));

  const todayKey = dateKey(now);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => saveLS("qd_settings", settings), [settings]);
  useEffect(() => saveLS("qd_meals", mealsByDate), [mealsByDate]);
  useEffect(() => saveLS("qd_training_plan", trainingPlan), [trainingPlan]);
  useEffect(() => saveLS("qd_training_history", trainingHistory), [trainingHistory]);
  useEffect(() => saveLS("qd_events", events), [events]);
  useEffect(() => saveLS("qd_favorites", favorites), [favorites]);
  useEffect(() => saveLS("qd_notifications", notifications), [notifications]);
  useEffect(() => saveLS("qd_xp", xp), [xp]);
  useEffect(() => saveLS("qd_weight", weightLog), [weightLog]);
  useEffect(() => saveLS("qd_chat", chatData), [chatData]);

  useEffect(() => {
    if (!mealsByDate[todayKey]) {
      setMealsByDate((prev) => ({ ...prev, [todayKey]: buildDefaultMeals(now, settings.mealTimes) }));
    }
    // eslint-disable-next-line
  }, [todayKey]);

  const todayMeals = mealsByDate[todayKey] || [];

  const pushNotification = useCallback((notif) => {
    setNotifications((prev) => [{ id: uid(), read: false, time: timeNowStr(new Date()), ...notif }, ...prev].slice(0, 50));
    setToasts((prev) => [...prev, { id: uid(), ...notif }]);
    if (settings.browserNotifications && typeof Notification !== "undefined" && Notification.permission === "granted") {
      try { new Notification(notif.title, { body: notif.message }); } catch (e) { /* ignore */ }
    }
  }, [settings.browserNotifications]);

  useEffect(() => {
    if (!settings.remindersEnabled) return;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    todayMeals.forEach((meal) => {
      const key = `meal-${todayKey}-${meal.slot}`;
      if (meal.status !== "erledigt" && timeToMinutes(meal.time) <= nowMin && !notifiedKeysRef.current.has(key)) {
        notifiedKeysRef.current.add(key);
        saveLS("qd_notified_keys", Array.from(notifiedKeysRef.current));
        pushNotification({ type: "meal", title: "Essenszeit! 🍽️", message: `Zeit für: ${meal.name}`, mealId: meal.id });
      }
    });
    events.filter((e) => e.date === todayKey && e.reminder).forEach((e) => {
      const key = `event-${e.id}-${todayKey}`;
      const diff = timeToMinutes(e.time) - nowMin;
      if (diff <= 15 && diff >= 0 && !notifiedKeysRef.current.has(key)) {
        notifiedKeysRef.current.add(key);
        saveLS("qd_notified_keys", Array.from(notifiedKeysRef.current));
        pushNotification({ type: "event", title: "Termin bald! 📅", message: `${e.title} um ${e.time}` });
      }
    });
    trainingPlan.filter((t) => t.date === todayKey && !t.done).forEach((t) => {
      const key = `training-${t.id}-${todayKey}`;
      if (!notifiedKeysRef.current.has(key)) {
        notifiedKeysRef.current.add(key);
        saveLS("qd_notified_keys", Array.from(notifiedKeysRef.current));
        pushNotification({ type: "training", title: "Training heute! 💪", message: `Vergiss nicht: ${t.title}` });
      }
    });
    // eslint-disable-next-line
  }, [now.getMinutes(), settings.remindersEnabled]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => setToasts((prev) => prev.slice(1)), 6000);
    return () => clearTimeout(t);
  }, [toasts]);

  const requestNotifPermission = () => {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then(setNotifPermission);
  };

  const toggleMeal = (id) => {
    setMealsByDate((prev) => {
      const list = prev[todayKey].map((m) => m.id === id ? { ...m, status: m.status === "erledigt" ? "offen" : "erledigt" } : m);
      return { ...prev, [todayKey]: list };
    });
    const meal = todayMeals.find((m) => m.id === id);
    setXp((x) => Math.max(0, x + (meal.status === "erledigt" ? -10 : 10)));
  };
  const rotateMealAt = (id) => setMealsByDate((prev) => ({ ...prev, [todayKey]: prev[todayKey].map((m) => m.id === id ? rotateMeal(m) : m) }));
  const renameMeal = (id, name) => setMealsByDate((prev) => ({ ...prev, [todayKey]: prev[todayKey].map((m) => m.id === id ? { ...m, name } : m) }));
  const addCustomMeal = (slotKey, name) => setMealsByDate((prev) => ({ ...prev, [todayKey]: [...prev[todayKey], { id: uid(), slot: slotKey, name, time: settings.mealTimes[slotKey], status: "offen", poolIndex: 0 }] }));
  const toggleFavoriteMeal = (name) => setFavorites((prev) => ({ ...prev, meals: prev.meals.includes(name) ? prev.meals.filter((n) => n !== name) : [...prev.meals, name] }));
  const toggleFavRecipe = (recipe) => setFavorites((prev) => ({ ...prev, recipes: prev.recipes.some((r) => r.id === recipe.id) ? prev.recipes.filter((r) => r.id !== recipe.id) : [...prev.recipes, recipe] }));
  const toggleFavExercise = (id) => setFavorites((prev) => ({ ...prev, exercises: prev.exercises.includes(id) ? prev.exercises.filter((e) => e !== id) : [...prev.exercises, id] }));

  const addRecipeToPlan = (recipe) => {
    setMealsByDate((prev) => {
      const list = prev[todayKey].map((m) => m.status !== "erledigt" ? { ...m, name: recipe.name, matched: true } : m);
      const firstOpenIdx = list.findIndex((m) => m.status !== "erledigt");
      if (firstOpenIdx === -1) return prev;
      const updated = prev[todayKey].map((m, i) => i === firstOpenIdx ? { ...m, name: recipe.name } : m);
      return { ...prev, [todayKey]: updated };
    });
  };

  const addTraining = (t) => {
    setTrainingPlan((prev) => [...prev, t]);
    setEvents((prev) => [...prev, { id: uid(), title: t.title, date: t.date, time: "17:00", category: "training", recurring: "none", reminder: true }]);
  };
  const addWorkoutToPlan = (workout) => addTraining({ id: uid(), title: workout.title, date: todayKey, durationMin: workout.durationMin, exercises: workout.exercises, done: false });
  const deleteTraining = (id) => setTrainingPlan((prev) => prev.filter((t) => t.id !== id));
  const toggleTrainingDone = (id) => {
    const t = trainingPlan.find((x) => x.id === id);
    if (!t) return;
    if (!t.done) { setTrainingHistory((prev) => [{ ...t, done: true }, ...prev]); setXp((x) => x + 20); }
    else { setTrainingHistory((prev) => prev.filter((h) => h.id !== id)); setXp((x) => Math.max(0, x - 20)); }
    setTrainingPlan((prev) => prev.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  };

  const addEvent = (ev) => setEvents((prev) => [...prev, ev]);
  const updateEvent = (ev) => setEvents((prev) => prev.map((e) => e.id === ev.id ? ev : e));
  const deleteEvent = (id) => setEvents((prev) => prev.filter((e) => e.id !== id));

  const addWeight = (value) => setWeightLog((prev) => [...prev, { date: todayKey, value }]);

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));
  const resetAll = () => {
    ["qd_settings", "qd_meals", "qd_training_plan", "qd_training_history", "qd_events", "qd_favorites", "qd_notifications", "qd_xp", "qd_weight", "qd_chat", "qd_notified_keys"].forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const upcomingEvent = useMemo(() => {
    const todays = events.filter((e) => e.date === todayKey).sort((a, b) => a.time.localeCompare(b.time));
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return todays.find((e) => timeToMinutes(e.time) >= nowMin) || todays[0];
  }, [events, todayKey, now]);

  const todayWorkout = trainingPlan.find((t) => t.date === todayKey && !t.done);

  const level = Math.floor(xp / 100) + 1;
  const xpIntoLevel = xp % 100;

  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const meals = mealsByDate[key];
      if (meals && meals.filter((m) => m.status === "erledigt").length >= 5) s++;
      else break;
    }
    return s;
  }, [mealsByDate, now]);

  const ctx = {
    todayMeals, todayWorkout,
    chat: { conversations: chatData.conversations, currentId: chatData.currentId },
    saveChat: (conversations, currentId) => setChatData({ conversations, currentId }),
  };

  const goTo = (p) => setPage(p);

  return (
    <div className={`qd-root ${settings.darkMode ? "" : "light"}`}>
      <style>{STYLES}</style>
      <div className="qd-app">
        <aside className="qd-sidebar">
          <div className="qd-brand"><div className="qd-brand-badge">⚡</div><div className="qd-brand-text qd-display">QuestBoard</div></div>
          {NAV.map((n) => (
            <button key={n.key} className={`qd-nav-item ${page === n.key ? "active" : ""}`} onClick={() => setPage(n.key)}>
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </aside>

        <div className="qd-main">
          <div className="qd-topbar">
            <div>
              <div className="qd-clock qd-mono">{timeNowStr(now)}</div>
              <div className="qd-date">{WEEKDAYS_DE[dayIndexMon0(now)]}, {now.getDate()}. {MONTHS_DE[now.getMonth()]} {now.getFullYear()}</div>
            </div>
            <div className="qd-topbar-right">
              <div className="qd-xp-chip">
                <div className="qd-level-badge">{level}</div>
                <div className="qd-xp-bar-track"><div className="qd-xp-bar-fill" style={{ width: `${xpIntoLevel}%` }} /></div>
                {streak > 0 && <div className="qd-streak"><Flame size={14} /> {streak}</div>}
              </div>
              <div className="qd-icon-btn" onClick={() => setNotifOpen((o) => !o)}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="qd-badge-dot" />}
              </div>
            </div>
          </div>

          {notifOpen && (
            <div className="qd-notif-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px 10px" }}>
                <strong style={{ fontSize: 14 }}>Benachrichtigungen</strong>
                <button className="qd-btn qd-btn-ghost qd-btn-sm" onClick={markAllRead}>Alle als gelesen markieren</button>
              </div>
              {notifications.length === 0 && <div className="qd-empty">Keine Benachrichtigungen.</div>}
              {notifications.map((n) => (
                <div key={n.id} className={`qd-notif-item ${n.read ? "" : "unread"}`}>
                  <AlarmClock size={16} style={{ flexShrink: 0, marginTop: 2, color: "var(--accent)" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{n.message}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="qd-content">
            {page === "dashboard" && <Dashboard now={now} todayMeals={todayMeals} toggleMeal={toggleMeal} xp={xp} level={level} streak={streak} upcomingEvent={upcomingEvent} todayWorkout={todayWorkout} goTo={goTo} />}
            {page === "nutrition" && <Nutrition todayMeals={todayMeals} toggleMeal={toggleMeal} rotateMealAt={rotateMealAt} renameMeal={renameMeal} addCustomMeal={addCustomMeal} favorites={favorites} toggleFavoriteMeal={toggleFavoriteMeal} />}
            {page === "training" && <Training trainingPlan={trainingPlan} addTraining={addTraining} toggleTrainingDone={toggleTrainingDone} deleteTraining={deleteTraining} history={trainingHistory} favorites={favorites} toggleFavExercise={toggleFavExercise} />}
            {page === "ai" && <AIAssistant ctx={ctx} addRecipeToPlan={addRecipeToPlan} addWorkoutToPlan={addWorkoutToPlan} favorites={favorites} toggleFavRecipe={toggleFavRecipe} />}
            {page === "calendar" && <Calendar events={events} addEvent={addEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} />}
            {page === "progress" && <Progress mealsByDate={mealsByDate} trainingHistory={trainingHistory} weightLog={weightLog} addWeight={addWeight} />}
            {page === "settings" && <SettingsPage settings={settings} updateSettings={updateSettings} resetAll={resetAll} notifPermission={notifPermission} requestNotifPermission={requestNotifPermission} />}
          </div>
        </div>
      </div>

      <nav className="qd-bottom-nav">
        {NAV.map((n) => (
          <button key={n.key} className={page === n.key ? "active" : ""} onClick={() => setPage(n.key)}>
            <n.icon size={18} /> {n.label}
          </button>
        ))}
      </nav>

      <div className="qd-toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="qd-toast">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{t.message}</div>
              </div>
              <X size={16} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
            </div>
            {t.type === "meal" && t.mealId && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="qd-btn qd-btn-primary qd-btn-sm" onClick={() => { toggleMeal(t.mealId); setToasts((prev) => prev.filter((x) => x.id !== t.id)); }}>Erledigt</button>
                <button className="qd-btn qd-btn-secondary qd-btn-sm" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>Später erinnern</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
