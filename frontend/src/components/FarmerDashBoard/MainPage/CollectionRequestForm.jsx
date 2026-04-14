import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Box, Typography, Button, TextField, Grid, Select, MenuItem,
  FormControl, InputLabel, Card, CardContent, Chip, CircularProgress,
  Alert, Divider, IconButton, Snackbar
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SendIcon from "@mui/icons-material/Send";
import api from "../../../api";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CROPS = ["Wheat", "Paddy", "Maize", "Sugarcane", "Cotton", "Other"];
const BASE_URL = "http://localhost:5000";

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) { setPosition([e.latlng.lat, e.latlng.lng]); }
  });
  return position ? <Marker position={position} /> : null;
}

export default function CollectionRequestForm({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    cropType: "", biomassQuantity: "", priceExpectation: "",
    qualityNotes: "", preferredPickupDate: "", address: "",
    lat: null, lng: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState(false);
  const mapPosition = form.lat && form.lng ? [form.lat, form.lng] : null;

  const getGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by your browser");
      return;
    }
    setGpsLoading(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode using nominatim (free)
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          setForm(f => ({ ...f, lat: latitude, lng: longitude, address: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } catch {
          setForm(f => ({ ...f, lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        }
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(t("farmer.locationError") + ": " + err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cropType || !form.biomassQuantity || !form.priceExpectation || !form.preferredPickupDate || !form.address) {
      setError("Please fill all required fields");
      return;
    }
    if (!form.lat || !form.lng) {
      setError("Please set your GPS location or type an address and click on the map");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== "") fd.append(k, v); });
      if (photoFile) fd.append("cropPhoto", photoFile);

      await api.post("/collections", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSnack(true);
      setTimeout(() => { onSuccess?.(); onClose?.(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally { setLoading(false); }
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Card sx={{ borderRadius: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.1)", overflow: "visible", maxWidth: 680, mx: "auto" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box>
            <Typography variant="h5" fontWeight="900" sx={{ color: "#1a3b2b" }}>
              🌾 {t("farmer.newRequest")}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {t("farmer.submitRequest")}
            </Typography>
          </Box>
          {onClose && <IconButton onClick={onClose} sx={{ bgcolor: "#f5f5f5" }}>✕</IconButton>}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            {/* Crop Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t("farmer.cropType")}</InputLabel>
                <Select label={t("farmer.cropType")} value={form.cropType}
                  onChange={e => setForm(f => ({ ...f, cropType: e.target.value }))}
                  sx={{ borderRadius: "12px" }}>
                  {CROPS.map(c => <MenuItem key={c} value={c}>{t(`crops.${c}`)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {/* Biomass */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label={t("farmer.biomass")} inputProps={{ min: 0.1, step: 0.1 }}
                value={form.biomassQuantity} onChange={e => setForm(f => ({ ...f, biomassQuantity: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            {/* Price */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label={t("farmer.priceExpectation")} inputProps={{ min: 0 }}
                value={form.priceExpectation} onChange={e => setForm(f => ({ ...f, priceExpectation: e.target.value }))}
                InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: "#666" }}>₹</Typography> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            {/* Pickup Date */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="date" label={t("farmer.pickupDate")}
                InputLabelProps={{ shrink: true }} inputProps={{ min: minDate }}
                value={form.preferredPickupDate} onChange={e => setForm(f => ({ ...f, preferredPickupDate: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            {/* Quality Notes */}
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label={t("farmer.qualityNotes")}
                value={form.qualityNotes} onChange={e => setForm(f => ({ ...f, qualityNotes: e.target.value }))}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            {/* GPS Location */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="700" color="#1a3b2b" mb={1}>
                📍 Location
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, flexWrap: "wrap" }}>
                <Button variant="contained" startIcon={gpsLoading ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
                  onClick={getGpsLocation} disabled={gpsLoading}
                  sx={{ borderRadius: "20px", textTransform: "none", bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}>
                  {gpsLoading ? t("farmer.gettingLocation") : t("farmer.getLocation")}
                </Button>
                {form.lat && <Chip label={`✅ ${t("farmer.locationSet")}`} color="success" variant="outlined" sx={{ borderRadius: "20px" }} />}
              </Box>
              {gpsError && <Alert severity="warning" sx={{ mb: 1, borderRadius: 2 }}>{gpsError}</Alert>}
              <TextField fullWidth label={t("farmer.manualLocation")} value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                placeholder="e.g. Village Nakodar, Jalandhar, Punjab"
                sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />

              {/* Mini map to pin location */}
              <Box sx={{ borderRadius: "16px", overflow: "hidden", height: 220, border: "1px solid #e0e0e0" }}>
                <MapContainer center={mapPosition || [30.9, 75.8]} zoom={mapPosition ? 14 : 7}
                  style={{ height: "100%", width: "100%" }} key={mapPosition?.toString()}>
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri" />
                  <LocationPicker position={mapPosition} setPosition={([lat, lng]) => setForm(f => ({ ...f, lat, lng }))} />
                </MapContainer>
              </Box>
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                Click on map to pin your farm location
              </Typography>
            </Grid>

            {/* Crop Photo */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight="700" color="#1a3b2b" mb={1}>
                📸 {t("farmer.cropPhoto")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button variant="outlined" startIcon={<CloudUploadIcon />}
                  onClick={() => fileRef.current?.click()}
                  sx={{ borderRadius: "20px", textTransform: "none", borderColor: "#2e7d32", color: "#2e7d32" }}>
                  {t("common.upload")} Photo
                </Button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                {photoPreview && (
                  <Box component="img" src={photoPreview} alt="crop"
                    sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: "12px", border: "2px solid #2e7d32" }} />
                )}
              </Box>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }} />
              <Button fullWidth type="submit" variant="contained" size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                disabled={loading}
                sx={{
                  borderRadius: "16px", py: 1.8, textTransform: "none",
                  fontWeight: 800, fontSize: "1.05rem",
                  background: "linear-gradient(135deg, #1b5e20, #2e7d32, #43a047)",
                  boxShadow: "0 8px 24px rgba(46,125,50,0.35)",
                  "&:hover": { boxShadow: "0 12px 32px rgba(46,125,50,0.45)" }
                }}>
                {loading ? "Submitting..." : t("farmer.submitRequest")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3 }}>🎉 {t("farmer.requestSuccess")}</Alert>
      </Snackbar>
    </Card>
  );
}
