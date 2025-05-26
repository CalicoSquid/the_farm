import { useState, useEffect, useContext } from "react";
import { UnreadContext } from "./context/unreadContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Galleries from "./pages/Galleries";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Map from "./pages/Map";
import BlogPost from "./components/BlogPost";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase.config";
import ImageGrid from "./components/ImageGrid";

function App() {
  const [blogs, setBlogs] = useState([]);
  const { setUnreadPosts } = useContext(UnreadContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "Blogs"));
      const blogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(blogData);

      // Get the stored read posts from localStorage
      const storedRead = JSON.parse(localStorage.getItem("readPosts")) || [];
      console.log(storedRead);

      // Filter out posts that have been marked as read
      const newUnread = blogData
        .map((blog) => blog.id)
        .filter((id) => !storedRead.includes(id));

      console.log(newUnread);

      if (newUnread.length > 0) {
        setUnreadPosts(newUnread); // Set unread posts based on those not in read posts list
      }
    };

    fetchBlogs();
  }, [setUnreadPosts]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="flex flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Galleries />} />
            <Route path="/gallery/:id" element={<ImageGrid />} />
            <Route
              path="/blog"
              element={<Blog blogs={blogs} setBlogs={setBlogs} />}
            />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/map" element={<Map />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
