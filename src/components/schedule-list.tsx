import type { Item } from '@/data/schema';
import { scheduleEntryLabel } from '@/lib/schedule';

/**
 * Show a listing's recurring weekly runs (day + start time). Renders
 * nothing when the listing has no known schedule.
 */
export function ScheduleList({ item }: { item: Item }): React.ReactElement | null {
  if (item.schedule.length === 0) return null;
  return (
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      {item.schedule.map(scheduleEntryLabel).join(' · ')}
    </p>
  );
}
