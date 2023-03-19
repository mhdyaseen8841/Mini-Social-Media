import logo from "./logo.svg";
import "./App.css";
import React from "react";

import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainPage from "./pages/MainPage";

import NotFoundPage from "./pages/404/NotFoundPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<MainPage />} />
        

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
