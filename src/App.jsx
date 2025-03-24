import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Gallery from "./pages/Gallery"   
import Blog from "./pages/Blog" 
import Contact from "./pages/Contact"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from "./pages/Map"
import BlogPost from "./components/BlogPost"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="flex flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/map" element={<Map/>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
