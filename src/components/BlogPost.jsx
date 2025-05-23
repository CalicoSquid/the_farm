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

  // Function to process text: replace "/" with new paragraphs and make "Rijeka Crnojevića" a link
  const renderTextWithLinksAndParagraphs = (text) => {
    return text.split("/p/").map((paragraph, i) => {
      const parts = paragraph.split(/(Rijeka Crnojevića)/g); // Keep the matched text as a separate element

      return (
        <p key={i} className="blog-paragraph">
          {parts.map((part, index) =>
            part === "Rijeka Crnojevića" ? (
              <Link key={index} to="/map" className="map-link">
                Rijeka Crnojevića
              </Link>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className="flex justify-center w-full">
    <div className=" flex-col blog-post-container">
      <button className="back-button" onClick={() => navigate(-1)}><span className="flip">➪</span> Back</button>
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
      <div className="blog-post-body">{renderTextWithLinksAndParagraphs(blog.body)}</div>
    </div>
    </div>
  );
}
