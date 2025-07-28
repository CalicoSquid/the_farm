import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import db from "../../firebase.config";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function ImageGrid() {
  const [images, setImages] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageTitle, setImageTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderImagesBy, setOrderImagesBy] = useState("desc");

  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageTitle = searchParams.get("title");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async (order) => {
      const imagesRef = collection(db, id);
      const q = query(imagesRef, orderBy("createdAt", order));
      const querySnapshot = await getDocs(q);
      const imageUrls = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageUrls);
      setLoadingStates({}); // ✅ Reset load state correctly
    };

    fetchImages(orderImagesBy);
  }, [id, orderImagesBy]);

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

  const handleImageLoad = (url) => {
    setLoadingStates((prev) => ({
      ...prev,
      [url]: true,
    }));
  };

  return (
    <div className="gallery-container blog-post-containe screen w-full">
      <h2 className="text-2xl h2-text title font-bold text-center mb-6">
        {pageTitle}
      </h2>
      <div className="buttons flex justify-between">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="flip">➪</span> Back
        </button>
        <button
          className="back-button image-sort"
          onClick={() =>
            setOrderImagesBy(orderImagesBy === "desc" ? "asc" : "desc")
          }
        >
          Sort by: {orderImagesBy === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Image Grid */}
      <div
        className="grid gap-4 mb-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
      >
        {images.map((image, index) => (
          <img
            key={image.id} // ✅ Use unique Firestore document ID
            src={image.url}
            alt={`Thumbnail ${index}`}
            className={`gallery-image cursor-pointer w-full h-70 object-cover transition-opacity duration-500 ease-in-out hover:opacity-80 ${
              loadingStates[image.url] === false ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
            onLoad={() => handleImageLoad(image.url)}
            onClick={() => handleImageClick(image.url, image.description)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed modal-overlay inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="relative modal-content p-4 rounded-lg shadow-lg flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {!isLoading && (
              <button
                onClick={handleCloseModal}
                className="close-btn flex justify-center items-center absolute top-2 right-2 hover:bg-gray-600 text-white p-2 rounded-full z-10"
              >
                X
              </button>
            )}

            {isLoading && <div className="text-white mb-2">Loading...</div>}

            <img
              src={selectedImage}
              alt="Full-size"
              className={`image max-w-full max-h-[80vh] object-contain ${
                isLoading ? "hidden" : "block"
              }`}
              onLoad={() => setIsLoading(false)}
            />

            {!isLoading && (
              <p className="text-white image-title text-title mt-2">
                {imageTitle}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
