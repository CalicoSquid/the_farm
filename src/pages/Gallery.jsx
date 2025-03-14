import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase.config";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageTitle, setImageTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "Gallery"));
      const imageUrls = querySnapshot.docs.map((doc) => doc.data());
      setImages(imageUrls);
    };

    fetchImages();
  }, []);

  const handleImageClick = (url, title) => {
    setIsLoading(true);
    setSelectedImage(url);
    setImageTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setImageTitle(null);
    setIsLoading(false);
  };

  return (
    <div className="gallery-container p-4 flex flex-col h-screen w-full">
      <h2 className="text-2xl h2-text title font-bold text-center mb-6">Project Gallery</h2>

      {/* Image Grid */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.thumbnailUrl}
            alt={`Thumbnail ${index}`}
            className=" gallery-image cursor-pointer w-full h-70 object-cover transition-opacity duration-500 ease-in-out hover:opacity-80"
            loading="lazy"
            onClick={() => handleImageClick(image.fullImage, image.title)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed modal-overlay inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50" onClick={handleCloseModal}>
          <div className="relative modal-content p-4 rounded-lg shadow-lg flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {!isLoading && <button onClick={handleCloseModal} className="close-btn flex justify-center items-center absolute top-2 right-2 hover:bg-gray-600 text-white p-2 rounded-full z-10">
              X
            </button>}

            {isLoading && <div className="text-white mb-2">Loading...</div>}
            
            <img
              src={selectedImage}
              alt="Full-size"
              className={` image max-w-full max-h-[80vh] object-contain ${isLoading ? "hidden" : "block"}`}
              onLoad={() => setIsLoading(false)}
            />

            {!isLoading && <p className="text-white mt-2">{imageTitle}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
