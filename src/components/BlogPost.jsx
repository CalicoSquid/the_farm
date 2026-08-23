import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import db from "../../firebase.config";
import renderTextWithLinksAndParagraphs from "../utils/rendertexwithparagraphs.jsx";

const getDate = (blog) => {
  if (blog?.date?.toDate) return blog.date.toDate();
  const parsed = new Date(blog?.date || 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const readStored = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key)) || [];
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docSnap = await getDoc(doc(db, "Blogs", id));
        if (docSnap.exists()) setBlog({ id: docSnap.id, ...docSnap.data() });
      } catch (error) {
        console.error("Unable to load update:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    setLiked(readStored("likedPosts").includes(id));
  }, [id]);

  const handleLike = async () => {
    if (liked) return;

    try {
      await updateDoc(doc(db, "Blogs", id), { likes: increment(1) });
      setBlog((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));

      setLiked(true);
      const likedPosts = readStored("likedPosts");
      localStorage.setItem("likedPosts", JSON.stringify([...new Set([...likedPosts, id])]));
    } catch (error) {
      console.error("Unable to like update:", error);
    }
  };

  if (loading) return <main className="page-shell"><div className="empty-state">Loading update…</div></main>;
  if (!blog) return <main className="page-shell"><div className="empty-state">That update couldn’t be found.</div></main>;

  const published = getDate(blog);

  return (
    <main className="article-page">
      <div className="article-page__topbar">
        <button className="text-link text-link--button" onClick={() => navigate(-1)}>← All updates</button>
      </div>
      <article className="article">
        <header className="article__header">
          <p className="eyebrow">The longer story</p>
          <h1>{blog.title}</h1>
          {blog.dek && <p className="article__dek">{blog.dek}</p>}
          {published && (
            <time>{published.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
          )}
        </header>
        <figure className="article__hero">
          <img src={blog.imageUrl} alt={blog.title} />
        </figure>
        <div className="article__body">{renderTextWithLinksAndParagraphs(blog.body)}</div>

        {blog.relatedLinks?.length > 0 && (
          <aside className="article__related" aria-label="Keep exploring the farm">
            {blog.relatedLinks.map((item) => (
              <Link to={item.to} className="article-related-card" key={item.to}>
                <p className="eyebrow">{item.eyebrow}</p>
                <h2>{item.title}</h2>
                <p>{item.copy}</p>
                <span className="text-link">{item.label} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </aside>
        )}

        <footer className="article__footer">
          <button className={`like-button like-button--article${liked ? " liked" : ""}`} onClick={handleLike} disabled={liked}>
            <span aria-hidden="true">♥</span> {liked ? "Liked" : "Like this"} · {blog.likes || 0}
          </button>
        </footer>
      </article>
    </main>
  );
}
