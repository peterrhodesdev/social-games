import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Footer } from "./partials/Footer";
import { Header } from "./partials/Header";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { MathGrid } from "./games/math-grid/MathGrid";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <div className="p-8 prose prose-lg prose-slate max-w-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/math-grid" element={<MathGrid />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <div className="sticky top-[100vh]">
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export { App };
