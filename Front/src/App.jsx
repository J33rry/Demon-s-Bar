import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div data-theme="dark">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "surface-raised border border-ash/20 text-parchment",
          duration: 3000,
          style: {
            background: "#14141C",
            color: "#E8DCC8",
            border: "1px solid #6B6B7A40",
          },
          success: {
            iconTheme: {
              primary: "#C84B31",
              secondary: "#E8DCC8",
            },
          },
          error: {
            iconTheme: {
              primary: "#C84B31",
              secondary: "#E8DCC8",
            },
          },
        }}
      />
    </div>
  );
};

export default App;