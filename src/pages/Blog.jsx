import { useContext, useEffect, useMemo, useState } from "react";
import { doc, increment, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import db from "../../firebase.config";
import { UnreadContext } from "../context/unreadContext";
import { localBlogs } from "../content/localBlogs";

const getDate = (blog) => {
  if (blog.date?.toDate) return blog.date.toDate();
  const parsed = new Date(blog.date || 0);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

const stripFormatting = (text = "") =>
  text.replace(/\/p\//g, " ").replace(/\/br\//g, " ").replace(/\/b\//g, "").replace(/\[([^\]]+)\]\{[^}]+\}/g, "$1");

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

  // Important: Firestore's `blogs` state is left completely untouched.
  // The local comeback essay only joins the list here at render time.
  const allBlogs = useMemo(() => [...localBlogs, ...blogs], [blogs]);

  const sortedBlogs = useMemo(
    () =>
      [...allBlogs].sort((a, b) =>
        sortOrder === "newest" ? getDate(b) - getDate(a) : getDate(a) - getDate(b)
      ),
    [allBlogs, sortOrder]
  );

  const handleLike = async (id) => {
    if (likedPosts.has(id)) return;
    const target = allBlogs.find((blog) => blog.id === id);

    try {
      if (!target?.local) {
        await updateDoc(doc(db, "Blogs", id), { likes: increment(1) });
        setBlogs((prev) =>
          prev.map((blog) => (blog.id === id ? { ...blog, likes: (blog.likes || 0) + 1 } : blog))
        );
      }

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
          const excerpt = blog.excerpt || stripFormatting(blog.body).trim();
          const isUnread = unreadPosts.includes(blog.id);
          const isLiked = likedPosts.has(blog.id);
          return (
            <article key={`${blog.local ? "local" : "remote"}-${blog.id}`} className="journal-card">
              <Link to={`/blog/${blog.id}`} onClick={() => handleMarkAsRead(blog.id)} className="journal-card__image-link">
                <img src={blog.imageUrl} alt="" className="journal-card__image" loading="lazy" />
              </Link>
              <div className="journal-card__content">
                <div className="journal-card__meta">
                  <time>{getDate(blog).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
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
                    <span aria-hidden="true">♥</span> {blog.local ? (isLiked ? "Liked" : "Like") : (blog.likes || 0)}
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
