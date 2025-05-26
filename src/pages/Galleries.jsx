import onion from "../assets/onion.jpg";
import rijeka from "../assets/rijeka.jpg";
import progress from "../assets/progress.jpg";
import { Link } from "react-router-dom";

export default function Gallery() {
  const tiles = [
    {
      title: "Nature",
      fullImage: onion,
      id: "Nature",
    },
    {
      title: "Rijeka Crnojevica",
      fullImage: rijeka,
      id: "Area",
    },
    {
      title: "Progress",
      fullImage: progress,
      id: "Land",
    },
  ];

  const handleImageClick = (url, title) => {
    console.log("Clicked on image:", url, title);

  };

  return (
    <div className="gallery-container p-4 flex flex-col h-screen w-full">
      <h2 className="text-2xl h2-text title font-bold text-center mb-6">
        Project Gallery
      </h2>

      {/* Image Grid */}
      <div
        className="grid gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="image-tile cursor-pointer"
            onClick={() => handleImageClick(tile.fullImage, tile.title)}
          >
<Link to={`/gallery/${tile.id}?title=${tile.title}`}>
            <img
              src={tile.fullImage}
              alt={tile.title}
              className="w-full h-full object-cover cover-image"
            />
            <div className="image-overlay">
              <p className="image-title">{tile.title}</p>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}