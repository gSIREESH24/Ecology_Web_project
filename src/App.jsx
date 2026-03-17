import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./components/IntroPage/IntroPage";
import LoginPage from "./components/LoginPage/login";
import FarmerDashboard from "./components/FarmerDashBoard/Dashboard";
import AnalysisPage from "./components/FarmerDashBoard/CropAnalysis/AnalysisPage";
import Profile from "./components/FarmerDashBoard/Profile/ProfilePage";
import ProfileProvider, { ProfileContext } from "./context/ProfileContext";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function AppContent() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showProfile, closeProfile } = useContext(ProfileContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<FarmerDashboard />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        {/* Commented routes for login flow
        {isAuthenticated ? (
          <FarmerDashboard />
        ) : showLogin ? (
          <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          <IntroPage onLoginComplete={() => setShowLogin(true)} />
        )}*/}
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
