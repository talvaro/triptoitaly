# 🇮🇹 Nuestro Tour de Puglia a Roma

An interactive travel dossier for a 13-day private tour across southern Italy — from Puglia (Lecce, Otranto, Gallipoli, Polignano a Mare, Alberobello, Locorotondo, Martina Franca, Ostuni) through Basilicata (Matera) and the Amalfi Coast (Sorrento, Positano, Amalfi) to Rome.

---

## Description

A single-file, zero-dependency web application that serves as a **private executive travel dossier**. It includes day-by-day activity guides, points of interest, restaurant suggestions, hotel information, transport logistics, and route maps — all presented in a clean, sidebar-navigated layout.

Key features:
- **Multilingual** — full ES / EN / IT translation with a single-click language switcher
- **Dynamic day labels** — optionally shows dates (MM/DD) and ✅ checkmarks for completed days, driven by server-side configuration
- **Responsive sidebar navigation** — collapses into a drawer on mobile
- **Sidebar photo slideshow** — rotates 5 travel images every 4 seconds
- **Cloudflare Pages** deployment with a Pages Function for runtime configuration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5 + CSS3 + JavaScript (ES2020) |
| Hosting | Cloudflare Pages |
| Server-side config | Cloudflare Pages Function (`functions/api/config.js`) |
| No build step | Plain `<script src>` — no bundler or framework |

---

## Application Flow

```
Browser loads index.html
    │
    ├─► Loads translations.js  (i18n dictionary + applyTranslations)
    ├─► Loads navigation.js    (showDay / sidebar active state)
    ├─► Loads tour-config.js   (fetches /api/config → sets language, dates, flags)
    │       │
    │       └─► GET /api/config (Cloudflare Pages Function)
    │               └─► returns { tourStartDate, showDates, showCompletedDays, initialLanguage }
    │
    ├─► Loads slideshow.js     (sidebar image rotation)
    │
    └─► initializeSite() runs
            ├─► loadTourConfiguration()  — fetches config from server
            ├─► applyTranslations(lang)  — sets all data-i18n elements
            └─► refreshDayLabels()       — optionally adds dates / checkmarks to sidebar
```

**User navigation:**  
Clicking a day in the sidebar calls `showDay(dayId)` which toggles the `.active` CSS class between `.day-section` divs — no page reload, no router.

**Language switching:**  
Each language button (`data-lang="es|en|it"`) triggers `applyTranslations(lang)`, which replaces all `data-i18n` element contents from the in-memory dictionary.

---

## Project Structure

```
triptoitaly/
├── index.html              # Entire page markup + styles (single file)
│
├── translations.js         # i18n dictionaries (ES/EN/IT) + applyTranslations()
├── navigation.js           # showDay(), setActiveMenuItem(), getMenuItemForDay()
├── tour-config.js          # Config globals, loadTourConfiguration(), refreshDayLabels()
├── slideshow.js            # Sidebar image slideshow
│
├── functions/
│   └── api/
│       └── config.js       # Cloudflare Pages Function — serves runtime config as JSON
│
├── images/                 # Route map images (mapa0.jpg, mapaAdia1.jpg … mapaJdia10.jpg)
├── sidebarslideshow/       # Slideshow photos (slideshow1–5.jpg)
│
├── .gitignore
└── README.md
```

### Page Sections (day-section IDs)

| ID | Content |
|----|---------|
| `home` | Hero, travel details, dossier summary |
| `hoteles` | Hotel list with check-in/out info |
| `transporte` | Transport & transfer logistics |
| `master` | Full 13-day itinerary overview |
| `day1` – `day13` | Daily activity guide per destination |
| `restaurants1` – `restaurants13` | Points of interest & restaurant picks per day |

### 13-Day Route

| Day | Destination |
|-----|-------------|
| 1 | Bari → Lecce (arrival) |
| 2 | Lecce |
| 3 | Otranto |
| 4 | Gallipoli |
| 5 | Polignano a Mare |
| 6 | Alberobello |
| 7 | Locorotondo & Martina Franca |
| 8 | Ostuni |
| 9 | Matera |
| 10 | Sorrento (transfer day) |
| 11 | Positano |
| 12 | Amalfi |
| 13 | Rome (departure) |

---

## Configuration (Cloudflare Pages)

Runtime behaviour is controlled via **environment variables** set in the Cloudflare Pages dashboard (not committed to the repo):

| Variable | Type | Description |
|----------|------|-------------|
| `TOUR_START_DATE` | `YYYY-MM-DD` | First day of the tour; used to calculate dates and completed-day markers |
| `SHOW_DATES` | `"true"/"false"` | Prepend MM/DD to each sidebar day label |
| `SHOW_COMPLETED_DAYS` | `"true"/"false"` | Append ✅ to days already past (Italy timezone) |
| `INITIAL_LANGUAGE` | `"es"/"en"/"it"` | Language loaded on first visit |

Local development uses `.dev.vars` (excluded from git) to mirror these values.

---

## Local Development

```bash
# Install Wrangler (Cloudflare CLI) if not already installed
npm install -g wrangler

# Start local dev server (reads .dev.vars automatically)
npx wrangler pages dev . --compatibility-date=2024-01-01
```

Open `http://localhost:8788` in your browser.

---

## Deployment

Push to the `main` branch. Cloudflare Pages auto-deploys on every push.

The `dev` branch is used for active development; merge to `main` when ready to go live.
