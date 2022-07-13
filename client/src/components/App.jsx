import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./header/Header";
import { Lobby } from "./lobby/Lobby";
import { NotFound } from "./NotFound";
import { Game } from "./games/Game";
import { UserProvider } from "../contexts/UserContext";
import { User } from "./User";
import { Guide } from "./Guide";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen">
          <Header />
          <div className="p-8 prose prose-lg prose-slate max-w-none">
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/game/:gameName" element={<Game />} />
              <Route path="/user" element={<User />} />
              <Route path="/guide/:gameName" element={<Guide />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <div className="sticky top-[100vh]">
            <Footer />
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export { App };
