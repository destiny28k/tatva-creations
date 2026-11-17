# tatva-creations

Website for **Tatva Creatives**, a creative solutions partner in Navi Mumbai: concept development, packaging design, print promotion, paper engineering, designing and production, execution, and digital solutions.

Built with Next.js 16 (App Router), React 19 and TypeScript. Styles are CSS Modules, one per component.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build
npm run start
```

## Where things live

```
app/
  page.tsx                 home page, built from the sections in components/home
  layout.tsx               fonts, metadata, mobile menu, WhatsApp button
  work/page.tsx            all products        → /work
  work/[slug]/page.tsx     one page per project → /work/<slug>
  @modal/                  the same pages as overlays when opened from inside the site
components/
  home/      the home page sections (Wall, Services, Process, FlatToFinished, ...)
  layout/    header, footer, mobile menu, WhatsApp button
  project/   project page
  work/      all products page
  ui/        shared pieces (buttons, protected images)
hooks/       shared animation loop and media-query hooks
lib/
  content.ts   all site text: services, process, clients, contact details
  projects.ts  all projects and their photos
public/
  tatva/       logo, client logos and work photos
  thf/         The Health Factory pack photos
```

## Editing content

- Text, services, process steps, clients and contact details: `lib/content.ts`
- Projects and their photos: `lib/projects.ts` (photos go in `public/`)
