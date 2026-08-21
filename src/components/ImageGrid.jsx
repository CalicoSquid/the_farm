import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import db from "../../firebase.config";

export default function ImageGrid() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [orderImagesBy, setOrderImagesBy] = useState("desc");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const location = useLocation();
  const pageTitle = new URLSearchParams(location.search).get("title") || "Gallery";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const imagesRef = collection(db, id);
        const q = query(imagesRef, orderBy("createdAt", orderImagesBy));
        const querySnapshot = await getDocs(q);
        setImages(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error(`Unable to load ${pageTitle} images:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id, orderImagesBy, pageTitle]);

  const openImage = (image) => {
    setIsModalLoading(true);
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setIsModalLoading(false);
  };

  return (
    <main className="page-shell photo-page">
      <header className="page-intro page-intro--with-actions">
        <div>
          <p className="eyebrow">Project gallery</p>
          <h1>{pageTitle}</h1>
          <p className="page-intro__copy">A running photographic record from the farm.</p>
        </div>
        <div className="page-actions">
          <button className="button button--ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button
            className="button button--ghost"
            onClick={() => setOrderImagesBy((order) => (order === "desc" ? "asc" : "desc"))}
          >
            {orderImagesBy === "desc" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="empty-state">Loading photographs…</div>
      ) : images.length === 0 ? (
        <div className="empty-state">Nothing here yet. Give the jungle time.</div>
      ) : (
        <div className="photo-grid">
          {images.map((image) => (
            <button
              key={image.id}
              className="photo-card"
              type="button"
              onClick={() => openImage(image)}
              aria-label={`Open ${image.description || "farm photograph"}`}
            >
              <img src={image.url} alt={image.description || "Farm photograph"} loading="lazy" />
              {image.description && <span className="photo-card__caption">{image.description}</span>}
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={closeImage}>
          <button className="lightbox__close" onClick={closeImage} aria-label="Close image">×</button>
          <div className="lightbox__inner" onClick={(event) => event.stopPropagation()}>
            {isModalLoading && <div className="lightbox__loading">Loading…</div>}
            <img
              src={selectedImage.url}
              alt={selectedImage.description || "Farm photograph"}
              onLoad={() => setIsModalLoading(false)}
              className={isModalLoading ? "is-loading" : ""}
            />
            {selectedImage.description && (
              <p className="lightbox__caption">{selectedImage.description}</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
