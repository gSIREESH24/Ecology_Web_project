import { useContext, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfileProvider, { ProfileContext } from "./context/ProfileContext";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const FarmerDashboard = lazy(() => import("./components/FarmerDashBoard/Dashboard"));
const AggregatorDashboard = lazy(() => import("./components/AggregatorDashboard/Dashboard"));
const IndustryDashboard = lazy(() => import("./components/IndustryDashboard/Dashboard"));
const AnalysisPage = lazy(() => import("./components/FarmerDashBoard/AnalysisPage"));
const CreditsPage = lazy(() => import("./components/FarmerDashBoard/Credits"));
const ProfilePage = lazy(() => import("./components/FarmerDashBoard/ProfilePage"));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

function AppContent() {
  const { showProfile, closeProfile } = useContext(ProfileContext);

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<AggregatorDashboard />} />
          <Route path="/industry" element={<IndustryDashboard />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/aggregator" element={<AggregatorDashboard />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/credits" element={<CreditsPage />} />
        </Routes>
        <ProfilePage open={showProfile} onClose={closeProfile} />
      </Suspense>
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
