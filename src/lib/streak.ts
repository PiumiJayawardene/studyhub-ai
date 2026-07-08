export function calculateStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;

  const uniqueDays = Array.from(
    new Set(sessionDates.map((d) => new Date(d).toISOString().slice(0, 10)))
  ).sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  let cursor = new Date(uniqueDays[0]);

  for (let i = 1; i < uniqueDays.length; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const expected = cursor.toISOString().slice(0, 10);
    if (uniqueDays[i] === expected) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}