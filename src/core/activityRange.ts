export interface ActivityDay {
  date: string;
  count: number;
  level: number;
}

export function selectActivity(history: ActivityDay[], start: string, end: string): ActivityDay[] {
  const valid = (s: string): boolean =>
    /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s + 'T12:00:00Z').toISOString().slice(0, 10) === s;
  if (!valid(start) || !valid(end) || start > end || start < history[0].date || end > history.at(-1)!.date) {
    throw new Error('invalidDateRange');
  }
  return history.filter((d) => d.date >= start && d.date <= end);
}

export interface ActivityTotals {
  contributions: number;
  activeDays: number;
}

export function activityTotals(days: ActivityDay[]): ActivityTotals {
  return {
    contributions: days.reduce((s, d) => s + d.count, 0),
    activeDays: days.filter((d) => d.count > 0).length,
  };
}
