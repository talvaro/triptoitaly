# 🇮🇹 Nuestro Tour de Puglia a Roma

An interactive travel dossier for a 13-day private tour across southern
Italy --- from Puglia (Lecce, Otranto, Gallipoli, Polignano a Mare,
Alberobello, Locorotondo, Martina Franca, Ostuni) through Basilicata
(Matera) and the Amalfi Coast (Sorrento, Positano, Amalfi) to Rome.

------------------------------------------------------------------------

## Description

A modular, zero-dependency vanilla web application that serves as a
**private executive travel dossier**. It includes day-by-day activity
guides, points of interest, restaurant suggestions, hotel information,
transport logistics, and route maps --- all presented in a clean,
sidebar-navigated layout.

Key features: - **Multilingual** --- full ES / EN / IT translation with
a single-click language switcher - **Language persistence** --- the last
user-selected language is stored in browser `localStorage` - **Tour
countdown** --- shows the number of days remaining until the trip starts,
localized per selected language - **Dynamic day labels** --- optionally
shows dates (MM/DD) and ✅ checkmarks for completed days, driven by
server-side configuration - **Responsive sidebar navigation** ---
collapses into a drawer on mobile - **Sidebar photo slideshow** ---
auto-discovers slideshow images and rotates them every 4 seconds -
**Cloudflare Pages** deployment with a Pages Function for runtime
configuration

------------------------------------------------------------------------

## Tech Stack

  -----------------------------------------------------------------------
  Layer                       Technology
  --------------------------- -------------------------------------------
  Frontend                    Vanilla HTML5 + CSS3 + JavaScript (ES2020)

  Hosting                     Cloudflare Pages

  Server-side config          Cloudflare Pages Function
                              (`functions/api/config.js`)

  No build step               Plain `<link>` + `<script src>` --- no
                              bundler or framework
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Application Flow

    Browser loads index.html
        │
        ├─► Loads styles.css        (all page styles via <link>)
        ├─► Loads translations.js  (i18n dictionary + applyTranslations + localStorage helpers)
        ├─► Loads navigation.js    (showDay / sidebar active state)
        ├─► Loads tour-config.js   (fetches /api/config → sets language, dates, flags, version)
        │       │
        │       └─► GET /api/config (Cloudflare Pages Function)
        │               └─► returns { tourStartDate, showDates, showCompletedDays, initialLanguage, version }
        │
        ├─► Loads slideshow.js     (sidebar image discovery + rotation)
        │
        └─► initializeSite() runs
                ├─► loadTourConfiguration()  — fetches config from server
                ├─► loadSidebarImages()      — auto-discovers slideshow1.jpg, slideshow2.jpg, ...
                ├─► startSidebarSlideshow()  — starts rotation if more than one image exists
                ├─► getSavedLanguage()       — reads triptoitaly.language from localStorage
                ├─► language priority: saved → INITIAL_LANGUAGE → "es"
                ├─► applyTranslations(lang)  — sets all data-i18n elements
                ├─► updateTourCountdown()    — renders days remaining until TOUR_START_DATE
                ├─► inject version label     — writes VERSION into the sidebar
                └─► refreshDayLabels()       — optionally adds dates / checkmarks to sidebar

**User navigation:**\
Clicking a day in the sidebar calls `showDay(dayId)` which toggles the
`.active` CSS class between `.day-section` divs --- no page reload, no
router.

**Language switching:**\
Each language button (`data-lang="es|en|it"`) triggers `applyTranslations(lang)` and
`saveLanguage(lang)`, which persists the choice to `localStorage` under the key
`triptoitaly.language`. On the next visit `getSavedLanguage()` returns the saved code,
overriding the Cloudflare `INITIAL_LANGUAGE` default. The preference is browser-specific
and is never written automatically — only on explicit user selection.

**Countdown banner:**\
The home section includes a countdown badge (`#tour-countdown`) that is updated by
`updateTourCountdown(lang)`. It uses `TOUR_START_DATE` from `/api/config`, calculates the
remaining calendar days in the `Europe/Rome` timezone, and renders a localized label using
the `countdownDays` translation template. The badge is hidden automatically when no start
date is configured or when the trip date is today or in the past.

------------------------------------------------------------------------

## Project Structure

    triptoitaly/
    ├── index.html              # Pure HTML markup — includes home countdown placeholder and script/css links
    ├── styles.css              # All page styles (sidebar, cards, countdown, layout, responsive)
    │
    ├── translations.js         # i18n dictionaries, applyTranslations(), countdown label templates, localStorage language persistence
    ├── navigation.js           # showDay(), setActiveMenuItem(), getMenuItemForDay()
    ├── tour-config.js          # Runtime config loading, countdown calculation, version label injection, initializeSite(), refreshDayLabels()
    ├── slideshow.js            # Sidebar image auto-discovery and slideshow rotation
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

### Page Sections (day-section IDs)

  -----------------------------------------------------------------------
  ID                    Content
  --------------------- -------------------------------------------------
  `home`                Hero, travel details, dossier summary

  `hoteles`             Hotel list with check-in/out info

  `transporte`          Transport & transfer logistics

  `master`              Full 13-day itinerary overview

  `day1` -- `day13`     Daily activity guide per destination

  `restaurants1` --     Points of interest & restaurant picks per day
  `restaurants13`       
  -----------------------------------------------------------------------

