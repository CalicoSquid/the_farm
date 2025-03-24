import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase.config";
import { Link } from "react-router-dom";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "Blogs"));
      const blogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogData);
    };

    fetchBlogs();
  }, []);

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
            <p className="blog-body">{blog.body.substring(0, 150)}...</p>
            <Link to={`/blog/${blog.id}`}>
              <button className="btn-primary">Read More</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
