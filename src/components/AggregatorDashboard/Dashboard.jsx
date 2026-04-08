import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AgricultureOutlinedIcon from "@mui/icons-material/AgricultureOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import { useAuth } from "../../context/AuthContext";
import { base, farmsSeed, filters, statusColor } from "./data";
import { distanceKm, planRoute } from "./utils";
import { FarmCard, MetricBox, Shell, SmallSummary, StatCard } from "./components";

function MapLegend() {
  return (
    <Box sx={{ position: "absolute", left: 24, bottom: 18, borderRadius: 4, boxShadow: "0 10px 26px rgba(0,0,0,0.12)", bgcolor: "#fff", p: 2 }}>
      {["available", "scheduled", "collected"].map((status) => (
        <Stack key={status} direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: statusColor[status] }} />
          <Typography sx={{ textTransform: "capitalize" }}>{status}</Typography>
        </Stack>
      ))}
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box sx={{ width: 32, borderTop: "3px dashed #3a7f66" }} />
        <Typography sx={{ fontWeight: 700 }}>Optimised Route</Typography>
      </Stack>
    </Box>
  );
}

export default function AggregatorDashboard() {
  const { session, logout } = useAuth();
  const [farms, setFarms] = useState(farmsSeed);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [capacity, setCapacity] = useState(10);
  const [route, setRoute] = useState(null);
  const [modalFarm, setModalFarm] = useState(null);
  const [pickup, setPickup] = useState({ date: "", time: "08:00" });

  const filtered = useMemo(
    () => (activeFilter === "all" ? farms : farms.filter((farm) => farm.status === activeFilter)),
    [activeFilter, farms]
  );
  const selected = useMemo(
    () => farms.filter((farm) => selectedIds.includes(farm.id)),
    [farms, selectedIds]
  );
  const selectedBiomass = selected.reduce((sum, farm) => sum + farm.biomass, 0);
  const counts = {
    available: farms.filter((farm) => farm.status === "available").length,
    scheduled: farms.filter((farm) => farm.status === "scheduled").length,
    collected: farms.filter((farm) => farm.status === "collected").length,
  };

  const toggleFarm = (farm) => {
    if (farm.status === "collected") return;
    setSelectedIds((current) =>
      current.includes(farm.id) ? current.filter((id) => id !== farm.id) : [...current, farm.id]
    );
  };

  const confirmSchedule = () => {
    if (!modalFarm || !pickup.date) return;
    setFarms((current) =>
      current.map((farm) =>
        farm.id === modalFarm.id
          ? { ...farm, status: "scheduled", pickupDate: pickup.date, pickupTime: pickup.time }
          : farm
      )
    );
    setModalFarm(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f4ee", pb: 6 }}>
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid rgba(153,117,75,0.16)" }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ py: 2.2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 60, height: 60, bgcolor: "#fff4d5", color: "#c96a00", border: "1px solid #f4d375" }}>
                <LocalShippingOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ color: "#d46700", fontWeight: 800, letterSpacing: "0.08em", fontSize: "0.9rem" }}>AGGREGATOR</Typography>
                <Typography sx={{ fontSize: { xs: "1.8rem", md: "2.1rem" }, fontWeight: 800, color: "#17212b" }}>
                  {session?.name || "Anvesh Jami"}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={0.7} alignItems="center">
                <LocationOnOutlinedIcon sx={{ color: "#8d7258", fontSize: 20 }} />
                <Typography sx={{ color: "#7f6955" }}>{session?.profile?.operatingArea || "chapara"}</Typography>
              </Stack>
              <Button variant="outlined" startIcon={<LogoutRoundedIcon />} onClick={logout} sx={{ borderRadius: 3, px: 2.4, py: 1.15, color: "#7f6955", borderColor: "#cddbd5", textTransform: "none", fontWeight: 700 }}>
                Sign Out
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      

      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}><StatCard icon={<AgricultureOutlinedIcon />} value={counts.available} label="AVAILABLE" bg="#fffaf0" border="#f7d56a" color="#c76600" /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><StatCard icon={<CalendarMonthOutlinedIcon />} value={counts.scheduled} label="SCHEDULED" bg="#f2f7ff" border="#b7d5ff" color="#3467f2" /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><StatCard icon={<Inventory2OutlinedIcon />} value={counts.collected} label="COLLECTED" bg="#f1fcf5" border="#b8f2c7" color="#1e9b53" /></Grid>
        </Grid>

        <Shell title="Farm Locations & Route Map" icon={<RouteOutlinedIcon />} mb={3}>
          <Box sx={{ borderRadius: 6, overflow: "hidden", height: 520, position: "relative" }}>
            <MapContainer center={base.coords} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {farms.map((farm) => (
                <CircleMarker key={farm.id} center={farm.coords} radius={12} pathOptions={{ color: "#fff", weight: 3, fillColor: statusColor[farm.status], fillOpacity: 1 }}>
                  <Tooltip>{farm.name}</Tooltip>
                </CircleMarker>
              ))}
              <CircleMarker center={base.coords} radius={14} pathOptions={{ color: "#fff", weight: 3, fillColor: "#f59e0b", fillOpacity: 1 }} />
              {route ? <Polyline positions={route.points.map((point) => point.coords)} pathOptions={{ color: "#3a7f66", weight: 4, dashArray: "12 8" }} /> : null}
            </MapContainer>
            <MapLegend />
          </Box>
        </Shell>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Shell title="Route Optimization" icon={<TuneRoundedIcon />}>
              <Typography sx={{ color: "#8a7058", lineHeight: 1.7, mb: 2.5 }}>Select farms from the list, then generate the optimal pickup tour using a nearest-neighbor + 2-opt VRP solver.</Typography>
              <Grid container spacing={1.6} sx={{ mb: 2.5 }}>
                {["Collecting farm", "Computing distance", "Nearest-neighbor heuristic", "2-opt local", "Finalising route"].map((label, i) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Button fullWidth variant="text" startIcon={<TaskAltRoundedIcon />} sx={{ justifyContent: "flex-start", borderRadius: 999, bgcolor: i === 4 ? "#eef7f2" : "#f7f4ef", color: i === 4 ? "#2f7d5a" : "#b18b6a", textTransform: "none", py: 1.2 }}>
                      {label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ borderRadius: 4, bgcolor: "#f9f6f2", px: 3, py: 2.5, mb: 2.8 }}>
                <Stack direction="row" justifyContent="space-between"><Typography sx={{ color: "#8a7058" }}>Selected farms</Typography><Typography sx={{ fontWeight: 800 }}>{selected.length}</Typography></Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.2 }}><Typography sx={{ color: "#8a7058" }}>Total biomass</Typography><Typography sx={{ fontWeight: 800 }}>{selectedBiomass.toFixed(1)} t</Typography></Stack>
              </Box>
              <Button fullWidth variant="contained" startIcon={<BoltRoundedIcon />} onClick={() => setRoute(selected.length ? planRoute(selected) : null)} sx={{ minHeight: 72, borderRadius: 999, textTransform: "none", fontWeight: 800, fontSize: "1.1rem", bgcolor: "#9fbeaf", boxShadow: "none" }}>Generate Best Pickup Route</Button>
              <Typography sx={{ textAlign: "center", color: "#8a7058", mt: 2 }}>Select at least one farm from the list below</Typography>
              {route ? (
                <Box sx={{ mt: 3.2 }}>
                  <Stack direction="row" spacing={1.6} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: "#d7f8e3", color: "#14844d" }}><TaskAltRoundedIcon /></Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.8rem", color: "#17212b" }}>Route Optimised</Typography>
                      <Typography sx={{ color: "#8a7058" }}>Nearest-neighbor + 2-opt - {selected.length} stops</Typography>
                    </Box>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}><MetricBox icon={<RouteOutlinedIcon />} value={`${route.total.toFixed(1)} km`} label="Distance" bg="#edf4f2" color="#3b7b67" /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><MetricBox icon={<AccessTimeRoundedIcon />} value={`${route.minutes} min`} label="Est. Time" bg="#fff3c8" color="#d17400" /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><MetricBox icon={<LocalGasStationRoundedIcon />} value={`Rs ${route.fuel.toLocaleString()}`} label="Fuel Cost" bg="#dce9ff" color="#2f5be8" /></Grid>
                  </Grid>
                </Box>
              ) : null}
            </Shell>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Shell title="Truck Capacity" icon={<ScaleOutlinedIcon />} sx={{ height: "100%" }}>
              <Typography sx={{ fontWeight: 800, color: "#2b2018", mb: 1.2 }}>Load Capacity (tons)</Typography>
              <Box sx={{ minHeight: 86, borderRadius: 4, border: "1px solid #e4d7c7", bgcolor: "#fff", display: "flex", alignItems: "center", px: 3, fontSize: "2rem", fontWeight: 800 }}>{capacity}<Box component="span" sx={{ ml: "auto", fontSize: "1rem", color: "#7d6755", fontWeight: 700 }}>tons</Box></Box>
              <Typography sx={{ mt: 3, mb: 1.4, color: "#8a7058", fontWeight: 800, letterSpacing: "0.05em" }}>QUICK SELECT</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {[5, 10, 20, 30].map((value) => (
                  <Button key={value} variant={capacity === value ? "contained" : "outlined"} onClick={() => setCapacity(value)} sx={{ minWidth: 120, minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 800, fontSize: "1.1rem", borderColor: "#d9cfbf", color: capacity === value ? "#2f7d5a" : "#2b2018", bgcolor: capacity === value ? "#eef7f2" : "#fff", boxShadow: "none" }}>{value}t</Button>
                ))}
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography sx={{ color: "#7d6755", fontWeight: 700 }}>Load from selected farms</Typography><Typography sx={{ color: "#02a54a", fontWeight: 800 }}>{selectedBiomass.toFixed(1)} / {capacity} t</Typography></Stack>
              <LinearProgress variant="determinate" value={Math.min((selectedBiomass / capacity) * 100, 100)} sx={{ height: 16, borderRadius: 999, bgcolor: "#ece7de", "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: "#08c243" } }} />
              <Typography sx={{ mt: 1.4, color: "#8a7058" }}>Remaining: {(capacity - selectedBiomass).toFixed(1)} t</Typography>
              <Grid container spacing={2} sx={{ mt: 2.2 }}>
                <Grid size={{ xs: 12, md: 6 }}><SmallSummary value={selectedBiomass > 0 ? Math.ceil(selectedBiomass / capacity) : 0} label="Trips needed" /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><SmallSummary value={`Rs ${Math.round(selectedBiomass * 2350).toLocaleString()}`} label="Est. revenue" /></Grid>
              </Grid>
            </Shell>
          </Grid>
        </Grid>

        <Shell
          title="Available Farms"
          icon={<AgricultureOutlinedIcon />}
          right={
            <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" useFlexGap>
              <IconButton sx={{ color: "#8b6f59" }}><TuneRoundedIcon /></IconButton>
              {filters.map((filter) => (
                <Button key={filter} onClick={() => setActiveFilter(filter)} variant={activeFilter === filter ? "contained" : "outlined"} sx={{ borderRadius: 999, minWidth: 92, textTransform: "none", fontWeight: 700, boxShadow: "none", bgcolor: activeFilter === filter ? "#2f7d5a" : "#fff", color: activeFilter === filter ? "#fff" : "#8b6f59", borderColor: "#dbcdbb" }}>{filter[0].toUpperCase() + filter.slice(1)}</Button>
              ))}
            </Stack>
          }
        >
          <Box sx={{ mb: 3, borderRadius: 4, bgcolor: "#f7f4ef", px: 2.5, py: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center"><TuneRoundedIcon sx={{ color: "#8b6f59" }} /><Typography sx={{ color: "#8b6f59" }}>Tap a farm card to select it for route planning - distances are calculated using the Haversine formula</Typography></Stack>
          </Box>
          <Grid container spacing={2.6}>
            {filtered.map((farm) => (
              <Grid key={farm.id} size={{ xs: 12, md: 6, xl: 4 }}>
                <FarmCard
                  farm={farm}
                  distance={distanceKm(base.coords, farm.coords)}
                  selected={selectedIds.includes(farm.id)}
                  onToggle={() => toggleFarm(farm)}
                  onSchedule={() => {
                    setModalFarm(farm);
                    setPickup({ date: "", time: "08:00" });
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Shell>
      </Container>

      <Dialog open={Boolean(modalFarm)} onClose={() => setModalFarm(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 0.5, bgcolor: "#fffdfb" } }}>
        <DialogContent sx={{ p: 3.5 }}>
          {modalFarm ? (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 60, height: 60, bgcolor: "#edf4f0", color: "#3a7f66" }}><EventAvailableRoundedIcon /></Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: "#2b2018", fontSize: "2rem" }}>Schedule Pickup</Typography>
                    <Typography sx={{ color: "#8a7058", fontSize: "1.1rem" }}>{modalFarm.name} - {modalFarm.place}</Typography>
                  </Box>
                </Stack>
                <IconButton onClick={() => setModalFarm(null)}><CloseRoundedIcon /></IconButton>
              </Stack>
              <Box sx={{ borderRadius: 4, bgcolor: "#f7f4ef", px: 3, py: 2.2, mb: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <Typography sx={{ color: "#8a7058" }}>Crop: <Box component="span" sx={{ color: "#2b2018", fontWeight: 800 }}>{modalFarm.crop} Stubble</Box></Typography>
                  <Typography sx={{ color: "#8a7058" }}>Amount: <Box component="span" sx={{ color: "#2b2018", fontWeight: 800 }}>{modalFarm.biomass}t</Box></Typography>
                  <Typography sx={{ color: "#8a7058" }}>Distance: <Box component="span" sx={{ color: "#2b2018", fontWeight: 800 }}>{distanceKm(base.coords, modalFarm.coords).toFixed(0)} km</Box></Typography>
                </Stack>
              </Box>
              <Typography sx={{ fontWeight: 800, color: "#3b3028", mb: 1.2 }}>Pickup Date</Typography>
              <TextField fullWidth type="date" value={pickup.date} onChange={(e) => setPickup((c) => ({ ...c, date: e.target.value }))} sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 4, bgcolor: "#fff" } }} />
              <Typography sx={{ fontWeight: 800, color: "#3b3028", mb: 1.2 }}>Preferred Time</Typography>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {["08:00", "10:00", "14:00", "16:00"].map((time) => (
                  <Button key={time} variant={pickup.time === time ? "contained" : "outlined"} onClick={() => setPickup((c) => ({ ...c, time }))} sx={{ minWidth: 140, minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 700, boxShadow: "none", bgcolor: pickup.time === time ? "#eef7f2" : "#fff", color: pickup.time === time ? "#2f7d5a" : "#3b3028", borderColor: "#dacdbf" }}>{time}</Button>
                ))}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button fullWidth variant="outlined" onClick={() => setModalFarm(null)} sx={{ minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 700, color: "#3a7f66", borderColor: "#cfe0d8" }}>Cancel</Button>
                <Button fullWidth variant="contained" disabled={!pickup.date} onClick={confirmSchedule} sx={{ minHeight: 64, borderRadius: 4, textTransform: "none", fontWeight: 800, bgcolor: "#9fbeaf", boxShadow: "none" }}>Confirm Pickup</Button>
              </Stack>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
