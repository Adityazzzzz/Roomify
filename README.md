# Roomify

Roomify turns a 2D floor plan into AI-assisted architectural visualizations. Upload a plan, configure its rooms and visual direction, then generate, compare, refine, version, and export design concepts from one workspace.

## What users can do

- Upload a JPG or PNG floor plan and save it as a project.
- Generate a 3D visualization from the floor plan with Puter AI.
- Pick a design direction: Modern Minimal, Scandinavian, Industrial, Luxury, Traditional, or Empty.
- Generate Top-down, Dollhouse, Interior, or Night views.
- Build a room program: add rooms, assign a name/type, approximate area, floor finish, wall finish, and furniture density.
- Apply one-click render feedback such as warmer lighting or more furniture, or write a custom refinement.
- Compare the source floor plan with the generated result using a draggable before/after slider.
- Keep render versions and restore a previous result.
- Export a rendered PNG and a text-based design sheet containing the selected design settings and room schedule.
- Copy a project share link and retain share metadata on the project.

## Stack

- React 19 + React Router 7
- TypeScript
- Tailwind CSS 4
- Puter.js for authentication, AI image generation, storage, hosting, and Worker requests
- `react-compare-slider` for the before/after comparison experience
- Lucide React icons

## How it works

1. A user uploads a floor plan from the home page.
2. Roomify creates a private project and hosts the source image through Puter.
3. In the design studio, the user selects a style, render view, room settings, and optional refinement feedback.
4. The selected settings are appended to Roomify's strict geometry-preserving AI prompt.
5. Puter AI generates an image-to-image render. The result and each historical version are hosted and saved with the project.
6. The user can compare, restore, download, or regenerate the result.

## Local setup

### Requirements

- Node.js 20 or later
- A Puter account
- A deployed Puter Worker URL for project persistence

### Install and run

```bash
npm install
npm run dev
```

On Windows PowerShell environments that block `npm.ps1`, use:

```bash
npm.cmd run dev
```

Create a `.env` file with your Worker endpoint:

```env
VITE_PUTER_WORKER_URL=https://your-worker.puter.work
```

Then deploy the Worker in [`lib/puter.worker.js`](./lib/puter.worker.js) to the URL configured above.

## Available scripts

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Serve the production build
npm run typecheck  # Generate route types and run TypeScript checks
```

## Project structure

```text
app/routes/home.tsx             Upload flow and project dashboard
app/routes/visualizer.$id.tsx   Design studio, render controls, rooms, versions, export
lib/ai.action.ts                AI prompt construction and image generation
lib/puter.action.ts             Project persistence and hosted image/version storage
lib/puter.hosting.ts            Puter hosting setup and file upload helpers
lib/puter.worker.js             Project API backed by the signed-in user's Puter KV store
type.d.ts                       Shared project, room, render, and style types
```

## Important notes

- Render quality and precise layout fidelity depend on the source plan and the image model. Room configuration and the “exact-plan” prompt improve control but do not provide CAD-grade geometric guarantees.
- Room areas are currently user-entered estimates; automatic plan measurement/detection is not implemented yet.
- The Share button saves public/share metadata and copies a project link. Anonymous viewing still needs a public-read endpoint or shared database because the current Worker stores each project in the owner's private Puter KV namespace.
- The Puter image model can change over time. The current implementation uses `gemini-3-pro-image-preview` in `lib/ai.action.ts`.

## Verification

```bash
npm.cmd run typecheck
```
