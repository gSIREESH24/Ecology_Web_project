import { useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Badge } from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";
import PaidIcon from "@mui/icons-material/Paid";
import { ProfileContext } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { openProfile } = useContext(ProfileContext);
  const { session } = useAuth();
  const navigate = useNavigate();
  const photoUrl = session?.profilePhotoUrl ? `http://localhost:5000${session.profilePhotoUrl}` : null;

  return (
    <AppBar position="static" sx={{ background: "white", color: "black", boxShadow: "0px 2px 10px rgba(0,0,0,0.05)", padding: { xs: "5px 10px", sm: "5px 20px" } }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={() => navigate("/farmer")}>
          <GrassIcon sx={{ color: "#2e7d32", fontSize: { xs: 30, sm: 38 } }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#33822a", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
            AgriCycle
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <LanguageSwitcher color="#1a3b2b" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, background: "linear-gradient(135deg,#e8f5e9,#c8e6c9)", px: 1.5, py: 0.8, borderRadius: "20px", cursor: "pointer" }}
            onClick={() => navigate("/credits")}>
            <PaidIcon sx={{ color: "#fbc02d", fontSize: 18 }} />
            <Typography sx={{ fontSize: "13px", fontWeight: "bold", color: "#2e7d32" }}>Credits</Typography>
          </Box>

          <IconButton onClick={openProfile} sx={{ p: 0.5 }}>
            <Avatar src={photoUrl} sx={{ width: 36, height: 36, bgcolor: "#2e7d32", fontSize: "1rem", border: "2px solid #a5d6a7" }}>
              {!photoUrl && (session?.name?.charAt(0) || "F")}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}