import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">The Farm</p>
          <p className="site-footer__line">A very slow project in Rijeka Crnojevića, Montenegro.</p>
        </div>
        <div className="site-footer__links" aria-label="Footer navigation">
          <Link to="/from-the-farm">From the Farm</Link>
          <Link to="/dreams">Dreams</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/blog">Updates</Link>
          <Link to="/map">Map</Link>
        </div>
      </div>
    </footer>
  );
}
