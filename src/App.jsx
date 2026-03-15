import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroPage from "./components/IntroPage/IntroPage";
import LoginPage from "./components/LoginPage/login";
import FarmerDashboard from "./components/FarmerDashBoard/Dashboard";
import AnalysisPage from "./components/FarmerDashBoard/CropAnalysis/AnalysisPage";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
