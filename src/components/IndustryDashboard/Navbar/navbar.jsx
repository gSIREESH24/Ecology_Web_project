import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #0b1c3d 0%, #0f2847 100%)",
        px: { xs: 1.5, sm: 3 },
        py: 1
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1
        }}
      >

        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          {/* ICON */}
          <Box
            sx={{
              width: { xs: 34, sm: 42 },
              height: { xs: 34, sm: 42 },
              borderRadius: "10px",
              background: "rgba(77,166,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FactoryIcon sx={{ color: "#4da6ff", fontSize: { xs: 20, sm: 24 } }} />
          </Box>

          {/* NAME */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#9bbcff",
                fontSize: "9px",
                display: { xs: "none", sm: "block" }
              }}
            >
              Factory
            </Typography>

            <Typography
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "13px", sm: "16px" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: { xs: "120px", sm: "none" }
              }}
            >
              GuttiReddy Sireesh Reddy
            </Typography>
          </Box>

          {/* EXTRA INFO (HIDDEN ON MOBILE) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
              ml: 2,
              pl: 2,
              borderLeft: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#4da6ff" }} />
              <Typography sx={{ color: "#cfd8dc", fontSize: "12px" }}>
                Kadapa
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 16, color: "#4da6ff" }} />
              <Typography sx={{ color: "#cfd8dc", fontSize: "12px" }}>
                +918125568419
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: "auto"
          }}
        >

          {/* CHIP (HIDE ON VERY SMALL) */}
          <Chip
            label="Green Certified"
            sx={{
              display: { xs: "none", sm: "flex" },
              backgroundColor: "rgba(15,81,50,0.8)",
              color: "#4ade80",
              fontSize: "11px",
              height: "26px"
            }}
          />

          {/* SIGN OUT BUTTON */}
          <Button
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: "#cfd8dc",
              fontWeight: 600,
              fontSize: { xs: "11px", sm: "13px" },
              textTransform: "none",
              px: { xs: 1, sm: 2 },
              minWidth: "auto",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.2)",
              "&:hover": {
                color: "#4da6ff",
                borderColor: "#4da6ff",
                backgroundColor: "rgba(77,166,255,0.08)"
              }
            }}
          >
            Sign Out
          </Button>

        </Box>

      </Toolbar>
    </AppBar>
  );
}