import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CalendarPage from "./components/CalendarPage";
import ErrorPage from "./error-page";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CalendarPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
