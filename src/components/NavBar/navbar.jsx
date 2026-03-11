import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        color: "black",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        padding: "5px 20px"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#2e7d32" }}>
            EcoStubble
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LanguageIcon />
            <Typography>English</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontWeight="bold">
              Gurpreet Singh
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Farmer
            </Typography>
            <Avatar />
          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  );
}