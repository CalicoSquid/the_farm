import { useState, useContext } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import db from "../../firebase.config";
import { Link } from "react-router-dom";
import { UnreadContext } from "../context/unreadContext";

export default function Blog({ blogs, setBlogs }) {
  const [sortOrder, setSortOrder] = useState("oldest");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { unreadPosts, setUnreadPosts, markAsRead } = useContext(UnreadContext);

  const handleLike = async (id) => {
    if (likedPosts.has(id)) return; // Prevent multiple likes

    const postRef = doc(db, "Blogs", id);
    await updateDoc(postRef, { likes: increment(1) });

    setLikedPosts((prev) => {
      const updatedLikes = new Set(prev);
      updatedLikes.add(id);
      localStorage.setItem("likedPosts", JSON.stringify([...updatedLikes]));
      return updatedLikes;
    });

    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog
      )
    );
  };

  const handleMarkAsRead = (id) => {
    const storedRead = JSON.parse(localStorage.getItem("readPosts")) || [];
    if (!storedRead.includes(id)) {
      storedRead.push(id);
      localStorage.setItem("readPosts", JSON.stringify(storedRead));
    }

    setUnreadPosts((prevUnread) =>
      prevUnread.filter((postId) => postId !== id)
    );
    markAsRead(id);
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(a.date.toDate()) - new Date(b.date.toDate())
      : new Date(b.date.toDate()) - new Date(a.date.toDate());
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
          <div key={blog.id} className="blog-post relative">
            <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
            <h3 className="blog-post-title">{blog.title}</h3>
            <small className="blog-date flex items-center gap-2">
  Published on:{" "}
  {blog.date?.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
  {unreadPosts.includes(blog.id) && (
    <span className="unread-indicator-post bg-red-500 text-white text-xs font-bold shadow-md">
      New
    </span>
  )}
</small>

            <p className="blog-body">{blog.body.substring(0, 250)}...</p>
            <Link
              to={`/blog/${blog.id}`}
              onClick={() => handleMarkAsRead(blog.id)}
            >
              <button className="btn-primary">Read More</button>
            </Link>
            <div className="likes-section">
              <button
                className={`like-button ${
                  likedPosts.has(blog.id) ? "liked" : ""
                }`}
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
