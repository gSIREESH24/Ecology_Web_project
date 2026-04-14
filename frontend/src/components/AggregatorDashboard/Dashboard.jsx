import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar, Box, Button, Container, Dialog, DialogContent, Grid,
  IconButton, LinearProgress, Stack, TextField, Typography, Chip,
  Badge, Tabs, Tab, CircularProgress, Alert, Snackbar, Card, CardContent, Divider
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import FactoryIcon from "@mui/icons-material/Factory";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../../context/AuthContext";
import { statusColor, demandStatusColor } from "./data";
import LanguageSwitcher from "../common/LanguageSwitcher";
import api from "../../api";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371, dLat = ((lat2-lat1)*Math.PI)/180, dLng = ((lng2-lng1)*Math.PI)/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return +(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
};

function MapBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      try { map.fitBounds(points, { padding: [40, 40] }); } catch {}
    }
  }, [points, map]);
  return null;
}

function MapLegend({ t }) {
  return (
    <Box sx={{ position: "absolute", left: 16, bottom: 16, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", bgcolor: "rgba(255,255,255,0.95)", p: 2, backdropFilter: "blur(8px)", zIndex: 999 }}>
      {[["pending","Pending"],["accepted","Accepted"],["collected","Collected"]].map(([s,l]) => (
        <Stack key={s} direction="row" spacing={1} alignItems="center" mb={0.8}>
          <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: statusColor[s] }} />
          <Typography variant="caption" fontWeight="600">{l}</Typography>
        </Stack>
      ))}
      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
        <Box sx={{ width: 28, borderTop: "3px dashed #3a7f66" }} />
        <Typography variant="caption" fontWeight="700">Route</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
        <Box sx={{ width: 14, height: 14, borderRadius: "3px", bgcolor: "#f59e0b" }} />
        <Typography variant="caption" fontWeight="600">You</Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
        <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: "#4da6ff" }} />
        <Typography variant="caption" fontWeight="600">Industry</Typography>
      </Stack>
    </Box>
  );
}

