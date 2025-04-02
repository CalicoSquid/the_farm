import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind/index.css";
import "./styles/sass/index.scss";
import App from "./App.jsx";
import { UnreadProvider } from "./context/unreadContext";

createRoot(document.getElementById("root")).render(
  <UnreadProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </UnreadProvider>
);
