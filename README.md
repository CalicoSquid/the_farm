# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## From the Farm feed

Pass 4 introduces a lightweight running farm feed at `/from-the-farm`.

The site reads the new `FarmNotes` Firestore collection and also folds in recent
images from the existing `Land`, `Nature`, and `Area` collections. That means the
new section can show the photo history that already exists before the Android
uploader is refactored.

Future Android uploads can write documents to `FarmNotes` using this shape:

```js
{
  imageUrl: "https://...",     // optional if this is a text-only note
  text: "Cleared another...", // short note / caption
  title: "",                  // optional
  category: "Progress",       // e.g. Progress, Nature, Around here, Small win, Found, Thinking, Problem
  place: "Lower terrace",     // optional; ready for future Places support
  createdAt: serverTimestamp(),
  featured: false              // optional; reserved for later curation
}
```

The feed deliberately normalizes old gallery documents (`url`, `description`,
`createdAt`) and new farm-note documents into one UI. Duplicate images are
removed by URL.

## 2026 refresh — Pass 5: Dreams

This pass adds the `/dreams` section as the hopeful counterpart to **From the Farm**. The saved former homepage concept image now lives here as an explicitly aspirational daydream, alongside a deliberately loose set of future ideas. Dreams is also linked from the homepage, primary navigation, mobile navigation, and footer.

The section is intentionally static for now: it is a place for possibilities rather than a project tracker. No timelines, completion percentages, or commitments are attached to the ideas.

## Blog document shape

Blog posts live in the `Blogs` Firestore collection. The site normalizes every
Firestore document into one predictable shape when it is loaded, so older posts
can remain simple while newer posts can opt into richer presentation fields.

Core fields:

```js
{
  title: "Post title",
  date: Timestamp,
  imageUrl: "https://...",
  body: "Article body using /p/, /b/, /br/ and [label]{url} markup",
  likes: 0,
}
```

Optional richer fields:

```js
{
  dek: "Optional standfirst beneath the title",
  excerpt: "Optional archive-card excerpt",
  relatedLinks: [
    {
      eyebrow: "Right now",
      title: "From the Farm",
      copy: "Short supporting copy",
      to: "/from-the-farm",
      label: "See what’s happening",
    },
  ],
}
```

The document ID is the public blog slug. Missing optional fields normalize to an
empty string or empty array, and missing/invalid `likes` normalize to `0` in the
UI. New posts should still use the canonical field names above rather than
introducing aliases.
