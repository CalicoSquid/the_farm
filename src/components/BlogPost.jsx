import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebase.config";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "Blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!blog) return <p className="error">Blog post not found.</p>;

  // Function to render text with "Rijeka Crnojevića" as a clickable link
  const renderTextWithLinks = (text) => {
    const regex = /Rijeka Crnojevića/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (index !== parts.length - 1) {
        return (
          <span key={index}>
            {part}
            <Link to="/map" className="map-link">
              Rijeka Crnojevića
            </Link>
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="blog-post-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <img src={blog.imageUrl} alt={blog.title} className="blog-post-image" />
      <h1 className="blog-post-title">{blog.title}</h1>
      <small className="blog-date">
        Published on:{" "}
        {blog.date?.toDate().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </small>
      <div className="blog-post-body">
        {/* Render the body with links inserted for "Rijeka Crnojevića" */}
        <p>{renderTextWithLinks(blog.body)}</p>
      </div>
    </div>
  );
}
