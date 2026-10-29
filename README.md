# Support Triage Dashboard

Internal dashboard for reviewing support tickets and assigning work to support agents.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run generate-data
```

## Project overview

The dashboard helps support managers inspect incoming tickets, identify urgent issues, and route work to the right support agents.

The app includes:

- Ticket list
- Ticket assignment flow
- Agent directory
- Generated mock support data
- Simulated API latency

## Data

Mock ticket data is generated locally into `src/data/db.json` when the app starts or builds. The generated file is ignored by Git.

To regenerate the data manually:

```bash
rm -f src/data/db.json
npm run generate-data
```

Support cases include fields such as:

- `priority`
- `status`
- `category`
- `customerTier`
- `agentId`
- `deadline`
- `description`

Agents are defined in `src/data/agents.ts` and include a specialty matching one of the support case categories.

## Tech stack

- React
- TypeScript
- Vite
- CSS modules by convention using plain CSS files
- Generated mock data with Faker

## Changes after the initial version

- **Bug fixes:** the mock API no longer hands out or mutates its internal objects, assignments update every screen, an empty list is no longer treated as an error, tickets show agent names instead of IDs, and everything works with the keyboard.
- **Loading and errors:** a spinner while data loads, an error message with "Try again", and "Assigning…" on the Assign button.
- **Navigation:** every screen has a title, and inner screens have a back button. On small screens the sidebar becomes a horizontal bar.
- **Tables:** tickets and agents are shown in tables you can sort by any column. Priority and status sort by severity, not alphabetically.
- **Search:** tickets by subject and description, agents by name and email. Case and accents are ignored, and a result count is shown.
- **Agent selection:** the assign screen lists only agents from the ticket's area, least busy first, and shows the ticket details and a success message. The Agents page has an Area filter.
- **Dashboard:** summary counts, open tickets by category, and the 5 busiest agents.
- **UI refresh:** better contrast, a clear focus outline on every control, compact tables that scroll sideways on phones, and colors and sizes set in `src/styles/tokens.css`.
- **Tests:** Vitest and React Testing Library for the sorting, search, workload and dashboard calculations, the tickets table, the assign flow and the dashboard.

**Key decisions:** tickets and agents are loaded once and shared through `useSupportData()`, so every screen shows the same data. Sorting, search and the counts are pure functions in `src/lib`, which makes them easy to test. Screens are still switched with React state rather than a router, to keep things simple.

### Running the tests

```bash
npm test            # run once
npm run test:watch  # re-run on file changes
```

The tests replace the mock API with stubs, so they don't wait for the simulated delay.

### Known limitations / next steps

- No routing: screens have no URL, so the browser back button and refresh don't keep your place. Sorting and search reset when you leave a screen.
- No pagination: all 500 tickets are shown in one table.
- Mock API only: the data lives in memory and resets on reload. `db.json` is used without checking its contents.
- `@mui/material` and Emotion are still listed in `package.json` but are no longer used.
