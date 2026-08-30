import type { Item, ScheduleEntry } from '@/data/schema';

/** Ordered day labels used by filters and displays. */
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

/** Time-of-day buckets the day/time filters expose. */
export const TIME_BUCKETS = ['morning', 'afternoon', 'evening'] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
export type TimeBucket = (typeof TIME_BUCKETS)[number];

/** Short display label for a day, e.g. "Mon". */
export function dayLabel(day: DayOfWeek): string {
  const short = day.slice(0, 3);
  return short[0].toUpperCase() + short.slice(1);
}

/**
 * Bucket a 24h HH:mm time string into morning / afternoon / evening.
 * Morning is before noon, evening from 5pm.
 *
 * @param time - 24h start time, HH:mm
 * @returns The time-of-day bucket
 */
export function timeBucketFor(time: string): TimeBucket {
  if (time < '12:00') return 'morning';
  if (time < '17:00') return 'afternoon';
  return 'evening';
}

/**
 * Inclusive start / exclusive end 24h times for a time-of-day bucket, for
 * SQL range filters.
 *
 * @param bucket - Time-of-day bucket
 * @returns [start, end) HH:mm bounds
 */
export function timeBucketRange(bucket: TimeBucket): [string, string] {
  if (bucket === 'morning') return ['00:00', '12:00'];
  if (bucket === 'afternoon') return ['12:00', '17:00'];
  return ['17:00', '24:00'];
}

/**
 * True when a listing has a recurring run on the given day.
 *
 * @param item - Listing to check
 * @param day - Day of week
 * @returns Whether any schedule entry falls on that day
 */
export function itemRunsOnDay(item: Item, day: DayOfWeek): boolean {
  return item.schedule.some((entry) => entry.day === day);
}

/**
 * True when a listing has a recurring run in the given time-of-day bucket.
 * Only entries with a `time` are considered — a listing with no known
 * times never matches a time filter.
 *
 * @param item - Listing to check
 * @param bucket - Time-of-day bucket
 * @returns Whether any scheduled time falls in the bucket
 */
export function itemRunsInTimeBucket(item: Item, bucket: TimeBucket): boolean {
  return item.schedule.some(
    (entry) => entry.time !== undefined && timeBucketFor(entry.time) === bucket
  );
}

/**
 * Compact human summary for a schedule entry, e.g. "Mon 6:30am".
 *
 * @param entry - Schedule entry
 * @returns Display string
 */
export function scheduleEntryLabel(entry: ScheduleEntry): string {
  return `${dayLabel(entry.day)}${entry.timeLabel ? ` ${entry.timeLabel}` : ''}`;
}
