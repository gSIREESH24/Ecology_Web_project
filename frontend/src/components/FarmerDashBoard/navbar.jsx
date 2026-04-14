import { useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, Button, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import GrassIcon from "@mui/icons-material/Grass";
import PaidIcon from "@mui/icons-material/Paid";
import { ProfileContext } from "../../context/ProfileContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { openProfile } = useContext(ProfileContext);
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        background: "white",
        color: "black",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        padding: { xs: "5px 10px", sm: "5px 20px" }
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          
          <GrassIcon
            sx={{
              color: "#2e7d32",
              fontSize: { xs: 30, sm: 38, md: 45 }
            }}
          />

          <Typography
            variant="h6"
            fontWeight="bold"
            onClick={() => navigate("/")}
            sx={{
              color: "#33822a",
              cursor: "pointer",
              "&:hover": {
                color: "#1b5e20"
              },
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.8rem" }
            }}
          >
            EcoStubble
          </Typography>

        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 3 }
          }}
        >

          <Button
            startIcon={<LanguageIcon />}
            sx={{
              textTransform: "none",
              color: "black",
              display: { xs: "none", sm: "flex" }
            }}
          >
            English
          </Button>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

            <IconButton onClick={openProfile}>
              <Avatar
                sx={{
                  width: { xs: 28, sm: 34 },
                  height: { xs: 28, sm: 34 }
                }}
              />
            </IconButton>

            <Button
              onClick={() => navigate("/credits")}
              sx={{
                border: "2px solid #2e7d32",
                borderRadius: "20px",
                padding: { xs: "2px 6px", sm: "4px 10px" },
                minHeight: "30px",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  backgroundColor: "#e8f5e9"
                }
              }}
            >
              <PaidIcon
                sx={{
                  color: "#fbc02d",
                  fontSize: { xs: 16, sm: 18 }
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px" },
                  fontWeight: "bold",
                  color: "#2e7d32"
                }}
              >
                Credits
              </Typography>

            </Button>

          </Box>

        </Box>

      </Toolbar>
    </AppBar>
  );
}