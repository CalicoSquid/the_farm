import { useMemo, useState } from "react";
import useFarmNotes, { formatFarmNoteDate } from "../hooks/useFarmNotes";

const sortCategories = (categories) => {
  const preferred = ["Progress", "Nature", "Around here", "Small win", "Found", "Thinking", "Problem"];
  return [...categories].sort((a, b) => {
    const aIndex = preferred.indexOf(a);
    const bIndex = preferred.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

function NoteMeta({ note, includeYear = false }) {
  return (
    <div className="farm-note__meta">
      <span className="farm-note__category">{note.category}</span>
      <span aria-hidden="true">·</span>
      <time>{formatFarmNoteDate(note.createdAt, { includeYear })}</time>
      {note.place && (
        <>
          <span aria-hidden="true">·</span>
          <span>{note.place}</span>
        </>
      )}
    </div>
  );
}

function FarmNoteCard({ note }) {
  return (
    <article className="farm-note-card">
      {note.imageUrl && (
        <figure className="farm-note-card__media">
          <img src={note.imageUrl} alt={note.title || note.text || "From the farm"} loading="lazy" />
        </figure>
      )}
      <div className="farm-note-card__body">
        <NoteMeta note={note} includeYear />
        {note.title && <h2>{note.title}</h2>}
        {note.text && <p>{note.text}</p>}
      </div>
    </article>
  );
}

export default function FromTheFarm() {
  const { notes, loading, error } = useFarmNotes({ limitCount: 48 });
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => sortCategories(new Set(notes.map((note) => note.category).filter(Boolean))),
    [notes]
  );

  const filteredNotes = useMemo(
    () =>
      activeCategory === "All"
        ? notes
        : notes.filter((note) => note.category === activeCategory),
    [activeCategory, notes]
  );

  const [leadNote, ...rest] = filteredNotes;

  return (
    <main className="page-shell farm-feed-page">
      <header className="page-intro farm-feed-intro">
        <p className="eyebrow">Small things, as they happen</p>
        <h1>From the farm</h1>
        <p className="page-intro__copy">
          Not everything needs a whole article. This is the running record — a cleared path,
          something growing, something found, a change of plan, or just a photograph worth keeping.
        </p>
      </header>

      {loading ? (
        <div className="empty-state">Checking what’s been happening…</div>
      ) : notes.length === 0 ? (
        <section className="farm-feed-empty">
          <p className="eyebrow">Quiet, for now</p>
          <h2>The first little thing goes here.</h2>
          <p>
            This part of the site is deliberately easy to fill. One photograph and a sentence is enough.
            The point is to notice the farm moving, even when the big jobs are moving slowly.
          </p>
          {error && <small>The feed also had trouble reaching Firestore this time.</small>}
        </section>
      ) : (
        <>
          <div className="farm-feed-toolbar" aria-label="Filter farm notes">
            <div className="farm-feed-filters">
              <button
                type="button"
                className={`farm-filter${activeCategory === "All" ? " farm-filter--active" : ""}`}
                onClick={() => setActiveCategory("All")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`farm-filter${activeCategory === category ? " farm-filter--active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="farm-feed-count">
              {filteredNotes.length} {filteredNotes.length === 1 ? "moment" : "moments"}
            </p>
          </div>

          {leadNote ? (
            <article className={`farm-note-lead${leadNote.imageUrl ? "" : " farm-note-lead--text-only"}`}>
              {leadNote.imageUrl && (
                <figure className="farm-note-lead__media">
                  <img src={leadNote.imageUrl} alt={leadNote.title || leadNote.text || "From the farm"} />
                </figure>
              )}
              <div className="farm-note-lead__body">
                <p className="eyebrow">Latest from the land</p>
                <NoteMeta note={leadNote} includeYear />
                {leadNote.title && <h2>{leadNote.title}</h2>}
                {leadNote.text ? (
                  <p className="farm-note-lead__copy">{leadNote.text}</p>
                ) : (
                  <p className="farm-note-lead__copy">Sometimes the photograph is the whole update.</p>
                )}
              </div>
            </article>
          ) : (
            <div className="empty-state">Nothing in this category yet.</div>
          )}

          {rest.length > 0 && (
            <section className="farm-note-grid" aria-label="Earlier farm notes">
              {rest.map((note) => <FarmNoteCard key={note.id} note={note} />)}
            </section>
          )}
        </>
      )}
    </main>
  );
}
