import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { Card, CardContent, Box, Typography, Tooltip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function FarmDisplayMap() {

  const farmCoordinates = [
    [14.450099, 78.814361],
    [14.450110, 78.814505],
    [14.449979, 78.814501],
    [14.449965, 78.814322]
  ];

  return (
    <Card
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(46, 125, 50, 0.12)",
        border: "1px solid rgba(46, 125, 50, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        width: "100%",
        "&:hover": {
          boxShadow: "0 12px 36px rgba(46, 125, 50, 0.18)",
          transform: "translateY(-4px)"
        }
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          color: "white"
        }}
      >
        <Tooltip title="Your farm location on the map">
          <LocationOnIcon sx={{ fontSize: 28 }} />
        </Tooltip>
        <Typography variant="h6" fontWeight="bold">
          Farm Location Map
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: "500px", position: "relative" }}>
        <MapContainer
          center={farmCoordinates[0]}
          zoom={16}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "0 0 24px 24px"
          }}
        >

          <TileLayer
            attribution="Esri Satellite"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          <Polygon
            positions={farmCoordinates}
            pathOptions={{
              color: "#2e7d32",
              weight: 3,
              dashArray: "5, 5",
              fillColor: "#4CAF50",
              fillOpacity: 0.35,
              lineCap: "round",
              lineJoin: "round"
            }}
          />

        </MapContainer>
      </Box>
    </Card>
  );
}