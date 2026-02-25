# Gunnerlytics — Arsenal F.C. Historical Player Database

A production-ready Next.js web application featuring the complete statistical database of Arsenal F.C. players. Includes searchable profiles, advanced comparison tools, and automatic data updates.

## Features

✨ **Comprehensive Database**
- All Arsenal men's first-team players (competitive appearances)
- Historical data spanning multiple decades
- Automatic stats tracking and updates
- Transfer history and career timelines

🔍 **Advanced Search & Filtering**
- Search by name, nationality, position
- Filter by era, position, minimum appearances, trophy winners
- Sort by rating, appearances, goals, era
- Mobile-responsive filtering interface

📊 **Player Profiles**
- Arsenal rating (weighted algorithm)
- Career statistics by competition
- Trophy history with seasons
- Transfer information and manager history
- Rating breakdown visualization

⚖️ **Comparison Tool**
- Side-by-side stat comparison (2-3 players)
- Interactive SVG radar chart
- Highlighted performance metrics
- Searchable player selector

🤖 **Automatic Updates**
- Daily GitHub Actions workflow
- FBref data scraping with change detection
- Transfer tracking and logging
- Auto-commit and Vercel redeploy

🎨 **Modern UI**
- Dark mode (persisted)
- Arsenal red theme (#EF0107)
- Mobile-first responsive design
- Tailwind CSS styling
- Lazy-loaded images

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Scraping**: Axios + Cheerio (FBref, public data)
- **Database**: JSON (git-tracked)
- **Deployment**: Vercel (free tier)
- **CI/CD**: GitHub Actions (daily cron)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Database Management

### Seeded Data

The database comes pre-populated with comprehensive Arsenal player data including:
- 5 major legends (Henry, Bergkamp, Vieira, Adams, Wright)
- Extended Arsene Wenger era players
- Modern squad (2020-2026)
- Historical players from George Graham era

### Automatic Updates

The database automatically updates daily via GitHub Actions:

```bash
# Test the scraper (dry run, no changes)
npm run scrape:test

# Run scraper with verbose output
npm run scrape:verbose

# Run scraper and commit changes
npm run scrape
```

### Manual Database Initialization

To reset and reinitialize the entire database:

```bash
npm run db:init
```

## Scraping & Data Updates

### How It Works

1. **FBref Scraping** (`scripts/scrape/fbref.ts`)
   - Fetches current Arsenal squad stats
   - Parses appearances, goals, assists, minutes
   - Extracts player metadata
   - Rate-limited (4s delay between requests)

2. **Smart Merging** (`scripts/scrape/merge.ts`)
   - Compares old and new data
   - Updates stats when changes detected
   - Preserves hand-curated information (trophies, transfers, managers)
   - Intelligent player name matching

3. **Transfer Detection** (`scripts/scrape/transfers.ts`)
   - Identifies new signings
   - Tracks departures
   - Logs transfers with dates and fees

4. **Change Detection** (`scripts/scrape/storage.ts`)
   - Compares datasets before writing
   - Only commits if changes detected
   - Maintains backup files

### GitHub Actions Workflow

Daily at 6 AM UTC:
```yaml
1. Checkout repo
2. Install dependencies
3. Run scraper
4. Detect changes
5. Auto-commit if needed
6. Trigger Vercel redeploy
```

Located in `.github/workflows/update-data.yml`

## Arsenal Rating Algorithm

Weighted scoring system based on Arsenal-specific stats:

```
Goals (25 pts) - position-weighted
├─ ST/CF: 1.0x
├─ LW/RW: 1.8x
├─ CAM: 2.0x
└─ CB: 6.0x

Assists (15 pts) - position-weighted
Trophies (25 pts) - major honors
Longevity (15 pts) - years + consistency
Captain Bonus (5 pts)
Clean Sheets (5 pts) - defenders only
Discipline (5 pts) - card penalty

Final = RawScore × MinutesMultiplier
Range: 1-99
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in with GitHub
4. Click "Add New Project"
5. Select `gunnerlytics` repository
6. Click "Deploy"

Your app will be live at `https://gunnerlytics.vercel.app`

### Configure Auto-Redeployment

1. Create a Vercel deploy hook:
   - Vercel Dashboard → Settings → Git
   - Copy the Redeploy URL

2. Add to GitHub secrets:
   - Go to repo Settings → Secrets & variables → Actions
   - New secret: `VERCEL_DEPLOY_HOOK`
   - Paste the URL

Now when the scraper commits changes, Vercel automatically rebuilds!

## File Structure

```
gunnerlytics/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home (search/filter)
│   ├── HomeClient.tsx           # Client logic
│   ├── players/[slug]/          # Player profiles (SSG)
│   └── compare/                 # Comparison tool
├── components/
│   ├── player/                  # Player cards, stats, badges
│   ├── compare/                 # Radar chart, comparison table
│   └── ui/                      # Reusable UI components
├── data/
│   └── players.json             # Main database (git-tracked)
├── lib/
│   ├── rating/                  # Arsenal rating algorithm
│   ├── filters.ts               # Filter/sort logic
│   ├── utils/                   # Helpers
│   └── data.ts                  # Data access layer
├── types/
│   └── player.ts                # TypeScript interfaces
├── scripts/
│   ├── scrape/                  # Scraper (FBref, merge, storage)
│   ├── init-db/                 # Database initialization
│   └── data-generator/          # Seeded data generators
├── .github/workflows/
│   └── update-data.yml          # GitHub Actions (daily)
└── [config files]

```

## Performance

### Optimization Strategies

- **SSG**: All 500+ player pages pre-rendered at build time
- **Dynamic Routes**: Uses `generateStaticParams` for SQL-like efficiency
- **Client-Side Filtering**: Search and filters run in browser (no server calls)
- **Lazy Loading**: Images load on demand
- **Code Splitting**: Tailwind purges unused CSS
- **JSON Chunking**: Data split for faster parsing

### Lighthouse Targets

- **Mobile**: 90+ performance score
- **Accessibility**: 95+
- **Best Practices**: 95+

## Scripts Reference

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint

# Database
npm run db:init            # Initialize database
npm run scrape             # Run scraper (live)
npm run scrape:test        # Dry run (no changes)
npm run scrape:verbose     # Scraper with logging
npm run db:refresh         # Scrape + build
```

## Data Sources

- **FBref**: Player stats, appearances, goals, assists
- **Wikipedia**: Historical information
- **Manual Curation**: Trophies, transfers, managers, careers

## Contributing

To add or update players:

1. Edit `data/players.json` directly for hand-curated data
2. Run `npm run db:init` to reinitialize
3. Commit and push
4. GitHub Actions will rebuild automatically

## Limitations & Future Work

### Current Limitations
- FBref data limited to recent seasons (historical requires manual entry)
- Images must be hosted separately
- Transfer fees approximate
- Stats exclude friendlies/competitions outside UK

### Future Enhancements
- [ ] API endpoint for external integrations
- [ ] Advanced stats (xG, pass completion %, etc.)
- [ ] Head-to-head player comparisons
- [ ] Timeline view of Arsenal seasons
- [ ] Women's team integration (if requested)
- [ ] PDF export of profiles
- [ ] Multi-language support

## Troubleshooting

### Scraper Fails
```bash
# Check FBref is accessible
curl https://fbref.com/en/squads/18bb7c10/Arsenal-Stats

# Verify rate limiting
npm run scrape:verbose

# Check for FBref schema changes (may need HTML parsing update)
```

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build

# Verify TypeScript
npx tsc --noEmit
```

### Data Not Updating
1. Check GitHub Actions logs
2. Verify `.github/workflows/update-data.yml` is present
3. Ensure `VERCEL_DEPLOY_HOOK` secret is set (if auto-redeploy wanted)

## License

This project is open source. Arsenal F.C. statistics are public domain.

## Credits

Built with:
- Next.js team
- FBref (Sports Reference)
- Tailwind Labs
- Vercel

---

**Status**: Production-ready

**Hosted**: [gunnerlytics.vercel.app](https://gunnerlytics.vercel.app)

**Repository**: [github.com/tommostock/gunnerlytics](https://github.com/tommostock/gunnerlytics)
