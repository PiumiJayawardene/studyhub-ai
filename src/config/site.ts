
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  Layers,
  HelpCircle,
  ClipboardList,
  Timer,
    FolderOpen,
  BarChart3,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Subjects", href: "/subjects", icon: BookOpen },
  { title: "Notes", href: "/notes", icon: FileText },
  {
  title: "Documents",
  href: "/documents",
  icon: FolderOpen,
},
  { title: "AI Chat", href: "/chat", icon: MessageSquare },
  { title: "Flashcards", href: "/flashcards", icon: Layers },
  { title: "Quizzes", href: "/quizzes", icon: HelpCircle },
  { title: "Assignments", href: "/assignments", icon: ClipboardList },
  { title: "Focus Timer", href: "/focus", icon: Timer },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/calendar", icon: Calendar },
];

export const siteConfig = {
  name: "StudyHub AI",
  description: "Your AI-powered study companion",
};