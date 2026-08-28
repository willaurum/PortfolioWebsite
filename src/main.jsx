import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// styles.css must be imported before App.jsx: the original pages linked
// styles.css first and the simulator's own stylesheet after it, and several
// simulator rules rely on winning that order tie-break.
import "./styles/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
