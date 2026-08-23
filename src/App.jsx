import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { UnreadContext } from "./context/unreadContext";
import db from "../firebase.config";
import { normalizeBlog } from "./utils/blog";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BlogPost from "./components/BlogPost";
import ImageGrid from "./components/ImageGrid";
import Home from "./pages/Home";
import FromTheFarm from "./pages/FromTheFarm";
import Dreams from "./pages/Dreams";
import Galleries from "./pages/Galleries";
import Blog from "./pages/Blog";
import Map from "./pages/Map";
import Contact from "./pages/Contact";

function App() {
  const [blogs, setBlogs] = useState([]);
  const { setUnreadPosts } = useContext(UnreadContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Blogs"));
        const blogData = querySnapshot.docs.map((doc) =>
          normalizeBlog(doc.id, doc.data())
        );

        setBlogs(blogData);

        const storedRead = JSON.parse(localStorage.getItem("readPosts")) || [];
        setUnreadPosts(
          blogData.map((blog) => blog.id).filter((id) => !storedRead.includes(id))
        );
      } catch (error) {
        console.error("Unable to load farm updates:", error);
      }
    };

    fetchBlogs();
  }, [setUnreadPosts]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="site-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/from-the-farm" element={<FromTheFarm />} />
            <Route path="/dreams" element={<Dreams />} />
            <Route path="/gallery" element={<Galleries />} />
            <Route path="/gallery/:id" element={<ImageGrid />} />
            <Route path="/blog" element={<Blog blogs={blogs} setBlogs={setBlogs} />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/map" element={<Map />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
