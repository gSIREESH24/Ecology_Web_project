import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProfileProvider from "./context/ProfileContext";
import "leaflet/dist/leaflet.css";
import AuthPage from "./components/LoginPage/AuthPage";

const FarmerDashboard = lazy(() => import("./components/FarmerDashBoard/Dashboard"));
const AggregatorDashboard = lazy(() => import("./components/AggregatorDashboard/Dashboard"));
const IndustryDashboard = lazy(() => import("./components/IndustryDashboard/Dashboard"));
const AnalysisPage = lazy(() => import("./components/FarmerDashBoard/AnalysisPage"));
const CreditsPage = lazy(() => import("./components/FarmerDashBoard/Credits"));

const LoadingFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif", color: "#2e7d32" }}>
    Loading AgriCycle...
  </div>
);

const roleToPath = {
  farmer: "/farmer",
  aggregator: "/aggregator",
  industry: "/industry",
};

function getAuthData() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  let user = null;
  try { user = userRaw ? JSON.parse(userRaw) : null; } catch { user = null; }
  return { token, user };
}

function AuthRoute() {
  const { token, user } = getAuthData();
  if (!token) return <AuthPage />;
  const role = user?.role?.toLowerCase();
  return <Navigate to={roleToPath[role] || "/"} replace />;
}

function ProtectedRoute({ children }) {
  const { token, user } = getAuthData();
  if (!token || !user?.role) return <Navigate to="/" replace />;
  return children;
}

function AppContent() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AuthRoute />} />
        <Route path="/farmer" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/aggregator" element={<ProtectedRoute><AggregatorDashboard /></ProtectedRoute>} />
        <Route path="/industry" element={<ProtectedRoute><IndustryDashboard /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
        <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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