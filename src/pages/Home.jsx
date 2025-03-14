import { Link } from "react-router-dom";
import logo from "../assets/logofarm.png";

export default function Home() {
  return (
    <div className="home main flex flex-col min-h-screen ">
      <div className="logo-center flex flex-col justify-center items-center relative">
        <img src={logo} className="logo-hero" />
        <p className="tagline">Coming 2025...</p>
        <Link to="/gallery">
        <button className="btn-primary absolute bottom-[-50px]">
         Take a Look
        </button>
        </Link>
        
      </div>
      <div className="home-bg flex flex-1 justify-center items-center"></div>
    </div>
  );
}