export default function AggregatorDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { session, logout } = useAuth();

  // Data state
  const [farmerRequests, setFarmerRequests] = useState([]);
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);

  // Map / Route state
  const [myCoords, setMyCoords] = useState(null); // [lat, lng]
  const [selectedIds, setSelectedIds] = useState([]);
  const [capacity, setCapacity] = useState(10);
  const [route, setRoute] = useState(null); // { routeCoords, segments, distanceKm, durationMin }
  const [animatedSegments, setAnimatedSegments] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const animRef = useRef(null);

  // Modal state
  const [modalFarm, setModalFarm] = useState(null);
  const [pickup, setPickup] = useState({ date: "", time: "08:00" });
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // Notification
  const notifCount = session?.notificationCount || 0;

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, demRes] = await Promise.all([
        api.get("/collections"),
        api.get("/demands")
      ]);
      setFarmerRequests(reqRes.data.requests || []);
      setDemands(demRes.data.demands || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Get my GPS location
  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setMyCoords([lat, lng]);
        try { await api.patch("/users/location", { lat, lng }); } catch {}
        // Clear notification count
        try { await api.patch("/users/notifications/clear"); } catch {}
        setSnack({ open: true, msg: "📍 Location set!", severity: "success" });
      },
      (err) => setSnack({ open: true, msg: "Location access denied: " + err.message, severity: "error" })
    );
  };

  useEffect(() => {
    if (session?.coordinates?.lat && session?.coordinates?.lng) {
      setMyCoords([session.coordinates.lat, session.coordinates.lng]);
    }
  }, [session]);

  // Filtered farms
  const filtered = useMemo(() =>
    activeFilter === "all" ? farmerRequests : farmerRequests.filter(r => r.status === activeFilter),
    [activeFilter, farmerRequests]);

  const selected = useMemo(() =>
    farmerRequests.filter(r => selectedIds.includes(r._id)),
    [farmerRequests, selectedIds]);

  const selectedBiomass = selected.reduce((s, r) => s + (r.biomassQuantity || 0), 0);

  const counts = {
    pending: farmerRequests.filter(r => r.status === "pending").length,
    accepted: farmerRequests.filter(r => r.status === "accepted").length,
    collected: farmerRequests.filter(r => r.status === "collected").length,
  };

  const toggleFarm = (req) => {
    if (req.status === "collected") return;
    setSelectedIds(cur => cur.includes(req._id) ? cur.filter(id => id !== req._id) : [...cur, req._id]);
  };

  // Accept request
  const acceptRequest = async (id) => {
    try {
      await api.patch(`/collections/${id}/accept`);
      setSnack({ open: true, msg: t("aggregator.requestAccepted"), severity: "success" });
      fetchData();
      setModalFarm(null);
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.message || "Failed", severity: "error" });
    }
  };

  // Mark collected
  const markCollected = async (id) => {
    try {
      await api.patch(`/collections/${id}/collect`);
      setSnack({ open: true, msg: "✅ Marked as collected! Carbon credits awarded.", severity: "success" });
      fetchData();
      setModalFarm(null);
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.message || "Failed", severity: "error" });
    }
  };

  // Accept demand
  const acceptDemand = async (id) => {
    try {
      await api.patch(`/demands/${id}/accept`);
      setSnack({ open: true, msg: t("aggregator.demandAccepted"), severity: "success" });
      fetchData();
    } catch (e) {
      setSnack({ open: true, msg: e.response?.data?.message || "Failed", severity: "error" });
    }
  };

  // Generate animated route via ORS
  const generateRoute = async () => {
    if (selected.length === 0) {
      setSnack({ open: true, msg: "Select at least one farm", severity: "warning" });
      return;
    }
    if (!myCoords) {
      setSnack({ open: true, msg: "Set your location first", severity: "warning" });
      return;
    }
    setRouteLoading(true);
    setRoute(null);
    setAnimatedSegments([]);
    try {
      const waypoints = [
        myCoords,
        ...selected.filter(r => r.coordinates?.lat).map(r => [r.coordinates.lat, r.coordinates.lng]),
        myCoords // return
      ];
      const res = await api.post("/routing/drive", { waypoints });
      setRoute(res.data);
      animateRoute(res.data.segments);
    } catch (e) {
      setSnack({ open: true, msg: "Routing failed: " + (e.response?.data?.message || e.message), severity: "error" });
    } finally { setRouteLoading(false); }
  };

  const animateRoute = (segments) => {
    setAnimating(true);
    setAnimatedSegments([]);
    let idx = 0;
    const next = () => {
      if (idx >= segments.length) { setAnimating(false); return; }
      setAnimatedSegments(prev => [...prev, segments[idx]]);
      idx++;
      animRef.current = setTimeout(next, 800);
    };
    next();
  };

  const resetRoute = () => {
    clearTimeout(animRef.current);
    setRoute(null);
    setAnimatedSegments([]);
    setAnimating(false);
    setSelectedIds([]);
  };

  // Map center
  const mapCenter = myCoords || (farmerRequests[0]?.coordinates?.lat
    ? [farmerRequests[0].coordinates.lat, farmerRequests[0].coordinates.lng]
    : [30.9, 75.8]);

  // All marker positions for fitBounds
  const allPoints = [
    ...(myCoords ? [myCoords] : []),
    ...farmerRequests.filter(r => r.coordinates?.lat).map(r => [r.coordinates.lat, r.coordinates.lng]),
    ...demands.filter(d => d.location?.lat).map(d => [d.location.lat, d.location.lng]),
  ];

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f4ee", pb: 6 }}>
      {/* Navbar */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid rgba(153,117,75,0.16)", position: "sticky", top: 0, zIndex: 1000 }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 52, height: 52, bgcolor: "#fff4d5", color: "#c96a00", border: "1px solid #f4d375" }}>
                <LocalShippingOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ color: "#d46700", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.08em" }}>AGGREGATOR</Typography>
                <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.8rem" }, fontWeight: 800, color: "#17212b" }}>
                  {session?.name || "Aggregator"}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <LanguageSwitcher color="#7f6955" />
              <Stack direction="row" spacing={0.7} alignItems="center">
                <LocationOnOutlinedIcon sx={{ color: "#8d7258", fontSize: 18 }} />
                <Typography sx={{ color: "#7f6955", fontSize: "0.9rem" }}>{session?.location || "Location"}</Typography>
              </Stack>
              <IconButton sx={{ bgcolor: "#f8f4ee" }} onClick={() => setSnack({ open: true, msg: "Notifications cleared!", severity: "info" })}>
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsIcon sx={{ color: "#7f6955" }} />
                </Badge>
              </IconButton>
              <Button startIcon={<LogoutRoundedIcon />} onClick={handleSignOut} variant="outlined"
                sx={{ borderRadius: 3, px: 2, py: 1, color: "#7f6955", borderColor: "#cddbd5", textTransform: "none", fontWeight: 700 }}>
                {t("nav.logout")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Stat cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { icon: <AgricultureOutlinedIcon />, value: counts.pending, label: "PENDING", bg: "#fffaf0", border: "#f7d56a", color: "#c76600" },
            { icon: <EventAvailableRoundedIcon />, value: counts.accepted, label: "ACCEPTED", bg: "#f2f7ff", border: "#b7d5ff", color: "#3467f2" },
            { icon: <TaskAltRoundedIcon />, value: counts.collected, label: "COLLECTED", bg: "#f1fcf5", border: "#b8f2c7", color: "#1e9b53" },
          ].map(s => (
            <Grid key={s.label} size={{ xs: 12, md: 4 }}>
              <Box sx={{ borderRadius: 4, border: `1px solid ${s.border}`, bgcolor: s.bg, p: 3, display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <Avatar sx={{ bgcolor: `${s.color}15`, color: s.color }}>{s.icon}</Avatar>
                <Box>
                  <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#17212b" }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: s.color, letterSpacing: "0.06em" }}>{s.label}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* My Location button */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button variant="contained" startIcon={<MyLocationIcon />} onClick={getMyLocation}
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, bgcolor: myCoords ? "#2e7d32" : "#f59e0b", "&:hover": { bgcolor: myCoords ? "#1b5e20" : "#d97706" } }}>
            {myCoords ? "📍 Location Set" : t("aggregator.myLocation")}
          </Button>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={fetchData}
            sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, borderColor: "#9fbeaf", color: "#2f7d5a" }}>
            {t("common.refresh")}
          </Button>
        </Box>

        {/* Map */}
        <Box sx={{ borderRadius: 6, overflow: "hidden", height: 500, position: "relative", mb: 4, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}>
          <MapContainer center={mapCenter} zoom={7} scrollWheelZoom style={{ height: "100%", width: "100%", zIndex: 0 }}>
            <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {allPoints.length > 1 && <MapBounds points={allPoints} />}

            {/* My location */}
            {myCoords && (
              <CircleMarker center={myCoords} radius={16}
                pathOptions={{ color: "#fff", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 }}
                eventHandlers={{ click: () => window.open(`https://www.google.com/maps?q=${myCoords[0]},${myCoords[1]}`, "_blank") }}>
                <Tooltip permanent>You</Tooltip>
              </CircleMarker>
            )}

            {/* Farmer markers */}
            {farmerRequests.filter(r => r.coordinates?.lat).map(r => (
              <CircleMarker key={r._id} center={[r.coordinates.lat, r.coordinates.lng]} radius={12}
                pathOptions={{ color: selectedIds.includes(r._id) ? "#fff" : "#ccc", weight: selectedIds.includes(r._id) ? 4 : 2, fillColor: statusColor[r.status] || "#f59e0b", fillOpacity: 1 }}
                eventHandlers={{
                  click: () => {
                    const url = `https://www.google.com/maps?q=${r.coordinates.lat},${r.coordinates.lng}`;
                    window.open(url, "_blank");
                  }
                }}>
                <Tooltip>{r.farmerName} — {r.farmBiomassQuantity}t {r.cropType}</Tooltip>
              </CircleMarker>
            ))}

            {/* Industry markers */}
            {demands.filter(d => d.location?.lat).map(d => (
              <CircleMarker key={d._id} center={[d.location.lat, d.location.lng]} radius={13}
                pathOptions={{ color: "#fff", weight: 3, fillColor: "#4da6ff", fillOpacity: 1 }}
                eventHandlers={{
                  click: () => window.open(`https://www.google.com/maps?q=${d.location.lat},${d.location.lng}`, "_blank")
                }}>
                <Tooltip>{d.companyName} — needs {d.quantityNeeded}t {d.cropType}</Tooltip>
              </CircleMarker>
            ))}

            {/* Animated route segments */}
            {animatedSegments.map((seg, i) => (
              <Polyline key={i} positions={seg}
                pathOptions={{ color: "#3a7f66", weight: 5, dashArray: "12 6", opacity: 0.9 }} />
            ))}
          </MapContainer>
          <MapLegend t={t} />
          <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 999 }}>
            <Typography variant="caption" sx={{ bgcolor: "rgba(255,255,255,0.9)", px: 1.5, py: 0.6, borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontWeight: 600 }}>
              🖱️ {t("map.clickForMaps")}
            </Typography>
          </Box>
        </Box>

        {/* Tabs: Farmer Requests | Industry Demands | Route */}
        <Box sx={{ mb: 3, bgcolor: "#fff", borderRadius: 4, p: 0.5, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth"
            sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 700, borderRadius: 3 }, "& .Mui-selected": { bgcolor: "#eef7f2" } }}>
            <Tab label={`🌾 ${t("aggregator.farmerRequests")} (${farmerRequests.length})`} />
            <Tab label={`🏭 ${t("aggregator.industryDemands")} (${demands.length})`} />
            <Tab label={`🗺️ ${t("aggregator.routeOptimization")}`} />
          </Tabs>
        </Box>

        {/* === FARMER REQUESTS TAB === */}
        {activeTab === 0 && (
          <Box>
            {/* Filter buttons */}
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" useFlexGap>
              {["all","pending","accepted","collected"].map(f => (
                <Button key={f} onClick={() => setActiveFilter(f)} variant={activeFilter === f ? "contained" : "outlined"}
                  sx={{ borderRadius: 20, textTransform: "none", fontWeight: 700, boxShadow: "none", bgcolor: activeFilter === f ? "#2f7d5a" : "#fff", color: activeFilter === f ? "#fff" : "#8b6f59", borderColor: "#dbcdbb" }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </Stack>

            {loading ? (
              <Box textAlign="center" py={6}><CircularProgress sx={{ color: "#2f7d5a" }} /></Box>
            ) : filtered.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>{t("aggregator.noRequests")}</Alert>
            ) : (
              <Grid container spacing={2.5}>
                {filtered.map(req => (
                  <Grid key={req._id} size={{ xs: 12, md: 6, xl: 4 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: selectedIds.includes(req._id) ? "2px solid #2f7d5a" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", "&:hover": { boxShadow: "0 8px 32px rgba(0,0,0,0.12)", transform: "translateY(-2px)" } }}
                      onClick={() => toggleFarm(req)}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box>
                            <Typography fontWeight="800" fontSize="1rem">{req.farmerName}</Typography>
                            <Typography variant="body2" color="text.secondary">📍 {req.address?.substring(0, 40)}...</Typography>
                          </Box>
                          <Chip label={req.status} size="small"
                            sx={{ bgcolor: `${statusColor[req.status]}20`, color: statusColor[req.status], fontWeight: 700, borderRadius: "10px", fontSize: "0.7rem" }} />
                        </Stack>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">Crop</Typography>
                            <Typography fontWeight="700" fontSize="0.9rem">🌾 {req.cropType}</Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">Biomass</Typography>
                            <Typography fontWeight="700" fontSize="0.9rem">⚖️ {req.biomassQuantity}t</Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">Price</Typography>
                            <Typography fontWeight="700" fontSize="0.9rem">💰 ₹{req.priceExpectation}/t</Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="caption" color="text.secondary">Distance</Typography>
                            <Typography fontWeight="700" fontSize="0.9rem">🚗 {req.distanceKm ? `${req.distanceKm} km` : "—"}</Typography>
                          </Grid>
                        </Grid>
                        {req.qualityNotes && (
                          <Box sx={{ mt: 1, p: 1, bgcolor: "#f9f6f2", borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">📝 {req.qualityNotes}</Typography>
                          </Box>
                        )}
                        {req.cropPhotoUrl && (
                          <Box component="img" src={`http://localhost:5000${req.cropPhotoUrl}`} alt="crop"
                            sx={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 2, mt: 1 }} />
                        )}
                        <Stack direction="row" spacing={1} mt={1.5}>
                          {req.status === "pending" && (
                            <Button fullWidth size="small" variant="contained" onClick={e => { e.stopPropagation(); setModalFarm(req); setPickup({ date: "", time: "08:00" }); }}
                              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#2f7d5a", boxShadow: "none" }}>
                              {t("aggregator.acceptRequest")}
                            </Button>
                          )}
                          {req.status === "accepted" && req.assignedAggregatorId === session?.id && (
                            <Button fullWidth size="small" variant="outlined" onClick={e => { e.stopPropagation(); markCollected(req._id); }}
                              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "#22c55e", color: "#22c55e" }}>
                              {t("aggregator.markCollected")}
                            </Button>
                          )}
                          <Button size="small" onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/maps?q=${req.coordinates?.lat},${req.coordinates?.lng}`, "_blank"); }}
                            sx={{ borderRadius: 2, textTransform: "none", fontSize: "0.75rem", color: "#1a73e8", fontWeight: 700 }}>
                            🗺️ Maps
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* === INDUSTRY DEMANDS TAB === */}
        {activeTab === 1 && (
          <Box>
            {loading ? (
              <Box textAlign="center" py={6}><CircularProgress sx={{ color: "#4da6ff" }} /></Box>
            ) : demands.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>{t("aggregator.noDemands")}</Alert>
            ) : (
              <Grid container spacing={2.5}>
                {demands.map(d => (
                  <Grid key={d._id} size={{ xs: 12, md: 6, xl: 4 }}>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e8f4ff", transition: "all 0.2s", "&:hover": { boxShadow: "0 8px 32px rgba(77,166,255,0.15)", transform: "translateY(-2px)" } }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "#e8f4ff", color: "#4da6ff", width: 38, height: 38 }}><FactoryIcon fontSize="small" /></Avatar>
                            <Box>
                              <Typography fontWeight="800">{d.companyName}</Typography>
                              <Typography variant="caption" color="text.secondary">{d.industryName}</Typography>
                            </Box>
                          </Box>
                          <Chip label={d.status} size="small"
                            sx={{ bgcolor: `${demandStatusColor[d.status]}20`, color: demandStatusColor[d.status], fontWeight: 700, borderRadius: "10px", fontSize: "0.7rem" }} />
                        </Stack>
                        <Divider sx={{ mb: 1.5 }} />
                        <Grid container spacing={1}>
                          <Grid size={6}><Typography variant="caption" color="text.secondary">Crop Needed</Typography><Typography fontWeight="700">🌾 {d.cropType}</Typography></Grid>
                          <Grid size={6}><Typography variant="caption" color="text.secondary">Quantity</Typography><Typography fontWeight="700">⚖️ {d.quantityNeeded}t</Typography></Grid>
                          <Grid size={6}><Typography variant="caption" color="text.secondary">Price Offered</Typography><Typography fontWeight="700" color="#22c55e">₹{d.priceOffered}/t</Typography></Grid>
                          <Grid size={6}><Typography variant="caption" color="text.secondary">Deadline</Typography><Typography fontWeight="700">📅 {new Date(d.deadline).toLocaleDateString()}</Typography></Grid>
                        </Grid>
                        <Box sx={{ mt: 1.5, p: 1.5, bgcolor: "#f8fcff", borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">📍 {d.location?.address}</Typography>
                        </Box>
                        {d.description && <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{d.description}</Typography>}
                        <Stack direction="row" spacing={1} mt={2}>
                          {d.status === "open" && (
                            <Button fullWidth size="small" variant="contained" onClick={() => acceptDemand(d._id)}
                              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#4da6ff", boxShadow: "none", "&:hover": { bgcolor: "#1a73e8" } }}>
                              {t("aggregator.acceptRequest")} Demand
                            </Button>
                          )}
                          {d.location?.lat && (
                            <Button size="small" onClick={() => window.open(`https://www.google.com/maps?q=${d.location.lat},${d.location.lng}`, "_blank")}
                              sx={{ borderRadius: 2, textTransform: "none", fontSize: "0.75rem", color: "#1a73e8", fontWeight: 700 }}>
                              🗺️ Maps
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* === ROUTE OPTIMIZATION TAB === */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ borderRadius: 4, bgcolor: "#fff", p: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <Typography variant="h6" fontWeight="800" mb={1}>{t("aggregator.routeOptimization")}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2.5}>
                  Select farms from the Farmer Requests tab, then click Generate to get the animated road route.
                </Typography>

                <Box sx={{ bgcolor: "#f9f6f2", borderRadius: 3, p: 2.5, mb: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" mb={1}><Typography color="#8a7058">Selected farms</Typography><Typography fontWeight="800">{selected.length}</Typography></Stack>
                  <Stack direction="row" justifyContent="space-between"><Typography color="#8a7058">Total biomass</Typography><Typography fontWeight="800">{selectedBiomass.toFixed(1)} t</Typography></Stack>
                </Box>

                <Stack direction="row" spacing={2} mb={2.5}>
                  <Button fullWidth variant="contained"
                    startIcon={routeLoading ? <CircularProgress size={18} color="inherit" /> : animating ? <RouteOutlinedIcon /> : <BoltRoundedIcon />}
                    onClick={generateRoute} disabled={routeLoading || animating}
                    sx={{ minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 800, fontSize: "1rem", bgcolor: "#9fbeaf", boxShadow: "none" }}>
                    {routeLoading ? "Getting route..." : animating ? t("aggregator.animating") : t("aggregator.generateRoute")}
                  </Button>
                  <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={resetRoute}
                    sx={{ minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 700, borderColor: "#d9cfbf", color: "#8a7058" }}>
                    {t("aggregator.resetRoute")}
                  </Button>
                </Stack>

                {route && (
                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "#d7f8e3", color: "#14844d" }}><TaskAltRoundedIcon /></Avatar>
                      <Box>
                        <Typography fontWeight="800" fontSize="1.4rem">Route Optimised</Typography>
                        <Typography color="#8a7058">{selected.length} stops — road network route</Typography>
                      </Box>
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={4}><Box sx={{ p: 2, borderRadius: 3, bgcolor: "#edf4f2", textAlign: "center" }}><RouteOutlinedIcon sx={{ color: "#3b7b67" }} /><Typography fontWeight="800">{route.distanceKm} km</Typography><Typography variant="caption" color="text.secondary">Distance</Typography></Box></Grid>
                      <Grid size={4}><Box sx={{ p: 2, borderRadius: 3, bgcolor: "#fff3c8", textAlign: "center" }}><AccessTimeRoundedIcon sx={{ color: "#d17400" }} /><Typography fontWeight="800">{route.durationMin} min</Typography><Typography variant="caption" color="text.secondary">Est. Time</Typography></Box></Grid>
                      <Grid size={4}><Box sx={{ p: 2, borderRadius: 3, bgcolor: "#dce9ff", textAlign: "center" }}><LocalGasStationRoundedIcon sx={{ color: "#2f5be8" }} /><Typography fontWeight="800">₹{Math.round(Number(route.distanceKm) * 11.5).toLocaleString()}</Typography><Typography variant="caption" color="text.secondary">Fuel Est.</Typography></Box></Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ borderRadius: 4, bgcolor: "#fff", p: 3, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <Typography variant="h6" fontWeight="800" mb={2}><ScaleOutlinedIcon sx={{ mb: -0.5, mr: 1 }} />Truck Capacity</Typography>
                <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 2, borderRadius: 3, border: "1px solid #e4d7c7", mb: 2, fontSize: "2rem", fontWeight: 800 }}>
                  {capacity}<Box component="span" sx={{ ml: "auto", fontSize: "1rem", color: "#7d6755" }}>tons</Box>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap mb={3}>
                  {[5, 10, 20, 30].map(v => (
                    <Button key={v} variant={capacity === v ? "contained" : "outlined"} onClick={() => setCapacity(v)}
                      sx={{ minWidth: 100, minHeight: 56, borderRadius: 3, textTransform: "none", fontWeight: 800, fontSize: "1rem", borderColor: "#d9cfbf", color: capacity === v ? "#2f7d5a" : "#2b2018", bgcolor: capacity === v ? "#eef7f2" : "#fff", boxShadow: "none" }}>
                      {v}t
                    </Button>
                  ))}
                </Stack>
                <Stack direction="row" justifyContent="space-between" mb={0.8}>
                  <Typography color="#7d6755" fontWeight="700">Load from selected</Typography>
                  <Typography color="#02a54a" fontWeight="800">{selectedBiomass.toFixed(1)} / {capacity} t</Typography>
                </Stack>
                <LinearProgress value={Math.min((selectedBiomass/capacity)*100,100)} variant="determinate"
                  sx={{ height: 14, borderRadius: 999, bgcolor: "#ece7de", "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: "#08c243" } }} />
                <Typography mt={1} color="#8a7058">Remaining: {(capacity-selectedBiomass).toFixed(1)} t</Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Accept modal */}
      <Dialog open={Boolean(modalFarm)} onClose={() => setModalFarm(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 6, bgcolor: "#fffdfb" } }}>
        <DialogContent sx={{ p: 3.5 }}>
          {modalFarm && (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 52, height: 52, bgcolor: "#edf4f0", color: "#3a7f66" }}><EventAvailableRoundedIcon /></Avatar>
                  <Box>
                    <Typography fontWeight="800" fontSize="1.6rem">{t("aggregator.schedulePickup")}</Typography>
                    <Typography color="#8a7058">{modalFarm.farmerName} — {modalFarm.address?.substring(0,35)}...</Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setModalFarm(null)}><CloseRoundedIcon /></IconButton>
              </Stack>
              <Box sx={{ bgcolor: "#f7f4ef", borderRadius: 3, p: 2.5, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Typography color="#8a7058">Crop: <Box component="span" fontWeight="800">{modalFarm.cropType}</Box></Typography>
                  <Typography color="#8a7058">Amount: <Box component="span" fontWeight="800">{modalFarm.biomassQuantity}t</Box></Typography>
                  <Typography color="#8a7058">Price: <Box component="span" fontWeight="800">₹{modalFarm.priceExpectation}/t</Box></Typography>
                </Stack>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button fullWidth variant="outlined" onClick={() => setModalFarm(null)}
                  sx={{ minHeight: 56, borderRadius: 3, textTransform: "none", fontWeight: 700, color: "#3a7f66", borderColor: "#cfe0d8" }}>
                  {t("common.cancel")}
                </Button>
                <Button fullWidth variant="contained" onClick={() => acceptRequest(modalFarm._id)}
                  sx={{ minHeight: 56, borderRadius: 3, textTransform: "none", fontWeight: 800, bgcolor: "#9fbeaf", boxShadow: "none" }}>
                  {t("aggregator.acceptRequest")}
                </Button>
              </Stack>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}