import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import db from "../../firebase.config";
import renderTextWithLinksAndParagraphs from "../utils/rendertexwithparagraphs.jsx";

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

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

    // Check if already liked
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    setLiked(likedPosts.includes(id));
  }, [id]);

  const handleLike = async () => {
    if (liked) return;

    const postRef = doc(db, "Blogs", id);
    await updateDoc(postRef, { likes: increment(1) });

    setLiked(true);

    // Save to localStorage
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    likedPosts.push(id);
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    // Update local blog state
    setBlog((prevBlog) => ({
      ...prevBlog,
      likes: (prevBlog.likes || 0) + 1,
    }));
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!blog) return <p className="error">Blog post not found.</p>;

  return (
    <div className="flex justify-center w-full">
      <div className="flex-col blog-post-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span className="flip">➪</span> Back
        </button>

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
          {renderTextWithLinksAndParagraphs(blog.body)}
        </div>

        <div className="likes-section">
          <button
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={liked}
          >
            ❤️ {blog.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );
}
