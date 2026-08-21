import { Link } from "react-router-dom";
import useFarmNotes, { formatFarmNoteDate } from "../hooks/useFarmNotes";

export default function Home() {
  const { notes, loading } = useFarmNotes({ limitCount: 3 });

  return (
    <main className="home">
      <section className="farm-hero" aria-labelledby="farm-hero-title">
        <picture className="farm-hero__media">
          <source
            type="image/avif"
            srcSet="/images/hero/farm-ruins-960.avif 960w, /images/hero/farm-ruins-1600.avif 1600w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/images/hero/farm-ruins-960.webp 960w, /images/hero/farm-ruins-1600.webp 1600w"
            sizes="100vw"
          />
          <img
            src="/images/hero/farm-ruins-1600.webp"
            alt="The old stone ruins on the farm, surrounded by summer growth"
            className="farm-hero__image"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="farm-hero__shade" aria-hidden="true" />

        <div className="farm-hero__inner">
          <div className="farm-hero__content">
            <p className="eyebrow farm-hero__eyebrow">A very slow restoration</p>
            <h1 id="farm-hero-title" className="farm-hero__title">
              The farm,<br />as it is.
            </h1>
            <p className="farm-hero__copy">
              Old stone, wild land, and a very long to-do list. This is the story
              of figuring out what comes next.
            </p>
            <div className="farm-hero__actions">
              <Link to="/from-the-farm" className="button button--light">
                See what’s happening <span aria-hidden="true">→</span>
              </Link>
              <Link to="/blog" className="text-link text-link--light">
                Read the longer story <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>

        <p className="farm-hero__caption">
          <span>June 2026</span>
          <span className="farm-hero__caption-rule" />
          <span>The ruins</span>
        </p>
      </section>

      <section className="home-farm-notes" aria-labelledby="home-farm-notes-title">
        <div className="home-farm-notes__inner">
          <header className="home-farm-notes__header">
            <div>
              <p className="eyebrow">From the farm</p>
              <h2 id="home-farm-notes-title">The small stuff counts too.</h2>
            </div>
            <div className="home-farm-notes__intro">
              <p>
                A running record of whatever happened since last time — no big milestone required.
              </p>
              <Link to="/from-the-farm" className="text-link">
                See everything <span aria-hidden="true">→</span>
              </Link>
            </div>
          </header>

          {loading ? (
            <div className="home-farm-notes__loading">Checking the farm…</div>
          ) : notes.length > 0 ? (
            <div className="home-farm-notes__grid">
              {notes.map((note, index) => (
                <Link
                  to="/from-the-farm"
                  key={note.id}
                  className={`home-note${index === 0 ? " home-note--lead" : ""}`}
                >
                  {note.imageUrl && (
                    <div className="home-note__media">
                      <img src={note.imageUrl} alt={note.title || note.text || "From the farm"} loading={index === 0 ? "eager" : "lazy"} />
                    </div>
                  )}
                  <div className="home-note__body">
                    <div className="home-note__meta">
                      <span>{note.category}</span>
                      <span aria-hidden="true">·</span>
                      <time>{formatFarmNoteDate(note.createdAt)}</time>
                    </div>
                    {note.title && <h3>{note.title}</h3>}
                    {note.text && <p>{note.text}</p>}
                    {note.place && <span className="home-note__place">{note.place}</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-farm-notes__empty">
              <p>
                This is where the tiny updates will land: one photograph, one thought, one thing noticed.
              </p>
              <Link to="/from-the-farm" className="text-link">
                See the new section <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="home-dreams" aria-labelledby="home-dreams-title">
        <div className="home-dreams__inner">
          <div className="home-dreams__media">
            <img
              src="/images/dreams/finished-farm.webp"
              alt="An imagined future version of the farm ruins as a warm outdoor gathering space"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="home-dreams__body">
            <p className="eyebrow">And then there are the dreams</p>
            <h2 id="home-dreams-title">What if, one day…</h2>
            <p>
              The real farm gets to stay messy on the homepage now. The tidier version still has a
              place here — alongside the cabin, the fig tree, the outdoor shower and all the other
              ideas that make the long way round feel worthwhile.
            </p>
            <Link to="/dreams" className="text-link">
              See what we’re dreaming about <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
