import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import db from "../../firebase.config";
import { Link } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [likedPosts, setLikedPosts] = useState(new Set());

  localStorage.clear(); 

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "Blogs"));
      const blogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);

      // Load liked posts from localStorage
      const storedLikes = JSON.parse(localStorage.getItem("likedPosts")) || [];
      setLikedPosts(new Set(storedLikes));
    };

    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    if (likedPosts.has(id)) return; // Prevent multiple likes

    const postRef = doc(db, "Blogs", id);
    await updateDoc(postRef, { likes: increment(1) });

    // Update local state and localStorage
    const updatedLikes = new Set(likedPosts);
    updatedLikes.add(id);
    setLikedPosts(updatedLikes);
    localStorage.setItem("likedPosts", JSON.stringify([...updatedLikes]));

    // Update UI
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
      )
    );
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="blog-container">
      <h2 className="blog-title text-2xl h2-text title font-bold text-center mb-6">
        Updates
      </h2>
      <div className="sort-container">
        <button
          className="sort-button"
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
        >
          Sort by: {sortOrder === "newest" ? "Oldest" : "Newest"}
        </button>
      </div>
      <div className="blog-grid">
        {sortedBlogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
            <h3 className="blog-post-title">{blog.title}</h3>
            <small className="blog-date">
              Published on:{" "}
              {blog.date
                ?.toDate()
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </small>{" "}
            <p className="blog-body">{blog.body.substring(0, 250)}...</p>
            <Link to={`/blog/${blog.id}`}>
              <button className="btn-primary">Read More</button>
            </Link>
            <div className="likes-section">
              <button
                className={`like-button ${likedPosts.has(blog.id) ? "liked" : ""}`}
                onClick={() => handleLike(blog.id)}
                disabled={likedPosts.has(blog.id)}
              >
                ❤️ {blog.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
