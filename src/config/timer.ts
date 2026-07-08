export const timerDurations = {
  pomodoro: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
} as const;

export const timerLabels = {
  pomodoro: "Focus",
  short_break: "Short Break",
  long_break: "Long Break",
} as const;

export const sessionsBeforeLongBreak = 4;