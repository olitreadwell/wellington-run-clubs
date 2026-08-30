# Data sources

All sources are public. Scrapers live in `src/lib/scrapers/`, run daily via
Vercel Cron, and record every run in `scrapes` (DB mode) or
`logs/scrapes.jsonl` (snapshot mode) with status, items found and items new.

## Working now

| Source | What we get | Status |
| --- | --- | --- |
| [Athletics Wellington club contacts](https://athleticswellington.org.nz/about-us/club-contacts/) | registered club list (names, areas, contacts) | ✅ working |
| [Run Wellington clubs](https://run.runwellington.com/clubs/) | social run clubs with meet times and links | ✅ working |
| [Wellington Harrier Athletic Club](https://whac.org.nz) | WHAC listing details | ✅ working |
| [Wellington Scottish Athletics](https://scottishathletics.org.nz) | Scottish listing details | ✅ working |
| [Hutt Valley Harriers](https://hvh.org.nz) | Hutt Valley Harriers listing details | ✅ working |
| [Olympic Harriers](https://www.olympicharriers.nz) | Olympic Harriers listing details | ✅ working |
| [Trentham United Harriers](https://www.trenthamunited.com) | Trentham United listing details | ✅ working |
| [Mana Athletics](https://www.manaathletics.co.nz) | Mana AAC listing details | ✅ working |
| [Karori Athletics](https://www.karoriathletics.org.nz) | Karori AAC listing details | ✅ working |
| [Wellington Marathon Clinic](https://www.wmc.org.nz) | Marathon Clinic listing details | ✅ working |
| [Victoria University Athletics](https://vuwathletics.wordpress.com) | VUW Athletics listing details | ✅ working |
| [NZ Running club directory](https://www.nzrunning.co.nz/run-clubs/city/wellington) | casual/social run clubs (261 Fearless, 445, Early Bird, WREC'kd) | ✅ working |
| [Reddy to Run](https://reddytorun.org.nz) | Petone beach run club details | ✅ working |
| [Wellington Runners and Walkers Meetup](https://www.meetup.com/wellington-runners-and-walkers/) | Sunday run/walk club details | ✅ working |
| [Hutt Valley Runners](https://huttvalleyrunners.nz) | Sunday social distance club details | ✅ working |
| [Capital Hash House Harriers](https://www.sporty.co.nz/capitalh3) | hash chapter details | ✅ working |
| [Mo Bros Wellington Instagram](https://www.instagram.com/mo_bros_wellington/) | Movember men's health run club | ✅ working |
| [Jog On Instagram](https://www.instagram.com/jog.onnn/) | Friday morning casual jog | ✅ working |
<!-- SEED-SOURCES -->

Projects run `pnpm run setup` to list their own initial sources here; the
scraper framework in `src/lib/scrapers/` turns each into a `Scraper`.

## Best-effort (fetched, no structured extraction yet)

| Source | What we want | Status |
| --- | --- | --- |
| _(add sources here as scrapers land)_ | | ⚠️ |

## Key-gated (enable via env)

| Source | Env var | Notes |
| --- | --- | --- |
| _(add keyed APIs here, e.g. Eventfinda/Meetup)_ | `..._API_KEY` | Free key at the provider portal |

## Planned

- Real scrapers for the project's seed sources, replacing the example
- Headless-browser fallback for JS-rendered listing pages
- Enrichment passes (socials, contact, coordinates) with sources per field

## Rules

- Respect `robots.txt` (enforced in `src/lib/scrapers/http.ts`)
- 500ms+ delay between requests per source
- 15s request timeout; failures are recorded, never fatal
- No paywalled, logged-in, or private data. Ever.
- Update this table when a source changes status — it is the project's
  transparency record.
