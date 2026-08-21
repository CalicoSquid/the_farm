# I Bought a Farm

React + Vite site for the farm in Rijeka Crnojevića, Montenegro.

## Development

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```

## Content

### Longer updates

Older posts are read from the Firestore `Blogs` collection. The August 2026 comeback essay, **It’s Been Quiet Around Here**, lives in `src/content/localBlogs.js` and is merged with Firestore at runtime. If a Firestore document is later created with the same id (`its-been-quiet-around-here`), the Firestore version takes precedence.

### From the Farm

The running feed at `/from-the-farm` reads the `FarmNotes` collection and also folds in the existing `Land`, `Nature`, and `Area` collections so the old uploader history remains useful.

Future `FarmNotes` documents can use:

```js
{
  imageUrl: "https://...",
  text: "Cleared another...",
  title: "",
  category: "Progress",
  place: "Lower terrace",
  createdAt: serverTimestamp(),
  featured: false
}
```

### Dreams

`/dreams` is intentionally static for now: ideas and possibilities, not a project tracker.
