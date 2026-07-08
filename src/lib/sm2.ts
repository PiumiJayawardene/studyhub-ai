export type SM2Grade = 0 | 1 | 2 | 3 | 4 | 5;

export type SM2State = {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
};

export type SM2Result = SM2State & {
  dueAt: Date;
};

export function calculateSM2(state: SM2State, grade: SM2Grade): SM2Result {
  let { easinessFactor, intervalDays, repetitions } = state;

  if (grade < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
    repetitions += 1;
  }

  easinessFactor =
    easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + intervalDays);

  return { easinessFactor, intervalDays, repetitions, dueAt };
}

export const gradeLabels: Record<string, SM2Grade> = {
  Again: 0,
  Hard: 3,
  Good: 4,
  Easy: 5,
};