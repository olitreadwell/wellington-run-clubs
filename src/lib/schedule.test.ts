import { describe, expect, it } from 'vitest';
import type { Item } from '@/data/schema';
import {
  itemRunsInTimeBucket,
  itemRunsOnDay,
  scheduleEntryLabel,
  timeBucketFor,
  timeBucketRange,
} from '@/lib/schedule';

const item = {
  schedule: [
    { day: 'monday', time: '06:30', timeLabel: '6:30am' },
    { day: 'wednesday', time: '18:15' },
    { day: 'saturday' },
  ],
} as Item;

describe('timeBucketFor', () => {
  it('buckets morning before noon, evening from 5pm', () => {
    expect(timeBucketFor('06:30')).toBe('morning');
    expect(timeBucketFor('11:59')).toBe('morning');
    expect(timeBucketFor('12:00')).toBe('afternoon');
    expect(timeBucketFor('16:59')).toBe('afternoon');
    expect(timeBucketFor('17:00')).toBe('evening');
    expect(timeBucketFor('23:59')).toBe('evening');
  });
});

describe('timeBucketRange', () => {
  it('returns half-open 24h bounds per bucket', () => {
    expect(timeBucketRange('morning')).toEqual(['00:00', '12:00']);
    expect(timeBucketRange('afternoon')).toEqual(['12:00', '17:00']);
    expect(timeBucketRange('evening')).toEqual(['17:00', '24:00']);
  });
});

describe('itemRunsOnDay', () => {
  it('matches a scheduled day', () => {
    expect(itemRunsOnDay(item, 'monday')).toBe(true);
    expect(itemRunsOnDay(item, 'friday')).toBe(false);
  });
});

describe('itemRunsInTimeBucket', () => {
  it('matches scheduled times by bucket', () => {
    expect(itemRunsInTimeBucket(item, 'morning')).toBe(true);
    expect(itemRunsInTimeBucket(item, 'evening')).toBe(true);
    expect(itemRunsInTimeBucket(item, 'afternoon')).toBe(false);
  });

  it('ignores entries without a time', () => {
    const dayOnly = { schedule: [{ day: 'saturday' }] } as Item;
    expect(itemRunsInTimeBucket(dayOnly, 'morning')).toBe(false);
  });
});

describe('scheduleEntryLabel', () => {
  it('renders day with time label when present', () => {
    expect(scheduleEntryLabel({ day: 'monday', time: '06:30', timeLabel: '6:30am' })).toBe(
      'Mon 6:30am'
    );
    expect(scheduleEntryLabel({ day: 'saturday' })).toBe('Sat');
  });
});
