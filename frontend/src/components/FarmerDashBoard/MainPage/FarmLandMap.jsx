import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import { Card, Box, Typography, Tooltip, IconButton } from "@mui/material";
import { LocateFixed, Maximize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

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
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        width: "100%",
        "&:hover": {
          boxShadow: "0 30px 60px rgba(46, 125, 50, 0.12)",
          transform: "translateY(-4px)"
        }
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.05)"
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ p: 1.5, background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', borderRadius: '14px', color: 'white', display: 'flex' }}>
            <LocateFixed size={20} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="800" sx={{ color: '#1a3b2b', lineHeight: 1.2 }}>
              Satellite View
            </Typography>
            <Typography variant="caption" fontWeight="600" color="text.secondary">
              Live coordinates synced
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <Tooltip title="Center Map">
            <IconButton sx={{ background: "rgba(0,0,0,0.04)", "&:hover":{background: "rgba(0,0,0,0.08)"} }}>
              <LocateFixed size={18} color="#2e7d32" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expand Map">
            <IconButton sx={{ background: "rgba(0,0,0,0.04)", "&:hover":{background: "rgba(0,0,0,0.08)"} }}>
              <Maximize2 size={18} color="#1a3b2b" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: "500px", position: "relative" }}>
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)', px: 2, py: 1, borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3d00' }} />
          <Typography variant="caption" fontWeight="bold">Live Tracking Active</Typography>
        </Box>

        <MapContainer
          center={farmCoordinates[0]}
          zoom={18}
          scrollWheelZoom={false}
          style={{
            height: "100%",
            width: "100%",
            zIndex: 1
          }}
        >

          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

          <Polygon
            positions={farmCoordinates}
            pathOptions={{
              color: "#00e676",
              weight: 4,
              dashArray: "10, 10",
              fillColor: "#4CAF50",
              fillOpacity: 0.4,
              lineCap: "round",
              lineJoin: "round"
            }}
          />

        </MapContainer>
      </Box>
    </Card>
  );
}