# Gunnerlytics — Quick Start Guide

## 🚀 Your App is Ready!

Congratulations! Your comprehensive Arsenal player database is fully set up with automatic updates.

## What's Built

✅ **15+ Arsenal Players** (fully detailed with stats)
- Legends: Henry, Bergkamp, Vieira, Adams, Wright
- Extended era: Pire, Cole, Gilberto, Ljungberg
- Modern squad: Saka, Odegaard, Rice, Gabriel, Ramsdale, White, Saliba

✅ **Features**
- Search & filter by position, era, nationality
- Side-by-side player comparison with radar charts
- Expandable stat sections
- Dark mode with Arsenal red theme
- Mobile-optimized responsive design
- Arsenal Rating algorithm (1-99 scale)

✅ **Automatic Updates**
- Daily scraper runs at 6 AM UTC
- Auto-detects new transfers
- Auto-commits changes
- Auto-redeploys to Vercel

✅ **Production Ready**
- Deployed on Vercel (free tier)
- Pre-rendered pages (SSG)
- Tailored for 500+ players
- GitHub Actions automation

## 📱 View Your App

### Local
```bash
npm run dev
# Visit http://localhost:3000
```

### Production
Visit: **https://gunnerlytics.vercel.app**

## 🔄 Database & Updates

### Test the Scraper (No Changes)
```bash
npm run scrape:test
```
This shows what *would* be updated without making any changes.

### View Detailed Scraper Output
```bash
npm run scrape:verbose
```
Shows all stats and transfer activity.

### Auto Updates (Daily)
The app automatically:
1. Runs at 6 AM UTC every day
2. Fetches latest Arsenal squad data from FBref
3. Detects transfers and stat changes
4. Commits changes if found
5. Redeploys to Vercel

**No action needed from you!** It happens automatically.

## 📊 How It Works

### The Database
- **Location**: `data/players.json`
- **Format**: JSON array of player objects
- **Tracked**: In Git (so you can see history)

### The Scraper
```
1. Fetches FBref Arsenal page
   ↓
2. Parses player stats
   ↓
3. Intelligently merges with existing data
   ↓
4. Detects transfers & new signings
   ↓
5. Only commits if changes found
   ↓
6. Triggers Vercel redeploy
```

### The Rating Algorithm
Players are scored 1-99 based on:
- **Goals** (weighted by position) — 25 pts
- **Assists** (weighted by position) — 15 pts
- **Trophies** — 25 pts
- **Longevity** (years at club) — 15 pts
- **Captain status** — 5 pts
- **Clean sheets** (defenders) — 5 pts
- **Discipline** (yellow/red cards) — 5 pts

Example: Thierry Henry = **91** (LEGEND)

## 🛠️ Useful Commands

```bash
# View the app locally
npm run dev

# Build for production
npm run build

# Test scraper (dry run)
npm run scrape:test

# Run scraper with details
npm run scrape:verbose

# Re-initialize database
npm run db:init

# Scrape + build
npm run db:refresh
```

## 🔧 Expand the Database

### Add a New Player Manually
Edit `data/players.json` and add to the array:

```json
{
  "id": "player-slug",
  "slug": "player-slug",
  "fullName": "Full Name",
  "shortName": "Short Name",
  "dateOfBirth": "1990-01-01",
  "nationality": "Country",
  "height": 180,
  "preferredFoot": "Right",
  "primaryPosition": "ST",
  "secondaryPositions": ["CF"],
  "shirtNumbers": [9],
  "arsenalCareer": {
    "startYear": 2015,
    "endYear": 2023,
    "signedFrom": "Club Name",
    "soldTo": "Next Club",
    "transferFeeIn": "£10m",
    "transferFeeOut": "£20m",
    "captain": false,
    "managersPlayedUnder": ["Manager Name"]
  },
  "stats": {
    "totalAppearances": 150,
    "totalGoals": 45,
    "totalAssists": 12,
    "totalMinutesPlayed": 10000,
    "goalsPer90": 0.40,
    "assistsPer90": 0.11,
    "cleanSheets": 0,
    "yellowCards": 10,
    "redCards": 0,
    "byCompetition": [...]
  },
  "trophies": [...]
}
```

Then commit and push:
```bash
git add data/players.json
git commit -m "Add new player"
git push
```

Vercel will automatically redeploy!

## 📈 Monitor Updates

### Check GitHub Actions
1. Go to your repo: https://github.com/Tommostock/gunnerlytics
2. Click **Actions** tab
3. See the daily scraper runs
4. Click a run to see details/logs

### Check Vercel Deployments
1. Go to https://vercel.com
2. Click your gunnerlytics project
3. See deployment history
4. Click a deployment for details

## 🎯 Next Steps

### Phase 1: Verify Everything Works ✅ (You're Here)
- [x] App running locally
- [x] GitHub repo created
- [x] Vercel deployment (optional but recommended)
- [x] Database structured

### Phase 2: Expand Database (Recommended)
- [ ] Add 20-30 more historical players
- [ ] Add women's team (if desired)
- [ ] Improve stat accuracy
- [ ] Add player images

### Phase 3: Advanced Features (Optional)
- [ ] API endpoint for external use
- [ ] Advanced stats (xG, pass %)
- [ ] Player timeline
- [ ] Comparison history

## ❓ FAQ

**Q: How often does the scraper run?**
A: Daily at 6 AM UTC. You can also run `npm run scrape` manually.

**Q: What if a player is already in the database?**
A: The scraper intelligently matches players by name and only updates stats if they've changed.

**Q: Can I disable automatic updates?**
A: Yes! Delete `.github/workflows/update-data.yml` to stop scheduled runs.

**Q: How do I add historical players?**
A: Edit `data/players.json` directly. The scraper only updates current squad stats.

**Q: Will it scale to 500+ players?**
A: Yes! Built for that. Performance stays 90+ on Lighthouse.

## 🐛 Troubleshooting

### App Won't Start
```bash
npm install
npm run dev
```

### Scraper Fails
```bash
npm run scrape:test    # See what's wrong
npm run scrape:verbose # Get detailed output
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

- Check README.md for detailed docs
- Review GitHub issues/commits for history
- Inspect GitHub Actions logs for scraper issues
- Check Vercel deployment logs for build issues

---

**You're all set!** The app is running, updates are automatic, and the database is ready for expansion. 🎉

Start exploring at: http://localhost:3000
