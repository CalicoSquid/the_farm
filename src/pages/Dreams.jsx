import { Link } from "react-router-dom";

const dreams = [
  {
    number: "01",
    eyebrow: "The heart of it",
    title: "A place to gather",
    copy:
      "The ruins do not need to become something grand. A table, a fire, food, lights after dark — somewhere people naturally end up when the day is done.",
  },
  {
    number: "02",
    eyebrow: "A roof of our own",
    title: "A little cabin",
    copy:
      "Simple, timber, and tucked into the land rather than dropped on top of it. Somewhere warm, dry and uncomplicated to stay while the rest of the farm takes its time.",
  },
  {
    number: "03",
    eyebrow: "Under the fig tree",
    title: "A night outside",
    copy:
      "The dome idea has never really gone away: a small place to sleep among the trees, close enough to hear the farm at night and far enough away to feel like an escape.",
  },
  {
    number: "04",
    eyebrow: "Small luxuries",
    title: "An outdoor shower",
    copy:
      "Stone, timber, hot water and sky overhead. Not essential in any reasonable sense, which is probably part of why the idea remains so appealing.",
  },
  {
    number: "05",
    eyebrow: "Something growing",
    title: "Food from the land",
    copy:
      "A kitchen garden, fruit, herbs and whatever else proves willing to cooperate with the soil, the heat, the wildlife and my questionable attention span.",
  },
  {
    number: "06",
    eyebrow: "Before almost everything",
    title: "Ways through the wild",
    copy:
      "Paths, little clearings and places to stop. There is a version of this farm where the jungle is still wild, but it no longer feels like it is actively trying to repel us.",
  },
];

export default function Dreams() {
  return (
    <main className="dreams-page">
      <section className="page-shell dreams-intro" aria-labelledby="dreams-title">
        <div className="dreams-intro__copy">
          <p className="eyebrow">Ideas, not promises</p>
          <h1 id="dreams-title">What this place could become.</h1>
          <p className="page-intro__copy">
            Plans change. Budgets change. Life changes. The point of this page is not to pin down a
            masterplan — it is to keep hold of the things that still make us excited about the farm.
          </p>
        </div>
        <p className="dreams-intro__aside">
          Some of these are sensible. Some are probably not. None of them come with a deadline.
        </p>
      </section>

      <section className="dream-vision" aria-labelledby="dream-vision-title">
        <div className="dream-vision__inner">
          <figure className="dream-vision__figure">
            <img
              src="/images/dreams/finished-farm.webp"
              alt="An imagined future version of the stone ruins as a warm outdoor gathering space"
              loading="eager"
              decoding="async"
            />
            <figcaption>
              <span>An early daydream</span>
              <span className="dream-vision__caption-rule" />
              <span>Not a rendering. Definitely not a deadline.</span>
            </figcaption>
          </figure>

          <div className="dream-vision__copy">
            <p className="eyebrow">The first picture in my head</p>
            <h2 id="dream-vision-title">Not finished. Lived in.</h2>
            <p>
              This was once the image on the homepage: the farm already transformed, tidy and glowing
              at sunset. It was lovely, but it skipped the entire story between here and there.
            </p>
            <p>
              It belongs better here. Not as a promise of what will happen, but as a reminder of what
              made the mess worth looking at in the first place.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell dream-list" aria-labelledby="dream-list-title">
        <header className="dream-list__header">
          <div>
            <p className="eyebrow">Still in the notebook</p>
            <h2 id="dream-list-title">Things worth imagining.</h2>
          </div>
          <p>
            A loose collection, deliberately. These can move, disappear, get cheaper, get stranger,
            or be replaced by a much better idea later.
          </p>
        </header>

        <div className="dream-grid">
          {dreams.map((dream) => (
            <article className="dream-card" key={dream.number}>
              <div className="dream-card__topline">
                <span className="dream-card__number">{dream.number}</span>
                <span className="dream-card__eyebrow">{dream.eyebrow}</span>
              </div>
              <h3>{dream.title}</h3>
              <p>{dream.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dreams-closing">
        <div className="dreams-closing__inner">
          <p className="eyebrow">Meanwhile, back in reality</p>
          <h2>The dream can be big. The next job can be tiny.</h2>
          <p>
            The farm does not have to become all of this at once — or even all of this at all. For now,
            there is still plenty to notice exactly as it is.
          </p>
          <Link to="/from-the-farm" className="button button--dark">
            Back to the real farm <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
