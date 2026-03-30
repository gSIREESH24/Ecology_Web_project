import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IntroPage from "./components/IntroPage/IntroPage";
import LoginPage from "./components/LoginPage/login";
import FarmerDashboard from "./components/FarmerDashBoard/Dashboard";
import AnalysisPage from "./components/FarmerDashBoard/CropAnalysis/AnalysisPage";
import CreditsPage from "./components/FarmerDashBoard/CreditsPage/Credits";
import Profile from "./components/FarmerDashBoard/Profile/ProfilePage";
import ProfileProvider, { ProfileContext } from "./context/ProfileContext";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("intro");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showProfile, closeProfile } = useContext(ProfileContext);

  const handleIntroComplete = () => {
    setCurrentPage("login");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            currentPage === "intro" ? (
              <IntroPage onLoginComplete={handleIntroComplete} />
            ) : currentPage === "login" ? (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            ) : (
              <FarmerDashboard />
            )
          }
        />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/credits" element={<CreditsPage />} />
      </Routes>
      
      <Profile open={showProfile} onClose={closeProfile} />
    </>
  );
}

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
