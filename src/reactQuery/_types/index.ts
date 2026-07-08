export const EQueries = {
  LIFE_AREAS: 'life_areas',
  GOALS: 'goals',
  TASKS: 'tasks',
} as const;

export type EQueries = typeof EQueries[keyof typeof EQueries];
