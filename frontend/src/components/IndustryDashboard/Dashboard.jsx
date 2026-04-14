import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box, Typography, Button, Container, Grid, Card, CardContent, Stack, Avatar,
  Chip, Divider, Dialog, DialogContent, TextField, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Alert, Snackbar, IconButton, Badge
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScaleIcon from "@mui/icons-material/Scale";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../common/LanguageSwitcher";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STATUS_COLOR = { open: "#22c55e", accepted: "#3b82f6", fulfilled: "#9aa4b2", closed: "#ef4444" };
const CROPS = ["Wheat", "Paddy", "Maize", "Sugarcane", "Cotton", "Any"];
const tomorrowStr = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; };

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position ? <Marker position={position} /> : null;
}

function DemandForm({ demand, onClose, onSaved }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    cropType: demand?.cropType || "",
    quantityNeeded: demand?.quantityNeeded || "",
    priceOffered: demand?.priceOffered || "",
    deadline: demand?.deadline?.split("T")[0] || tomorrowStr(),
    description: demand?.description || "",
    address: demand?.location?.address || "",
  });
  const [mapPos, setMapPos] = useState(
    demand?.location?.lat ? [demand.location.lat, demand.location.lng] : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);

  const getGps = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setMapPos([lat, lng]);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await res.json();
          setForm(f => ({ ...f, address: data.display_name }));
        } catch { setForm(f => ({ ...f, address: `${lat.toFixed(4)},${lng.toFixed(4)}` })); }
        setGpsLoading(false);
      },
      () => setGpsLoading(false)
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.cropType || !form.quantityNeeded || !form.priceOffered || !form.deadline || !form.address) {
      setError("All required fields must be filled"); return;
    }
    setLoading(true); setError("");
    try {
      const payload = { ...form, lat: mapPos?.[0], lng: mapPos?.[1] };
      if (demand) { await api.patch(`/demands/${demand._id}/close`); } // Simple edit: close + recreate
      await api.post("/demands", payload);
      onSaved();
      onClose();
    } catch (e) { setError(e.response?.data?.message || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight="800" mb={2}>
        {demand ? "Edit Demand" : `➕ ${t("industry.createDemand")}`}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Crop Type</InputLabel>
            <Select label="Crop Type" value={form.cropType} onChange={e => setForm(f => ({ ...f, cropType: e.target.value }))} sx={{ borderRadius: "12px" }}>
              {CROPS.map(c => <MenuItem key={c} value={c}>{t(`crops.${c}`)}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth required type="number" label="Quantity Needed (tons)" value={form.quantityNeeded}
            onChange={e => setForm(f => ({ ...f, quantityNeeded: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth required type="number" label="Price Offered (₹/ton)"
            InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: "#666" }}>₹</Typography> }}
            value={form.priceOffered} onChange={e => setForm(f => ({ ...f, priceOffered: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth required type="date" label="Deadline" InputLabelProps={{ shrink: true }}
            inputProps={{ min: tomorrowStr() }} value={form.deadline}
            onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline rows={2} label="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight="700" mb={1}>📍 Delivery Location</Typography>
          <Box display="flex" gap={1.5} mb={1.5}>
            <Button variant="outlined" startIcon={gpsLoading ? <CircularProgress size={16} /> : <MyLocationIcon />}
              onClick={getGps} disabled={gpsLoading} size="small"
              sx={{ borderRadius: "20px", textTransform: "none", borderColor: "#0b1c3d", color: "#0b1c3d" }}>
              Use GPS
            </Button>
            {mapPos && <Chip label="✅ Location set" color="success" variant="outlined" size="small" sx={{ borderRadius: "20px" }} />}
          </Box>
          <TextField fullWidth label="Delivery Address" value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="e.g. Industrial Area, Amritsar, Punjab" sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <Box sx={{ borderRadius: "16px", overflow: "hidden", height: 200, border: "1px solid #e0e0e0" }}>
            <MapContainer center={mapPos || [30.9, 75.8]} zoom={mapPos ? 13 : 6} style={{ height: "100%", width: "100%" }} key={mapPos?.toString()}>
              <TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker position={mapPos} setPosition={setMapPos} />
            </MapContainer>
          </Box>
          <Typography variant="caption" color="text.secondary">Click map to set exact delivery location</Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={2}>
            <Button fullWidth type="submit" variant="contained" disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddCircleOutlineIcon />}
              sx={{ borderRadius: "14px", py: 1.5, textTransform: "none", fontWeight: 800, bgcolor: "#0b1c3d", "&:hover": { bgcolor: "#0f2847" } }}>
              {demand ? "Update Demand" : t("industry.postDemand")}
            </Button>
            <Button fullWidth variant="outlined" onClick={onClose}
              sx={{ borderRadius: "14px", py: 1.5, textTransform: "none", fontWeight: 700, borderColor: "#0b1c3d", color: "#0b1c3d" }}>
              {t("common.cancel")}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function IndustryDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { session, logout } = useAuth();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editDemand, setEditDemand] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({ companyName: "", industryType: "", address: "", phone: "" });

  useEffect(() => {
    if (session) {
      setProfileData({
        companyName: session.profile?.companyName || session.name || "",
        industryType: session.profile?.industryType || "",
        address: session.location || "",
        phone: session.mobile || "",
      });
    }
  }, [session]);

  const fetchDemands = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get("/demands/my"); setDemands(res.data.demands || []); }
    catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDemands(); }, [fetchDemands]);

  const closeDemand = async (id) => {
    try {
      await api.patch(`/demands/${id}/close`);
      setSnack({ open: true, msg: t("industry.demandClosed"), severity: "info" });
      fetchDemands();
    } catch (e) { setSnack({ open: true, msg: "Failed", severity: "error" }); }
  };

  const handleSignOut = () => { logout(); navigate("/", { replace: true }); };

  const photoUrl = session?.profilePhotoUrl ? `http://localhost:5000${session.profilePhotoUrl}` : null;
  const totalBiomass = demands.filter(d => d.status === "open").reduce((s, d) => s + (d.quantityNeeded || 0), 0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4fa", pb: 6 }}>
      {/* Navbar */}
      <Box sx={{ background: "linear-gradient(90deg, #0b1c3d 0%, #0f2847 100%)", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 4px 24px rgba(11,28,61,0.25)" }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ py: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "rgba(77,166,255,0.15)", border: "1px solid #4da6ff", width: 52, height: 52 }}>
                <FactoryIcon sx={{ color: "#4da6ff" }} />
              </Avatar>
              <Box>
                <Typography sx={{ color: "#9bbcff", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.09em" }}>INDUSTRY</Typography>
                <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>
                  {profileData.companyName || session?.name || "Company"}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <LanguageSwitcher color="#9bbcff" />
              <Button startIcon={<AddCircleOutlineIcon />} variant="contained" onClick={() => { setEditDemand(null); setShowForm(true); }}
                sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, bgcolor: "#4da6ff", "&:hover": { bgcolor: "#1a73e8" } }}>
                {t("industry.postDemand")}
              </Button>
              <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0 }}>
                <Avatar src={photoUrl} sx={{ border: "2px solid #4da6ff", bgcolor: "#0f2847", width: 40, height: 40 }}>
                  {!photoUrl && (session?.name?.charAt(0) || "I")}
                </Avatar>
              </IconButton>
              <Button startIcon={<LogoutIcon />} onClick={handleSignOut} variant="outlined"
                sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, color: "#9bbcff", borderColor: "rgba(155,188,255,0.3)" }}>
                {t("nav.logout")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Quick stats */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Open Demands", value: demands.filter(d=>d.status==="open").length, color: "#22c55e", bg: "#f0fdf4", icon: "📋" },
            { label: "Accepted", value: demands.filter(d=>d.status==="accepted").length, color: "#3b82f6", bg: "#eff6ff", icon: "✅" },
            { label: "Total Tonnes Needed", value: `${totalBiomass.toFixed(1)}t`, color: "#8b5cf6", bg: "#f5f3ff", icon: "⚖️" },
          ].map(s => (
            <Grid key={s.label} item xs={12} md={4}>
              <Box sx={{ borderRadius: 4, bgcolor: s.bg, p: 3, display: "flex", alignItems: "center", gap: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: `1px solid ${s.color}33` }}>
                <Typography fontSize="2rem">{s.icon}</Typography>
                <Box>
                  <Typography sx={{ fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.value}</Typography>
                  <Typography variant="caption" fontWeight="700" color="text.secondary">{s.label}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Demands list */}
        <Typography variant="h5" fontWeight="800" mb={3} sx={{ color: "#0b1c3d" }}>
          🏭 {t("industry.myDemands")}
        </Typography>

        {loading ? (
          <Box textAlign="center" py={6}><CircularProgress sx={{ color: "#0b1c3d" }} /></Box>
        ) : demands.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h4" mb={2}>📋</Typography>
            <Typography color="text.secondary" mb={3}>{t("industry.noDemands")}</Typography>
            <Button variant="contained" onClick={() => { setEditDemand(null); setShowForm(true); }}
              sx={{ borderRadius: "20px", textTransform: "none", fontWeight: 700, bgcolor: "#0b1c3d" }}>
              {t("industry.createDemand")}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {demands.map(d => (
              <Grid item key={d._id} xs={12} md={6} xl={4}>
                <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transition: "all 0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                      <Box>
                        <Typography fontWeight="800" fontSize="1.05rem">🌾 {d.cropType}</Typography>
                        <Typography variant="body2" color="text.secondary">{d.companyName}</Typography>
                      </Box>
                      <Chip label={d.status} size="small"
                        sx={{ bgcolor: `${STATUS_COLOR[d.status]}20`, color: STATUS_COLOR[d.status], fontWeight: 700, borderRadius: "10px" }} />
                    </Stack>
                    <Divider sx={{ mb: 1.5 }} />
                    <Grid container spacing={1} mb={1.5}>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Quantity</Typography><Typography fontWeight="700">⚖️ {d.quantityNeeded}t</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Price Offered</Typography><Typography fontWeight="700" color="#22c55e">₹{d.priceOffered}/t</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Deadline</Typography><Typography fontWeight="700">📅 {new Date(d.deadline).toLocaleDateString()}</Typography></Grid>
                      <Grid item xs={6}><Typography variant="caption" color="text.secondary">Posted</Typography><Typography fontWeight="700">🕐 {new Date(d.createdAt).toLocaleDateString()}</Typography></Grid>
                    </Grid>
                    {d.location?.address && (
                      <Box sx={{ p: 1.5, bgcolor: "#f4f6ff", borderRadius: 2, mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">📍 {d.location.address}</Typography>
                      </Box>
                    )}
                    {d.description && (
                      <Typography variant="body2" color="text.secondary" mb={1.5}>{d.description}</Typography>
                    )}
                    {d.acceptedAggregatorName && (
                      <Alert severity="success" sx={{ borderRadius: 2, mb: 1, py: 0.5 }}>
                        ✅ Accepted by {d.acceptedAggregatorName}
                      </Alert>
                    )}
                    <Stack direction="row" spacing={1}>
                      {d.status === "open" && (
                        <>
                          <Button size="small" variant="outlined" startIcon={<EditIcon fontSize="small" />}
                            onClick={() => { setEditDemand(d); setShowForm(true); }}
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "#0b1c3d", color: "#0b1c3d" }}>
                            Edit
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => closeDemand(d._id)}
                            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>
                            Close
                          </Button>
                        </>
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
      </Container>

      {/* New/Edit Demand Dialog */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth scroll="paper"
        PaperProps={{ sx: { borderRadius: "28px" } }}>
        <Box sx={{ position: "relative" }}>
          <IconButton onClick={() => setShowForm(false)} sx={{ position: "absolute", right: 12, top: 12, zIndex: 10 }}>
            <CloseIcon />
          </IconButton>
          <DemandForm demand={editDemand} onClose={() => setShowForm(false)} onSaved={() => { fetchDemands(); setSnack({ open: true, msg: t("industry.demandPosted"), severity: "success" }); }} />
        </Box>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 3 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}