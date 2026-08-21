import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <main className="page-shell contact-page">
      <div className="contact-card">
        <p className="eyebrow">The quiet corner</p>
        <h1>Hello.</h1>
        <p>This is still mostly a family-and-friends project. For now, the best way to keep up is simply to wander around.</p>
        <div className="contact-card__links">
          <Link className="button button--dark" to="/blog">Read the updates</Link>
          <Link className="text-link" to="/gallery">Browse the photos →</Link>
        </div>
      </div>
    </main>
  );
}
