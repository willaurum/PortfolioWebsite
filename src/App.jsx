import { Navigate, Route, Routes } from "react-router-dom";

import ScrollToHash from "./components/ScrollToHash.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import LearnPython from "./pages/LearnPython.jsx";
import Simulation from "./pages/Simulation.jsx";

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/learnPython" element={<LearnPython />} />
        <Route path="/theAreanaSim/simulation" element={<Simulation />} />

        {/* The original site used .html URLs; keep them working. */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/projects.html" element={<Navigate to="/projects" replace />} />
        <Route path="/learnPython.html" element={<Navigate to="/learnPython" replace />} />
        <Route
          path="/theAreanaSim/simulation.html"
          element={<Navigate to="/theAreanaSim/simulation" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
