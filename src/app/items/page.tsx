import { ItemCard } from '@/components/item-card';
import { listCategories, listCities, listItems } from '@/lib/item-repository';
import { DAYS_OF_WEEK, TIME_BUCKETS, dayLabel } from '@/lib/schedule';
import { getSiteConfig } from '@/lib/site-config';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * Browse all listings, newest-verified first, capped at 200.
 *
 * @param props - Page props
 * @param props.searchParams - Query string
 * @returns Browse page
 */
export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string; day?: string; time?: string }>;
}): Promise<React.ReactElement> {
  const config = getSiteConfig();
  const params = await searchParams;
  const [items, cities, categories] = await Promise.all([
    listItems({
      city: params.city,
      category: params.category,
      day: params.day as (typeof DAYS_OF_WEEK)[number] | undefined,
      time: params.time as (typeof TIME_BUCKETS)[number] | undefined,
      limit: 200,
    }),
    listCities(),
    listCategories(),
  ]);
  const hasFilters = Boolean(params.city || params.category || params.day || params.time);
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">
        All {config.thingPlural}
        {params.city ? ` in ${params.city}` : ''}
        {params.category ? ` — ${params.category}` : ''}
        {params.day ? ` — ${dayLabel(params.day as (typeof DAYS_OF_WEEK)[number])}` : ''}
        {params.time ? ` — ${params.time}` : ''}
      </h1>
      <form
        method="get"
        action="/items"
        className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Day</span>
          <select
            name="day"
            defaultValue={params.day ?? ''}
            className="rounded-md border border-neutral-300 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Any day</option>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day} value={day}>
                {dayLabel(day)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Time</span>
          <select
            name="time"
            defaultValue={params.time ?? ''}
            className="rounded-md border border-neutral-300 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Any time</option>
            {TIME_BUCKETS.map((bucket) => (
              <option key={bucket} value={bucket}>
                {bucket[0].toUpperCase() + bucket.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">City</span>
          <select
            name="city"
            defaultValue={params.city ?? ''}
            className="rounded-md border border-neutral-300 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Any city</option>
            {cities.map((c) => (
              <option key={c.city} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-500 dark:text-neutral-400">Category</span>
          <select
            name="category"
            defaultValue={params.category ?? ''}
            className="rounded-md border border-neutral-300 px-2 py-1.5 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="">Any category</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Filter
        </button>
        {hasFilters ? (
          <Link
            href="/items"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            Clear
          </Link>
        ) : null}
      </form>
      <p className="text-neutral-600 dark:text-neutral-300">
        {items.length} {items.length === 1 ? 'listing' : 'listings'} shown.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      {items.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No listings match yet.</p>
      ) : null}
    </main>
  );
}
