import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export function Shell({ title, icon, right, children, mb = 0, sx }) {
  return (
    <Card sx={{ borderRadius: 7, border: "1px solid #e0d2c1", boxShadow: "0 10px 34px rgba(117,86,48,0.08)", overflow: "hidden", mb, ...sx }}>
      <Box sx={{ px: { xs: 2.4, md: 3.2 }, py: 2.6, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap", borderBottom: "1px solid #eadccc", bgcolor: "#fff" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ width: 58, height: 58, bgcolor: "#dcf7e8", color: "#14844d" }}>{icon}</Avatar>
          <Typography sx={{ fontSize: { xs: "1.8rem", md: "2rem" }, fontWeight: 800, color: "#1f1c1a" }}>{title}</Typography>
        </Stack>
        {right}
      </Box>
      <CardContent sx={{ p: { xs: 2.4, md: 3.2 }, bgcolor: "#fffdfb" }}>{children}</CardContent>
    </Card>
  );
}

export function StatCard({ icon, value, label, bg, border, color }) {
  return (
    <Card sx={{ borderRadius: 6, border: `1px solid ${border}`, bgcolor: bg, boxShadow: "none" }}>
      <CardContent sx={{ py: 3.5, textAlign: "center", color }}>
        <Avatar sx={{ mx: "auto", mb: 1, bgcolor: "transparent", color: "inherit" }}>{icon}</Avatar>
        <Typography sx={{ fontWeight: 800, fontSize: "3rem", lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ mt: 1, fontWeight: 800, letterSpacing: "0.06em" }}>{label}</Typography>
      </CardContent>
    </Card>
  );
}

export function MetricBox({ icon, value, label, bg, color }) {
  return (
    <Box sx={{ borderRadius: 5, bgcolor: bg, py: 2.4, px: 2, textAlign: "center" }}>
      <Avatar sx={{ mx: "auto", mb: 1.2, bgcolor: "transparent", color }}>{icon}</Avatar>
      <Typography sx={{ color, fontWeight: 800, fontSize: "2rem", lineHeight: 1.1 }}>{value}</Typography>
      <Typography sx={{ color, fontWeight: 700, mt: 0.8 }}>{label}</Typography>
    </Box>
  );
}

export function SmallSummary({ value, label }) {
  return (
    <Box sx={{ borderRadius: 5, bgcolor: "#f8f5f1", py: 3, textAlign: "center" }}>
      <Typography sx={{ fontSize: "2.8rem", fontWeight: 800, color: "#2b2018", lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ color: "#8a7058", mt: 1 }}>{label}</Typography>
    </Box>
  );
}

export function InfoPill({ label, value }) {
  return (
    <Box sx={{ borderRadius: 4, bgcolor: "#f7f4ef", px: 1.2, py: 1.4, textAlign: "center" }}>
      <Typography sx={{ color: "#9a7a58", fontSize: "0.9rem" }}>{label}</Typography>
      <Typography sx={{ color: "#1e1d22", fontWeight: 800, mt: 0.5 }}>{value}</Typography>
    </Box>
  );
}

export function FarmCard({ farm, distance, selected, onToggle, onSchedule }) {
  return (
    <Card sx={{ borderRadius: 5, border: selected ? "2px solid #2f7d5a" : "1px solid #ddd0c0", boxShadow: "none", cursor: "pointer", bgcolor: selected ? "#fbfff9" : "#fff", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 26px rgba(117,86,48,0.08)" } }} onClick={onToggle}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={1.8}>
            <Avatar sx={{ bgcolor: "#f2efeb", color: "#c98a1d", fontWeight: 800 }}>{farm.icon}</Avatar>
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#17212b", fontSize: "1.2rem" }}>{farm.name}</Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.4 }}>
                <LocationOnOutlinedIcon sx={{ fontSize: 18, color: "#8a7058" }} />
                <Typography sx={{ color: "#8a7058" }}>{farm.place}</Typography>
              </Stack>
            </Box>
          </Stack>
          <Chip label={farm.status[0].toUpperCase() + farm.status.slice(1)} sx={{ bgcolor: farm.status === "available" ? "#d8f9e1" : farm.status === "scheduled" ? "#fff0bf" : "#efebe6", color: farm.status === "available" ? "#098b43" : farm.status === "scheduled" ? "#c16a00" : "#8a7a66", fontWeight: 800 }} />
        </Stack>

        <Stack direction="row" spacing={1.2} sx={{ mt: 2.2 }}>
          <InfoPill label="Crop" value={farm.crop} />
          <InfoPill label="Biomass" value={`${farm.biomass}t`} />
          <InfoPill label="Dist." value={`${distance.toFixed(0)} km`} />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2.2 }}>
          <Stack direction="row" spacing={0.1} alignItems="center">
            {[0, 1, 2, 3, 4].map((i) => <StarRoundedIcon key={i} sx={{ fontSize: 20, color: i < farm.rating ? "#ffc400" : "#ddd4c8" }} />)}
            <Typography sx={{ ml: 1, color: "#8a7058" }}>{farm.age}</Typography>
          </Stack>
          {farm.status === "available" ? (
            <Button variant="text" onClick={(e) => { e.stopPropagation(); onSchedule(); }} sx={{ textTransform: "none", fontWeight: 700, color: "#2f7d5a", minWidth: "unset", px: 0 }}>
              Schedule
            </Button>
          ) : (
            <Typography sx={{ color: farm.status === "scheduled" ? "#c16a00" : "#8a7a66", fontWeight: 700 }}>
              {farm.status === "scheduled" ? "Pickup set" : "Delivered"}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
