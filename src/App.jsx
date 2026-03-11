import React, { useState } from "react";
import IntroPage from "./components/IntroPage/IntroPage";
import LoginPage from "./components/LoginPage/login";
import FarmerDashboard from "./components/FarmerDashBoard/Dashboard";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);

  return (
    <>
      {showLogin ? (
        <LoginPage />
      ) : (
        <IntroPage onLoginComplete={() => setShowLogin(true)} />
      )}
      <FarmerDashboard />
    </>
  );
}

export default App;