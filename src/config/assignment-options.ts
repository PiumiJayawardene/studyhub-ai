export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const priorityColors: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export const statusColors: Record<string, string> = {
  pending: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
  in_progress: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
};