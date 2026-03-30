import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IntroPage from "./components/IntroPage/IntroPage";
import LoginPage from "./components/LoginPage/login";
import FarmerDashboard from "./components/FarmerDashBoard/Dashboard";
import AggregatorDashboard from "./components/AggregatorDashboard/Dashboard";
import IndustryDashboard from "./components/IndustryDashboard/Dashboard";
import AnalysisPage from "./components/FarmerDashBoard/CropAnalysis/AnalysisPage";
import CreditsPage from "./components/FarmerDashBoard/CreditsPage/Credits";
import { useAuth } from "./context/AuthContext";
import ProfileProvider from "./context/ProfileContext";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

function getDashboardByRole(role) {
  switch (role) {
    case "aggregator":
      return <AggregatorDashboard />;
    case "industry":
      return <IndustryDashboard />;
    case "farmer":
    default:
      return <FarmerDashboard />;
  }
}

function AppContent() {
  const { session } = useAuth();
  const [hasSeenIntro, setHasSeenIntro] = useState(() => Boolean(session));

  const currentPage = useMemo(() => {
    if (session?.profileComplete) return "dashboard";
    if (session) return "login";
    return hasSeenIntro ? "login" : "intro";
  }, [hasSeenIntro, session]);

  useEffect(() => {
    if (session) {
      setHasSeenIntro(true);
    }
  }, [session]);

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          currentPage === "intro" ? (
            <IntroPage onLoginComplete={handleIntroComplete} />
          ) : currentPage === "login" ? (
            <LoginPage />
          ) : (
            getDashboardByRole(session?.role)
          )
        }
      />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/credits" element={<CreditsPage />} />
    </Routes>
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
