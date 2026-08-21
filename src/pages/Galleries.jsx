import nature from "../assets/optimized/nature.webp";
import rijeka from "../assets/optimized/rijeka.webp";
import progress from "../assets/optimized/progress.webp";
import { Link } from "react-router-dom";

export default function Galleries() {
  const tiles = [
    {
      title: "Nature",
      description: "Wildlife, plants, seasons and whatever else turns up.",
      image: nature,
      id: "Nature",
    },
    {
      title: "Rijeka Crnojevića",
      description: "The village, water and landscape surrounding the farm.",
      image: rijeka,
      id: "Area",
    },
    {
      title: "Progress",
      description: "The slow, scrappy work of bringing the land back.",
      image: progress,
      id: "Land",
    },
  ];

  return (
    <main className="page-shell gallery-index">
      <header className="page-intro">
        <p className="eyebrow">The place in pictures</p>
        <h1>Project gallery</h1>
        <p className="page-intro__copy">
          The land, the area around it, and evidence that occasionally something
          does actually get done.
        </p>
      </header>

      <div className="gallery-index__grid">
        {tiles.map((tile, index) => (
          <Link
            key={tile.id}
            to={`/gallery/${tile.id}?title=${encodeURIComponent(tile.title)}`}
            className="gallery-feature"
          >
            <img src={tile.image} alt="" className="gallery-feature__image" />
            <div className="gallery-feature__scrim" aria-hidden="true" />
            <div className="gallery-feature__index">0{index + 1}</div>
            <div className="gallery-feature__content">
              <h2>{tile.title}</h2>
              <p>{tile.description}</p>
              <span className="gallery-feature__arrow" aria-hidden="true">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
