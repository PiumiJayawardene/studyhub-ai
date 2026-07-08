import {
  Book,
  Calculator,
  FlaskConical,
  Globe,
  Code,
  Music,
  Palette,
  Landmark,
  Dna,
  Languages,
  type LucideIcon,
} from "lucide-react";

export const subjectIcons: Record<string, LucideIcon> = {
  book: Book,
  calculator: Calculator,
  flask: FlaskConical,
  globe: Globe,
  code: Code,
  music: Music,
  palette: Palette,
  landmark: Landmark,
  dna: Dna,
  languages: Languages,
};

export const iconOptions = Object.keys(subjectIcons);

export const colorOptions = [
  "#6366f1",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#64748b",
];