### 13-Day Route

  Day   Destination
  ----- ------------------------------
  1     Bari → Lecce (arrival)
  2     Lecce
  3     Otranto
  4     Gallipoli
  5     Polignano a Mare
  6     Alberobello
  7     Locorotondo & Martina Franca
  8     Ostuni
  9     Matera
  10    Sorrento (transfer day)
  11    Positano
  12    Amalfi
  13    Rome (departure)

------------------------------------------------------------------------

## Configuration (Cloudflare Pages)

Runtime behaviour is controlled via **environment variables** set in the
Cloudflare Pages dashboard (not committed to the repo):

- `TOUR_START_DATE` (`YYYY-MM-DD`): first day of the tour; used for the countdown, sidebar dates, and completed-day markers.
- `SHOW_DATES` (`"true"/"false"`): prepends `MM/DD` to each sidebar day label.
- `SHOW_COMPLETED_DAYS` (`"true"/"false"`): appends `✅` to days already past, based on the Italy timezone.
- `INITIAL_LANGUAGE` (`"es"/"en"/"it"`): default language for browsers with no saved preference.
- `VERSION` (`string`): optional version label shown in the sidebar.

Local development uses `.dev.vars` (excluded from git) to mirror these
values.

------------------------------------------------------------------------

## Local Development

``` bash
# Install Wrangler (Cloudflare CLI) if not already installed
npm install -g wrangler

# Start local dev server (reads .dev.vars automatically)
npx wrangler pages dev . --compatibility-date=2024-01-01
```

Open `http://localhost:8788` in your browser.

------------------------------------------------------------------------

## Deployment

Push to the `main` branch. Cloudflare Pages auto-deploys on every push.

The `dev` branch is used for active development; merge to `main` when
ready to go live.

------------------------------------------------------------------------

# System Architecture

                               Browser
                                   │
                   ┌───────────────┴───────────────┐
                   │                               │
             index.html                      /api/config
                   │                               │
         HTML / CSS / JavaScript      Cloudflare Pages Function
                   │                               │
                   └───────────────┬───────────────┘
                                   │
                     Cloudflare Environment Variables

This project is intentionally built as a lightweight **vanilla
JavaScript application**. Runtime behaviour is controlled through a
Cloudflare Pages Function, while the frontend remains entirely static.

------------------------------------------------------------------------

## JavaScript Module Responsibilities

- `translations.js`: translation dictionaries (ES/EN/IT), `applyTranslations()`, `data-i18n` processing, countdown label templates, and localStorage language persistence helpers.
- `navigation.js`: `showDay()`, sidebar navigation, and active-menu handling.
- `tour-config.js`: runtime configuration loading from `/api/config`, `initializeSite()`, `updateTourCountdown()`, version label injection, `refreshDayLabels()`, and date calculations.
- `slideshow.js`: sidebar image discovery, slideshow startup, and image rotation.
- `styles.css`: layout, cards, countdown badge, responsive behavior, and visual theme.

------------------------------------------------------------------------

## Initialization Sequence

    Browser
        ↓
    initializeSite()
        ↓
    loadTourConfiguration()
        ↓
    loadSidebarImages()
        ↓
    startSidebarSlideshow()
        ↓
    GET /api/config
        ↓
    Cloudflare Environment Variables
        ↓
    getSavedLanguage()
        ↓
    saved language → INITIAL_LANGUAGE → "es"
        ↓
    applyTranslations()
        ↓
    updateTourCountdown()
        ↓
    Inject version label
        ↓
    refreshDayLabels()
        ↓
    Application Ready

------------------------------------------------------------------------

## Development Workflow

    Edit code
        ↓
    npx wrangler pages dev .
        ↓
    Local testing (http://localhost:8788)
        ↓
    Deploy to Preview (optional)
        ↓
    Deploy to Production

Local configuration comes from `.dev.vars`.

Production configuration comes from Cloudflare Pages Environment
Variables.

------------------------------------------------------------------------

## Troubleshooting

  ------------------------------------------------------------------------
  Symptom         Possible Cause              Suggested Check
  --------------- --------------------------- ----------------------------
  `/api/config`   Pages Function not deployed Verify deployment with
  returns HTML                                Wrangler and that
                                              `functions/api/config.js`
                                              exists

  Initial         Invalid `INITIAL_LANGUAGE`  Open `/api/config` and
  language always value                       verify the JSON response
  Spanish                                     

    Saved language  `triptoitaly.language`      Clear localStorage and reload
    not updating    contains invalid or stale   the page to re-test fallback
                                    data                        behaviour

    Countdown       Missing or invalid          Verify `TOUR_START_DATE` in
    not shown       `TOUR_START_DATE`, or the   `/api/config`; the countdown
                                    tour date is today/past     hides itself automatically in
                                                                                            those cases

  Tour dates do   Incorrect `TOUR_START_DATE` Check Cloudflare Environment
  not update                                  Variables and `/api/config`

  `.dev.vars`     Wrangler still running      Restart `wrangler pages dev`
  changes ignored                             

  Browser still   Cached resources            Perform a hard refresh
  shows old code                              (`Ctrl/Cmd + Shift + R`)
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## Future Roadmap

-   [ ] User preferences stored locally
-   [ ] Weather integration
-   [ ] Google Maps enhancements
-   [ ] Offline/PWA support
-   [ ] Printable itinerary
-   [ ] Dark mode

------------------------------------------------------------------------

## Version Highlights

  Version   Major Feature
  --------- -------------------------------------------------
  1.0       Initial static itinerary
  1.1       Responsive layout
  1.2       Multilingual support
  1.3       Sidebar slideshow
  1.4       Cloudflare runtime configuration
  1.5       Dynamic tour dates and completed-day indicators
