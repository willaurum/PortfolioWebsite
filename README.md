# My Personal Website

## willcook.org

A React (Vite) single-page app. It replaces the earlier hand-written
HTML/CSS/JS version of the site, which remains in this repository's git history
if you ever need it back.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build locally
```

## Routes

| Page                    | Route                        |
| ----------------------- | ---------------------------- |
| Home                    | `/`                          |
| Projects                | `/projects`                  |
| Python lessons          | `/learnPython`               |
| Hunger Games Simulator  | `/theAreanaSim/simulation`   |

The old `.html` URLs (`/projects.html`, …) still resolve and redirect to the
extensionless routes, the same way the old `.htaccess` did.

## Layout

```
index.html                  Vite entry document
vite.config.js
public/                     copied to dist/ untouched, same URLs as before
  assets/  gifs/  Portrait.PNG
  pythonLessons/            lesson markdown + lessons.json, fetched at runtime
  theAreanaSim/             arena_events.json, fetched at runtime, plus the
                            generator script, notes and simulation.json
  .htaccess                 SPA fallback + legacy .html redirects (Apache)
src/
  main.jsx  App.jsx         entry point and routing
  styles/styles.css         the site's stylesheet
  styles/simulation.css     the simulator's stylesheet
  lib/markdown.js           markdown renderer used by the lessons page
  lib/arenaConfig.js        simulator defaults (events, items, probabilities)
  lib/arenaEngine.js        the simulation engine
  lib/useDocumentTitle.js
  components/               SiteHeader, SiteFooter, SkipLink, ProjectCard,
                            LeetCodeCount, ScrollToHash
  pages/                    Home, Projects, LearnPython, Simulation
deploy/nginx.conf.example   server block for the Raspberry Pi
```

### Notes for future edits

- **Stylesheet order matters.** `main.jsx` imports `styles/styles.css` *before*
  `App.jsx`. The simulator's stylesheet loads later through `Simulation.jsx`, and
  several of its rules win only on that order (e.g. its `button { font-weight:
  600 }` over the global `button, input, textarea { font: inherit }`). Swapping
  those two imports silently changes the simulator's typography.

- **The simulator's CSS is route-scoped.** Its bare element selectors are
  prefixed with `:where(body.arena-page)`, and `Simulation.jsx` adds
  `arena-page` to `<body>` while mounted. `:where()` contributes no specificity,
  so each rule keeps the exact weight it had when the simulator was its own
  page. `#root` becomes `display: contents` there so `main.arena-container`
  stays a direct child of the centred flex body.

- **Lesson and arena content is fetched, not bundled.** Adding a lesson means
  dropping the markdown file in `public/pythonLessons/` and listing it in
  `lessons.json`; the first line of the file becomes its title. Simulator
  events, items and probabilities are edited in
  `public/theAreanaSim/arena_events.json`, which is merged over the defaults in
  `src/lib/arenaConfig.js` at runtime.

## Deploying to the Raspberry Pi

```bash
git pull
npm ci
npm run build
```

Serve the generated `dist/` directory. `deploy/nginx.conf.example` has a ready
server block with the SPA fallback, the legacy `.html` redirects, and cache
headers for the hashed bundles; `public/.htaccess` covers the same ground if you
serve it with Apache instead.

`CNAME` is left in place from the GitHub Pages setup. It has no effect once the
Pi is serving the domain, but it costs nothing to keep and preserves that option.
