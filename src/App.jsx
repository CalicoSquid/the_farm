import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { UnreadContext } from "./context/unreadContext";
import db from "../firebase.config";
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
import { localBlogs } from "./content/localBlogs";

function App() {
  const [blogs, setBlogs] = useState(localBlogs);
  const { setUnreadPosts } = useContext(UnreadContext);

  useEffect(() => {
    const updateUnread = (allBlogs) => {
      const storedRead = JSON.parse(localStorage.getItem("readPosts")) || [];
      setUnreadPosts(
        allBlogs.map((blog) => blog.id).filter((id) => !storedRead.includes(id))
      );
    };

    // Local essays are available immediately, even if Firestore is slow or offline.
    updateUnread(localBlogs);

    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Blogs"));
        const remoteBlogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Firestore wins if an article is later migrated there with the same id.
        const merged = new Map(localBlogs.map((blog) => [blog.id, blog]));
        remoteBlogs.forEach((blog) => merged.set(blog.id, blog));
        const allBlogs = [...merged.values()];

        setBlogs(allBlogs);
        updateUnread(allBlogs);
      } catch (error) {
        // The local comeback essay still works if Firestore cannot be reached.
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
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
