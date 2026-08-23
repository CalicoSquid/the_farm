import { useContext, useEffect, useMemo, useState } from "react";
import { doc, increment, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import db from "../../firebase.config";
import { UnreadContext } from "../context/unreadContext";
import { getBlogDate, getBlogExcerpt, getBlogTimestamp } from "../utils/blog";

const readStored = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key)) || [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function Blog({ blogs, setBlogs }) {
  const [sortOrder, setSortOrder] = useState("newest");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { unreadPosts, markAsRead } = useContext(UnreadContext);

  useEffect(() => {
    setLikedPosts(new Set(readStored("likedPosts")));
  }, []);

  const sortedBlogs = useMemo(
    () =>
      [...blogs].sort((a, b) =>
        sortOrder === "newest"
          ? getBlogTimestamp(b) - getBlogTimestamp(a)
          : getBlogTimestamp(a) - getBlogTimestamp(b)
      ),
    [blogs, sortOrder]
  );

  const handleLike = async (id) => {
    if (likedPosts.has(id)) return;
    try {
      await updateDoc(doc(db, "Blogs", id), { likes: increment(1) });
      setBlogs((prev) =>
        prev.map((blog) => (blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog))
      );

      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem("likedPosts", JSON.stringify([...next]));
        return next;
      });
    } catch (error) {
      console.error("Unable to like update:", error);
    }
  };

  const handleMarkAsRead = (id) => {
    const storedRead = readStored("readPosts");
    if (!storedRead.includes(id)) {
      localStorage.setItem("readPosts", JSON.stringify([...storedRead, id]));
    }
    markAsRead(id);
  };

  return (
    <main className="page-shell journal-page">
      <header className="page-intro page-intro--with-actions">
        <div>
          <p className="eyebrow">Notes from the long way round</p>
          <h1>Updates</h1>
          <p className="page-intro__copy">
            Longer stories from the farm — progress, detours, plans and the occasional existential crisis.
          </p>
        </div>
        <button
          className="button button--ghost"
          onClick={() => setSortOrder((order) => (order === "newest" ? "oldest" : "newest"))}
        >
          {sortOrder === "newest" ? "Newest first" : "Oldest first"}
        </button>
      </header>

      <div className="journal-list">
        {sortedBlogs.length === 0 && <div className="empty-state">Loading updates…</div>}
        {sortedBlogs.map((blog) => {
          const excerpt = getBlogExcerpt(blog);
          const published = getBlogDate(blog);
          const isUnread = unreadPosts.includes(blog.id);
          const isLiked = likedPosts.has(blog.id);
          return (
            <article key={blog.id} className="journal-card">
              <Link to={`/blog/${blog.id}`} onClick={() => handleMarkAsRead(blog.id)} className="journal-card__image-link">
                <img src={blog.imageUrl} alt="" className="journal-card__image" loading="lazy" />
              </Link>
              <div className="journal-card__content">
                <div className="journal-card__meta">
                  {published && (
                    <time>{published.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                  )}
                  {isUnread && <span className="status-pill">New</span>}
                </div>
                <h2>
                  <Link to={`/blog/${blog.id}`} onClick={() => handleMarkAsRead(blog.id)}>{blog.title}</Link>
                </h2>
                <p>{excerpt.slice(0, 260)}{excerpt.length > 260 ? "…" : ""}</p>
                <div className="journal-card__footer">
                  <Link to={`/blog/${blog.id}`} onClick={() => handleMarkAsRead(blog.id)} className="text-link">
                    Read update <span aria-hidden="true">→</span>
                  </Link>
                  <button
                    className={`like-button${isLiked ? " liked" : ""}`}
                    onClick={() => handleLike(blog.id)}
                    disabled={isLiked}
                    aria-label={isLiked ? "Already liked" : "Like this update"}
                  >
                    <span aria-hidden="true">♥</span> {isLiked ? "Liked" : (blog.likes || 0)}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
