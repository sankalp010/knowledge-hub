# Personal Knowledge Hub

## Tech stack

- **Language:** TypeScript 5.9 with TSX.
- **UI:** React 19 and React DOM 19.
- **Build and development server:** Vite 7 with the official React plugin.
- **Styling:** Custom responsive CSS, including CSS variables for dark and light themes, transitions, reduced-motion support, and the dotted canvas treatment.
- **Icons:** Phosphor Icons for React (`@phosphor-icons/react`), including the social brand glyphs.
- **Markdown rendering:** `react-markdown` for local knowledge notes.
- **Content model:** File-based TypeScript data and Markdown files bundled at build time; no application server or database is required.
- **Browser APIs:** Intersection Observer for active landing scenes, `localStorage` for the theme preference, and an iframe for the portfolio preview.
- **Package manager:** npm.

## Run it

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and serve it locally with `npm run preview`.

## Add content

- **Learning notes:** add Markdown files under `src/content/notes/<category>/<topic>.md`. Use a `# Heading` for the title. Notes are discovered at build time and rendered in the app. Match folder names to the category IDs used in `src/content/navigation.ts`, for example `ai/modern-ml`, `backend/relational`, or `frontend`.
- **Saved links, articles, videos, and tools:** add `Resource` entries to the `resourceEntries` array in `src/content/resources.ts`. Use the stable category ID, set `saved: true` to show an item in Vault, and set `queueStatus` to `to-learn`, `in-progress`, or `completed` to show it in Queue.
- **PDF library:** place files under `public/library/<category>/` and add a matching entry to `resourceEntries` with a site-relative URL such as `/library/ai/roadmap.pdf`. The file is served directly by the website.
- **Projects:** add `Project` entries to `src/content/projects.ts`. Repository, live, and source-document links are optional. Project ideas from the cohort image and the supplied project collections are listed in Build.
- **Navigation:** edit the option arrays in `src/content/navigation.ts`. New learn destinations also need a display label in `src/App.tsx` so the content heading stays readable.

Content is bundled from these local files during build. Editing the deployed website does not write changes back to this repository.
